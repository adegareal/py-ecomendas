import { supabase } from "../integrations/supabase/client";
import type { Empresa, ServiceResult } from "../types/app";

type CompanyPayload = {
  nome: string;
  slug: string;
};

export async function listCompanies(): Promise<ServiceResult<Empresa[]>> {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("nome", { ascending: true });

  return {
    data: data ?? [],
    error: error ? "Não foi possível carregar as empresas." : null,
  };
}

export async function createCompany(
  payload: CompanyPayload
): Promise<ServiceResult<Empresa>> {
  const { data, error } = await supabase
    .from("empresas")
    .insert(payload)
    .select()
    .single<Empresa>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível criar a empresa." : null,
  };
}

export async function updateCompany(
  id: string,
  payload: CompanyPayload
): Promise<ServiceResult<Empresa>> {
  const { data, error } = await supabase
    .from("empresas")
    .update(payload)
    .eq("id", id)
    .select()
    .single<Empresa>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível atualizar a empresa." : null,
  };
}