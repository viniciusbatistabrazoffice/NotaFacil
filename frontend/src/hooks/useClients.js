import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createClient,
  deleteClient as apiDeleteClient,
  fetchClients,
  updateClient,
} from '../services/clients';
import { translateError } from '../utils/errors';

export function useClients() {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchClients(token)
      .then(setClients)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveClient = useCallback(
    async (id, payload) => {
      if (id) {
        await updateClient(id, payload, token);
      } else {
        await createClient(payload, token);
      }
      await reload();
    },
    [reload, token],
  );

  const deleteClient = useCallback(
    async (id) => {
      await apiDeleteClient(id, token);
      await reload();
    },
    [reload, token],
  );

  return { clients, loading, error, saveClient, deleteClient };
}
