import { useState } from 'react';
import { Icon } from '../components/Icon';
import { ClientFormModal } from '../components/ClientFormModal';
import { DeleteClientModal } from '../components/DeleteClientModal';
import { ClientsTable } from '../components/ClientsTable';
import { useClients } from '../hooks/useClients';
import { translateError } from '../utils/errors';
import { filterClients } from '../utils/clients';

export function ClientsPage() {
  const { clients, loading, error, saveClient, deleteClient } = useClients();
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, client: null });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filteredClients = filterClients(clients, search);

  const openForm = (client = null) => {
    setFormState({ open: true, client });
    setFormError('');
  };

  const closeForm = () => setFormState({ open: false, client: null });

  const openDelete = (client) => {
    setDeleteTarget(client);
    setDeleteError('');
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      await saveClient(formState.client?.id ?? null, payload);
      closeForm();
    } catch (err) {
      setFormError(translateError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteClient(deleteTarget.id);
      setDeleteTarget(null);
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
          <h1>Clientes</h1>
          <p>Gerencie os clientes da sua confecção</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo cliente
        </button>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por nome, e-mail ou CNPJ/CPF..."
            aria-label="Buscar clientes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <ClientsTable
        clients={filteredClients}
        loading={loading}
        error={error}
        onEdit={openForm}
        onDelete={openDelete}
      />

      {formState.open && (
        <ClientFormModal
          client={formState.client}
          saving={saving}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteClientModal
          client={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
