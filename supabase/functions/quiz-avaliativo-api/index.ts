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
    // POST /quiz-avaliativo-api - save score
    if (req.method === "POST") {
      const body = await req.json();

      // Validate required fields
      const errors: string[] = [];
      if (!body.quizid || typeof body.quizid !== "number") errors.push("Campo 'quizid' é obrigatório e deve ser number");
      if (!body.usuarioid || typeof body.usuarioid !== "number") errors.push("Campo 'usuarioid' é obrigatório e deve ser number");
      if (body.pontuacao === undefined || body.pontuacao === null) errors.push("Campo 'pontuacao' é obrigatório");
      if (errors.length > 0) {
        return new Response(JSON.stringify({ status: "error", statusCode: 400, message: "Dados inválidos", errors }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (body.pontuacao < 0) {
        return new Response(JSON.stringify({ status: "error", statusCode: 400, message: "A pontuacao nao pode ser negativa" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if score already exists
      const { data: existing } = await supabase
        .from("quiz_avaliativo_usuario")
        .select("id")
        .eq("quizid", body.quizid)
        .eq("usuarioid", body.usuarioid)
        .single();
      
      if (existing) {
        return new Response(JSON.stringify({ message: "Pontuacao ja existe" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase.from("quiz_avaliativo_usuario").insert({
        quizid: body.quizid,
        usuarioid: body.usuarioid,
        pontuacao: body.pontuacao,
        horainicial: body.horainicial || new Date().toISOString(),
        horafinal: body.horafinal || new Date().toISOString(),
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-avaliativo-api/:id
    if (req.method === "GET" && rest.length === 1 && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("quiz_avaliativo_usuario").select("*").eq("id", id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ message: "Pontuacao nao encontrada" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /quiz-avaliativo-api/quiz/:quizId/:skip/:take
    if (req.method === "GET" && rest[0] === "quiz") {
      const quizId = parseInt(rest[1]);
      const skip = parseInt(rest[2]) || 0;
      const take = parseInt(rest[3]) || 20;
      const { data, error } = await supabase
        .from("quiz_avaliativo_usuario")
        .select("*")
        .eq("quizid", quizId)
        .range(skip, skip + take - 1);
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
