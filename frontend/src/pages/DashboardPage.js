import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { fetchDashboardStats } from '../services/dashboard';
import { Icon } from '../components/Icon';
import { translateError } from '../utils/errors';

const STATUS_VARIANTS = {
  in_production: 'blue',
  awaiting_cutting: 'amber',
  invoiced: 'purple',
  finished: 'green',
  cancelled: 'slate',
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export function DashboardPage() {
  const { tenant, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [lowStockSupplies, setLowStockSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiRequest('/users', { token }).catch(() => []),
      fetchDashboardStats(token),
    ])
      .then(([usersData, dashboardData]) => {
        setUsers(usersData || []);
        setStats(dashboardData.stats);
        setRecentOrders(dashboardData.recentOrders);
        setProductionOrders(dashboardData.productionOrders);
        setLowStockSupplies(dashboardData.lowStockSupplies);
      })
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral da operação de {tenant?.name}</p>
        </div>
        <Link
          to="/pedidos"
          className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
        >
          <Icon name="plus" size={14} />
          Novo pedido
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-12 col-sm-6 col-xl-3" key={stat.label}>
            <div className="stat-card">
              <span className={`stat-icon stat-icon--${stat.accent}`}>
                <Icon name={stat.icon} size={20} />
              </span>
              <span className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-detail">{stat.detail}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Pedidos recentes</h2>
              <Link to="/pedidos">Ver todos</Link>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
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
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="orders-empty">
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.id}</strong>
                          <span className="dash-table-muted d-block">
                            {order.date}
                          </span>
                        </td>
                        <td>{order.client}</td>
                        <td>{order.items}</td>
                        <td>{currency.format(order.total)}</td>
                        <td>
                          <span
                            className={`status-badge status-badge--${STATUS_VARIANTS[order.status] ?? 'slate'}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dash-card mt-4">
            <div className="dash-card-header">
              <h2>Equipe</h2>
            </div>
            {error && <p className="form-error m-3">{error}</p>}
            <div className="table-responsive">
              <table className="dash-table">
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
                      <td>
                        {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Produção em andamento</h2>
              <Link to="/producao">Ver todas</Link>
            </div>
            <div>
              {loading ? (
                <div className="text-center p-3">Carregando...</div>
              ) : productionOrders.length === 0 ? (
                <div className="text-center p-3">Nenhuma ordem em produção.</div>
              ) : (
                productionOrders.map((item) => (
                  <div className="production-item" key={item.id}>
                    <div className="production-item-head">
                      <span className="production-item-name">{item.product}</span>
                      <span className="production-item-stage">{item.stage}</span>
                    </div>
                    <div className="production-item-meta">
                      {item.id} · {item.client}
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${item.progress}%` }}
                        aria-valuenow={item.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="dash-card mt-4">
            <div className="dash-card-header">
              <h2>Estoque baixo</h2>
              <Link to="/insumos">Ver insumos</Link>
            </div>
            <div>
              {loading ? (
                <div className="text-center p-3">Carregando...</div>
              ) : lowStockSupplies.length === 0 ? (
                <div className="text-center p-3">Todos os insumos com estoque normal.</div>
              ) : (
                lowStockSupplies.map((item) => (
                  <div className="stock-item" key={item.name}>
                    <span className="stock-item-name">{item.name}</span>
                    <span className="stock-item-qty">{item.qty}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
