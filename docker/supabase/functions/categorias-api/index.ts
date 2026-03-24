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
    // POST /categorias-api (admin only)
    if (req.method === "POST") {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const body = await req.json();
      const errors: string[] = [];
      if (!body.descricao || typeof body.descricao !== "string") errors.push("Campo 'descricao' é obrigatório e deve ser string");
      if (!body.cursoId || typeof body.cursoId !== "number") errors.push("Campo 'cursoId' é obrigatório e deve ser number");
      if (errors.length > 0) return errorResponse(400, "Dados inválidos", errors);

      const { data: existing } = await supabase.from("categorias").select("id").eq("descricao", body.descricao).eq("cursoId", body.cursoId).single();
      if (existing) return errorResponse(400, "Categoria ja existe");

      const { data, error } = await supabase.from("categorias").insert({
        descricao: body.descricao, imagem: body.imagem || "", "cursoId": body.cursoId,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // GET /categorias-api/:id
    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const { data, error } = await supabase.from("categorias").select("*").eq("id", parseInt(rest[0])).single();
      if (error || !data) return errorResponse(404, "Categoria nao encontrada");
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // GET /categorias-api/curso/:cursoId
    if (req.method === "GET" && rest[0] === "curso" && rest[1]) {
      const { data, error } = await supabase.from("categorias").select("*").eq("cursoId", parseInt(rest[1])).eq("status", true);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // GET /categorias-api/quiz/:quizId
    if (req.method === "GET" && rest[0] === "quiz" && rest[1]) {
      const { data: perguntas } = await supabase.from("perguntas").select("categoriasid").eq("quizid", parseInt(rest[1]));
      const catIds = [...new Set((perguntas || []).map(p => p.categoriasid))];
      if (catIds.length === 0) return new Response(JSON.stringify([]), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data, error } = await supabase.from("categorias").select("*").in("id", catIds);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // PUT /categorias-api/:id (admin only)
    if (req.method === "PUT" && rest.length >= 1) {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const id = parseInt(rest[0]);
      if (rest[1] === "status") {
        const { data: existing } = await supabase.from("categorias").select("status").eq("id", id).single();
        if (!existing) return errorResponse(404, "Categoria nao encontrada");
        const { data, error } = await supabase.from("categorias").update({ status: !existing.status }).eq("id", id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const body = await req.json();
      const { data, error } = await supabase.from("categorias").update({ descricao: body.descricao, imagem: body.imagem }).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
