import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ status: "error", statusCode: status, message }), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = getSupabase();

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("perguntasnivel").select("*");
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const rest = pathParts.slice(1);

    if (req.method === "GET" && rest.length === 1) {
      const { data, error } = await supabase.from("perguntasnivel").select("*").eq("id", parseInt(rest[0])).single();
      if (error || !data) return errorResponse(404, "Nivel nao encontrado");
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
