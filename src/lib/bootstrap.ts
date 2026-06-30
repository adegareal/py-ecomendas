import { supabase } from "../integrations/supabase/client";
import type { Empresa, ServiceResult } from "../types/app";

type InitialAccessData = {
  empresaSlug: string;
  username: string;
  senha: string;
};

type ExistingUser = {
  id: string;
};

const DEFAULT_COMPANY_NAME = "Empresa Principal";
const DEFAULT_COMPANY_SLUG = "principal";
const DEFAULT_SUPER_ADMIN_NAME = "Super Admin";
const DEFAULT_SUPER_ADMIN_USERNAME = "superadmin";
const DEFAULT_SUPER_ADMIN_PASSWORD = "admin123";

export async function createInitialSuperAdmin(): Promise<ServiceResult<InitialAccessData>> {
  const { data: existingCompany, error: existingCompanyError } = await supabase
    .from("empresas")
    .select("id, nome, slug, created_at")
    .eq("slug", DEFAULT_COMPANY_SLUG)
    .maybeSingle<Empresa>();

  if (existingCompanyError) {
    return { data: null, error: "Não foi possível preparar a empresa inicial." };
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
      .single<Empresa>();

    if (createCompanyError || !createdCompany) {
      return { data: null, error: "Não foi possível criar a empresa inicial." };
    }

    company = createdCompany;
  }

  const { data: existingInitialUser, error: existingInitialUserError } = await supabase
    .from("usuarios")
    .select("id")
    .eq("empresa_id", company.id)
    .eq("username", DEFAULT_SUPER_ADMIN_USERNAME)
    .maybeSingle<ExistingUser>();

  if (existingInitialUserError) {
    return { data: null, error: "Não foi possível verificar o usuário inicial." };
  }

  if (existingInitialUser) {
    const { error: updateUserError } = await supabase
      .from("usuarios")
      .update({
        nome: DEFAULT_SUPER_ADMIN_NAME,
        senha: DEFAULT_SUPER_ADMIN_PASSWORD,
        nivel: "super_admin",
        role: "super_admin",
      })
      .eq("id", existingInitialUser.id)
      .eq("empresa_id", company.id);

    if (updateUserError) {
      return { data: null, error: "Não foi possível restaurar o super admin inicial." };
    }
  } else {
    const { error: createUserError } = await supabase.from("usuarios").insert({
      nome: DEFAULT_SUPER_ADMIN_NAME,
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      senha: DEFAULT_SUPER_ADMIN_PASSWORD,
      nivel: "super_admin",
      role: "super_admin",
      empresa_id: company.id,
    });

    if (createUserError) {
      return { data: null, error: "Não foi possível criar o super admin inicial." };
    }
  }

  return {
    data: {
      empresaSlug: DEFAULT_COMPANY_SLUG,
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      senha: DEFAULT_SUPER_ADMIN_PASSWORD,
    },
    error: null,
  };
}