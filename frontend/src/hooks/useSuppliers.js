import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';

export function useSuppliers() {
  const { token } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return apiRequest('/suppliers', { token })
      .then(setSuppliers)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveSupplier = useCallback(
    async (id, payload) => {
      if (id) {
        await apiRequest(`/suppliers/${id}`, { method: 'PUT', body: payload, token });
      } else {
        await apiRequest('/suppliers', { method: 'POST', body: payload, token });
      }
      await reload();
    },
    [reload, token],
  );

  const deleteSupplier = useCallback(
    async (id) => {
      await apiRequest(`/suppliers/${id}`, { method: 'DELETE', token });
      await reload();
    },
    [reload, token],
  );

  return { suppliers, loading, error, saveSupplier, deleteSupplier };
}
