import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  const hasHeader = Boolean(title || description);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 h-full w-full bg-slate-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 overflow-y-auto px-3 py-4 sm:px-6 sm:py-8">
        <div className="flex min-h-full items-start justify-center sm:items-center">
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#142436] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar popup"
              className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {hasHeader ? (
              <div className="border-b border-white/10 bg-[#142436] px-5 py-5 pr-16 sm:px-6">
                {title ? <h2 className="text-xl font-bold text-white">{title}</h2> : null}
                {description ? (
                  <p className="mt-1 text-sm text-slate-300">{description}</p>
                ) : null}
              </div>
            ) : null}

            <div
              className={cn(
                "overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6",
                footer ? "max-h-[calc(100dvh-12rem)]" : "max-h-[calc(100dvh-8rem)]",
                hasHeader ? "pt-4 sm:pt-6" : "pt-16"
              )}
            >
              {children}
            </div>

            {footer ? (
              <div className="border-t border-white/10 bg-[#142436] px-4 py-4 sm:px-6">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Dialog;