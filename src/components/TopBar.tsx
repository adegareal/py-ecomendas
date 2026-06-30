import { Menu } from "lucide-react";
import Button from "./ui/Button";

type TopBarProps = {
  title: string;
  description: string;
  onOpenMenu: () => void;
};

function TopBar({ title, description, onOpenMenu }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-blue-600">PY Encomendas</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>

        <Button variant="secondary" className="lg:hidden" onClick={onOpenMenu}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export default TopBar;