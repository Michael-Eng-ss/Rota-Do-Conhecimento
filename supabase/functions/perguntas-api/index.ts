import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

function errorResponse(status: number, message: string, errors?: string[]) {
  const body: Record<string, unknown> = { status: "error", statusCode: status, message };
  if (errors) body.errors = errors;
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyAuth(req: Request): Promise<Record<string, unknown> | null> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  const secret = Deno.env.get("JWT_SECRET");
  if (!secret) return null;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const signingInput = `${parts[0]}.${parts[1]}`;
    const signature = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(signingInput));
    if (!valid) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

function requireAdmin(user: Record<string, unknown> | null): Response | null {
  if (!user) return errorResponse(401, "Token não fornecido ou inválido");
  if (user.role !== 1) return errorResponse(403, "Acesso negado");
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const rest = pathParts.slice(1);

  try {
    // === GET routes (public) ===

    if (req.method === "GET" && rest[0] === "completas" && rest[1]) {
      const categoriaId = parseInt(rest[1]);
      const activeOnly = url.searchParams.get("active") !== "false";
      let query = supabase.from("perguntas").select("*").eq("categoriasid", categoriaId);
      if (activeOnly) query = query.eq("status", true);
      const { data: perguntas, error } = await query;
      if (error) throw error;

      const perguntaIds = (perguntas || []).map(p => p.id);
      let alternativas: any[] = [];
      if (perguntaIds.length > 0) {
        const { data: alts, error: altError } = await supabase.from("alternativas").select("*").in("perguntasid", perguntaIds);
        if (altError) throw altError;
        alternativas = alts || [];
      }
      const altMap: Record<number, any[]> = {};
      for (const alt of alternativas) { (altMap[alt.perguntasid] = altMap[alt.perguntasid] || []).push(alt); }

      return new Response(JSON.stringify((perguntas || []).map(p => ({ ...p, alternativas: altMap[p.id] || [] }))), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && rest[0] === "todas") {
      const { data: perguntas, error } = await supabase.from("perguntas").select("*").order("id", { ascending: false });
      if (error) throw error;
      const perguntaIds = (perguntas || []).map(p => p.id);
      let alternativas: any[] = [];
      if (perguntaIds.length > 0) {
        const { data: alts, error: altError } = await supabase.from("alternativas").select("*").in("perguntasid", perguntaIds);
        if (altError) throw altError;
        alternativas = alts || [];
      }
      const altMap: Record<number, any[]> = {};
      for (const alt of alternativas) { (altMap[alt.perguntasid] = altMap[alt.perguntasid] || []).push(alt); }
      return new Response(JSON.stringify((perguntas || []).map(p => ({ ...p, alternativas: altMap[p.id] || [] }))), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("perguntas").select("*").eq("id", id).single();
      if (error || !data) return errorResponse(404, "Pergunta nao encontrada");
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && rest[0] === "quiz") {
      const quizId = parseInt(rest[1]);
      const categoriaId = rest[2] === "categoria" ? parseInt(rest[3]) : undefined;
      let userId: number | undefined, skip = 0, take = 20;
      if (rest.includes("usuario")) {
        const uIdx = rest.indexOf("usuario");
        userId = parseInt(rest[uIdx + 1]);
        skip = parseInt(rest[uIdx + 2]) || 0;
        take = parseInt(rest[uIdx + 3]) || 20;
      } else if (categoriaId !== undefined) {
        skip = parseInt(rest[4]) || 0;
        take = parseInt(rest[5]) || 20;
      }
      let query = supabase.from("perguntas").select("*").eq("quizid", quizId).eq("status", true);
      if (categoriaId) query = query.eq("categoriasid", categoriaId);
      if (userId) {
        const { data: progresso } = await supabase.from("progressoperguntas").select("perguntasid").eq("usuariosid", userId);
        const answeredIds = (progresso || []).map(p => p.perguntasid);
        if (answeredIds.length > 0) query = query.not("id", "in", `(${answeredIds.join(",")})`);
      }
      query = query.range(skip, skip + take - 1);
      const { data, error } = await query;
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === WRITE routes (require auth + admin role) ===

    if (req.method === "POST") {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const body = await req.json();
      const errors: string[] = [];
      if (!body.conteudo || typeof body.conteudo !== "string") errors.push("Campo 'conteudo' é obrigatório e deve ser string");
      if (!body.categoriasid || typeof body.categoriasid !== "number") errors.push("Campo 'categoriasid' é obrigatório e deve ser number");
      if (errors.length > 0) return errorResponse(400, "Dados inválidos", errors);

      const { data, error } = await supabase.from("perguntas").insert({
        conteudo: body.conteudo, perguntasnivelid: body.perguntasnivelid || 1,
        tempo: body.tempo || 30, pathimage: body.pathimage || null,
        status: body.status ?? true, categoriasid: body.categoriasid, quizid: body.quizid || null,
      }).select().single();
      if (error) throw error;

      if (body.alternativas && Array.isArray(body.alternativas) && body.alternativas.length > 0) {
        const alts = body.alternativas.map((a: any) => ({
          perguntasid: data.id, conteudo: a.conteudo || a.text || null,
          imagem: a.imagem || null, correta: a.correta ?? a.isCorrect ?? false,
        }));
        const { error: altError } = await supabase.from("alternativas").insert(alts);
        if (altError) throw altError;
      }
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "PUT" && rest.length >= 1) {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const id = parseInt(rest[0]);

      if (rest[1] === "status") {
        const { data: existing } = await supabase.from("perguntas").select("status").eq("id", id).single();
        if (!existing) return errorResponse(404, "Pergunta nao encontrada");
        const { data, error } = await supabase.from("perguntas").update({ status: !existing.status }).eq("id", id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const updateData: Record<string, unknown> = {};
      for (const k of ['conteudo','perguntasnivelid','tempo','pathimage','categoriasid','quizid','status']) {
        if (body[k] !== undefined) updateData[k] = body[k];
      }
      const { data, error } = await supabase.from("perguntas").update(updateData).eq("id", id).select().single();
      if (error) throw error;

      if (body.alternativas && Array.isArray(body.alternativas)) {
        await supabase.from("alternativas").delete().eq("perguntasid", id);
        if (body.alternativas.length > 0) {
          const alts = body.alternativas.map((a: any) => ({
            perguntasid: id, conteudo: a.conteudo || a.text || null,
            imagem: a.imagem || null, correta: a.correta ?? a.isCorrect ?? false,
          }));
          const { error: altError } = await supabase.from("alternativas").insert(alts);
          if (altError) throw altError;
        }
      }
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const id = parseInt(rest[0]);
      await supabase.from("alternativas").delete().eq("perguntasid", id);
      const { error } = await supabase.from("perguntas").delete().eq("id", id);
      if (error) throw error;
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
