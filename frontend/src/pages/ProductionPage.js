import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  deleteProduction,
  fetchProductions,
  updateProduction,
} from '../services/productions';
import { Icon } from '../components/Icon';
import { ProductionFormModal } from '../components/ProductionFormModal';
import { DeleteProductionModal } from '../components/DeleteProductionModal';
import { translateError } from '../utils/errors';
import { formatDate, formatOrderId } from '../utils/orders';
import {
  PRODUCTION_STAGE_OPTIONS,
  getStageLabel,
  getStageVariant,
} from '../utils/production';

export function ProductionPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [stage, setStage] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchProductions(token, { stage, search: debouncedSearch })
      .then(setItems)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token, stage, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleUpdate = async (payload) => {
    setSaving(true);
    setSaveError('');
    try {
      await updateProduction(editTarget.id, payload, token);
      setEditTarget(null);
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
      await deleteProduction(deleteTarget.id, token);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setDeleteError(translateError(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Produção</h1>
          <p>Acompanhe as ordens de produção em andamento</p>
        </div>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por produto, cliente ou OP..."
            aria-label="Buscar ordens de produção"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="orders-filter-select"
          aria-label="Filtrar por etapa"
          value={stage}
          onChange={(event) => setStage(event.target.value)}
        >
          <option value="">Todas as etapas</option>
          {PRODUCTION_STAGE_OPTIONS.map((option) => (
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
                <th>OP</th>
                <th>Produto</th>
                <th>Cliente</th>
                <th>Pedido</th>
                <th>Etapa</th>
                <th>Progresso</th>
                <th className="users-col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="orders-empty">
                    Carregando ordens de produção...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="orders-empty">
                    Nenhuma ordem de produção encontrada.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.id}</strong>
                      <span className="dash-table-muted d-block">
                        {formatDate(item.dueDate)}
                      </span>
                    </td>
                    <td>{item.product}</td>
                    <td>{item.client}</td>
                    <td>
                      <Link to={`/pedidos/${item.orderId}`}>
                        {formatOrderId(item.orderId)}
                      </Link>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${getStageVariant(item.stage)}`}
                      >
                        {getStageLabel(item.stage)}
                      </span>
                    </td>
                    <td>
                      <div className="progress" style={{ minWidth: 100 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${item.progress}%` }}
                          aria-valuenow={item.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <span className="dash-table-muted">{item.progress}%</span>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          title="Atualizar"
                          aria-label={`Atualizar ${item.id}`}
                          onClick={() => {
                            setSaveError('');
                            setEditTarget(item);
                          }}
                        >
                          <Icon name="pencil" size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          title="Remover"
                          aria-label={`Remover ${item.id}`}
                          onClick={() => {
                            setDeleteError('');
                            setDeleteTarget(item);
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

      {editTarget && (
        <ProductionFormModal
          item={editTarget}
          saving={saving}
          error={saveError}
          onClose={() => setEditTarget(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteTarget && (
        <DeleteProductionModal
          item={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
