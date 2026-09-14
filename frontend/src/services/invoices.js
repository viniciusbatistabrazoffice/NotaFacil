import { apiRequest } from './api';

export async function fetchInvoices(token, options = {}) {
  const params = new URLSearchParams();
  if (options.status) params.append('status', options.status);
  if (options.search) params.append('search', options.search);
  
  const query = params.toString();
  const url = query ? `/invoices?${query}` : '/invoices';
  return apiRequest(url, { token });
}

export async function fetchInvoiceById(id, token) {
  return apiRequest(`/invoices/${id}`, { token });
}

export async function createInvoice(data, token) {
  return apiRequest('/invoices', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateInvoice(id, data, token) {
  return apiRequest(`/invoices/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteInvoice(id, token) {
  return apiRequest(`/invoices/${id}`, {
    method: 'DELETE',
    token,
  });
}
