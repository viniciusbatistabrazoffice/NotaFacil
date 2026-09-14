const MOCK_ORDERS = [
  {
    id: 1042,
    clientName: 'Confecções Bella Moda',
    status: 'awaiting_cutting',
    notes: 'Cliente pediu urgência na entrega.',
    deliveryDate: '2026-09-25',
    createdAt: '2026-09-10T13:20:00.000Z',
    items: [
      { id: 1, productName: 'Camiseta básica P', quantity: 50, unitPrice: 18.9 },
      { id: 2, productName: 'Camiseta básica M', quantity: 80, unitPrice: 18.9 },
      { id: 3, productName: 'Camiseta básica G', quantity: 40, unitPrice: 18.9 },
    ],
  },
  {
    id: 1041,
    clientName: 'Loja Fashion Kids',
    status: 'in_production',
    notes: null,
    deliveryDate: '2026-09-20',
    createdAt: '2026-09-08T09:45:00.000Z',
    items: [
      { id: 1, productName: 'Vestido infantil floral', quantity: 30, unitPrice: 42.5 },
      { id: 2, productName: 'Short infantil jeans', quantity: 30, unitPrice: 29.9 },
    ],
  },
  {
    id: 1040,
    clientName: 'Atacado Roupas Ltda',
    status: 'invoiced',
    notes: 'Nota fiscal emitida em 05/09.',
    deliveryDate: '2026-09-15',
    createdAt: '2026-09-01T16:10:00.000Z',
    items: [
      { id: 1, productName: 'Moletom canguru', quantity: 60, unitPrice: 55 },
      { id: 2, productName: 'Calça moletom', quantity: 60, unitPrice: 48 },
    ],
  },
  {
    id: 1039,
    clientName: 'Boutique Elegance',
    status: 'finished',
    notes: null,
    deliveryDate: '2026-08-30',
    createdAt: '2026-08-20T11:00:00.000Z',
    items: [{ id: 1, productName: 'Blusa social feminina', quantity: 25, unitPrice: 65 }],
  },
  {
    id: 1038,
    clientName: 'Uniformes Silva & Cia',
    status: 'cancelled',
    notes: 'Cliente cancelou por atraso na entrega de insumos.',
    deliveryDate: '2026-08-25',
    createdAt: '2026-08-15T08:30:00.000Z',
    items: [{ id: 1, productName: 'Camisa uniforme manga longa', quantity: 100, unitPrice: 32 }],
  },
  {
    id: 1037,
    clientName: 'Confecções Bella Moda',
    status: 'in_production',
    notes: null,
    deliveryDate: '2026-09-22',
    createdAt: '2026-08-28T14:15:00.000Z',
    items: [
      { id: 1, productName: 'Jaqueta jeans', quantity: 20, unitPrice: 89.9 },
      { id: 2, productName: 'Saia jeans', quantity: 35, unitPrice: 54.9 },
    ],
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function getItemsCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function getTotal(items) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function toListItem({ items, ...order }) {
  return { ...order, itemsCount: getItemsCount(items), total: getTotal(items) };
}

export function fetchMockOrders({ status, search } = {}) {
  let orders = MOCK_ORDERS;

  if (status) {
    orders = orders.filter((order) => order.status === status);
  }

  if (search) {
    const normalized = search.trim().toLowerCase().replace(/^#/, '');
    orders = orders.filter(
      (order) =>
        order.clientName.toLowerCase().includes(normalized) ||
        String(order.id) === normalized,
    );
  }

  return withDelay(
    [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(toListItem),
  );
}

export function fetchMockOrderById(id) {
  const order = MOCK_ORDERS.find((item) => item.id === Number(id));
  if (!order) {
    return Promise.reject(new Error('Order not found'));
  }
  const { items } = order;
  return withDelay({ ...order, itemsCount: getItemsCount(items), total: getTotal(items) });
}

export function updateMockOrder(id, data) {
  const index = MOCK_ORDERS.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return Promise.reject(new Error('Order not found'));
  }
  MOCK_ORDERS[index] = { ...MOCK_ORDERS[index], ...data };
  return withDelay(toListItem(MOCK_ORDERS[index]));
}

export function createMockOrder(data) {
  const nextId = MOCK_ORDERS.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const order = { items: [], createdAt: new Date().toISOString(), ...data, id: nextId };
  MOCK_ORDERS.unshift(order);
  return withDelay(toListItem(order));
}

export function deleteMockOrder(id) {
  const index = MOCK_ORDERS.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return Promise.reject(new Error('Order not found'));
  }
  MOCK_ORDERS.splice(index, 1);
  return withDelay(null);
}
