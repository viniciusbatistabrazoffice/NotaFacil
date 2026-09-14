import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  createOrder,
  deleteOrder,
  fetchOrders,
  updateOrder,
} from '../services/orders';
import { Icon } from '../components/Icon';
import { OrderFormModal } from '../components/OrderFormModal';
import { DeleteOrderModal } from '../components/DeleteOrderModal';
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
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, order: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchOrders(token, { status, search: debouncedSearch })
      .then(setOrders)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token, status, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    reload();
  }, [reload]);

  const openForm = (order = null) => {
    setFormState({ open: true, order });
    setSaveError('');
  };

  const closeForm = () => setFormState({ open: false, order: null });

  const handleSave = async (payload) => {
    setSaving(true);
    setSaveError('');
    try {
      if (formState.order) {
        await updateOrder(formState.order.id, payload, token);
      } else {
        await createOrder(payload, token);
      }
      closeForm();
      await reload();
    } catch (err) {
      setSaveError(translateError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteOrder(deleteTarget.id, token);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setDeleteError(translateError(err));
    } finally {
      setDeleting(false);
    }
  };

  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const inProductionCount = orders.filter((o) => o.status === 'in_production').length;
  const awaitingCuttingCount = orders.filter((o) => o.status === 'awaiting_cutting').length;

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Acompanhe os pedidos da sua confecção</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo pedido
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--blue">
              <Icon name="orders" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{orders.length}</span>
              <span className="stat-label">Pedidos encontrados</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--amber">
              <Icon name="scissors" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{awaitingCuttingCount}</span>
              <span className="stat-label">Aguardando corte</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--purple">
              <Icon name="scissors" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{inProductionCount}</span>
              <span className="stat-label">Em produção</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--green">
              <Icon name="financial" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{formatCurrency(totalValue)}</span>
              <span className="stat-label">Valor total</span>
            </span>
          </div>
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
                <th className="users-col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="orders-empty">
                    Carregando pedidos...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="orders-empty">
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
                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          title="Atualizar"
                          aria-label={`Atualizar pedido ${formatOrderId(order.id)}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            openForm(order);
                          }}
                        >
                          <Icon name="pencil" size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          title="Remover"
                          aria-label={`Remover pedido ${formatOrderId(order.id)}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeleteError('');
                            setDeleteTarget(order);
                          }}
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formState.open && (
        <OrderFormModal
          order={formState.order}
          saving={saving}
          error={saveError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteOrderModal
          order={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

