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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const rest = pathParts.slice(1);

  try {
    // POST /progresso-perguntas-api (authenticated)
    if (req.method === "POST") {
      const user = await verifyAuth(req);
      if (!user) return errorResponse(401, "Token não fornecido ou inválido");

      const body = await req.json();

      if (Array.isArray(body)) {
        for (const item of body) {
          if (!item.usuariosid || typeof item.usuariosid !== "number" || !item.perguntasid || typeof item.perguntasid !== "number") {
            return errorResponse(400, "Dados inválidos", ["Campos 'usuariosid' e 'perguntasid' são obrigatórios e devem ser number"]);
          }
        }
        const userId = body[0]?.usuariosid;
        const { data: existing } = await supabase.from("progressoperguntas").select("perguntasid").eq("usuariosid", userId);
        const existingIds = new Set((existing || []).map(p => p.perguntasid));
        const perguntaIds = body.map(p => p.perguntasid);
        if (new Set(perguntaIds).size !== perguntaIds.length) return errorResponse(400, "As perguntas não podem se repetir");
        for (const pid of perguntaIds) {
          if (existingIds.has(pid)) return errorResponse(400, "Progresso ja existe");
        }
        const results = [];
        for (const item of body) {
          const { data, error } = await supabase.from("progressoperguntas").insert({ usuariosid: item.usuariosid, perguntasid: item.perguntasid }).select().single();
          if (error) throw error;
          results.push(data);
        }
        return new Response(JSON.stringify(results), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Single insert
      const errors: string[] = [];
      if (!body.usuariosid || typeof body.usuariosid !== "number") errors.push("Campo 'usuariosid' é obrigatório e deve ser number");
      if (!body.perguntasid || typeof body.perguntasid !== "number") errors.push("Campo 'perguntasid' é obrigatório e deve ser number");
      if (errors.length > 0) return errorResponse(400, "Dados inválidos", errors);

      const { data: existing } = await supabase.from("progressoperguntas").select("id").eq("usuariosid", body.usuariosid).eq("perguntasid", body.perguntasid);
      if (existing && existing.length > 0) return errorResponse(400, "Progresso ja existe");

      const { data, error } = await supabase.from("progressoperguntas").insert({ usuariosid: body.usuariosid, perguntasid: body.perguntasid }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // GET /progresso-perguntas-api/quiz/:quizId/usuario/:usuarioId
    if (req.method === "GET" && rest[0] === "quiz") {
      const quizId = parseInt(rest[1]);
      const usuarioId = parseInt(rest[3]);
      const { data: perguntas } = await supabase.from("perguntas").select("id").eq("quizid", quizId);
      const perguntaIds = (perguntas || []).map(p => p.id);
      if (perguntaIds.length === 0) return new Response(JSON.stringify([]), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data, error } = await supabase.from("progressoperguntas").select("*").eq("usuariosid", usuarioId).in("perguntasid", perguntaIds);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // GET /progresso-perguntas-api/categoria/:catId/quiz/:quizId/usuario/:usuarioId
    if (req.method === "GET" && rest[0] === "categoria") {
      const categoriaId = parseInt(rest[1]);
      const quizId = parseInt(rest[3]);
      const usuarioId = parseInt(rest[5]);
      const { data: perguntas } = await supabase.from("perguntas").select("id").eq("quizid", quizId).eq("categoriasid", categoriaId);
      const perguntaIds = (perguntas || []).map(p => p.id);
      if (perguntaIds.length === 0) return new Response(JSON.stringify([]), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data, error } = await supabase.from("progressoperguntas").select("*").eq("usuariosid", usuarioId).in("perguntasid", perguntaIds);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
