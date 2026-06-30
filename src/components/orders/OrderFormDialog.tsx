import { HeartHandshake, Package2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { pedidoStatusOptions } from "../../lib/constants";
import type { Pedido, ServiceResult } from "../../types/app";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import OrderDraftItemFields from "./OrderDraftItemFields";
import OrderDraftSummary from "./OrderDraftSummary";

type DraftItem = {
  encomenda: string;
  valor: string;
  loja: string;
  item_status: string;
};

type OrderFormDialogProps = {
  open: boolean;
  pedido: Pedido | null;
  empresaId: string;
  lojas: string[];
  onClose: () => void;
  onSubmit: (values: {
    cliente: string;
    status: string;
    data: string;
    taxa: number;
    empresa_id: string;
    items: Array<{
      encomenda: string;
      valor: number;
      loja: string;
      item_status: string;
    }>;
  }) => Promise<ServiceResult<Pedido>>;
};

function createEmptyDraftItem(lojas: string[]): DraftItem {
  return {
    encomenda: "",
    valor: "",
    loja: lojas[0] ?? "",
    item_status: "Aguardando pagamento",
  };
}

function OrderFormDialog({
  open,
  pedido,
  empresaId,
  lojas,
  onClose,
  onSubmit,
}: OrderFormDialogProps) {
  const [cliente, setCliente] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [taxa, setTaxa] = useState("");
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCliente(pedido?.cliente ?? "");
    setStatus(pedido?.status ?? "Pendente");
    setData(pedido?.data ?? new Date().toISOString().slice(0, 10));
    setTaxa(pedido ? String(pedido.taxa ?? 0) : "");
    setDraftItems([createEmptyDraftItem(lojas)]);
  }, [pedido, open, lojas]);

  const subtotal = useMemo(
    () => draftItems.reduce((total, item) => total + Number(item.valor || 0), 0),
    [draftItems]
  );

  const total = subtotal + Number(taxa || 0);

  return (
    <Dialog open={open} onClose={onClose} title="" description="">
      <form
        className="space-y-5 rounded-[2rem] border border-slate-700 bg-slate-900 p-5 text-white sm:p-6"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!pedido) {
            const hasInvalidItem = draftItems.some(
              (item) => !item.encomenda.trim() || !item.loja.trim() || Number(item.valor || 0) <= 0
            );

            if (hasInvalidItem) {
              toast.error("Preencha corretamente os produtos do pedido.");
              return;
            }
          }

          setSaving(true);

          const result = await onSubmit({
            cliente,
            status,
            data,
            taxa: Number(taxa || 0),
            empresa_id: empresaId,
            items: pedido
              ? []
              : draftItems.map((item) => ({
                  encomenda: item.encomenda.trim(),
                  valor: Number(item.valor || 0),
                  loja: item.loja,
                  item_status: item.item_status,
                })),
          });

          setSaving(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(pedido ? "Pedido atualizado." : "Pedido criado.");
          onClose();
        }}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-800 p-3 text-amber-300">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{pedido ? "Editar pedido" : "Novo pedido"}</h2>
            <p className="text-sm text-slate-400">
              {pedido ? "Atualize os dados principais do pedido." : "Cadastre o pedido e seus produtos de uma vez."}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Nome do cliente
          </label>
          <input
            value={cliente}
            onChange={(event) => setCliente(event.target.value)}
            placeholder="Ex: Maria Silva"
            required
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(event) => setData(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400"
            >
              {pedidoStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
            <HeartHandshake className="h-4 w-4" />
            <span>Taxa de serviço (R$)</span>
          </div>

          <input
            type="number"
            step="0.01"
            value={taxa}
            onChange={(event) => setTaxa(event.target.value)}
            placeholder="Ex: 80.00"
            className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
          />

          <p className="mt-2 text-sm text-slate-400">
            Valor combinado com o cliente pelo serviço de busca.
          </p>
        </div>

        {!pedido ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Produtos ({draftItems.length})
              </p>

              <button
                type="button"
                onClick={() => setDraftItems((current) => [...current, createEmptyDraftItem(lojas)])}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20"
              >
                <Plus className="h-4 w-4" />+ Produto
              </button>
            </div>

            <div className="space-y-4">
              {draftItems.map((item, index) => (
                <OrderDraftItemFields
                  key={`${index}-${open}`}
                  index={index}
                  item={item}
                  stores={lojas}
                  canRemove={draftItems.length > 1}
                  onChange={(itemIndex, nextItem) =>
                    setDraftItems((current) =>
                      current.map((entry, currentIndex) =>
                        currentIndex === itemIndex ? nextItem : entry
                      )
                    )
                  }
                  onRemove={(itemIndex) =>
                    setDraftItems((current) => current.filter((_, currentIndex) => currentIndex !== itemIndex))
                  }
                />
              ))}
            </div>

            <OrderDraftSummary subtotal={subtotal} taxa={Number(taxa || 0)} total={total} />
          </>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onClose} className="w-full">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Salvando..." : pedido ? "Salvar alterações" : "Criar pedido"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default OrderFormDialog;