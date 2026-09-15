import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Erro inesperado. Tente novamente.';
    throw new Error(message);
  }
);

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const config = {
    method,
    url: path,
    ...(body && { data: body }),
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };

  return axiosInstance(config);
}
