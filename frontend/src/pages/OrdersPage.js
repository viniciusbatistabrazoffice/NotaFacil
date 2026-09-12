import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { Icon } from '../components/Icon';
import { translateError } from '../utils/errors';
import {
  ORDER_STATUS_OPTIONS,
  formatCurrency,
  formatDate,
  formatOrderId,
  getStatusLabel,
  getStatusVariant,
} from '../utils/orders';

export function OrdersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (debouncedSearch) params.set('search', debouncedSearch);
    const query = params.toString();

    apiRequest(`/orders${query ? `?${query}` : ''}`, { token })
      .then(setOrders)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token, status, debouncedSearch]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Acompanhe os pedidos da sua confecção</p>
        </div>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por cliente ou número do pedido..."
            aria-label="Buscar pedidos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="orders-filter-select"
          aria-label="Filtrar por status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">Todos os status</option>
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dash-card">
        {error && <p className="form-error m-3">{error}</p>}
        <div className="table-responsive">
          <table className="dash-table orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Peças</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="orders-empty">
                    Carregando pedidos...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="orders-empty">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/pedidos/${order.id}`)}
                  >
                    <td>
                      <strong>{formatOrderId(order.id)}</strong>
                      <span className="dash-table-muted d-block">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td>{order.clientName}</td>
                    <td>{order.itemsCount}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${getStatusVariant(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
