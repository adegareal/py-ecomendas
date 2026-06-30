import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;