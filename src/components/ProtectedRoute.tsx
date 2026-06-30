import { Navigate, Outlet } from "react-router-dom";
import { useAppSession } from "../hooks/useAppSession";

function ProtectedRoute() {
  const { session, isReady } = useAppSession();

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#142436] p-6">
        <div className="rounded-2xl border border-white/10 bg-[#223245] px-6 py-4 text-sm font-medium text-slate-200 shadow-sm">
          Carregando sistema...
        </div>
      </main>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;