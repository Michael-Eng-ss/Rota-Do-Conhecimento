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
      const { data: logs, error: logsError } = await supabase
        .from("logs")
        .select("datalogin, usuariosid")
        .gte("datalogin", "2024-08-01")
        .lte("datalogin", "2024-08-31");

      if (logsError) throw logsError;

      const userIds = [...new Set((logs || []).map(l => l.usuariosid))];
      if (userIds.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: usuarios } = await supabase
        .from("usuarios")
        .select("id, sexo, cidade, datanascimento")
        .in("id", userIds);

      const userMap = new Map((usuarios || []).map(u => [u.id, u]));

      const reportMap = new Map<string, any>();
      for (const log of logs || []) {
        const user = userMap.get(log.usuariosid);
        if (!user) continue;

        const hour = new Date(log.datalogin).getHours();
        let periodo = "Outro";
        if (hour >= 7 && hour <= 11) periodo = "Manhã";
        else if (hour >= 12 && hour <= 17) periodo = "Tarde";
        else if (hour >= 18 && hour <= 23) periodo = "Noite";

        if (periodo === "Outro") continue;

        const age = Math.floor((Date.now() - new Date(user.datanascimento).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const key = `${user.sexo}_${user.cidade}`;

        if (!reportMap.has(key)) {
          reportMap.set(key, {
            sexo: user.sexo, cidade: user.cidade,
            quantidade_manha: 0, quantidade_tarde: 0, quantidade_noite: 0,
            idade_15_19: 0, idade_20_24: 0, idade_25_29: 0, idade_30_34: 0, idade_35_mais: 0,
          });
        }

        const entry = reportMap.get(key);
        if (periodo === "Manhã") entry.quantidade_manha++;
        else if (periodo === "Tarde") entry.quantidade_tarde++;
        else if (periodo === "Noite") entry.quantidade_noite++;

        if (age >= 15 && age <= 19) entry.idade_15_19++;
        else if (age >= 20 && age <= 24) entry.idade_20_24++;
        else if (age >= 25 && age <= 29) entry.idade_25_29++;
        else if (age >= 30 && age <= 34) entry.idade_30_34++;
        else if (age >= 35) entry.idade_35_mais++;
      }

      return new Response(JSON.stringify([...reportMap.values()]), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return errorResponse(404, "Not Found");
  } catch (e) {
    return errorResponse(500, e.message || "Erro interno do servidor");
  }
});
