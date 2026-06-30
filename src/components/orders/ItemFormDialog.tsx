import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemStatusOptions } from "../../lib/constants";
import type { ItemPedido, ServiceResult } from "../../types/app";
import Dialog from "../ui/Dialog";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

type ItemFormDialogProps = {
  open: boolean;
  item: ItemPedido | null;
  pedidoId: string;
  empresaId: string;
  lojas: string[];
  onClose: () => void;
  onSubmit: (values: {
    pedido_id: string;
    encomenda: string;
    valor: number;
    loja: string;
    item_status: string;
    empresa_id: string;
  }) => Promise<ServiceResult<ItemPedido>>;
};

function ItemFormDialog({
  open,
  item,
  pedidoId,
  empresaId,
  lojas,
  onClose,
  onSubmit,
}: ItemFormDialogProps) {
  const [encomenda, setEncomenda] = useState("");
  const [valor, setValor] = useState("0");
  const [loja, setLoja] = useState("");
  const [itemStatus, setItemStatus] = useState("Aguardando pagamento");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEncomenda(item?.encomenda ?? "");
    setValor(String(item?.valor ?? 0));
    setLoja(item?.loja ?? lojas[0] ?? "");
    setItemStatus(item?.item_status ?? "Aguardando pagamento");
  }, [item, lojas, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={item ? "Editar item" : "Novo item"}
      description="Cadastre a encomenda vinculada a este pedido."
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="item-form" disabled={saving}>
            {saving ? "Salvando..." : item ? "Salvar alterações" : "Criar item"}
          </Button>
        </div>
      }
    >
      <form
        id="item-form"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);

          const result = await onSubmit({
            pedido_id: pedidoId,
            encomenda,
            valor: Number(valor || 0),
            loja,
            item_status: itemStatus,
            empresa_id: empresaId,
          });

          setSaving(false);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(item ? "Item atualizado." : "Item criado.");
          onClose();
        }}
      >
        <div className="sm:col-span-2">
          <Input label="Encomenda" value={encomenda} onChange={(e) => setEncomenda(e.target.value)} required />
        </div>

        <Input label="Valor" type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
        <Select label="Loja" value={loja} onChange={(e) => setLoja(e.target.value)} required>
          <option value="">Selecione</option>
          {lojas.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <div className="sm:col-span-2">
          <Select label="Status do item" value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
            {itemStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </form>
    </Dialog>
  );
}

export default ItemFormDialog;