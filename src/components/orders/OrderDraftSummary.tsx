import { formatCurrency } from "../../lib/formatters";

type OrderDraftSummaryProps = {
  subtotal: number;
  taxa: number;
  total: number;
};

function OrderDraftSummary({ subtotal, taxa, total }: OrderDraftSummaryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/70">
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-slate-300">
        <span>Subtotal produtos</span>
        <strong className="text-base text-slate-100">{formatCurrency(subtotal)}</strong>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-700 px-4 py-3 text-sm text-violet-300">
        <span>Taxa de serviço</span>
        <strong className="text-base">{formatCurrency(taxa)}</strong>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-700 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300">
        <span className="font-semibold">Total geral</span>
        <strong className="text-2xl leading-none">{formatCurrency(total)}</strong>
      </div>
    </div>
  );
}

export default OrderDraftSummary;