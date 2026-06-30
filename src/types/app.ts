export type Empresa = {
  id: string;
  nome: string;
  slug: string;
  created_at?: string;
};

export type AppUser = {
  id: string;
  username: string;
  nome: string;
  role: string;
  created_at?: string;
  empresa_id: string;
  nivel: string;
};

export type Pedido = {
  id: string;
  cliente: string;
  status: string;
  data: string;
  taxa: number;
  created_at?: string;
  empresa_id: string;
};

export type ItemPedido = {
  id: string;
  pedido_id: string | null;
  encomenda: string;
  valor: number;
  loja: string;
  item_status: string;
  created_at?: string;
  empresa_id: string;
};

export type Loja = {
  id: string;
  nome: string;
  created_at?: string;
  empresa_id: string;
};

export type AppSession = {
  empresa: Empresa;
  usuario: AppUser;
};

export type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};