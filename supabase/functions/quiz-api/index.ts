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
    // POST /quiz-api - create quiz (admin only)
    if (req.method === "POST") {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const body = await req.json();
      const errors: string[] = [];
      if (!body.titulo || typeof body.titulo !== "string") errors.push("Campo 'titulo' é obrigatório e deve ser string");
      if (!body.cursoid || typeof body.cursoid !== "number") errors.push("Campo 'cursoid' é obrigatório e deve ser number");
      if (!body.usuarioid || typeof body.usuarioid !== "number") errors.push("Campo 'usuarioid' é obrigatório e deve ser number");
      if (errors.length > 0) return errorResponse(400, "Dados inválidos", errors);

      const { data, error } = await supabase.from("quiz").insert({
        titulo: body.titulo, cursoid: body.cursoid, imagem: body.imagem || "",
        status: body.status ?? true, avaliativo: body.avaliativo ?? false, usuarioid: body.usuarioid,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET routes (public)
    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("quiz").select("*").eq("id", id).single();
      if (error || !data) return errorResponse(404, "Quiz nao encontrado");
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && rest.length === 2 && !isNaN(parseInt(rest[0]))) {
      const skip = parseInt(rest[0]); const take = parseInt(rest[1]);
      const { data, error } = await supabase.from("quiz").select("*").range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && rest[0] === "curso" && rest.length >= 4) {
      const { data, error } = await supabase.from("quiz").select("*").eq("cursoid", parseInt(rest[1])).range(parseInt(rest[2]), parseInt(rest[2]) + parseInt(rest[3]) - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && rest[0] === "usuario") {
      const { data, error } = await supabase.from("quiz").select("*").eq("cursoid", parseInt(rest[3])).eq("usuarioid", parseInt(rest[1])).range(parseInt(rest[4]), parseInt(rest[4]) + parseInt(rest[5]) - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "GET" && rest[0] === "avaliativo") {
      const { data, error } = await supabase.from("quiz").select("*").eq("cursoid", parseInt(rest[4])).eq("usuarioid", parseInt(rest[2])).eq("avaliativo", true).range(parseInt(rest[5]), parseInt(rest[5]) + parseInt(rest[6]) - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // PUT /quiz-api/:id (admin only)
    if (req.method === "PUT" && rest.length >= 1) {
      const user = await verifyAuth(req);
      const denied = requireAdmin(user);
      if (denied) return denied;

      const id = parseInt(rest[0]);
      if (rest[1] === "status") {
        const { data: existing } = await supabase.from("quiz").select("status").eq("id", id).single();
        if (!existing) return errorResponse(404, "Quiz nao encontrado");
        const { data, error } = await supabase.from("quiz").update({ status: !existing.status }).eq("id", id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const body = await req.json();
      const { data, error } = await supabase.from("quiz").update({ titulo: body.titulo, imagem: body.imagem }).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
