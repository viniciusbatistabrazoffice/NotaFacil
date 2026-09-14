const MOCK_TICKETS = [
  {
    id: 301,
    subject: 'Erro ao gerar nota fiscal do pedido #1040',
    requester: 'Atacado Roupas Ltda',
    message: 'A nota fiscal não foi gerada após faturar o pedido.',
    status: 'open',
    priority: 'high',
    createdAt: '2026-09-11T09:20:00.000Z',
  },
  {
    id: 300,
    subject: 'Dúvida sobre cadastro de novos usuários',
    requester: 'Confecções Bella Moda',
    message: 'Gostaria de saber o limite de usuários por plano.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-09-09T14:05:00.000Z',
  },
  {
    id: 299,
    subject: 'Solicitação de exportação de relatório mensal',
    requester: 'Boutique Elegance',
    message: 'Preciso exportar o relatório de vendas de agosto em PDF.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-09-02T10:40:00.000Z',
  },
  {
    id: 298,
    subject: 'Sistema lento ao abrir a lista de pedidos',
    requester: 'Loja Fashion Kids',
    message: 'A tela de pedidos está demorando para carregar no período da tarde.',
    status: 'open',
    priority: 'medium',
    createdAt: '2026-08-28T16:30:00.000Z',
  },
];

const MOCK_DELAY_MS = 300;

function withDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

function generateId() {
  return MOCK_TICKETS.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function fetchMockTickets({ status, search } = {}) {
  let tickets = MOCK_TICKETS;

  if (status) {
    tickets = tickets.filter((ticket) => ticket.status === status);
  }

  if (search) {
    const normalized = search.trim().toLowerCase();
    tickets = tickets.filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(normalized) ||
        ticket.requester.toLowerCase().includes(normalized),
    );
  }

  return withDelay(
    [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  );
}

export function createMockTicket(data) {
  const ticket = {
    status: 'open',
    createdAt: new Date().toISOString(),
    ...data,
    id: generateId(),
  };
  MOCK_TICKETS.unshift(ticket);
  return withDelay({ ...ticket });
}

export function updateMockTicket(id, data) {
  const index = MOCK_TICKETS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Ticket not found'));
  }
  MOCK_TICKETS[index] = { ...MOCK_TICKETS[index], ...data };
  return withDelay({ ...MOCK_TICKETS[index] });
}

export function deleteMockTicket(id) {
  const index = MOCK_TICKETS.findIndex((item) => item.id === id);
  if (index === -1) {
    return Promise.reject(new Error('Ticket not found'));
  }
  MOCK_TICKETS.splice(index, 1);
  return withDelay(null);
}
