import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[update-usuario] starting request");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const body = await req.json();
  const id = String(body?.id ?? "");
  const nome = String(body?.nome ?? "").trim();
  const username = String(body?.username ?? "").trim().toLowerCase();
  const nivel = String(body?.nivel ?? "").trim();
  const empresaId = String(body?.empresa_id ?? "").trim();
  const senha = typeof body?.senha === "string" ? body.senha : "";

  if (!id || !nome || !username || !nivel || !empresaId) {
    console.warn("[update-usuario] missing required fields", {
      id,
      nome,
      username,
      nivel,
      empresaId,
    });

    return new Response(
      JSON.stringify({ error: "Dados obrigatórios não informados." }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const updatePayload = {
    nome,
    username,
    nivel,
    empresa_id: empresaId,
    ...(senha ? { senha } : {}),
  };

  const { error: updateError } = await supabase
    .from("usuarios")
    .update(updatePayload)
    .eq("id", id);

  if (updateError) {
    console.error("[update-usuario] failed to update user", updateError);

    return new Response(
      JSON.stringify({ error: "Não foi possível atualizar o usuário." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const { data: user, error: userError } = await supabase
    .from("usuarios")
    .select("id, username, nome, role, created_at, empresa_id, nivel")
    .eq("id", id)
    .maybeSingle();

  if (userError || !user) {
    console.error("[update-usuario] failed to load updated user", userError);

    return new Response(
      JSON.stringify({ error: "Não foi possível carregar o usuário atualizado." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.log("[update-usuario] user updated successfully", {
    id,
    empresaId,
    username,
  });

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});