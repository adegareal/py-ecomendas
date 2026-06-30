import type { ItemPedido, Pedido, ServiceResult } from "../../types/app";
import Dialog from "../ui/Dialog";
import OrderItemsPanel from "./OrderItemsPanel";

type OrderItemsDialogProps = {
  open: boolean;
  pedido: Pedido | null;
  items: ItemPedido[];
  empresaId: string;
  lojas: string[];
  onClose: () => void;
  onCreateItem: (values: {
    pedido_id: string;
    encomenda: string;
    valor: number;
    loja: string;
    item_status: string;
    empresa_id: string;
  }) => Promise<ServiceResult<ItemPedido>>;
  onUpdateItem: (
    id: string,
    values: {
      pedido_id: string;
      encomenda: string;
      valor: number;
      loja: string;
      item_status: string;
      empresa_id: string;
    }
  ) => Promise<ServiceResult<ItemPedido>>;
  onDeleteItem: (id: string) => Promise<ServiceResult<boolean>>;
};

function OrderItemsDialog({
  open,
  pedido,
  items,
  empresaId,
  lojas,
  onClose,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: OrderItemsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="" description="">
      <div className="w-full max-w-4xl">
        <OrderItemsPanel
          pedido={pedido}
          items={items}
          empresaId={empresaId}
          lojas={lojas}
          onCreateItem={onCreateItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
        />
      </div>
    </Dialog>
  );
}

export default OrderItemsDialog;