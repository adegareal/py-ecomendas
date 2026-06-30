import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_COMPANY_NAME = "Empresa Principal";
const DEFAULT_COMPANY_SLUG = "principal";
const DEFAULT_SUPER_ADMIN_NAME = "Super Admin";
const DEFAULT_SUPER_ADMIN_USERNAME = "superadmin";
const DEFAULT_SUPER_ADMIN_PASSWORD = "admin123";
const DEFAULT_DATABASE_LEVEL = "admin_empresa";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[bootstrap-super-admin] starting bootstrap");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data: existingCompany, error: existingCompanyError } = await supabase
    .from("empresas")
    .select("id, nome, slug, created_at")
    .eq("slug", DEFAULT_COMPANY_SLUG)
    .maybeSingle();

  if (existingCompanyError) {
    console.error("[bootstrap-super-admin] failed to load company", existingCompanyError);
    return new Response(
      JSON.stringify({ error: "Não foi possível preparar a empresa inicial." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  let company = existingCompany;

  if (!company) {
    const { data: createdCompany, error: createCompanyError } = await supabase
      .from("empresas")
      .insert({
        nome: DEFAULT_COMPANY_NAME,
        slug: DEFAULT_COMPANY_SLUG,
      })
      .select("id, nome, slug, created_at")
      .single();

    if (createCompanyError || !createdCompany) {
      console.error("[bootstrap-super-admin] failed to create company", createCompanyError);
      return new Response(
        JSON.stringify({ error: "Não foi possível criar a empresa inicial." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    company = createdCompany;
  }

  const { data: existingUser, error: existingUserError } = await supabase
    .from("usuarios")
    .select("id")
    .eq("empresa_id", company.id)
    .eq("username", DEFAULT_SUPER_ADMIN_USERNAME)
    .maybeSingle();

  if (existingUserError) {
    console.error("[bootstrap-super-admin] failed to load user", existingUserError);
    return new Response(
      JSON.stringify({ error: "Não foi possível verificar o usuário inicial." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (existingUser) {
    const { error: updateUserError } = await supabase
      .from("usuarios")
      .update({
        nome: DEFAULT_SUPER_ADMIN_NAME,
        senha: DEFAULT_SUPER_ADMIN_PASSWORD,
        nivel: DEFAULT_DATABASE_LEVEL,
        empresa_id: company.id,
      })
      .eq("id", existingUser.id)
      .eq("empresa_id", company.id);

    if (updateUserError) {
      console.error("[bootstrap-super-admin] failed to update user", updateUserError);
      return new Response(
        JSON.stringify({ error: "Não foi possível restaurar o super admin inicial." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } else {
    const { error: createUserError } = await supabase.from("usuarios").insert({
      nome: DEFAULT_SUPER_ADMIN_NAME,
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      senha: DEFAULT_SUPER_ADMIN_PASSWORD,
      nivel: DEFAULT_DATABASE_LEVEL,
      empresa_id: company.id,
    });

    if (createUserError) {
      console.error("[bootstrap-super-admin] failed to create user", createUserError);
      return new Response(
        JSON.stringify({ error: "Não foi possível criar o super admin inicial." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  }

  console.log("[bootstrap-super-admin] bootstrap completed", {
    companySlug: DEFAULT_COMPANY_SLUG,
    username: DEFAULT_SUPER_ADMIN_USERNAME,
  });

  return new Response(
    JSON.stringify({
      empresaSlug: DEFAULT_COMPANY_SLUG,
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      senha: DEFAULT_SUPER_ADMIN_PASSWORD,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});