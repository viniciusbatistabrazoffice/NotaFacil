import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';

export function useUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return apiRequest('/users', { token })
      .then(setUsers)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveUser = useCallback(
    async (id, payload) => {
      if (id) {
        await apiRequest(`/users/${id}`, {
          method: 'PUT',
          body: payload,
          token,
        });
      } else {
        await apiRequest('/users', { method: 'POST', body: payload, token });
      }
      await reload();
    },
    [token, reload]
  );

  const deleteUser = useCallback(
    async (id) => {
      await apiRequest(`/users/${id}`, { method: 'DELETE', token });
      await reload();
    },
    [token, reload]
  );

  return { users, loading, error, saveUser, deleteUser };
}
