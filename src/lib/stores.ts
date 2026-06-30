import { supabase } from "../integrations/supabase/client";
import type { Loja, ServiceResult } from "../types/app";

export async function listStores(empresaId: string): Promise<ServiceResult<Loja[]>> {
  const { data, error } = await supabase
    .from("lojas")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("nome", { ascending: true });

  return {
    data: data ?? [],
    error: error ? "Não foi possível carregar as lojas." : null,
  };
}

export async function createStore(
  nome: string,
  empresaId: string
): Promise<ServiceResult<Loja>> {
  const { data, error } = await supabase
    .from("lojas")
    .insert({ nome, empresa_id: empresaId })
    .select()
    .single<Loja>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível criar a loja." : null,
  };
}

export async function updateStore(
  id: string,
  empresaId: string,
  nome: string
): Promise<ServiceResult<Loja>> {
  const { data, error } = await supabase
    .from("lojas")
    .update({ nome })
    .eq("id", id)
    .eq("empresa_id", empresaId)
    .select()
    .single<Loja>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível atualizar a loja." : null,
  };
}

export async function deleteStore(
  id: string,
  empresaId: string
): Promise<ServiceResult<boolean>> {
  const { error } = await supabase
    .from("lojas")
    .delete()
    .eq("id", id)
    .eq("empresa_id", empresaId);

  return {
    data: !error,
    error: error ? "Não foi possível remover a loja." : null,
  };
}