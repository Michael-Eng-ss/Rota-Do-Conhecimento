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
    // POST /quiz-avaliativo-api - save score (authenticated)
    if (req.method === "POST") {
      const user = await verifyAuth(req);
      if (!user) return errorResponse(401, "Token não fornecido ou inválido");

      const body = await req.json();
      const errors: string[] = [];
      if (!body.quizid || typeof body.quizid !== "number") errors.push("Campo 'quizid' é obrigatório e deve ser number");
      if (!body.usuarioid || typeof body.usuarioid !== "number") errors.push("Campo 'usuarioid' é obrigatório e deve ser number");
      if (body.pontuacao === undefined || body.pontuacao === null) errors.push("Campo 'pontuacao' é obrigatório");
      if (errors.length > 0) return errorResponse(400, "Dados inválidos", errors);

      if (body.pontuacao < 0) return errorResponse(400, "A pontuacao nao pode ser negativa");

      const { data: existing } = await supabase.from("quiz_avaliativo_usuario").select("id").eq("quizid", body.quizid).eq("usuarioid", body.usuarioid).single();
      if (existing) return errorResponse(400, "Pontuacao ja existe");

      const { data, error } = await supabase.from("quiz_avaliativo_usuario").insert({
        quizid: body.quizid, usuarioid: body.usuarioid, pontuacao: body.pontuacao,
        horainicial: body.horainicial || new Date().toISOString(),
        horafinal: body.horafinal || new Date().toISOString(),
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const { data, error } = await supabase.from("quiz_avaliativo_usuario").select("*").eq("id", parseInt(rest[0])).single();
      if (error || !data) return errorResponse(404, "Pontuacao nao encontrada");
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && rest[0] === "quiz") {
      const { data, error } = await supabase.from("quiz_avaliativo_usuario").select("*").eq("quizid", parseInt(rest[1])).range(parseInt(rest[2]) || 0, (parseInt(rest[2]) || 0) + (parseInt(rest[3]) || 20) - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
