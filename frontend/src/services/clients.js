import { apiRequest } from './api';

export async function fetchClients(token) {
  return apiRequest('/clients', { token });
}

export async function createClient(data, token) {
  return apiRequest('/clients', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateClient(id, data, token) {
  return apiRequest(`/clients/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteClient(id, token) {
  return apiRequest(`/clients/${id}`, {
    method: 'DELETE',
    token,
  });
}
