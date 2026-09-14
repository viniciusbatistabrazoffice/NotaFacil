const MOCK_SUPPLIES = [
  {
    id: 's1',
    name: 'Tecido Oxford — Azul marinho',
    category: 'Tecido',
    unit: 'm',
    stock: 12,
    minStock: 30,
    createdAt: '2026-01-08T10:00:00.000Z',
  },
  {
    id: 's2',
    name: 'Linha poliéster — Branca',
    category: 'Linha',
    unit: 'cone',
    stock: 3,
    minStock: 10,
    createdAt: '2026-01-20T09:30:00.000Z',
  },
  {
    id: 's3',
    name: 'Botão encapado 12mm',
    category: 'Aviamento',
    unit: 'un',
    stock: 50,
    minStock: 200,
    createdAt: '2026-02-11T14:15:00.000Z',
  },
  {
    id: 's4',
    name: 'Zíper invisível 60cm — Preto',
    category: 'Aviamento',
    unit: 'un',
    stock: 18,
    minStock: 50,
    createdAt: '2026-02-25T16:45:00.000Z',
  },
  {
    id: 's5',
    name: 'Tecido Malha PV — Cinza mescla',
    category: 'Tecido',
    unit: 'm',
    stock: 85,
    minStock: 40,
    createdAt: '2026-03-14T11:20:00.000Z',
  },
  {
    id: 's6',
    name: 'Etiqueta de composição',
    category: 'Etiqueta',
    unit: 'un',
    stock: 620,
    minStock: 300,
    createdAt: '2026-03-30T13:00:00.000Z',
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function generateId() {
  return `s${Date.now()}`;
}

export function fetchMockSupplies() {
  return withDelay(
    [...MOCK_SUPPLIES].sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export function createMockSupply(data) {
  const supply = { id: generateId(), createdAt: new Date().toISOString(), ...data };
  MOCK_SUPPLIES.push(supply);
  return withDelay({ ...supply });
}

export function updateMockSupply(id, data) {
  const index = MOCK_SUPPLIES.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Supply not found'));
  }
  MOCK_SUPPLIES[index] = { ...MOCK_SUPPLIES[index], ...data };
  return withDelay({ ...MOCK_SUPPLIES[index] });
}

export function deleteMockSupply(id) {
  const index = MOCK_SUPPLIES.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Supply not found'));
  }
  MOCK_SUPPLIES.splice(index, 1);
  return withDelay(null);
}
