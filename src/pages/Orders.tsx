import {
  CheckSquare,
  Coins,
  Hourglass,
  RefreshCcw,
  Search,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import OrderFormDialog from "../components/orders/OrderFormDialog";
import OrderItemsPanel from "../components/orders/OrderItemsPanel";
import OrderListCard from "../components/orders/OrderListCard";
import OrdersSummaryCard from "../components/orders/OrdersSummaryCard";
import { useAppSession } from "../hooks/useAppSession";
import { pedidoStatusOptions } from "../lib/constants";
import { formatCurrency } from "../lib/formatters";
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
  const [statusFilter, setStatusFilter] = useState("all");
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

  const totals = useMemo(() => {
    const uniqueClients = new Set(orders.map((order) => order.cliente.trim().toLowerCase()));
    const itemsTotal = items.reduce((sum, item) => sum + Number(item.valor || 0), 0);
    const feesTotal = orders.reduce((sum, order) => sum + Number(order.taxa || 0), 0);
    const pendingCount = orders.filter((order) => order.status !== "Entregue").length;
    const deliveredCount = orders.filter((order) => order.status === "Entregue").length;

    return {
      clients: uniqueClients.size,
      total: itemsTotal + feesTotal,
      fees: feesTotal,
      pending: pendingCount,
      delivered: deliveredCount,
    };
  }, [items, orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const relatedItems = items.filter((item) => item.pedido_id === order.id);

      const matchesSearch =
        !term ||
        order.cliente.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        relatedItems.some(
          (item) =>
            item.encomenda.toLowerCase().includes(term) ||
            item.loja.toLowerCase().includes(term)
        );

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, orders, search, statusFilter]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <AppShell
      title="Pedidos"
      description="Cadastre, acompanhe e organize os pedidos da empresa."
      hidePageIntro
      headerActions={
        <button
          type="button"
          onClick={() => {
            setEditingOrder(null);
            setDialogOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-xl bg-[#ffd400] px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-[#ffdf40]"
        >
          + Novo Pedido
        </button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <OrdersSummaryCard
          title="Clientes"
          value={String(totals.clients)}
          icon={UserRound}
          dotClassName="bg-sky-400"
        />
        <OrdersSummaryCard
          title="Total Geral"
          value={formatCurrency(totals.total)}
          icon={Coins}
          dotClassName="bg-emerald-400"
        />
        <OrdersSummaryCard
          title="Em Taxas"
          value={formatCurrency(totals.fees)}
          icon={Coins}
          dotClassName="bg-violet-400"
        />
        <OrdersSummaryCard
          title="Pendentes"
          value={String(totals.pending)}
          icon={Hourglass}
          dotClassName="bg-amber-400"
        />
        <OrdersSummaryCard
          title="Entregues"
          value={String(totals.delivered)}
          icon={CheckSquare}
          dotClassName="bg-teal-400"
        />
      </section>

      <section className="mt-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_56px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar cliente, produto ou loja..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#223245] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-12 rounded-2xl border border-white/10 bg-[#223245] px-4 text-sm font-semibold text-white outline-none transition focus:border-blue-400"
          >
            <option value="all">Todos os status</option>
            {pedidoStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-[#223245] text-blue-300 transition hover:bg-[#2a3d53]"
            title="Atualizar"
            aria-label="Atualizar"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-[#223245] p-5 text-sm text-slate-300">
              Carregando pedidos...
            </div>
          ) : filteredOrders.length ? (
            filteredOrders.map((order) => {
              const relatedItems = items.filter((item) => item.pedido_id === order.id);
              const totalItemsValue = relatedItems.reduce(
                (sum, item) => sum + Number(item.valor || 0),
                0
              );

              return (
                <OrderListCard
                  key={order.id}
                  pedido={order}
                  itemCount={relatedItems.length}
                  totalValue={totalItemsValue + Number(order.taxa || 0)}
                  selected={selectedOrderId === order.id}
                  onSelect={() =>
                    setSelectedOrderId((current) => (current === order.id ? null : order.id))
                  }
                  onEdit={() => {
                    setEditingOrder(order);
                    setDialogOpen(true);
                  }}
                  onDelete={async () => {
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
                />
              );
            })
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-[#223245] p-6 text-sm text-slate-300">
              Nenhum pedido encontrado.
            </div>
          )}
        </div>

        <p className="mt-4 text-right text-sm text-blue-200">
          {filteredOrders.length} de {orders.length} pedido(s)
        </p>
      </section>

      {selectedOrder ? (
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
      ) : null}

      <OrderFormDialog
        open={dialogOpen}
        pedido={editingOrder}
        empresaId={session?.empresa.id ?? ""}
        lojas={stores.map((store) => store.nome)}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (values) => {
          const result = editingOrder
            ? await updateOrder(editingOrder.id, session?.empresa.id ?? "", {
                cliente: values.cliente,
                status: values.status,
                data: values.data,
                taxa: values.taxa,
              })
            : await createOrder({
                cliente: values.cliente,
                status: values.status,
                data: values.data,
                taxa: values.taxa,
                empresa_id: values.empresa_id,
              });

          if (result.error || !result.data) {
            return result;
          }

          if (!editingOrder) {
            for (const item of values.items) {
              const itemResult = await createOrderItem({
                pedido_id: result.data.id,
                encomenda: item.encomenda,
                valor: item.valor,
                loja: item.loja,
                item_status: item.item_status,
                empresa_id: values.empresa_id,
              });

              if (itemResult.error) {
                return {
                  data: result.data,
                  error: itemResult.error,
                };
              }
            }
          }

          await loadData();
          return result;
        }}
      />
    </AppShell>
  );
}

export default Orders;