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
    // GET /alternativas-api/pergunta/:perguntaId
    if (req.method === "GET" && rest[0] === "pergunta" && rest[1]) {
      const perguntaId = parseInt(rest[1]);
      const { data, error } = await supabase
        .from("alternativas")
        .select("*")
        .eq("perguntasid", perguntaId);
      if (error) throw error;
      return new Response(JSON.stringify(data || []), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /alternativas-api - create single
    if (req.method === "POST" && rest.length === 0) {
      const body = await req.json();

      // Check if it's a batch insert (array)
      if (Array.isArray(body)) {
        // Validate required fields in batch
        for (const item of body) {
          if (!item.perguntasid || typeof item.perguntasid !== "number") {
            return new Response(JSON.stringify({ status: "error", statusCode: 400, message: "Dados inválidos", errors: ["Campo 'perguntasid' é obrigatório e deve ser number em todos os itens"] }), {
              status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
        // Validate limit per pergunta
        const perguntaId = body[0]?.perguntasid;
        const { data: existing } = await supabase
          .from("alternativas")
          .select("id")
          .eq("perguntasid", perguntaId);
        
        if ((existing?.length || 0) + body.length > 5) {
          return new Response(JSON.stringify({ message: "Limite de alternativas excedido" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data, error } = await supabase.from("alternativas").insert(
          body.map((a: any) => ({
            perguntasid: a.perguntasid,
            conteudo: a.conteudo || null,
            imagem: a.imagem || null,
            correta: a.correta || false,
          }))
        ).select();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Single insert
      // Check limit
      const { data: existing } = await supabase
        .from("alternativas")
        .select("id, conteudo, correta")
        .eq("perguntasid", body.perguntasid);
      
      if ((existing?.length || 0) >= 5) {
        return new Response(JSON.stringify({ message: "Limite de alternativas excedido" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check duplicate content
      if (body.conteudo && existing?.some(a => a.conteudo === body.conteudo)) {
        return new Response(JSON.stringify({ message: "Alternativa ja existe" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if correta already exists
      if (body.correta && existing?.some(a => a.correta)) {
        return new Response(JSON.stringify({ message: "Nao pode existir mais de uma alternativa correta" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase.from("alternativas").insert({
        perguntasid: body.perguntasid,
        conteudo: body.conteudo || null,
        imagem: body.imagem || null,
        correta: body.correta || false,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /alternativas-api/:id
    if (req.method === "PUT" && rest[0] && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const body = await req.json();
      const { data, error } = await supabase.from("alternativas").update({
        conteudo: body.conteudo,
        imagem: body.imagem,
        correta: body.correta,
      }).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /alternativas-api/:id
    if (req.method === "DELETE" && rest[0] && !isNaN(parseInt(rest[0]))) {
      const id = parseInt(rest[0]);
      const { error } = await supabase.from("alternativas").delete().eq("id", id);
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
