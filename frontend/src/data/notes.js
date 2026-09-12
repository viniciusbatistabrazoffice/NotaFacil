export const notes = [
  { id: 1, number: '0001', client: 'Cliente A', value: 'R$ 1.200,00', status: 'Emitida' },
  { id: 2, number: '0002', client: 'Cliente B', value: 'R$ 850,00', status: 'Pendente' },
  { id: 3, number: '0003', client: 'Cliente C', value: 'R$ 2.400,00', status: 'Cancelada' },
];

export const statusOptions = [
  { label: 'Emitidas', param: 'emitida', color: '#34d399' },
  { label: 'Pendentes', param: 'pendente', color: '#fbbf24' },
  { label: 'Canceladas', param: 'cancelada', color: '#f87171' },
];

export const countByStatus = (param) =>
  notes.filter((note) => note.status.toLowerCase() === param).length;
