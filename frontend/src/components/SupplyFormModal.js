import { useState } from 'react';
import { Modal } from './Modal';

export function SupplyFormModal({ supply, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(supply);
  const [form, setForm] = useState({
    name: supply?.name ?? '',
    category: supply?.category ?? '',
    unit: supply?.unit ?? '',
    stock: supply?.stock ?? '',
    minStock: supply?.minStock ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      unit: form.unit.trim(),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
    });
  };

  return (
    <Modal title={isEdit ? 'Editar insumo' : 'Novo insumo'} busy={saving} onClose={onClose}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Nome</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex.: Tecido Oxford — Azul marinho"
              required
            />
          </label>
          <label className="form-field">
            <span>Categoria</span>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ex.: Tecido, Aviamento, Linha"
              required
            />
          </label>
          <label className="form-field">
            <span>Unidade</span>
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Ex.: m, un, cone"
              required
            />
          </label>
          <label className="form-field">
            <span>Estoque atual</span>
            <input
              name="stock"
              type="number"
              min="0"
              step="0.01"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span>Estoque mínimo</span>
            <input
              name="minStock"
              type="number"
              min="0"
              step="0.01"
              value={form.minStock}
              onChange={handleChange}
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar insumo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
