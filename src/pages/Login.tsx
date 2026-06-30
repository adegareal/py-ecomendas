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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-semibold text-blue-600">Entrar</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">PY Encomendas</h1>
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
    </main>
  );
}

export default Login;