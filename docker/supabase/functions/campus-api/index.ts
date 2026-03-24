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
    // GET /campus-api - all
    if (req.method === "GET" && rest.length === 0) {
      const { data, error } = await supabase.from("campus").select("*");
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // GET /campus-api/:id
    if (req.method === "GET" && rest.length === 1) {
      const { data, error } = await supabase.from("campus").select("*").eq("id", parseInt(rest[0])).single();
      if (error || !data) return errorResponse(404, "Campus nao encontrado");
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // POST /campus-api (admin only)
    if (req.method === "POST") {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const body = await req.json();
      if (!body.nomecampus || typeof body.nomecampus !== "string") return errorResponse(400, "Dados inválidos", ["Campo 'nomecampus' é obrigatório e deve ser string"]);

      const { data: existing } = await supabase.from("campus").select("id").eq("nomecampus", body.nomecampus);
      if (existing && existing.length > 0) return errorResponse(400, "Campus ja existe");

      const { data, error } = await supabase.from("campus").insert({ nomecampus: body.nomecampus }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // PUT /campus-api/:id (admin only)
    if (req.method === "PUT" && rest[0]) {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const body = await req.json();
      if (!body.nomecampus || typeof body.nomecampus !== "string") return errorResponse(400, "Dados inválidos", ["Campo 'nomecampus' é obrigatório e deve ser string"]);

      const { data, error } = await supabase.from("campus").update({ nomecampus: body.nomecampus }).eq("id", parseInt(rest[0])).select().single();
      if (error || !data) return errorResponse(404, "Campus nao encontrado");
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // DELETE /campus-api/:id (admin only)
    if (req.method === "DELETE" && rest[0]) {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const { error } = await supabase.from("campus").delete().eq("id", parseInt(rest[0]));
      if (error) throw error;
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
