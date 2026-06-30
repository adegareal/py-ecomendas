import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Empresa, ServiceResult } from "../../types/app";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";

type CompanyFormDialogProps = {
  open: boolean;
  empresa: Empresa | null;
  onClose: () => void;
  onSubmit: (values: { nome: string; slug: string }) => Promise<ServiceResult<Empresa>>;
};

function CompanyFormDialog({ open, empresa, onClose, onSubmit }: CompanyFormDialogProps) {
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(empresa?.nome ?? "");
    setSlug(empresa?.slug ?? "");
  }, [empresa, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={empresa ? "Editar empresa" : "Nova empresa"}
      description="Cadastre a empresa e defina o slug usado no login."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="company-form" disabled={saving}>
            {saving ? "Salvando..." : empresa ? "Salvar alterações" : "Criar empresa"}
          </Button>
        </div>
      }
    >
      <form
        id="company-form"
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);

          const result = await onSubmit({
            nome,
            slug: slug.trim().toLowerCase(),
          });

          setSaving(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(empresa ? "Empresa atualizada." : "Empresa criada.");
          onClose();
        }}
      >
        <Input label="Nome da empresa" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input
          label="Slug"
          placeholder="minha-empresa"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </form>
    </Dialog>
  );
}

export default CompanyFormDialog;