export const config = {
  // Em dev, o proxy do package.json encaminha as chamadas para o backend.
  // Em produção, defina REACT_APP_API_URL no ambiente de build.
  apiBaseUrl: process.env.REACT_APP_API_URL || '',
};
