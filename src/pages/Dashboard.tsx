import {
  Building2,
  CheckSquare,
  Coins,
  Hourglass,
  Search,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import StoresDialog from "../components/dashboard/StoresDialog";
import SuperAdminDialog from "../components/dashboard/SuperAdminDialog";
import UsersDialog from "../components/dashboard/UsersDialog";
import OrderFormDialog from "../components/orders/OrderFormDialog";
import OrderItemsDialog from "../components/orders/OrderItemsDialog";
import OrderListCard from "../components/orders/OrderListCard";
import OrdersSummaryCard from "../components/orders/OrdersSummaryCard";
import { useAppSession } from "../hooks/useAppSession";
import { isSuperAdminSession } from "../lib/access";
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

function Dashboard() {
  const { session } = useAppSession();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [stores, setStores] = useState<Loja[]>([]);
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<Pedido | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Pedido | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
  const [storesDialogOpen, setStoresDialogOpen] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [superAdminDialogOpen, setSuperAdminDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = isSuperAdminSession(session);

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

      if (!term) {
        return true;
      }

      return (
        order.cliente.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        relatedItems.some(
          (item) =>
            item.encomenda.toLowerCase().includes(term) ||
            item.loja.toLowerCase().includes(term)
        )
      );
    });
  }, [items, orders, search]);

  return (
    <AppShell
      title="Painel principal"
      description="Resumo rápido da operação atual da empresa."
      hidePageIntro
      headerActions={
        <>
          {isSuperAdmin ? (
            <button
              type="button"
              onClick={() => setSuperAdminDialogOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Building2 className="h-4 w-4" />
              Empresas
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setUsersDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Users className="h-4 w-4" />
            Usuários
          </button>

          <button
            type="button"
            onClick={() => setStoresDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Store className="h-4 w-4" />
            Lojas
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingOrder(null);
              setOrderDialogOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[#ffd400] px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-[#ffdf40]"
          >
            + Novo Pedido
          </button>
        </>
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar cliente, produto ou loja..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#223245] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
          />
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
                  selected={viewingOrder?.id === order.id && itemsDialogOpen}
                  onSelect={() => {
                    setViewingOrder(order);
                    setItemsDialogOpen(true);
                  }}
                  onEdit={() => {
                    setEditingOrder(order);
                    setOrderDialogOpen(true);
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

                    if (viewingOrder?.id === order.id) {
                      setViewingOrder(null);
                      setItemsDialogOpen(false);
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

      {isSuperAdmin ? (
        <SuperAdminDialog open={superAdminDialogOpen} onClose={() => setSuperAdminDialogOpen(false)} />
      ) : null}

      <UsersDialog open={usersDialogOpen} onClose={() => setUsersDialogOpen(false)} />
      <StoresDialog open={storesDialogOpen} onClose={() => setStoresDialogOpen(false)} />

      <OrderItemsDialog
        open={itemsDialogOpen}
        pedido={viewingOrder}
        items={items}
        empresaId={session?.empresa.id ?? ""}
        lojas={stores.map((store) => store.nome)}
        onClose={() => setItemsDialogOpen(false)}
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

      <OrderFormDialog
        open={orderDialogOpen}
        pedido={editingOrder}
        empresaId={session?.empresa.id ?? ""}
        lojas={stores.map((store) => store.nome)}
        onClose={() => setOrderDialogOpen(false)}
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

export default Dashboard;