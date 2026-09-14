const MOCK_SUPPLIERS = [
  {
    id: 'f1',
    name: 'Têxtil Nordeste Ltda',
    document: '11.222.333/0001-44',
    category: 'Tecidos',
    email: 'vendas@textilnordeste.com.br',
    phone: '(85) 98765-4321',
    city: 'Fortaleza',
    state: 'CE',
    createdAt: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'f2',
    name: 'Aviamentos Sul Com.',
    document: '22.333.444/0001-55',
    category: 'Aviamentos',
    email: 'comercial@aviamentossul.com.br',
    phone: '(51) 99887-6655',
    city: 'Porto Alegre',
    state: 'RS',
    createdAt: '2026-01-22T09:30:00.000Z',
  },
  {
    id: 'f3',
    name: 'Linhas & Cia Distribuidora',
    document: '33.444.555/0001-66',
    category: 'Linhas',
    email: 'contato@linhasecia.com.br',
    phone: '(11) 98123-4567',
    city: 'São Paulo',
    state: 'SP',
    createdAt: '2026-02-14T11:15:00.000Z',
  },
  {
    id: 'f4',
    name: 'Etiquetas Print Express',
    document: '44.555.666/0001-77',
    category: 'Etiquetas',
    email: 'atendimento@printexpress.com.br',
    phone: '(19) 99234-5678',
    city: 'Campinas',
    state: 'SP',
    createdAt: '2026-03-01T14:45:00.000Z',
  },
  {
    id: 'f5',
    name: 'Malharia Vale Verde',
    document: '55.666.777/0001-88',
    category: 'Tecidos',
    email: 'vendas@malhariavaleverde.com.br',
    phone: '(47) 98345-6789',
    city: 'Blumenau',
    state: 'SC',
    createdAt: '2026-03-19T16:20:00.000Z',
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function generateId() {
  return `f${Date.now()}`;
}

export function fetchMockSuppliers() {
  return withDelay(
    [...MOCK_SUPPLIERS].sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export function createMockSupplier(data) {
  const supplier = { id: generateId(), createdAt: new Date().toISOString(), ...data };
  MOCK_SUPPLIERS.push(supplier);
  return withDelay({ ...supplier });
}

export function updateMockSupplier(id, data) {
  const index = MOCK_SUPPLIERS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Supplier not found'));
  }
  MOCK_SUPPLIERS[index] = { ...MOCK_SUPPLIERS[index], ...data };
  return withDelay({ ...MOCK_SUPPLIERS[index] });
}

export function deleteMockSupplier(id) {
  const index = MOCK_SUPPLIERS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Supplier not found'));
  }
  MOCK_SUPPLIERS.splice(index, 1);
  return withDelay(null);
}
