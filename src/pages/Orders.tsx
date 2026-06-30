import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderFormDialog from "../components/orders/OrderFormDialog";
import OrderItemsPanel from "../components/orders/OrderItemsPanel";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAppSession } from "../hooks/useAppSession";
import { formatCurrency, formatDate } from "../lib/formatters";
import {
  createOrder,
  createOrderItem,
  deleteOrder,
  deleteOrderItem,
  listOrderItems,
  listOrders,
  updateOrder,
  updateOrderItem,
} from "../lib/orders";
import { listStores } from "../lib/stores";
import type { ItemPedido, Loja, Pedido } from "../types/app";

function Orders() {
  const { session } = useAppSession();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [stores, setStores] = useState<Loja[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Pedido | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    if (!session) {
      return;
    }

    setLoading(true);

    const [ordersResult, itemsResult, storesResult] = await Promise.all([
      listOrders(session.empresa.id),
      listOrderItems(session.empresa.id),
      listStores(session.empresa.id),
    ]);

    if (ordersResult.error) toast.error(ordersResult.error);
    if (itemsResult.error) toast.error(itemsResult.error);
    if (storesResult.error) toast.error(storesResult.error);

    setOrders(ordersResult.data ?? []);
    setItems(itemsResult.data ?? []);
    setStores(storesResult.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, [session]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      if (!term) {
        return true;
      }

      return (
        order.cliente.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    });
  }, [orders, search]);

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? filteredOrders[0] ?? null;

  return (
    <AppShell
      title="Pedidos"
      description="Cadastre, acompanhe e organize os pedidos da empresa."
    >
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Lista de pedidos</h2>
            <p className="mt-1 text-sm text-slate-600">Selecione um pedido para gerenciar seus itens.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Buscar por cliente ou status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setEditingOrder(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo pedido
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-600">Carregando pedidos...</p>
          ) : filteredOrders.length ? (
            filteredOrders.map((order) => {
              const totalItems = items
                .filter((item) => item.pedido_id === order.id)
                .reduce((sum, item) => sum + Number(item.valor || 0), 0);

              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selectedOrder?.id === order.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{order.cliente}</h3>
                      <p className="mt-1 text-sm text-slate-600">Data: {formatDate(order.data)}</p>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Itens</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {items.filter((item) => item.pedido_id === order.id).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Subtotal</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{formatCurrency(totalItems)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Taxa</p>
                      <p className="mt-1 text-base font-semibold text-slate-900">{formatCurrency(Number(order.taxa || 0))}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingOrder(order);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={async (event) => {
                        event.stopPropagation();

                        if (!session || !window.confirm("Deseja excluir este pedido?")) {
                          return;
                        }

                        const result = await deleteOrder(order.id, session.empresa.id);

                        if (result.error) {
                          toast.error(result.error);
                          return;
                        }

                        toast.success("Pedido removido.");
                        if (selectedOrderId === order.id) {
                          setSelectedOrderId(null);
                        }
                        await loadData();
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
              Nenhum pedido encontrado.
            </div>
          )}
        </div>
      </section>

      <div className="mt-6">
        <OrderItemsPanel
          pedido={selectedOrder}
          items={items}
          empresaId={session?.empresa.id ?? ""}
          lojas={stores.map((store) => store.nome)}
          onCreateItem={async (values) => {
            const result = await createOrderItem(values);
            if (!result.error) {
              await loadData();
            }
            return result;
          }}
          onUpdateItem={async (id, values) => {
            const result = await updateOrderItem(id, session?.empresa.id ?? "", values);
            if (!result.error) {
              await loadData();
            }
            return result;
          }}
          onDeleteItem={async (id) => {
            const result = await deleteOrderItem(id, session?.empresa.id ?? "");
            if (!result.error) {
              await loadData();
            }
            return result;
          }}
        />
      </div>

      <OrderFormDialog
        open={dialogOpen}
        pedido={editingOrder}
        empresaId={session?.empresa.id ?? ""}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (values) => {
          const result = editingOrder
            ? await updateOrder(editingOrder.id, session?.empresa.id ?? "", {
                cliente: values.cliente,
                status: values.status,
                data: values.data,
                taxa: values.taxa,
              })
            : await createOrder(values);

          if (!result.error) {
            await loadData();
          }

          return result;
        }}
      />
    </AppShell>
  );
}

export default Orders;