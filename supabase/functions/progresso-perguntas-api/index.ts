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
    // POST /progresso-perguntas-api - single or batch
    if (req.method === "POST") {
      const body = await req.json();

      if (Array.isArray(body)) {
        // Validate batch items
        for (const item of body) {
          if (!item.usuariosid || typeof item.usuariosid !== "number" || !item.perguntasid || typeof item.perguntasid !== "number") {
            return new Response(JSON.stringify({ status: "error", statusCode: 400, message: "Dados inválidos", errors: ["Campos 'usuariosid' e 'perguntasid' são obrigatórios e devem ser number"] }), {
              status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
        // Batch insert
        const userId = body[0]?.usuariosid;
        const { data: existing } = await supabase
          .from("progressoperguntas")
          .select("perguntasid")
          .eq("usuariosid", userId);
        
        const existingIds = new Set((existing || []).map(p => p.perguntasid));
        const perguntaIds = body.map(p => p.perguntasid);
        
        // Check duplicates
        const uniqueIds = new Set(perguntaIds);
        if (uniqueIds.size !== perguntaIds.length) {
          return new Response(JSON.stringify({ message: "As perguntas não podem se repetir" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        for (const pid of perguntaIds) {
          if (existingIds.has(pid)) {
            return new Response(JSON.stringify({ message: "Progresso ja existe" }), {
              status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        const results = [];
        for (const item of body) {
          const { data, error } = await supabase.from("progressoperguntas").insert({
            usuariosid: item.usuariosid,
            perguntasid: item.perguntasid,
          }).select().single();
          if (error) throw error;
          results.push(data);
        }

        return new Response(JSON.stringify(results), {
          status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Single insert
      const { data: existing } = await supabase
        .from("progressoperguntas")
        .select("id")
        .eq("usuariosid", body.usuariosid)
        .eq("perguntasid", body.perguntasid);
      
      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ message: "Progresso ja existe" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase.from("progressoperguntas").insert({
        usuariosid: body.usuariosid,
        perguntasid: body.perguntasid,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /progresso-perguntas-api/quiz/:quizId/usuario/:usuarioId
    if (req.method === "GET" && rest[0] === "quiz") {
      const quizId = parseInt(rest[1]);
      const usuarioId = parseInt(rest[3]); // after "usuario"

      // Get perguntas in quiz first
      const { data: perguntas } = await supabase
        .from("perguntas")
        .select("id")
        .eq("quizid", quizId);
      const perguntaIds = (perguntas || []).map(p => p.id);

      if (perguntaIds.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("progressoperguntas")
        .select("*")
        .eq("usuariosid", usuarioId)
        .in("perguntasid", perguntaIds);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /progresso-perguntas-api/categoria/:catId/quiz/:quizId/usuario/:usuarioId
    if (req.method === "GET" && rest[0] === "categoria") {
      const categoriaId = parseInt(rest[1]);
      const quizId = parseInt(rest[3]);
      const usuarioId = parseInt(rest[5]);

      const { data: perguntas } = await supabase
        .from("perguntas")
        .select("id")
        .eq("quizid", quizId)
        .eq("categoriasid", categoriaId);
      const perguntaIds = (perguntas || []).map(p => p.id);

      if (perguntaIds.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("progressoperguntas")
        .select("*")
        .eq("usuariosid", usuarioId)
        .in("perguntasid", perguntaIds);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
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
