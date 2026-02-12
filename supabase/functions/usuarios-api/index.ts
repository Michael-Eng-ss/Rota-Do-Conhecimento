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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  // pathParts: ["usuarios-api", ...rest]
  const rest = pathParts.slice(1);

  try {
    // POST /usuarios-api - create user
    if (req.method === "POST" && rest.length === 0) {
      const body = await req.json();

      // Check email uniqueness
      const { data: existing } = await supabase.from("usuarios").select("id").eq("email", body.email).single();
      if (existing) {
        return new Response(JSON.stringify({ message: "Email ja cadastrado" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const hashedPassword = await hashPassword(body.senha);
      const { data, error } = await supabase.from("usuarios").insert({
        nome: body.nome,
        email: body.email,
        senha: hashedPassword,
        telefone: body.telefone || "",
        sexo: body.sexo || 0,
        datanascimento: body.datanascimento || new Date().toISOString(),
        role: body.role || 3,
        uf: body.uf || "",
        foto: body.foto || "",
        pontuacao: body.pontuacao || 0,
        status: body.status ?? true,
        cidade: body.cidade || "",
        turma: body.turma || null,
        periodo: body.periodo || null,
        cursoid: body.cursoid,
        campusid: body.campusid || null,
      }).select().single();

      if (error) throw error;
      // Remove senha from response
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /usuarios-api/ranking/:cursoId
    if (req.method === "GET" && rest[0] === "ranking" && rest[1]) {
      const cursoId = parseInt(rest[1]);
      const { data, error } = await supabase
        .from("usuarios")
        .select("id, nome, foto, pontuacao")
        .eq("cursoid", cursoId)
        .eq("status", true)
        .order("pontuacao", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /usuarios-api/:id
    if (req.method === "GET" && rest[0] && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("usuarios").select("*").eq("id", id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ message: "Usuario nao encontrado" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
      const { data, error } = await supabase
        .from("usuarios")
        .select("id, nome, email, telefone, sexo, datanascimento, role, uf, foto, pontuacao, status, cidade, turma, periodo, cursoid, campusid")
        .eq("cursoid", cursoId)
        .eq("status", true)
        .range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /usuarios-api/:id - update user
    if (req.method === "PUT" && rest[0] && !isNaN(parseInt(rest[0])) && rest.length === 1) {
      const id = parseInt(rest[0]);
      const body = await req.json();

      const updateData: Record<string, unknown> = {};
      if (body.nome !== undefined) updateData.nome = body.nome;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.telefone !== undefined) updateData.telefone = body.telefone;
      if (body.sexo !== undefined) updateData.sexo = body.sexo;
      if (body.datanascimento !== undefined) updateData.datanascimento = body.datanascimento;
      if (body.uf !== undefined) updateData.uf = body.uf;
      if (body.foto !== undefined) updateData.foto = body.foto;
      if (body.cidade !== undefined) updateData.cidade = body.cidade;
      if (body.turma !== undefined) updateData.turma = body.turma;
      if (body.periodo !== undefined) updateData.periodo = body.periodo;
      if (body.cursoid !== undefined) updateData.cursoid = body.cursoid;
      if (body.campusid !== undefined) updateData.campusid = body.campusid;

      const { data, error } = await supabase.from("usuarios").update(updateData).eq("id", id).select().single();
      if (error) throw error;
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /usuarios-api/:id/senha - update password
    if (req.method === "PUT" && rest.length === 2 && rest[1] === "senha") {
      const id = parseInt(rest[0]);
      const { senha } = await req.json();
      const hashed = await hashPassword(senha);
      const { error } = await supabase.from("usuarios").update({ senha: hashed }).eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ message: "success" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /usuarios-api/:id/pontuacao - add score
    if (req.method === "PUT" && rest.length === 2 && rest[1] === "pontuacao") {
      const id = parseInt(rest[0]);
      const { pontuacao } = await req.json();
      const { data: user } = await supabase.from("usuarios").select("pontuacao").eq("id", id).single();
      if (!user) {
        return new Response(JSON.stringify({ message: "Usuario nao encontrado" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const newPontuacao = (user.pontuacao || 0) + pontuacao;
      const { data, error } = await supabase.from("usuarios").update({ pontuacao: newPontuacao }).eq("id", id).select().single();
      if (error) throw error;
      const { senha: _, ...safeData } = data;
      return new Response(JSON.stringify(safeData), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Not Found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message || "Internal Error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
