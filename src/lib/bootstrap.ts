import { supabase } from "../integrations/supabase/client";
import type { ServiceResult } from "../types/app";

type InitialAccessData = {
  empresaSlug: string;
  username: string;
  senha: string;
};

export async function createInitialSuperAdmin(): Promise<ServiceResult<InitialAccessData>> {
  const { data, error } = await supabase.functions.invoke("bootstrap-super-admin");

  if (error) {
    return { data: null, error: "Não foi possível preparar o super admin inicial." };
  }

  return {
    data: {
      empresaSlug: data?.empresaSlug ?? "",
      username: data?.username ?? "",
      senha: data?.senha ?? "",
    },
    error: null,
  };
}