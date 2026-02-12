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
    // GET /campus-api - all
    if (req.method === "GET" && rest.length === 0) {
      const { data, error } = await supabase.from("campus").select("*");
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /campus-api/:id
    if (req.method === "GET" && rest.length === 1) {
      const id = parseInt(rest[0]);
      const { data, error } = await supabase.from("campus").select("*").eq("id", id).single();
      if (error || !data) {
        return new Response(JSON.stringify({ message: "Campus nao encontrado" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /campus-api
    if (req.method === "POST") {
      const body = await req.json();
      const { data: existing } = await supabase.from("campus").select("id").eq("nomecampus", body.nomecampus);
      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ message: "Campus ja existe" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase.from("campus").insert({ nomecampus: body.nomecampus }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /campus-api/:id
    if (req.method === "PUT" && rest[0]) {
      const id = parseInt(rest[0]);
      const body = await req.json();
      const { data, error } = await supabase.from("campus").update({ nomecampus: body.nomecampus }).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /campus-api/:id
    if (req.method === "DELETE" && rest[0]) {
      const id = parseInt(rest[0]);
      const { error } = await supabase.from("campus").delete().eq("id", id);
      if (error) throw error;
      return new Response(null, { status: 204, headers: corsHeaders });
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
