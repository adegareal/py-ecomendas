import type { ReactNode } from "react";
import Button from "./Button";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

function Dialog({ open, title, description, children, footer, onClose }: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="p-6">{children}</div>

        {footer ? <div className="border-t border-slate-200 p-6">{footer}</div> : null}
      </div>
    </div>
  );
}

export default Dialog;