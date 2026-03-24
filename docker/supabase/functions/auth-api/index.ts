import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getJwtSecret(): string {
  const secret = Deno.env.get("JWT_SECRET");
  if (!secret) throw new Error("JWT_SECRET not configured");
  return secret;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function createJWT(payload: Record<string, unknown>): Promise<string> {
  const secret = getJwtSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + 28800 }; // 8h

  const base64url = (obj: unknown) => {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    return btoa(String.fromCharCode(...bytes)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };

  const headerB64 = base64url(header);
  const payloadB64 = base64url(fullPayload);
  const signingInput = `${headerB64}.${payloadB64}`;

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${headerB64}.${payloadB64}.${sigB64}`;
}

export async function verifyJWT(token: string): Promise<Record<string, unknown> | null> {
  try {
    const secret = getJwtSecret();
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const signingInput = `${parts[0]}.${parts[1]}`;
    const signature = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(signingInput));
    if (!valid) return null;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ status: "error", statusCode: status, message }), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const { email, senha } = body;

    // Validate required fields
    const errors: string[] = [];
    if (!email || typeof email !== "string") errors.push("Campo 'email' é obrigatório e deve ser string");
    if (!senha || typeof senha !== "string") errors.push("Campo 'senha' é obrigatório e deve ser string");
    if (errors.length > 0) {
      return new Response(JSON.stringify({ status: "error", statusCode: 400, message: "Dados inválidos", errors }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: user, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return errorResponse(401, "Email e/ou Senha Incorretos");

    const hashed = await hashPassword(senha);
    if (user.senha !== hashed) return errorResponse(401, "Email e/ou Senha Incorretos");

    const token = await createJWT({ id: user.id, name: user.nome, role: user.role });

    // Log login
    await supabase.from("logs").insert({ usuariosid: user.id, descricao: "Login successfully" });

    return new Response(JSON.stringify({ token, id: user.id, role: user.role }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
