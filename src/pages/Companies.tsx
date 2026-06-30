import { Building2, Pencil, Plus, Users2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import CompanyFormDialog from "../components/companies/CompanyFormDialog";
import OrderStatusBadge from "../components/OrderStatusBadge";
import Button from "../components/ui/Button";
import { useAppSession } from "../hooks/useAppSession";
import { isSuperAdminSession } from "../lib/access";
import { createCompany, listCompanies, updateCompany } from "../lib/companies";
import { createUser, listUsers, updateUser } from "../lib/users";
import type { AppUser, Empresa } from "../types/app";
import UserFormDialog from "../components/users/UserFormDialog";

function Companies() {
  const { session } = useAppSession();
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) ?? null,
    [companies, selectedCompanyId]
  );

  async function loadCompanies() {
    setLoadingCompanies(true);
    const result = await listCompanies();

    if (result.error) {
      toast.error(result.error);
    }

    const nextCompanies = result.data ?? [];
    setCompanies(nextCompanies);
    setSelectedCompanyId((current) => {
      if (current && nextCompanies.some((company) => company.id === current)) {
        return current;
      }

      return nextCompanies[0]?.id ?? null;
    });
    setLoadingCompanies(false);
  }

  async function loadUsersByCompany(companyId: string) {
    setLoadingUsers(true);
    const result = await listUsers(companyId);

    if (result.error) {
      toast.error(result.error);
    }

    setUsers(result.data ?? []);
    setLoadingUsers(false);
  }

  useEffect(() => {
    if (isSuperAdminSession(session)) {
      void loadCompanies();
    }
  }, [session]);

  useEffect(() => {
    if (selectedCompanyId) {
      void loadUsersByCompany(selectedCompanyId);
      return;
    }

    setUsers([]);
  }, [selectedCompanyId]);

  if (!isSuperAdminSession(session)) {
    return <Navigate to="/painel" replace />;
  }

  return (
    <AppShell
      title="Painel do super admin"
      description="Cadastre empresas e gerencie os usuários de cada tenant."
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">Empresas</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Tenants cadastrados</h2>
              <p className="mt-1 text-sm text-slate-600">
                Cada empresa usa seu próprio slug para entrar no sistema.
              </p>
            </div>

            <Button
              onClick={() => {
                setEditingCompany(null);
                setCompanyDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova empresa
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {loadingCompanies ? (
              <p className="text-sm text-slate-600">Carregando empresas...</p>
            ) : companies.length ? (
              companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selectedCompanyId === company.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Empresa</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{company.nome}</h3>
                      <p className="mt-1 text-sm text-slate-600">Slug: {company.slug}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <Button
                      variant="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingCompany(company);
                        setCompanyDialogOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                Nenhuma empresa cadastrada ainda.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">Usuários da empresa</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {selectedCompany?.nome ?? "Selecione uma empresa"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Cadastre e ajuste os acessos do tenant selecionado.
              </p>
            </div>

            <Button
              disabled={!selectedCompany}
              onClick={() => {
                setEditingUser(null);
                setUserDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo usuário
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {!selectedCompany ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                Escolha uma empresa para visualizar os usuários dela.
              </div>
            ) : loadingUsers ? (
              <p className="text-sm text-slate-600">Carregando usuários...</p>
            ) : users.length ? (
              users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-slate-400" />
                        <h3 className="text-base font-semibold text-slate-900">{user.nome}</h3>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">@{user.username}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <OrderStatusBadge status={user.nivel} />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingUser(user);
                          setUserDialogOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
                Esta empresa ainda não possui usuários cadastrados.
              </div>
            )}
          </div>
        </section>
      </div>

      <CompanyFormDialog
        open={companyDialogOpen}
        empresa={editingCompany}
        onClose={() => setCompanyDialogOpen(false)}
        onSubmit={async (values) => {
          const result = editingCompany
            ? await updateCompany(editingCompany.id, values)
            : await createCompany(values);

          if (!result.error) {
            await loadCompanies();
          }

          return result;
        }}
      />

      <UserFormDialog
        open={userDialogOpen}
        usuario={editingUser}
        empresaId={selectedCompany?.id ?? ""}
        onClose={() => setUserDialogOpen(false)}
        onSubmit={async (values) => {
          const result = editingUser
            ? await updateUser(editingUser.id, selectedCompany?.id ?? "", {
                nome: values.nome,
                username: values.username,
                senha: values.senha,
                nivel: values.nivel,
              })
            : await createUser(values);

          if (!result.error && selectedCompany?.id) {
            await loadUsersByCompany(selectedCompany.id);
          }

          return result;
        }}
      />
    </AppShell>
  );
}

export default Companies;