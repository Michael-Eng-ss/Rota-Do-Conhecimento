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
    // GET /perguntas-api/:id - get by id
    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("perguntas").select("*").eq("id", id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ message: "Pergunta nao encontrada" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /perguntas-api/quiz/:quizId/categoria/:categoriaId/usuario/:userId/:skip/:take
    if (req.method === "GET" && rest[0] === "quiz") {
      const quizId = parseInt(rest[1]);
      const categoriaId = rest[2] === "categoria" ? parseInt(rest[3]) : undefined;
      
      // Parse remaining path params
      let userId: number | undefined;
      let skip = 0;
      let take = 20;
      
      if (rest.includes("usuario")) {
        const uIdx = rest.indexOf("usuario");
        userId = parseInt(rest[uIdx + 1]);
        skip = parseInt(rest[uIdx + 2]) || 0;
        take = parseInt(rest[uIdx + 3]) || 20;
      } else if (categoriaId !== undefined) {
        // /quiz/:id/categoria/:catId/:skip/:take (for prof)
        skip = parseInt(rest[4]) || 0;
        take = parseInt(rest[5]) || 20;
      }

      let query = supabase
        .from("perguntas")
        .select("*")
        .eq("quizid", quizId)
        .eq("status", true);

      if (categoriaId) query = query.eq("categoriasid", categoriaId);
      query = query.range(skip, skip + take - 1);

      // If userId provided, exclude already answered questions
      if (userId) {
        const { data: progresso } = await supabase
          .from("progressoperguntas")
          .select("perguntasid")
          .eq("usuariosid", userId);
        
        const answeredIds = (progresso || []).map(p => p.perguntasid);
        if (answeredIds.length > 0) {
          query = query.not("id", "in", `(${answeredIds.join(",")})`);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /perguntas-api - create
    if (req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase.from("perguntas").insert({
        conteudo: body.conteudo,
        perguntasnivelid: body.perguntasnivelid,
        tempo: body.tempo || 30,
        pathimage: body.pathimage || null,
        status: body.status ?? true,
        categoriasid: body.categoriasid,
        quizid: body.quizid || null,
      }).select().single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /perguntas-api/:id - update
    if (req.method === "PUT" && rest.length >= 1) {
      const id = parseInt(rest[0]);
      
      // PUT /perguntas-api/:id/status - toggle status
      if (rest[1] === "status") {
        const { data: existing } = await supabase.from("perguntas").select("status").eq("id", id).single();
        if (!existing) {
          return new Response(JSON.stringify({ message: "Pergunta nao encontrada" }), {
            status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await supabase.from("perguntas").update({ status: !existing.status }).eq("id", id).select().single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Regular update
      const body = await req.json();
      const updateData: Record<string, unknown> = {};
      if (body.conteudo !== undefined) updateData.conteudo = body.conteudo;
      if (body.perguntasnivelid !== undefined) updateData.perguntasnivelid = body.perguntasnivelid;
      if (body.tempo !== undefined) updateData.tempo = body.tempo;
      if (body.pathimage !== undefined) updateData.pathimage = body.pathimage;
      if (body.categoriasid !== undefined) updateData.categoriasid = body.categoriasid;
      if (body.quizid !== undefined) updateData.quizid = body.quizid;

      const { data, error } = await supabase.from("perguntas").update(updateData).eq("id", id).select().single();
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
