import { useState, type ReactNode } from "react";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function AppShell({ title, description, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 shrink-0 lg:block">
          <SidebarNav />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar title={title} description={description} onOpenMenu={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden">
          <div className="h-full w-72">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AppShell;