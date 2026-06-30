import { Navigate } from "react-router-dom";
import { useAppSession } from "../hooks/useAppSession";

function Index() {
  const { session, isReady } = useAppSession();

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
          Carregando sistema...
        </div>
      </main>
    );
  }

  return <Navigate to={session ? "/painel" : "/login"} replace />;
}

export default Index;