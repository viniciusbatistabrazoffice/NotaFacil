import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SupplierFormModal } from '../components/SupplierFormModal';
import { DeleteSupplierModal } from '../components/DeleteSupplierModal';
import { SuppliersTable } from '../components/SuppliersTable';
import { useSuppliers } from '../hooks/useSuppliers';
import { translateError } from '../utils/errors';
import { filterSuppliers } from '../utils/suppliers';

export function SuppliersPage() {
  const { suppliers, loading, error, saveSupplier, deleteSupplier } = useSuppliers();
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, supplier: null });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filteredSuppliers = filterSuppliers(suppliers, search);

  const openForm = (supplier = null) => {
    setFormState({ open: true, supplier });
    setFormError('');
  };

  const closeForm = () => setFormState({ open: false, supplier: null });

  const openDelete = (supplier) => {
    setDeleteTarget(supplier);
    setDeleteError('');
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      await saveSupplier(formState.supplier?.id ?? null, payload);
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
      await deleteSupplier(deleteTarget.id);
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
          <h1>Fornecedores</h1>
          <p>Gerencie os fornecedores da sua confecção</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo fornecedor
        </button>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por nome, categoria ou CNPJ/CPF..."
            aria-label="Buscar fornecedores"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <SuppliersTable
        suppliers={filteredSuppliers}
        loading={loading}
        error={error}
        onEdit={openForm}
        onDelete={openDelete}
      />

      {formState.open && (
        <SupplierFormModal
          supplier={formState.supplier}
          saving={saving}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteSupplierModal
          supplier={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
