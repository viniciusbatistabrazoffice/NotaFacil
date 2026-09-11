import axios from 'axios';
import { config } from '../config/env';
import { authStorage } from '../utils/storage';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const http = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((requestConfig) => {
  if (requestConfig.auth !== false) {
    const token = authStorage.getToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
  }
  return requestConfig;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response, config: requestConfig } = error;

    if (response?.status === 401 && requestConfig?.auth !== false) {
      authStorage.clear();
      window.location.assign('/login');
      return Promise.reject(new ApiError(401, 'Sessão expirada. Faça login novamente.'));
    }

    const message =
      response?.data?.message ||
      (response ? 'Não foi possível concluir a requisição.' : 'Sem conexão com o servidor.');
    return Promise.reject(new ApiError(response?.status ?? 0, message));
  }
);

export const apiClient = {
  get: (path, options) => http.get(path, options),
  post: (path, body, options) => http.post(path, body, options),
  put: (path, body, options) => http.put(path, body, options),
  patch: (path, body, options) => http.patch(path, body, options),
  delete: (path, options) => http.delete(path, options),
};
