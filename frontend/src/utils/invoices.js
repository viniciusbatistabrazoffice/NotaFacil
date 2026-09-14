const INVOICE_STATUS_LABELS = {
  issued: 'Emitida',
  cancelled: 'Cancelada',
};

const INVOICE_STATUS_VARIANTS = {
  issued: 'green',
  cancelled: 'slate',
};

export const INVOICE_STATUS_OPTIONS = Object.entries(INVOICE_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function getInvoiceStatusLabel(status) {
  return INVOICE_STATUS_LABELS[status] ?? status;
}

export function getInvoiceStatusVariant(status) {
  return INVOICE_STATUS_VARIANTS[status] ?? 'slate';
}

export function formatInvoiceNumber(number) {
  return `NF-${number}`;
}
