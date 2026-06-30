import { Building2, KeyRound, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAppSession } from "../hooks/useAppSession";

function Login() {
  const navigate = useNavigate();
  const { session, signIn } = useAppSession();
  const [empresaSlug, setEmpresaSlug] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Navigate to="/painel" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">Projeto multi-tenant</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">PY Encomendas</h1>
          <p className="mt-4 max-w-xl text-base text-slate-300">
            Acesse sua operação por empresa e gerencie pedidos, itens, lojas e usuários em um só lugar.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-4">
              <Building2 className="h-5 w-5 text-blue-300" />
              <p className="mt-3 text-sm font-semibold">Por empresa</p>
              <p className="mt-1 text-sm text-slate-300">Cada acesso é vinculado ao slug da empresa.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <UserRound className="h-5 w-5 text-blue-300" />
              <p className="mt-3 text-sm font-semibold">Por usuário</p>
              <p className="mt-1 text-sm text-slate-300">Perfis separados para cada equipe.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <KeyRound className="h-5 w-5 text-blue-300" />
              <p className="mt-3 text-sm font-semibold">Acesso rápido</p>
              <p className="mt-1 text-sm text-slate-300">Login direto para o painel principal.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <p className="text-sm font-semibold text-blue-600">Entrar</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Acesse sua empresa</h2>
          <p className="mt-2 text-sm text-slate-600">
            Informe o slug da empresa, usuário e senha para abrir o painel.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);

              const result = await signIn(empresaSlug, username, senha);

              setLoading(false);

              if (result.error) {
                toast.error(result.error);
                return;
              }

              toast.success("Login realizado com sucesso.");
              navigate("/painel");
            }}
          >
            <Input
              label="Slug da empresa"
              placeholder="minha-empresa"
              value={empresaSlug}
              onChange={(e) => setEmpresaSlug(e.target.value)}
              required
            />
            <Input
              label="Usuário"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar no sistema"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;