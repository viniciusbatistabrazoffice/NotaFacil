const MOCK_CLIENTS = [
  {
    id: 'c1',
    name: 'Confecções Bella Moda',
    document: '12.345.678/0001-90',
    email: 'contato@bellamoda.com.br',
    phone: '(11) 98765-4321',
    city: 'São Paulo',
    state: 'SP',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'c2',
    name: 'Loja Fashion Kids',
    document: '23.456.789/0001-01',
    email: 'compras@fashionkids.com.br',
    phone: '(21) 99887-6655',
    city: 'Rio de Janeiro',
    state: 'RJ',
    createdAt: '2026-02-03T14:30:00.000Z',
  },
  {
    id: 'c3',
    name: 'Atacado Roupas Ltda',
    document: '34.567.890/0001-12',
    email: 'financeiro@atacadoroupas.com.br',
    phone: '(31) 98123-4567',
    city: 'Belo Horizonte',
    state: 'MG',
    createdAt: '2026-03-20T09:15:00.000Z',
  },
  {
    id: 'c4',
    name: 'Boutique Elegance',
    document: '45.678.901/0001-23',
    email: 'atendimento@boutiqueelegance.com.br',
    phone: '(41) 99234-5678',
    city: 'Curitiba',
    state: 'PR',
    createdAt: '2026-04-11T16:45:00.000Z',
  },
  {
    id: 'c5',
    name: 'Uniformes Silva & Cia',
    document: '56.789.012/0001-34',
    email: 'contato@uniformessilva.com.br',
    phone: '(51) 98345-6789',
    city: 'Porto Alegre',
    state: 'RS',
    createdAt: '2026-05-08T11:20:00.000Z',
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function generateId() {
  return `c${Date.now()}`;
}

export function fetchMockClients() {
  return withDelay(
    [...MOCK_CLIENTS].sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export function createMockClient(data) {
  const client = { id: generateId(), createdAt: new Date().toISOString(), ...data };
  MOCK_CLIENTS.push(client);
  return withDelay({ ...client });
}

export function updateMockClient(id, data) {
  const index = MOCK_CLIENTS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Client not found'));
  }
  MOCK_CLIENTS[index] = { ...MOCK_CLIENTS[index], ...data };
  return withDelay({ ...MOCK_CLIENTS[index] });
}

export function deleteMockClient(id) {
  const index = MOCK_CLIENTS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Client not found'));
  }
  MOCK_CLIENTS.splice(index, 1);
  return withDelay(null);
}
