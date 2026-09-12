const STATUS_LABELS = {
  awaiting_cutting: 'Aguardando corte',
  in_production: 'Em produção',
  invoiced: 'Faturado',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

const STATUS_VARIANTS = {
  awaiting_cutting: 'amber',
  in_production: 'blue',
  invoiced: 'purple',
  finished: 'green',
  cancelled: 'slate',
};

export const ORDER_STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function getStatusVariant(status) {
  return STATUS_VARIANTS[status] ?? 'slate';
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value) {
  return currency.format(value ?? 0);
}

export function formatOrderId(id) {
  return `#${id}`;
}

export function formatDate(value) {
  if (!value) return '—';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
  }
  return new Date(value).toLocaleDateString('pt-BR');
}
