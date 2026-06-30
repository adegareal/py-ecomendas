import { supabase } from "../integrations/supabase/client";
import type { ItemPedido, Pedido, ServiceResult } from "../types/app";

type PedidoPayload = {
  cliente: string;
  status: string;
  data: string;
  taxa: number;
  empresa_id: string;
};

type ItemPayload = {
  pedido_id: string;
  encomenda: string;
  valor: number;
  loja: string;
  item_status: string;
  empresa_id: string;
};

export async function listOrders(empresaId: string): Promise<ServiceResult<Pedido[]>> {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("data", { ascending: false });

  return {
    data: data ?? [],
    error: error ? "Não foi possível carregar os pedidos." : null,
  };
}

export async function listOrderItems(empresaId: string): Promise<ServiceResult<ItemPedido[]>> {
  const { data, error } = await supabase
    .from("itens")
    .select("*")
    .eq("empresa_id", empresaId)
    .order("created_at", { ascending: false });

  return {
    data: data ?? [],
    error: error ? "Não foi possível carregar os itens." : null,
  };
}

export async function createOrder(payload: PedidoPayload): Promise<ServiceResult<Pedido>> {
  const { data, error } = await supabase
    .from("pedidos")
    .insert(payload)
    .select()
    .single<Pedido>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível criar o pedido." : null,
  };
}

export async function updateOrder(
  id: string,
  empresaId: string,
  payload: Omit<PedidoPayload, "empresa_id">
): Promise<ServiceResult<Pedido>> {
  const { data, error } = await supabase
    .from("pedidos")
    .update(payload)
    .eq("id", id)
    .eq("empresa_id", empresaId)
    .select()
    .single<Pedido>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível atualizar o pedido." : null,
  };
}

export async function deleteOrder(id: string, empresaId: string): Promise<ServiceResult<boolean>> {
  const { error: itemsError } = await supabase
    .from("itens")
    .delete()
    .eq("pedido_id", id)
    .eq("empresa_id", empresaId);

  if (itemsError) {
    return { data: null, error: "Não foi possível remover os itens do pedido." };
  }

  const { error } = await supabase
    .from("pedidos")
    .delete()
    .eq("id", id)
    .eq("empresa_id", empresaId);

  return {
    data: !error,
    error: error ? "Não foi possível remover o pedido." : null,
  };
}

export async function createOrderItem(payload: ItemPayload): Promise<ServiceResult<ItemPedido>> {
  const { data, error } = await supabase
    .from("itens")
    .insert(payload)
    .select()
    .single<ItemPedido>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível criar o item." : null,
  };
}

export async function updateOrderItem(
  id: string,
  empresaId: string,
  payload: Omit<ItemPayload, "empresa_id" | "pedido_id"> & { pedido_id: string }
): Promise<ServiceResult<ItemPedido>> {
  const { data, error } = await supabase
    .from("itens")
    .update(payload)
    .eq("id", id)
    .eq("empresa_id", empresaId)
    .select()
    .single<ItemPedido>();

  return {
    data: data ?? null,
    error: error ? "Não foi possível atualizar o item." : null,
  };
}

export async function deleteOrderItem(
  id: string,
  empresaId: string
): Promise<ServiceResult<boolean>> {
  const { error } = await supabase
    .from("itens")
    .delete()
    .eq("id", id)
    .eq("empresa_id", empresaId);

  return {
    data: !error,
    error: error ? "Não foi possível remover o item." : null,
  };
}