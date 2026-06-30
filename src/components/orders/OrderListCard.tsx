import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import OrderStatusBadge from "../OrderStatusBadge";
import { formatCurrency, formatDate } from "../../lib/formatters";
import type { Pedido } from "../../types/app";

type OrderListCardProps = {
  pedido: Pedido;
  itemCount: number;
  totalValue: number;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function OrderListCard({
  pedido,
  itemCount,
  totalValue,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: OrderListCardProps) {
  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm transition sm:p-5 ${
        selected
          ? "border-blue-400 bg-[#26384d]"
          : "border-white/10 bg-[#223245]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1653b8] text-base font-extrabold text-white">
            {pedido.cliente.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-xl font-extrabold text-white">{pedido.cliente}</h3>
            <p className="truncate text-sm text-blue-200">
              {itemCount} produto{itemCount === 1 ? "" : "s"} · {formatDate(pedido.data)}
            </p>
          </div>
        </button>

        <div className="flex flex-col gap-3 lg:items-end">
          <p className="text-3xl font-extrabold leading-none text-emerald-400">
            {formatCurrency(totalValue)}
          </p>
          <OrderStatusBadge status={pedido.status} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-white/15"
        >
          <ChevronDown className={`h-4 w-4 transition ${selected ? "rotate-180" : ""}`} />
          Produtos
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/40 bg-[#184c9e] text-amber-300 transition hover:bg-[#215ab5]"
          aria-label="Editar pedido"
          title="Editar pedido"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-200 transition hover:bg-red-500/20"
          aria-label="Excluir pedido"
          title="Excluir pedido"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default OrderListCard;