import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SupplyFormModal } from '../components/SupplyFormModal';
import { DeleteSupplyModal } from '../components/DeleteSupplyModal';
import { SuppliesTable } from '../components/SuppliesTable';
import { useSupplies } from '../hooks/useSupplies';
import { translateError } from '../utils/errors';
import { filterSupplies } from '../utils/supplies';

export function SuppliesPage() {
  const { supplies, loading, error, saveSupply, deleteSupply } = useSupplies();
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, supply: null });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filteredSupplies = filterSupplies(supplies, search);

  const openForm = (supply = null) => {
    setFormState({ open: true, supply });
    setFormError('');
  };

  const closeForm = () => setFormState({ open: false, supply: null });

  const openDelete = (supply) => {
    setDeleteTarget(supply);
    setDeleteError('');
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      await saveSupply(formState.supply?.id ?? null, payload);
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
      await deleteSupply(deleteTarget.id);
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
          <h1>Tecidos e Insumos</h1>
          <p>Controle o estoque de tecidos e insumos da sua confecção</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo insumo
        </button>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por nome ou categoria..."
            aria-label="Buscar insumos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <SuppliesTable
        supplies={filteredSupplies}
        loading={loading}
        error={error}
        onEdit={openForm}
        onDelete={openDelete}
      />

      {formState.open && (
        <SupplyFormModal
          supply={formState.supply}
          saving={saving}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteSupplyModal
          supply={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
