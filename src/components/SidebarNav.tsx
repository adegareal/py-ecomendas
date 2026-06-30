import { Home, LogOut, Package, Store, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppSession } from "../hooks/useAppSession";
import { cn } from "../lib/cn";

type SidebarNavProps = {
  onNavigate?: () => void;
};

const items = [
  { to: "/painel", label: "Painel", icon: Home },
  { to: "/pedidos", label: "Pedidos", icon: Package },
  { to: "/lojas", label: "Lojas", icon: Store },
  { to: "/usuarios", label: "Usuários", icon: Users },
];

function SidebarNav({ onNavigate }: SidebarNavProps) {
  const navigate = useNavigate();
  const { session, signOut } = useAppSession();

  return (
    <div className="flex h-full flex-col rounded-none bg-slate-950 text-white lg:rounded-r-3xl">
      <div className="border-b border-white/10 p-6">
        <p className="text-sm font-semibold text-blue-300">{session?.empresa.nome}</p>
        <h2 className="mt-1 text-2xl font-bold">PY Encomendas</h2>
        <p className="mt-3 text-sm text-slate-300">{session?.usuario.nome}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{session?.usuario.nivel}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={() => {
            signOut();
            toast.success("Sessão encerrada.");
            navigate("/login");
            onNavigate?.();
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );
}

export default SidebarNav;