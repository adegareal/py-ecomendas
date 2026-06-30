import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userLevelOptions } from "../../lib/constants";
import type { AppUser, ServiceResult } from "../../types/app";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";
import Select from "../ui/Select";

type UserFormDialogProps = {
  open: boolean;
  usuario: AppUser | null;
  empresaId: string;
  onClose: () => void;
  onSubmit: (values: {
    nome: string;
    username: string;
    senha?: string;
    nivel: string;
    role: string;
    empresa_id: string;
  }) => Promise<ServiceResult<AppUser>>;
};

function UserFormDialog({ open, usuario, empresaId, onClose, onSubmit }: UserFormDialogProps) {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [nivel, setNivel] = useState("viewer");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNome(usuario?.nome ?? "");
    setUsername(usuario?.username ?? "");
    setSenha("");
    setNivel(usuario?.nivel ?? "viewer");
  }, [usuario, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={usuario ? "Editar usuário" : "Novo usuário"}
      description="Gerencie os acessos desta empresa."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="user-form" disabled={saving}>
            {saving ? "Salvando..." : usuario ? "Salvar alterações" : "Criar usuário"}
          </Button>
        </div>
      }
    >
      <form
        id="user-form"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);

          const result = await onSubmit({
            nome,
            username: username.trim().toLowerCase(),
            senha: senha || undefined,
            nivel,
            role: nivel,
            empresa_id: empresaId,
          });

          setSaving(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(usuario ? "Usuário atualizado." : "Usuário criado.");
          onClose();
        }}
      >
        <div className="sm:col-span-2">
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <Input label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Select label="Nível" value={nivel} onChange={(e) => setNivel(e.target.value)}>
          {userLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <div className="sm:col-span-2">
          <Input
            label={usuario ? "Nova senha (opcional)" : "Senha"}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required={!usuario}
          />
        </div>
      </form>
    </Dialog>
  );
}

export default UserFormDialog;