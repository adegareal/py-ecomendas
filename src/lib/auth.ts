import { supabase } from "../integrations/supabase/client";
import { setStoredSession } from "./session-storage";
import { normalizeSessionUser } from "./access";
import type { AppSession, AppUser, Empresa, ServiceResult } from "../types/app";

export async function signInWithTenant(
  empresaSlug: string,
  username: string,
  senha: string
): Promise<ServiceResult<AppSession>> {
  const normalizedSlug = empresaSlug.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const { data: empresa, error: empresaError } = await supabase
    .from("empresas")
    .select("id, nome, slug, created_at")
    .eq("slug", normalizedSlug)
    .maybeSingle<Empresa>();

  if (empresaError) {
    return { data: null, error: "Não foi possível carregar a empresa." };
  }

  if (!empresa) {
    return { data: null, error: "Empresa não encontrada." };
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id, username, nome, role, created_at, empresa_id, nivel")
    .eq("empresa_id", empresa.id)
    .eq("username", normalizedUsername)
    .eq("senha", senha)
    .maybeSingle<AppUser>();

  if (usuarioError) {
    return { data: null, error: "Não foi possível validar o acesso." };
  }

  if (!usuario) {
    return { data: null, error: "Usuário ou senha inválidos." };
  }

  const session = {
    empresa,
    usuario: normalizeSessionUser(usuario, empresa.slug),
  };

  setStoredSession(session);

  return { data: session, error: null };
}