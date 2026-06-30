import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#223245] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-blue-200">{description}</p>
        </div>

        <div className="rounded-2xl bg-white/10 p-3 text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;