const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro inesperado. Tente novamente.');
  }

  return data;
}
