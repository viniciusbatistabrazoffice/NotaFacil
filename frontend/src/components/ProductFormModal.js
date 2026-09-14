import { useState } from 'react';
import { Modal } from './Modal';

export function ProductFormModal({ product, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name ?? '',
    code: product?.code ?? '',
    category: product?.category ?? '',
    price: product?.price ?? '',
    sizes: product?.sizes ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name.trim(),
      code: form.code.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      sizes: form.sizes.trim(),
    });
  };

  return (
    <Modal title={isEdit ? 'Editar produto' : 'Novo produto'} busy={saving} onClose={onClose}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Nome</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome do produto"
              required
            />
          </label>
          <label className="form-field">
            <span>Código</span>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Ex.: CB-001"
              required
            />
          </label>
          <label className="form-field">
            <span>Categoria</span>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ex.: Camisetas"
              required
            />
          </label>
          <label className="form-field">
            <span>Preço</span>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="0,00"
              required
            />
          </label>
          <label className="form-field">
            <span>Tamanhos</span>
            <input
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="Ex.: P, M, G, GG"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="user-modal-footer">
          <button
            type="button"
            className="dash-btn dash-btn--ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button type="submit" className="dash-btn dash-btn--primary" disabled={saving}>
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
