import { supabase } from "../integrations/supabase/client";
import type { AppUser, ServiceResult } from "../types/app";

type UserPayload = {
  nome: string;
  username: string;
  senha?: string;
  nivel: string;
  empresa_id: string;
};

export async function listUsers(empresaId: string): Promise<ServiceResult<AppUser[]>> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, username, nome, role, created_at, empresa_id, nivel")
    .eq("empresa_id", empresaId)
    .order("nome", { ascending: true });

  return {
    data: data ?? [],
    error: error ? "Não foi possível carregar os usuários." : null,
  };
}

export async function createUser(payload: UserPayload): Promise<ServiceResult<AppUser>> {
  const insertPayload = {
    nome: payload.nome,
    username: payload.username,
    senha: payload.senha,
    nivel: payload.nivel,
    empresa_id: payload.empresa_id,
  };

  const { data, error } = await supabase
    .from("usuarios")
    .insert(insertPayload)
    .select("id, username, nome, role, created_at, empresa_id, nivel")
    .single<AppUser>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível criar o usuário." : null,
  };
}

export async function updateUser(
  id: string,
  currentEmpresaId: string,
  payload: UserPayload
): Promise<ServiceResult<AppUser>> {
  const updatePayload = {
    nome: payload.nome,
    username: payload.username,
    nivel: payload.nivel,
    empresa_id: payload.empresa_id,
    ...(payload.senha ? { senha: payload.senha } : {}),
  };

  const { data, error } = await supabase
    .from("usuarios")
    .update(updatePayload)
    .eq("id", id)
    .eq("empresa_id", currentEmpresaId)
    .select("id, username, nome, role, created_at, empresa_id, nivel")
    .single<AppUser>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível atualizar o usuário." : null,
  };
}

export async function deleteUser(
  id: string,
  empresaId: string
): Promise<ServiceResult<boolean>> {
  const { error } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", id)
    .eq("empresa_id", empresaId);

  return {
    data: !error,
    error: error ? "Não foi possível remover o usuário." : null,
  };
}