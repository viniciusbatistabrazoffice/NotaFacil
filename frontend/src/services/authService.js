import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';

export const authService = {
  login: (credentials) =>
    apiClient.post(endpoints.auth.login, credentials, { auth: false }),

  register: (payload) =>
    apiClient.post(endpoints.auth.register, payload, { auth: false }),

  forgotPassword: (identifier) =>
    apiClient.post(endpoints.auth.forgotPassword, { identifier }, { auth: false }),

  resetPassword: ({ token, newPassword }) =>
    apiClient.post(endpoints.auth.resetPassword, { token, newPassword }, { auth: false }),

  // O logout é stateless no backend; falhas não devem impedir a saída local.
  logout: () => apiClient.post(endpoints.auth.logout).catch(() => undefined),
};
