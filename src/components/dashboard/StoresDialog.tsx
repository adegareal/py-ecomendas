import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppSession } from "../../hooks/useAppSession";
import { createStore, deleteStore, listStores, updateStore } from "../../lib/stores";
import type { Loja } from "../../types/app";
import StoreFormDialog from "../stores/StoreFormDialog";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";

type StoresDialogProps = {
  open: boolean;
  onClose: () => void;
};

function StoresDialog({ open, onClose }: StoresDialogProps) {
  const { session } = useAppSession();
  const [stores, setStores] = useState<Loja[]>([]);
  const [search, setSearch] = useState("");
  const [editingStore, setEditingStore] = useState<Loja | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    if (!session) {
      return;
    }

    setLoading(true);
    const result = await listStores(session.empresa.id);

    if (result.error) {
      toast.error(result.error);
    }

    setStores(result.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (open) {
      void loadData();
    }
  }, [open, session]);

  const filteredStores = useMemo(() => {
    const term = search.trim().toLowerCase();
    return stores.filter((store) => store.nome.toLowerCase().includes(term));
  }, [stores, search]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title="Lojas"
        description="Gerencie as lojas sem sair do painel principal."
      >
        <div className="w-full max-w-4xl">
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-full rounded-2xl border border-white/10 bg-[#1c2a3b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                placeholder="Buscar loja"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setEditingStore(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova loja
            </Button>
          </div>

          <div className="mt-5 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-[#1c2a3b] p-5 text-sm text-slate-300">
                Carregando lojas...
              </div>
            ) : filteredStores.length ? (
              filteredStores.map((store) => (
                <div key={store.id} className="rounded-2xl border border-white/10 bg-[#1c2a3b] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-300">Loja</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">{store.nome}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingStore(store);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={async () => {
                          if (!session || !window.confirm("Deseja excluir esta loja?")) {
                            return;
                          }

                          const result = await deleteStore(store.id, session.empresa.id);

                          if (result.error) {
                            toast.error(result.error);
                            return;
                          }

                          toast.success("Loja removida.");
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
                Nenhuma loja encontrada.
              </div>
            )}
          </div>
        </div>
      </Dialog>

      <StoreFormDialog
        open={formOpen}
        loja={editingStore}
        onClose={() => setFormOpen(false)}
        onSubmit={async (nome) => {
          const result = editingStore
            ? await updateStore(editingStore.id, session?.empresa.id ?? "", nome)
            : await createStore(nome, session?.empresa.id ?? "");

          if (!result.error) {
            await loadData();
          }

          return result;
        }}
      />
    </>
  );
}

export default StoresDialog;