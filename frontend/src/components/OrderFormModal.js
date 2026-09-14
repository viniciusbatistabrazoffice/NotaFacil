import { useState } from 'react';
import { Modal } from './Modal';
import { ORDER_STATUS_OPTIONS, formatOrderId } from '../utils/orders';

export function OrderFormModal({ order, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(order);
  const [form, setForm] = useState({
    clientName: order?.clientName ?? '',
    status: order?.status ?? ORDER_STATUS_OPTIONS[0].value,
    deliveryDate: order?.deliveryDate ?? '',
    notes: order?.notes ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      clientName: form.clientName.trim(),
      status: form.status,
      deliveryDate: form.deliveryDate || null,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <Modal
      title={isEdit ? `Atualizar pedido ${formatOrderId(order.id)}` : 'Novo pedido'}
      busy={saving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Cliente</span>
            <input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              placeholder="Nome do cliente"
              required
            />
          </label>
          <label className="form-field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange} required>
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Previsão de entrega</span>
            <input
              name="deliveryDate"
              type="date"
              value={form.deliveryDate}
              onChange={handleChange}
            />
          </label>
          <label className="form-field">
            <span>Observações</span>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Observações do pedido"
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar pedido'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

