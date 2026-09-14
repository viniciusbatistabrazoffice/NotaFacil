const MOCK_INVOICES = [
  {
    id: 5001,
    number: '000005001',
    orderId: 1040,
    clientName: 'Atacado Roupas Ltda',
    issueDate: '2026-09-05',
    status: 'issued',
    total: 6180.0,
    notes: null,
  },
  {
    id: 5000,
    number: '000005000',
    orderId: 1039,
    clientName: 'Boutique Elegance',
    issueDate: '2026-08-31',
    status: 'issued',
    total: 1625.0,
    notes: null,
  },
  {
    id: 4999,
    number: '000004999',
    orderId: 1038,
    clientName: 'Uniformes Silva & Cia',
    issueDate: '2026-08-26',
    status: 'cancelled',
    total: 3200.0,
    notes: 'Cancelada: pedido cancelado pelo cliente.',
  },
  {
    id: 4998,
    number: '000004998',
    orderId: 1035,
    clientName: 'Moda Jovem Ltda',
    issueDate: '2026-08-18',
    status: 'issued',
    total: 2450.5,
    notes: null,
  },
  {
    id: 4997,
    number: '000004997',
    orderId: 1033,
    clientName: 'Confecções Bella Moda',
    issueDate: '2026-08-10',
    status: 'issued',
    total: 3890.0,
    notes: null,
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

export function fetchMockInvoices({ status, search } = {}) {
  let invoices = MOCK_INVOICES;

  if (status) {
    invoices = invoices.filter((invoice) => invoice.status === status);
  }

  if (search) {
    const normalized = search.trim().toLowerCase().replace(/^#/, '');
    invoices = invoices.filter(
      (invoice) =>
        invoice.clientName.toLowerCase().includes(normalized) ||
        invoice.number.includes(normalized) ||
        String(invoice.orderId) === normalized,
    );
  }

  return withDelay(
    [...invoices].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)),
  );
}

export function fetchMockInvoiceById(id) {
  const invoice = MOCK_INVOICES.find((item) => item.id === Number(id));
  if (!invoice) {
    return Promise.reject(new Error('Invoice not found'));
  }
  return withDelay({ ...invoice });
}

export function updateMockInvoice(id, data) {
  const index = MOCK_INVOICES.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return Promise.reject(new Error('Invoice not found'));
  }
  MOCK_INVOICES[index] = { ...MOCK_INVOICES[index], ...data };
  return withDelay({ ...MOCK_INVOICES[index] });
}

export function createMockInvoice(data) {
  const nextId = MOCK_INVOICES.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const invoice = { notes: null, ...data, id: nextId, number: String(nextId).padStart(9, '0') };
  MOCK_INVOICES.unshift(invoice);
  return withDelay({ ...invoice });
}

export function deleteMockInvoice(id) {
  const index = MOCK_INVOICES.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return Promise.reject(new Error('Invoice not found'));
  }
  MOCK_INVOICES.splice(index, 1);
  return withDelay(null);
}
