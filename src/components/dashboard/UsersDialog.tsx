import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppSession } from "../../hooks/useAppSession";
import { createUser, deleteUser, listUsers, updateUser } from "../../lib/users";
import type { AppUser } from "../../types/app";
import OrderStatusBadge from "../OrderStatusBadge";
import UserFormDialog from "../users/UserFormDialog";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";

type UsersDialogProps = {
  open: boolean;
  onClose: () => void;
};

function UsersDialog({ open, onClose }: UsersDialogProps) {
  const { session } = useAppSession();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    if (!session) {
      return;
    }

    setLoading(true);
    const result = await listUsers(session.empresa.id);

    if (result.error) {
      toast.error(result.error);
    }

    setUsers(result.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      void loadData();
    }
  }, [open, session]);

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
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="Usuários"
        description="Gerencie os usuários sem sair do painel principal."
      >
        <div className="w-full max-w-4xl">
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#1c2a3b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                placeholder="Buscar usuário"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setEditingUser(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo usuário
            </Button>
          </div>

          <div className="mt-5 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-[#1c2a3b] p-5 text-sm text-slate-300">
                Carregando usuários...
              </div>
            ) : filteredUsers.length ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="rounded-2xl border border-white/10 bg-[#1c2a3b] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.nome}</h3>
                      <p className="mt-1 text-sm text-blue-200">@{user.username}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <OrderStatusBadge status={user.nivel} />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingUser(user);
                          setFormOpen(true);
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
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-[#1c2a3b] p-6 text-sm text-slate-300">
                Nenhum usuário encontrado.
              </div>
            )}
          </div>
        </div>
      </Dialog>

      <UserFormDialog
        open={formOpen}
        usuario={editingUser}
        empresaId={session?.empresa.id ?? ""}
        onClose={() => setFormOpen(false)}
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
    </>
  );
}

export default UsersDialog;