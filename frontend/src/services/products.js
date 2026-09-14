import { apiRequest } from './api';

export async function fetchProducts(token) {
  return apiRequest('/products', { token });
}

export async function createProduct(data, token) {
  return apiRequest('/products', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateProduct(id, data, token) {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
}

export async function deleteProduct(id, token) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
    token,
  });
}
