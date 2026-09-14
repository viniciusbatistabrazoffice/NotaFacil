import { apiRequest } from './api';

export async function fetchSupplies(token) {
  return apiRequest('/supplies', { token });
}

export async function createSupply(data, token) {
  return apiRequest('/supplies', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateSupply(id, data, token) {
  return apiRequest(`/supplies/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteSupply(id, token) {
  return apiRequest(`/supplies/${id}`, {
    method: 'DELETE',
    token,
  });
}
