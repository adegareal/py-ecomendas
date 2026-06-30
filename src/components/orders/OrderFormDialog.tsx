import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { pedidoStatusOptions } from "../../lib/constants";
import type { Pedido, ServiceResult } from "../../types/app";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

type OrderFormDialogProps = {
  open: boolean;
  pedido: Pedido | null;
  empresaId: string;
  onClose: () => void;
  onSubmit: (values: {
    cliente: string;
    status: string;
    data: string;
    taxa: number;
    empresa_id: string;
  }) => Promise<ServiceResult<Pedido>>;
};

function OrderFormDialog({ open, pedido, empresaId, onClose, onSubmit }: OrderFormDialogProps) {
  const [cliente, setCliente] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [taxa, setTaxa] = useState("0");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCliente(pedido?.cliente ?? "");
    setStatus(pedido?.status ?? "Pendente");
    setData(pedido?.data ?? new Date().toISOString().slice(0, 10));
    setTaxa(String(pedido?.taxa ?? 0));
  }, [pedido, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={pedido ? "Editar pedido" : "Novo pedido"}
      description="Preencha os dados principais do pedido."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="order-form"
            disabled={saving}
          >
            {saving ? "Salvando..." : pedido ? "Salvar alterações" : "Criar pedido"}
          </Button>
        </div>
      }
    >
      <form
        id="order-form"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);

          const result = await onSubmit({
            cliente,
            status,
            data,
            taxa: Number(taxa || 0),
            empresa_id: empresaId,
          });

          setSaving(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(pedido ? "Pedido atualizado." : "Pedido criado.");
          onClose();
        }}
      >
        <div className="sm:col-span-2">
          <Input label="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        </div>

        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {pedidoStatusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <Input label="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} required />
        <Input label="Taxa" type="number" step="0.01" value={taxa} onChange={(e) => setTaxa(e.target.value)} />
      </form>
    </Dialog>
  );
}

export default OrderFormDialog;