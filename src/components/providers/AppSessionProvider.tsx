import { createContext, useEffect, useState } from "react";
import { clearStoredSession, getStoredSession } from "../../lib/session-storage";
import { signInWithTenant } from "../../lib/auth";
import { normalizeSession } from "../../lib/access";
import type { AppSession, ServiceResult } from "../../types/app";

type AppSessionContextValue = {
  session: AppSession | null;
  isReady: boolean;
  signIn: (
    empresaSlug: string,
    username: string,
    senha: string
  ) => Promise<ServiceResult<AppSession>>;
  signOut: () => void;
};

export const AppSessionContext = createContext<AppSessionContextValue | null>(null);

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(normalizeSession(getStoredSession()));
    setIsReady(true);
  }, []);

  const signIn = async (empresaSlug: string, username: string, senha: string) => {
    const result = await signInWithTenant(empresaSlug, username, senha);

    if (result.data) {
      setSession(normalizeSession(result.data));
    }

    return result;
  };

  const signOut = () => {
    clearStoredSession();
    setSession(null);
  };

  return (
    <AppSessionContext.Provider value={{ session, isReady, signIn, signOut }}>
      {children}
    </AppSessionContext.Provider>
  );
}