import type { LucideIcon } from "lucide-react";

type OrdersSummaryCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  dotClassName: string;
};

function OrdersSummaryCard({
  title,
  value,
  icon: Icon,
  dotClassName,
}: OrdersSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#223245] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl text-slate-200">
          <Icon className="h-5 w-5" />
        </div>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClassName}`} />
      </div>

      <p className="mt-5 text-4xl font-extrabold leading-none text-white">{value}</p>
      <p className="mt-2 text-sm text-blue-200">{title}</p>
    </div>
  );
}

export default OrdersSummaryCard;