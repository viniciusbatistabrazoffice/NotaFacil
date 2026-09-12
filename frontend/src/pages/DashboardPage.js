import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';

export function DashboardPage() {
  const { tenant, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/users', { token })
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="dashboard-content">
      <h2>Usuários de {tenant?.name}</h2>
      {error && <p className="form-error">{error}</p>}
      <table className="users-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
