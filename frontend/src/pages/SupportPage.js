import { useCallback, useEffect, useState } from 'react';
import {
  createMockTicket,
  deleteMockTicket,
  fetchMockTickets,
  updateMockTicket,
} from '../services/mockTickets';
import { Icon } from '../components/Icon';
import { TicketFormModal } from '../components/TicketFormModal';
import { DeleteTicketModal } from '../components/DeleteTicketModal';
import { translateError } from '../utils/errors';
import { formatDate } from '../utils/orders';
import {
  TICKET_STATUS_OPTIONS,
  getTicketPriorityLabel,
  getTicketPriorityVariant,
  getTicketStatusLabel,
  getTicketStatusVariant,
} from '../utils/tickets';

export function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({ open: false, ticket: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    return fetchMockTickets({ status, search: debouncedSearch })
      .then(setTickets)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [status, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    reload();
  }, [reload]);

  const openForm = (ticket = null) => {
    setFormState({ open: true, ticket });
    setSaveError('');
  };

  const closeForm = () => setFormState({ open: false, ticket: null });

  const handleSave = async (payload) => {
    setSaving(true);
    setSaveError('');
    try {
      if (formState.ticket) {
        await updateMockTicket(formState.ticket.id, payload);
      } else {
        await createMockTicket(payload);
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
      await deleteMockTicket(deleteTarget.id);
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      setDeleteError(translateError(err));
    } finally {
      setDeleting(false);
    }
  };

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Central de Atendimento</h1>
          <p>Acompanhe os chamados de suporte da sua empresa</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo chamado
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--blue">
              <Icon name="help" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{tickets.length}</span>
              <span className="stat-label">Chamados encontrados</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--amber">
              <Icon name="help" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{openCount}</span>
              <span className="stat-label">Abertos</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--purple">
              <Icon name="help" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{inProgressCount}</span>
              <span className="stat-label">Em andamento</span>
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <span className="stat-icon stat-icon--green">
              <Icon name="help" size={20} />
            </span>
            <span className="stat-info">
              <span className="stat-value">{resolvedCount}</span>
              <span className="stat-label">Resolvidos</span>
            </span>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por assunto ou solicitante..."
            aria-label="Buscar chamados"
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
          {TICKET_STATUS_OPTIONS.map((option) => (
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
                <th>Chamado</th>
                <th>Solicitante</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th className="users-col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="orders-empty">
                    Carregando chamados...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="orders-empty">
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <strong>{ticket.subject}</strong>
                      <span className="dash-table-muted d-block">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </td>
                    <td>{ticket.requester}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${getTicketPriorityVariant(ticket.priority)}`}
                      >
                        {getTicketPriorityLabel(ticket.priority)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${getTicketStatusVariant(ticket.status)}`}
                      >
                        {getTicketStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          title="Atualizar"
                          aria-label={`Atualizar chamado ${ticket.subject}`}
                          onClick={() => openForm(ticket)}
                        >
                          <Icon name="pencil" size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          title="Remover"
                          aria-label={`Remover chamado ${ticket.subject}`}
                          onClick={() => {
                            setDeleteError('');
                            setDeleteTarget(ticket);
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
        <TicketFormModal
          ticket={formState.ticket}
          saving={saving}
          error={saveError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteTicketModal
          ticket={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
