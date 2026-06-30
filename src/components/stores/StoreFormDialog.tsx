import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Loja, ServiceResult } from "../../types/app";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";

type StoreFormDialogProps = {
  open: boolean;
  loja: Loja | null;
  onClose: () => void;
  onSubmit: (nome: string) => Promise<ServiceResult<Loja>>;
};

function StoreFormDialog({ open, loja, onClose, onSubmit }: StoreFormDialogProps) {
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(loja?.nome ?? "");
  }, [loja, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={loja ? "Editar loja" : "Nova loja"}
      description="Cadastre as lojas disponíveis para os pedidos."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="store-form" disabled={saving}>
            {saving ? "Salvando..." : loja ? "Salvar alterações" : "Criar loja"}
          </Button>
        </div>
      }
    >
      <form
        id="store-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);

          const result = await onSubmit(nome);

          setSaving(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(loja ? "Loja atualizada." : "Loja criada.");
          onClose();
        }}
      >
        <Input label="Nome da loja" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </form>
    </Dialog>
  );
}

export default StoreFormDialog;