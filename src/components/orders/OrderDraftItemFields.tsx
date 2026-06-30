import { Trash2 } from "lucide-react";
import { itemStatusOptions } from "../../lib/constants";

type DraftItem = {
  encomenda: string;
  valor: string;
  loja: string;
  item_status: string;
};

type OrderDraftItemFieldsProps = {
  index: number;
  item: DraftItem;
  stores: string[];
  canRemove: boolean;
  onChange: (index: number, nextItem: DraftItem) => void;
  onRemove: (index: number) => void;
};

function OrderDraftItemFields({
  index,
  item,
  stores,
  canRemove,
  onChange,
  onRemove,
}: OrderDraftItemFieldsProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
          Produto {index + 1}
        </p>

        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Remover
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Nome do produto
          </label>
          <input
            value={item.encomenda}
            onChange={(event) =>
              onChange(index, {
                ...item,
                encomenda: event.target.value,
              })
            }
            placeholder="Nome do produto"
            required
            className="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={item.valor}
              onChange={(event) =>
                onChange(index, {
                  ...item,
                  valor: event.target.value,
                })
              }
              placeholder="Valor (R$)"
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Loja
            </label>
            <select
              value={item.loja}
              onChange={(event) =>
                onChange(index, {
                  ...item,
                  loja: event.target.value,
                })
              }
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400"
            >
              <option value="">Selecione a loja</option>
              {stores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Status do produto
          </label>
          <select
            value={item.item_status}
            onChange={(event) =>
              onChange(index, {
                ...item,
                item_status: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-amber-300 outline-none transition focus:border-blue-400"
          >
            {itemStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default OrderDraftItemFields;