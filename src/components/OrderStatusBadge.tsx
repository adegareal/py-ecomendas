import { cn } from "../lib/cn";

type OrderStatusBadgeProps = {
  status: string;
};

const styles: Record<string, string> = {
  Pendente: "bg-amber-100 text-amber-700",
  "Em andamento": "bg-sky-100 text-sky-700",
  "Aguardando pagamento": "bg-orange-100 text-orange-700",
  Pago: "bg-emerald-100 text-emerald-700",
  Enviado: "bg-violet-100 text-violet-700",
  Recebido: "bg-cyan-100 text-cyan-700",
  Entregue: "bg-slate-200 text-slate-700",
  Comprado: "bg-indigo-100 text-indigo-700",
  "Em trânsito": "bg-fuchsia-100 text-fuchsia-700",
};

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        styles[status] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}

export default OrderStatusBadge;