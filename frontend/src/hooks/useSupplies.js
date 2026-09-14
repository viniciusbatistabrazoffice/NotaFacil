import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createSupply,
  deleteSupply as apiDeleteSupply,
  fetchSupplies,
  updateSupply,
} from '../services/supplies';
import { translateError } from '../utils/errors';

export function useSupplies() {
  const { token } = useAuth();
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchSupplies(token)
      .then(setSupplies)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveSupply = useCallback(
    async (id, payload) => {
      if (id) {
        await updateSupply(id, payload, token);
      } else {
        await createSupply(payload, token);
      }
      await reload();
    },
    [reload, token],
  );

  const deleteSupply = useCallback(
    async (id) => {
      await apiDeleteSupply(id, token);
      await reload();
    },
    [reload, token],
  );

  return { supplies, loading, error, saveSupply, deleteSupply };
}
