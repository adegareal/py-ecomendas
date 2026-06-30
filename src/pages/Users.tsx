import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import OrderStatusBadge from "../components/OrderStatusBadge";
import UserFormDialog from "../components/users/UserFormDialog";
import Button from "../components/ui/Button";
import { useAppSession } from "../hooks/useAppSession";
import { createUser, deleteUser, listUsers, updateUser } from "../lib/users";
import type { AppUser } from "../types/app";

function Users() {
  const { session } = useAppSession();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadData() {
    if (!session) {
      return;
    }

    const result = await listUsers(session.empresa.id);

    if (result.error) {
      toast.error(result.error);
    }

    setUsers(result.data ?? []);
  }

  useEffect(() => {
    void loadData();
  }, [session]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      return (
        user.nome.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.nivel.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  return (
    <AppShell
      title="Usuários"
      description="Gerencie os acessos internos da empresa e seus níveis."
    >
      <section className="rounded-3xl border border-white/10 bg-[#223245] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Equipe cadastrada</h2>
            <p className="mt-1 text-sm text-slate-300">
              Cada usuário pertence à empresa logada.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#1c2a3b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                placeholder="Buscar usuário"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setEditingUser(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo usuário
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {filteredUsers.length ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="rounded-3xl border border-white/10 bg-[#1c2a3b] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.nome}</h3>
                    <p className="mt-1 text-sm text-blue-200">@{user.username}</p>
                  </div>

                  <OrderStatusBadge status={user.nivel} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingUser(user);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    disabled={user.id === session?.usuario.id}
                    onClick={async () => {
                      if (!session || !window.confirm("Deseja excluir este usuário?")) {
                        return;
                      }

                      const result = await deleteUser(user.id, session.empresa.id);

                      if (result.error) {
                        toast.error(result.error);
                        return;
                      }

                      toast.success("Usuário removido.");
                      await loadData();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#1c2a3b] p-6 text-sm text-slate-300">
              Nenhum usuário encontrado.
            </div>
          )}
        </div>
      </section>

      <UserFormDialog
        open={dialogOpen}
        usuario={editingUser}
        empresaId={session?.empresa.id ?? ""}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (values) => {
          const result = editingUser
            ? await updateUser(editingUser.id, session?.empresa.id ?? "", values)
            : await createUser(values);

          if (!result.error) {
            await loadData();
          }

          return result;
        }}
      />
    </AppShell>
  );
}

export default Users;