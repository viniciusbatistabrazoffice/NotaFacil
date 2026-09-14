import { useState } from 'react';
import { Icon } from '../components/Icon';
import { ProductFormModal } from '../components/ProductFormModal';
import { DeleteProductModal } from '../components/DeleteProductModal';
import { ProductsTable } from '../components/ProductsTable';
import { useProducts } from '../hooks/useProducts';
import { translateError } from '../utils/errors';
import { filterProducts } from '../utils/products';

export function ProductsPage() {
  const { products, loading, error, saveProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, product: null });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filteredProducts = filterProducts(products, search);

  const openForm = (product = null) => {
    setFormState({ open: true, product });
    setFormError('');
  };

  const closeForm = () => setFormState({ open: false, product: null });

  const openDelete = (product) => {
    setDeleteTarget(product);
    setDeleteError('');
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      await saveProduct(formState.product?.id ?? null, payload);
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
      await deleteProduct(deleteTarget.id);
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
          <h1>Modelos e Produtos</h1>
          <p>Gerencie os modelos e produtos da sua confecção</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo produto
        </button>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por nome, código ou categoria..."
            aria-label="Buscar produtos"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <ProductsTable
        products={filteredProducts}
        loading={loading}
        error={error}
        onEdit={openForm}
        onDelete={openDelete}
      />

      {formState.open && (
        <ProductFormModal
          product={formState.product}
          saving={saving}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteProductModal
          product={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
