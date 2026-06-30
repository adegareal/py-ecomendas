import { Building2, Package, ShoppingBag, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import OrderStatusBadge from "../components/OrderStatusBadge";
import StatsCard from "../components/StatsCard";
import { useAppSession } from "../hooks/useAppSession";
import { formatCurrency, formatDate } from "../lib/formatters";
import { listOrderItems, listOrders } from "../lib/orders";
import { listStores } from "../lib/stores";
import { listUsers } from "../lib/users";
import type { ItemPedido, Loja, Pedido, AppUser } from "../types/app";

function Dashboard() {
  const { session } = useAppSession();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [stores, setStores] = useState<Loja[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!session) {
        return;
      }

      setLoading(true);

      const [ordersResult, itemsResult, storesResult, usersResult] = await Promise.all([
        listOrders(session.empresa.id),
        listOrderItems(session.empresa.id),
        listStores(session.empresa.id),
        listUsers(session.empresa.id),
      ]);

      if (ordersResult.error) toast.error(ordersResult.error);
      if (itemsResult.error) toast.error(itemsResult.error);
      if (storesResult.error) toast.error(storesResult.error);
      if (usersResult.error) toast.error(usersResult.error);

      setOrders(ordersResult.data ?? []);
      setItems(itemsResult.data ?? []);
      setStores(storesResult.data ?? []);
      setUsers(usersResult.data ?? []);
      setLoading(false);
    }

    void loadData();
  }, [session]);

  const totals = useMemo(() => {
    const openOrders = orders.filter((order) => order.status !== "Entregue").length;
    const itemsValue = items.reduce((sum, item) => sum + Number(item.valor || 0), 0);
    const feesValue = orders.reduce((sum, order) => sum + Number(order.taxa || 0), 0);

    return {
      orders: orders.length,
      openOrders,
      stores: stores.length,
      users: users.length,
      revenue: formatCurrency(itemsValue + feesValue),
    };
  }, [items, orders, stores, users]);

  return (
    <AppShell
      title="Painel principal"
      description="Resumo rápido da operação atual da empresa."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Pedidos"
          value={String(totals.orders)}
          description={`${totals.openOrders} ainda em aberto`}
          icon={Package}
        />
        <StatsCard
          title="Valor movimentado"
          value={totals.revenue}
          description="Itens somados com taxas dos pedidos"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Lojas"
          value={String(totals.stores)}
          description="Base disponível para vincular itens"
          icon={Building2}
        />
        <StatsCard
          title="Usuários"
          value={String(totals.users)}
          description="Acessos cadastrados para esta empresa"
          icon={Users}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Pedidos recentes</h2>
              <p className="mt-1 text-sm text-slate-600">Acompanhe os últimos pedidos da empresa.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-600">Carregando dados...</p>
            ) : orders.length ? (
              orders.slice(0, 6).map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{order.cliente}</h3>
                      <p className="mt-1 text-sm text-slate-600">Data: {formatDate(order.data)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(Number(order.taxa || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">Nenhum pedido cadastrado ainda.</p>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Informações da sessão</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Empresa</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{session?.empresa.nome}</p>
              <p className="mt-1 text-sm text-slate-600">Slug: {session?.empresa.slug}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Usuário</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{session?.usuario.nome}</p>
              <p className="mt-1 text-sm text-slate-600">@{session?.usuario.username}</p>
              <p className="mt-1 text-sm text-slate-600">Nível: {session?.usuario.nivel}</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default Dashboard;