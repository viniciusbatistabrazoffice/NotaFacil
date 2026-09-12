import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { Icon } from '../components/Icon';

const STATS = [
  {
    icon: 'orders',
    accent: 'blue',
    label: 'Pedidos em aberto',
    value: '24',
    detail: '+4 esta semana',
  },
  {
    icon: 'scissors',
    accent: 'purple',
    label: 'Ordens em produção',
    value: '8',
    detail: '3 em fase de corte',
  },
  {
    icon: 'invoice',
    accent: 'amber',
    label: 'Notas emitidas no mês',
    value: '132',
    detail: '+8% vs. mês anterior',
  },
  {
    icon: 'financial',
    accent: 'green',
    label: 'Faturamento no mês',
    value: 'R$ 86.400',
    detail: '+15% vs. mês anterior',
  },
];

const RECENT_ORDERS = [
  { id: '#2051', client: 'Loja Bella Moda', items: 240, total: 12800, date: '10/09/2026', status: 'Em produção' },
  { id: '#2050', client: 'Executiva Sul', items: 180, total: 15300, date: '09/09/2026', status: 'Aguardando corte' },
  { id: '#2049', client: 'Denim Store', items: 320, total: 22400, date: '08/09/2026', status: 'Faturado' },
  { id: '#2048', client: 'Veste Bem', items: 150, total: 6750, date: '08/09/2026', status: 'Finalizado' },
  { id: '#2047', client: 'Atacado Prime', items: 500, total: 31000, date: '05/09/2026', status: 'Em produção' },
];

const PRODUCTION = [
  { id: 'OP-1042', product: 'Vestido midi floral', client: 'Bella Moda', stage: 'Costura', progress: 65 },
  { id: 'OP-1043', product: 'Camisa social slim', client: 'Executiva Sul', stage: 'Corte', progress: 30 },
  { id: 'OP-1044', product: 'Calça jeans feminina', client: 'Denim Store', stage: 'Acabamento', progress: 85 },
  { id: 'OP-1045', product: 'Blusa malha canelada', client: 'Veste Bem', stage: 'Costura', progress: 50 },
];

const LOW_STOCK = [
  { name: 'Tecido Oxford — Azul marinho', qty: '12 m' },
  { name: 'Linha poliéster — Branca', qty: '3 cones' },
  { name: 'Botão encapado 12mm', qty: '50 un' },
  { name: 'Zíper invisível 60cm — Preto', qty: '18 un' },
];

const STATUS_VARIANTS = {
  'Em produção': 'blue',
  'Aguardando corte': 'amber',
  'Faturado': 'purple',
  'Finalizado': 'green',
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

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
        {STATS.map((stat) => (
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
                  {RECENT_ORDERS.map((order) => (
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
                  ))}
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
              {PRODUCTION.map((item) => (
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
              ))}
            </div>
          </div>

          <div className="dash-card mt-4">
            <div className="dash-card-header">
              <h2>Estoque baixo</h2>
              <Link to="/insumos">Ver insumos</Link>
            </div>
            <div>
              {LOW_STOCK.map((item) => (
                <div className="stock-item" key={item.name}>
                  <span className="stock-item-name">{item.name}</span>
                  <span className="stock-item-qty">{item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
