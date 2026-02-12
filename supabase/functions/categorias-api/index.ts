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
    // POST /categorias-api
    if (req.method === "POST") {
      const body = await req.json();

      // Check duplicate
      const { data: existing } = await supabase
        .from("categorias")
        .select("id")
        .eq("descricao", body.descricao)
        .eq("cursoId", body.cursoId)
        .single();
      if (existing) {
        return new Response(JSON.stringify({ message: "Categoria ja existe" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase.from("categorias").insert({
        descricao: body.descricao,
        imagem: body.imagem || "",
        "cursoId": body.cursoId,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /categorias-api/:id
    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("categorias").select("*").eq("id", id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ message: "Categoria nao encontrada" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /categorias-api/curso/:cursoId
    if (req.method === "GET" && rest[0] === "curso" && rest[1]) {
      const cursoId = parseInt(rest[1]);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("cursoId", cursoId)
        .eq("status", true);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /categorias-api/quiz/:quizId
    if (req.method === "GET" && rest[0] === "quiz" && rest[1]) {
      const quizId = parseInt(rest[1]);
      // Get distinct categorias from perguntas in quiz
      const { data: perguntas } = await supabase
        .from("perguntas")
        .select("categoriasid")
        .eq("quizid", quizId);
      
      const catIds = [...new Set((perguntas || []).map(p => p.categoriasid))];
      if (catIds.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const { data, error } = await supabase.from("categorias").select("*").in("id", catIds);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /categorias-api/:id
    if (req.method === "PUT" && rest.length >= 1) {
      const id = parseInt(rest[0]);

      // PUT /categorias-api/:id/status
      if (rest[1] === "status") {
        const { data: existing } = await supabase.from("categorias").select("status").eq("id", id).single();
        if (!existing) {
          return new Response(JSON.stringify({ message: "Categoria nao encontrada" }), {
            status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await supabase.from("categorias").update({ status: !existing.status }).eq("id", id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const { data, error } = await supabase.from("categorias").update({
        descricao: body.descricao,
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
