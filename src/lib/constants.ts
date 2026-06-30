export const pedidoStatusOptions = [
  "Pendente",
  "Em andamento",
  "Aguardando pagamento",
  "Pago",
  "Enviado",
  "Entregue",
] as const;

export const itemStatusOptions = [
  "Aguardando pagamento",
  "Pago",
  "Comprado",
  "Em trânsito",
  "Recebido",
  "Entregue",
] as const;

export const userLevelOptions = [
  { value: "viewer", label: "Visualizador" },
  { value: "admin_empresa", label: "Admin da empresa" },
  { value: "super_admin", label: "Super admin" },
];