const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Camiseta Básica',
    code: 'CB-001',
    category: 'Camisetas',
    price: 18.9,
    sizes: 'P, M, G, GG',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Vestido Midi Floral',
    code: 'VD-014',
    category: 'Vestidos',
    price: 89.9,
    sizes: 'P, M, G',
    createdAt: '2026-02-05T09:30:00.000Z',
  },
  {
    id: 'p3',
    name: 'Calça Jeans Feminina',
    code: 'CJ-022',
    category: 'Calças',
    price: 79.9,
    sizes: '36, 38, 40, 42, 44',
    createdAt: '2026-02-18T11:15:00.000Z',
  },
  {
    id: 'p4',
    name: 'Moletom Canguru',
    code: 'MC-007',
    category: 'Moletons',
    price: 99.0,
    sizes: 'P, M, G, GG',
    createdAt: '2026-03-02T14:45:00.000Z',
  },
  {
    id: 'p5',
    name: 'Blusa Social Feminina',
    code: 'BS-030',
    category: 'Blusas',
    price: 65.0,
    sizes: 'P, M, G',
    createdAt: '2026-03-22T16:20:00.000Z',
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function generateId() {
  return `p${Date.now()}`;
}

export function fetchMockProducts() {
  return withDelay(
    [...MOCK_PRODUCTS].sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export function createMockProduct(data) {
  const product = { id: generateId(), createdAt: new Date().toISOString(), ...data };
  MOCK_PRODUCTS.push(product);
  return withDelay({ ...product });
}

export function updateMockProduct(id, data) {
  const index = MOCK_PRODUCTS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Product not found'));
  }
  MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...data };
  return withDelay({ ...MOCK_PRODUCTS[index] });
}

export function deleteMockProduct(id) {
  const index = MOCK_PRODUCTS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Product not found'));
  }
  MOCK_PRODUCTS.splice(index, 1);
  return withDelay(null);
}
