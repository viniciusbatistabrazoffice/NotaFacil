import { apiRequest } from './api';

export async function fetchOrders(token, options = {}) {
  const params = new URLSearchParams();
  if (options.status) params.append('status', options.status);
  if (options.search) params.append('search', options.search);
  
  const query = params.toString();
  const url = query ? `/orders?${query}` : '/orders';
  return apiRequest(url, { token });
}

export async function fetchOrderById(id, token) {
  return apiRequest(`/orders/${id}`, { token });
}

export async function createOrder(data, token) {
  return apiRequest('/orders', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateOrder(id, data, token) {
  return apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteOrder(id, token) {
  return apiRequest(`/orders/${id}`, {
    method: 'DELETE',
    token,
  });
}
