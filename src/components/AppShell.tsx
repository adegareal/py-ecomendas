import type { ReactNode } from "react";
import AppHeader from "./AppHeader";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  headerActions?: ReactNode;
  hidePageIntro?: boolean;
};

function AppShell({
  title,
  description,
  children,
  headerActions,
  hidePageIntro = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#142436] text-white">
      <AppHeader actions={headerActions} />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        {hidePageIntro ? null : (
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

export default AppShell;