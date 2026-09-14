const MOCK_PRODUCTION = [
  {
    id: 'OP-1042',
    orderId: 1042,
    product: 'Camiseta básica (mix tamanhos)',
    client: 'Confecções Bella Moda',
    stage: 'cutting',
    progress: 20,
    dueDate: '2026-09-25',
  },
  {
    id: 'OP-1041',
    orderId: 1041,
    product: 'Vestido infantil floral',
    client: 'Loja Fashion Kids',
    stage: 'sewing',
    progress: 55,
    dueDate: '2026-09-20',
  },
  {
    id: 'OP-1037',
    orderId: 1037,
    product: 'Jaqueta jeans',
    client: 'Confecções Bella Moda',
    stage: 'finishing',
    progress: 80,
    dueDate: '2026-09-22',
  },
  {
    id: 'OP-1036',
    orderId: 1036,
    product: 'Calça moletom',
    client: 'Atacado Roupas Ltda',
    stage: 'packaging',
    progress: 95,
    dueDate: '2026-09-16',
  },
  {
    id: 'OP-1030',
    orderId: 1030,
    product: 'Blusa social feminina',
    client: 'Boutique Elegance',
    stage: 'done',
    progress: 100,
    dueDate: '2026-09-01',
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

export function fetchMockProductionOrders({ stage, search } = {}) {
  let items = MOCK_PRODUCTION;

  if (stage) {
    items = items.filter((item) => item.stage === stage);
  }

  if (search) {
    const normalized = search.trim().toLowerCase().replace(/^#/, '');
    items = items.filter(
      (item) =>
        item.product.toLowerCase().includes(normalized) ||
        item.client.toLowerCase().includes(normalized) ||
        item.id.toLowerCase().includes(normalized) ||
        String(item.orderId) === normalized,
    );
  }

  return withDelay(
    [...items].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
  );
}

export function updateMockProductionOrder(id, data) {
  const index = MOCK_PRODUCTION.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Production order not found'));
  }
  MOCK_PRODUCTION[index] = { ...MOCK_PRODUCTION[index], ...data };
  return withDelay({ ...MOCK_PRODUCTION[index] });
}

export function deleteMockProductionOrder(id) {
  const index = MOCK_PRODUCTION.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Production order not found'));
  }
  MOCK_PRODUCTION.splice(index, 1);
  return withDelay(null);
}
