import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import StoreFormDialog from "../components/stores/StoreFormDialog";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAppSession } from "../hooks/useAppSession";
import { createStore, deleteStore, listStores, updateStore } from "../lib/stores";
import type { Loja } from "../types/app";

function Stores() {
  const { session } = useAppSession();
  const [stores, setStores] = useState<Loja[]>([]);
  const [search, setSearch] = useState("");
  const [editingStore, setEditingStore] = useState<Loja | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadData() {
    if (!session) {
      return;
    }

    const result = await listStores(session.empresa.id);

    if (result.error) {
      toast.error(result.error);
    }

    setStores(result.data ?? []);
  }

  useEffect(() => {
    void loadData();
  }, [session]);

  const filteredStores = useMemo(() => {
    const term = search.trim().toLowerCase();

    return stores.filter((store) => store.nome.toLowerCase().includes(term));
  }, [stores, search]);

  return (
    <AppShell
      title="Lojas"
      description="Cadastre e mantenha a base de lojas utilizada nos pedidos."
    >
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Lojas cadastradas</h2>
            <p className="mt-1 text-sm text-slate-600">Use esta lista para facilitar a criação de itens.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Buscar loja"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setEditingStore(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova loja
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStores.length ? (
            filteredStores.map((store) => (
              <div key={store.id} className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-blue-600">Loja</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{store.nome}</h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingStore(store);
                      setDialogOpen(true);
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
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              Nenhuma loja encontrada.
            </div>
          )}
        </div>
      </section>

      <StoreFormDialog
        open={dialogOpen}
        loja={editingStore}
        onClose={() => setDialogOpen(false)}
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
    </AppShell>
  );
}

export default Stores;