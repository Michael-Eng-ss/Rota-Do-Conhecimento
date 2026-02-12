import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const rest = pathParts.slice(1);

  try {
    // POST /quiz-api - create quiz
    if (req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase.from("quiz").insert({
        titulo: body.titulo,
        cursoid: body.cursoid,
        imagem: body.imagem || "",
        status: body.status ?? true,
        avaliativo: body.avaliativo ?? false,
        usuarioid: body.usuarioid,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-api/:id
    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("quiz").select("*").eq("id", id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ message: "Quiz nao encontrado" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-api/:skip/:take - all quizzes paginated
    if (req.method === "GET" && rest.length === 2 && !isNaN(parseInt(rest[0]))) {
      const skip = parseInt(rest[0]);
      const take = parseInt(rest[1]);
      const { data, error } = await supabase.from("quiz").select("*").range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-api/curso/:cursoId/:skip/:take
    if (req.method === "GET" && rest[0] === "curso" && rest.length >= 4) {
      const cursoId = parseInt(rest[1]);
      const skip = parseInt(rest[2]);
      const take = parseInt(rest[3]);
      const { data, error } = await supabase.from("quiz").select("*").eq("cursoid", cursoId).range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-api/usuario/:usuarioId/curso/:cursoId/:skip/:take
    if (req.method === "GET" && rest[0] === "usuario") {
      const usuarioId = parseInt(rest[1]);
      const cursoId = parseInt(rest[3]); // after "curso"
      const skip = parseInt(rest[4]);
      const take = parseInt(rest[5]);
      const { data, error } = await supabase.from("quiz").select("*")
        .eq("cursoid", cursoId)
        .eq("usuarioid", usuarioId)
        .range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-api/avaliativo/usuario/:usuarioId/curso/:cursoId/:skip/:take
    if (req.method === "GET" && rest[0] === "avaliativo") {
      const usuarioId = parseInt(rest[2]);
      const cursoId = parseInt(rest[4]);
      const skip = parseInt(rest[5]);
      const take = parseInt(rest[6]);
      const { data, error } = await supabase.from("quiz").select("*")
        .eq("cursoid", cursoId)
        .eq("usuarioid", usuarioId)
        .eq("avaliativo", true)
        .range(skip, skip + take - 1);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /quiz-api/:id
    if (req.method === "PUT" && rest.length >= 1) {
      const id = parseInt(rest[0]);

      // PUT /quiz-api/:id/status
      if (rest[1] === "status") {
        const { data: existing } = await supabase.from("quiz").select("status").eq("id", id).single();
        if (!existing) {
          return new Response(JSON.stringify({ message: "Quiz nao encontrado" }), {
            status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await supabase.from("quiz").update({ status: !existing.status }).eq("id", id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const { data, error } = await supabase.from("quiz").update({
        titulo: body.titulo,
        imagem: body.imagem,
      }).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
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
