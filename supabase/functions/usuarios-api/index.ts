import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

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
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const rest = pathParts.slice(1);

  try {
    // POST /usuarios-api - create user (public, no auth needed)
    if (req.method === "POST" && rest.length === 0) {
      const body = await req.json();

      const requiredFields = { nome: "string", email: "string", senha: "string" };
      const errors: string[] = [];
      for (const [field, type] of Object.entries(requiredFields)) {
        const value = body[field];
        if (value === undefined || value === null || value === "") {
          errors.push(`Campo '${field}' é obrigatório`);
        } else if (typeof value !== type) {
          errors.push(`Campo '${field}' deve ser do tipo ${type}`);
        }
      }
      if (!body.cursoid) errors.push("Campo 'cursoid' é obrigatório");
      if (errors.length > 0) return errorResponse(400, "Dados inválidos", errors);

      const { data: existing } = await supabase.from("usuarios").select("id").eq("email", body.email).single();
      if (existing) return errorResponse(400, "Email ja cadastrado");

      const hashedPassword = await hashPassword(body.senha);
      const { data, error } = await supabase.from("usuarios").insert({
        nome: body.nome, email: body.email, senha: hashedPassword,
        telefone: body.telefone || "", sexo: body.sexo || 0,
        datanascimento: body.datanascimento || new Date().toISOString(),
        role: body.role || 3, uf: body.uf || "", foto: body.foto || "",
        pontuacao: body.pontuacao || 0, status: body.status ?? true,
        cidade: body.cidade || "", turma: body.turma || null,
        periodo: body.periodo || null, cursoid: body.cursoid, campusid: body.campusid || null,
      }).select().single();
      if (error) throw error;
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /usuarios-api/ranking/:cursoId (public)
    if (req.method === "GET" && rest[0] === "ranking" && rest[1]) {
      const cursoId = parseInt(rest[1]);
      const { data, error } = await supabase.from("usuarios")
        .select("id, nome, foto, pontuacao").eq("cursoid", cursoId).eq("status", true)
        .order("pontuacao", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /usuarios-api/:id (public)
    if (req.method === "GET" && rest[0] && !isNaN(parseInt(rest[0])) && rest.length === 1) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("usuarios").select("*").eq("id", id).single();
      if (error || !data) return errorResponse(404, "Usuario nao encontrado");
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /usuarios-api/curso/:cursoId/:skip/:take
    if (req.method === "GET" && rest[0] === "curso" && rest.length >= 4) {
      const cursoId = parseInt(rest[1]);
      const skip = parseInt(rest[2]);
      const take = parseInt(rest[3]);
      const { data, error } = await supabase.from("usuarios")
        .select("id, nome, email, telefone, sexo, datanascimento, role, uf, foto, pontuacao, status, cidade, turma, periodo, cursoid, campusid")
        .eq("cursoid", cursoId).eq("status", true).range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === AUTHENTICATED ROUTES ===

    // PUT /usuarios-api/:id - update user
    if (req.method === "PUT" && rest[0] && !isNaN(parseInt(rest[0])) && rest.length === 1) {
      const user = await verifyAuth(req);
      if (!user) return errorResponse(401, "Token não fornecido ou inválido");

      const id = parseInt(rest[0]);
      const body = await req.json();
      const updateData: Record<string, unknown> = {};
      for (const k of ['nome','email','telefone','sexo','datanascimento','uf','foto','cidade','turma','periodo','cursoid','campusid']) {
        if (body[k] !== undefined) updateData[k] = body[k];
      }
      if (Object.keys(updateData).length === 0) return errorResponse(400, "Nada para atualizar");

      const { data, error } = await supabase.from("usuarios").update(updateData).eq("id", id).select().single();
      if (error || !data) return errorResponse(404, "Usuario nao encontrado");
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /usuarios-api/:id/senha
    if (req.method === "PUT" && rest.length === 2 && rest[1] === "senha") {
      const user = await verifyAuth(req);
      if (!user) return errorResponse(401, "Token não fornecido ou inválido");

      const id = parseInt(rest[0]);
      const { senha } = await req.json();
      if (!senha || typeof senha !== "string") return errorResponse(400, "Campo 'senha' é obrigatório");
      const hashed = await hashPassword(senha);
      const { error } = await supabase.from("usuarios").update({ senha: hashed }).eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ message: "success" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /usuarios-api/:id/pontuacao
    if (req.method === "PUT" && rest.length === 2 && rest[1] === "pontuacao") {
      const user = await verifyAuth(req);
      if (!user) return errorResponse(401, "Token não fornecido ou inválido");

      const id = parseInt(rest[0]);
      const { pontuacao } = await req.json();
      const { data: existing } = await supabase.from("usuarios").select("pontuacao").eq("id", id).single();
      if (!existing) return errorResponse(404, "Usuario nao encontrado");
      const newPontuacao = (existing.pontuacao || 0) + pontuacao;
      const { data, error } = await supabase.from("usuarios").update({ pontuacao: newPontuacao }).eq("id", id).select().single();
      if (error) throw error;
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
