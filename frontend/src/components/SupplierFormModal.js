import { useState } from 'react';
import { Modal } from './Modal';

export function SupplierFormModal({ supplier, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(supplier);
  const [form, setForm] = useState({
    name: supplier?.name ?? '',
    document: supplier?.document ?? '',
    category: supplier?.category ?? '',
    email: supplier?.email ?? '',
    phone: supplier?.phone ?? '',
    city: supplier?.city ?? '',
    state: supplier?.state ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name.trim(),
      document: form.document.trim(),
      category: form.category.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
    });
  };

  return (
    <Modal
      title={isEdit ? 'Editar fornecedor' : 'Novo fornecedor'}
      busy={saving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Nome / Razão social</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome do fornecedor"
              required
            />
          </label>
          <label className="form-field">
            <span>CNPJ/CPF</span>
            <input
              name="document"
              value={form.document}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              required
            />
          </label>
          <label className="form-field">
            <span>Categoria</span>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ex.: Tecidos, Aviamentos"
              required
            />
          </label>
          <label className="form-field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="fornecedor@empresa.com"
              required
            />
          </label>
          <label className="form-field">
            <span>Telefone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              required
            />
          </label>
          <label className="form-field">
            <span>Cidade</span>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Cidade"
              required
            />
          </label>
          <label className="form-field">
            <span>UF</span>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="UF"
              maxLength={2}
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar fornecedor'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
