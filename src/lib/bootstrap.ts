import { supabase } from "../integrations/supabase/client";
import type { Empresa, ServiceResult } from "../types/app";

type InitialAccessData = {
  empresaSlug: string;
  username: string;
  senha: string;
};

const DEFAULT_COMPANY_NAME = "Empresa Principal";
const DEFAULT_COMPANY_SLUG = "principal";
const DEFAULT_SUPER_ADMIN_NAME = "Super Admin";
const DEFAULT_SUPER_ADMIN_USERNAME = "superadmin";
const DEFAULT_SUPER_ADMIN_PASSWORD = "admin123";

export async function createInitialSuperAdmin(): Promise<ServiceResult<InitialAccessData>> {
  const { data: existingSuperAdmin, error: existingSuperAdminError } = await supabase
    .from("usuarios")
    .select("id")
    .eq("nivel", "super_admin")
    .limit(1);

  if (existingSuperAdminError) {
    return { data: null, error: "Não foi possível verificar o acesso inicial." };
  }

  if (existingSuperAdmin?.length) {
    return { data: null, error: "Já existe um super admin cadastrado." };
  }

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

  return {
    data: {
      empresaSlug: DEFAULT_COMPANY_SLUG,
      username: DEFAULT_SUPER_ADMIN_USERNAME,
      senha: DEFAULT_SUPER_ADMIN_PASSWORD,
    },
    error: null,
  };
}