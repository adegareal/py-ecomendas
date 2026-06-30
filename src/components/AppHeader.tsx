import { LogOut, Package, Store, Users } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppSession } from "../hooks/useAppSession";

type AppHeaderProps = {
  actions?: ReactNode;
};

const roleLabels: Record<string, string> = {
  super_admin: "Admin",
  admin_empresa: "Admin",
  viewer: "Visualizador",
};

function AppHeader({ actions }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAppSession();

  const navItems = [
    { to: "/usuarios", label: "Usuários", icon: Users },
    { to: "/lojas", label: "Lojas", icon: Store },
  ].filter((item) => item.to !== location.pathname);

  const userName = session?.usuario.nome ?? "Usuário";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = roleLabels[session?.usuario.nivel ?? "viewer"] ?? "Usuário";

  return (
    <header className="border-b border-blue-900/40 bg-[#1653b8] text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => navigate("/painel")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#0f3f92] shadow-sm">
            <Package className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold leading-none">PY Encomendas</h1>
            <p className="mt-1 text-sm text-blue-100">
              Gestão de mercadorias importadas do Paraguai
            </p>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}

          {actions}

          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd400] text-sm font-extrabold text-slate-900">
              {userInitial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-blue-100">{userRole}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              signOut();
              toast.success("Sessão encerrada.");
              navigate("/login");
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;