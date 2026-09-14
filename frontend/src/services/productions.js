import { apiRequest } from './api';

export async function fetchProductions(token, options = {}) {
  const params = new URLSearchParams();
  if (options.stage) params.append('stage', options.stage);
  if (options.search) params.append('search', options.search);
  
  const query = params.toString();
  const url = query ? `/productions?${query}` : '/productions';
  return apiRequest(url, { token });
}

export async function createProduction(data, token) {
  return apiRequest('/productions', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateProduction(id, data, token) {
  return apiRequest(`/productions/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteProduction(id, token) {
  return apiRequest(`/productions/${id}`, {
    method: 'DELETE',
    token,
  });
}
