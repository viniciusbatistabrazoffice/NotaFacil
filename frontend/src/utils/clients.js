export function filterClients(clients, search) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return clients;
  return clients.filter(
    (client) =>
      client.name.toLowerCase().includes(normalized) ||
      client.email.toLowerCase().includes(normalized) ||
      client.document.includes(normalized),
  );
}
