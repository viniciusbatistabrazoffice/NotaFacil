import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  createInvoice,
  deleteInvoice,
  fetchInvoices,
  updateInvoice,
} from '../services/invoices';
import { Icon } from '../components/Icon';
import { InvoiceFormModal } from '../components/InvoiceFormModal';
import { DeleteInvoiceModal } from '../components/DeleteInvoiceModal';
import { translateError } from '../utils/errors';
import { formatCurrency, formatDate, formatOrderId } from '../utils/orders';
import {
  INVOICE_STATUS_OPTIONS,
  formatInvoiceNumber,
  getInvoiceStatusLabel,
  getInvoiceStatusVariant,
} from '../utils/invoices';

export function InvoicesPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, invoice: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchInvoices(token, { status, search: debouncedSearch })
      .then(setInvoices)
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

  const openForm = (invoice = null) => {
    setFormState({ open: true, invoice });
    setSaveError('');
  };

  const closeForm = () => setFormState({ open: false, invoice: null });

  const handleSave = async (payload) => {
    setSaving(true);
    setSaveError('');
    try {
      if (formState.invoice) {
        await updateInvoice(formState.invoice.id, payload, token);
      } else {
        await createInvoice(payload, token);
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
      await deleteInvoice(deleteTarget.id, token);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setDeleteError(translateError(err));
    } finally {
      setDeleting(false);
    }
  };

  const totalValue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const issuedCount = invoices.filter((i) => i.status === 'issued').length;
  const cancelledCount = invoices.filter((i) => i.status === 'cancelled').length;

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Notas Fiscais</h1>
          <p>Acompanhe as notas fiscais emitidas para os pedidos</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Nova nota fiscal
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--blue">
              <Icon name="invoice" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{invoices.length}</span>
              <span className="stat-label">Notas encontradas</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--green">
              <Icon name="invoice" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{issuedCount}</span>
              <span className="stat-label">Emitidas</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--amber">
              <Icon name="invoice" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{cancelledCount}</span>
              <span className="stat-label">Canceladas</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--purple">
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
            placeholder="Buscar por cliente, número da nota ou pedido..."
            aria-label="Buscar notas fiscais"
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
          {INVOICE_STATUS_OPTIONS.map((option) => (
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
                <th>Nota Fiscal</th>
                <th>Cliente</th>
                <th>Pedido</th>
                <th>Total</th>
                <th>Status</th>
                <th className="users-col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="orders-empty">
                    Carregando notas fiscais...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="orders-empty">
                    Nenhuma nota fiscal encontrada.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => navigate(`/notas-fiscais/${invoice.id}`)}
                  >
                    <td>
                      <strong>{formatInvoiceNumber(invoice.number)}</strong>
                      <span className="dash-table-muted d-block">
                        {formatDate(invoice.issueDate)}
                      </span>
                    </td>
                    <td>{invoice.clientName}</td>
                    <td>{formatOrderId(invoice.orderId)}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${getInvoiceStatusVariant(invoice.status)}`}
                      >
                        {getInvoiceStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          title="Atualizar"
                          aria-label={`Atualizar ${formatInvoiceNumber(invoice.number)}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            openForm(invoice);
                          }}
                        >
                          <Icon name="pencil" size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          title="Remover"
                          aria-label={`Remover ${formatInvoiceNumber(invoice.number)}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setDeleteError('');
                            setDeleteTarget(invoice);
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
        <InvoiceFormModal
          invoice={formState.invoice}
          saving={saving}
          error={saveError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteInvoiceModal
          invoice={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
