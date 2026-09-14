const TICKET_STATUS_LABELS = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  resolved: 'Resolvido',
};

const TICKET_STATUS_VARIANTS = {
  open: 'amber',
  in_progress: 'blue',
  resolved: 'green',
};

const TICKET_PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const TICKET_PRIORITY_VARIANTS = {
  low: 'slate',
  medium: 'amber',
  high: 'purple',
};

export const TICKET_STATUS_OPTIONS = Object.entries(TICKET_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const TICKET_PRIORITY_OPTIONS = Object.entries(TICKET_PRIORITY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function getTicketStatusLabel(status) {
  return TICKET_STATUS_LABELS[status] ?? status;
}

export function getTicketStatusVariant(status) {
  return TICKET_STATUS_VARIANTS[status] ?? 'slate';
}

export function getTicketPriorityLabel(priority) {
  return TICKET_PRIORITY_LABELS[priority] ?? priority;
}

export function getTicketPriorityVariant(priority) {
  return TICKET_PRIORITY_VARIANTS[priority] ?? 'slate';
}
