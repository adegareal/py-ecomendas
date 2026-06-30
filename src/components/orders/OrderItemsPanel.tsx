import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { formatCurrency } from "../../lib/formatters";
import type { ItemPedido, Pedido, ServiceResult } from "../../types/app";
import Button from "../ui/Button";
import OrderStatusBadge from "../OrderStatusBadge";
import ItemFormDialog from "./ItemFormDialog";

type OrderItemsPanelProps = {
  pedido: Pedido | null;
  items: ItemPedido[];
  empresaId: string;
  lojas: string[];
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

function OrderItemsPanel({
  pedido,
  items,
  empresaId,
  lojas,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
}: OrderItemsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemPedido | null>(null);

  const orderItems = useMemo(
    () => items.filter((item) => item.pedido_id === pedido?.id),
    [items, pedido]
  );

  const subtotal = orderItems.reduce((total, item) => total + Number(item.valor || 0), 0);
  const total = subtotal + Number(pedido?.taxa || 0);

  if (!pedido) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Itens do pedido</h2>
        <p className="mt-2 text-sm text-slate-600">
          Selecione um pedido acima para visualizar ou cadastrar os itens dele.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Pedido selecionado</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{pedido.cliente}</h2>
          <p className="mt-1 text-sm text-slate-600">Gerencie os itens e acompanhe o valor total.</p>
        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo item
        </Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Subtotal dos itens</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(subtotal)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Taxa do pedido</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(Number(pedido.taxa || 0))}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Total geral</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(total)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {orderItems.length ? (
          orderItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{item.encomenda}</h3>
                  <p className="mt-1 text-sm text-slate-600">Loja: {item.loja || "Não informada"}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(Number(item.valor || 0))}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={item.item_status} />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingItem(item);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={async () => {
                      if (!window.confirm("Deseja excluir este item?")) {
                        return;
                      }

                      const result = await onDeleteItem(item.id);

                      if (result.error) {
                        toast.error(result.error);
                        return;
                      }

                      toast.success("Item removido.");
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            Este pedido ainda não possui itens cadastrados.
          </div>
        )}
      </div>

      <ItemFormDialog
        open={dialogOpen}
        item={editingItem}
        pedidoId={pedido.id}
        empresaId={empresaId}
        lojas={lojas}
        onClose={() => setDialogOpen(false)}
        onSubmit={(values) =>
          editingItem ? onUpdateItem(editingItem.id, values) : onCreateItem(values)
        }
      />
    </section>
  );
}

export default OrderItemsPanel;