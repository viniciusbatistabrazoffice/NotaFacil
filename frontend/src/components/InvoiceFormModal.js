import { useState } from 'react';
import { Modal } from './Modal';
import { INVOICE_STATUS_OPTIONS, formatInvoiceNumber } from '../utils/invoices';

export function InvoiceFormModal({ invoice, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(invoice);
  const [form, setForm] = useState({
    clientName: invoice?.clientName ?? '',
    orderId: invoice?.orderId ?? '',
    status: invoice?.status ?? INVOICE_STATUS_OPTIONS[0].value,
    issueDate: invoice?.issueDate ?? new Date().toISOString().slice(0, 10),
    total: invoice?.total ?? '',
    notes: invoice?.notes ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      status: form.status,
      issueDate: form.issueDate,
      notes: form.notes.trim() || null,
    };
    if (!isEdit) {
      payload.clientName = form.clientName.trim();
      payload.orderId = Number(form.orderId);
      payload.total = Number(form.total);
    }
    onSubmit(payload);
  };

  return (
    <Modal
      title={isEdit ? `Atualizar ${formatInvoiceNumber(invoice.number)}` : 'Nova nota fiscal'}
      busy={saving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          {!isEdit && (
            <>
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
                <span>Número do pedido</span>
                <input
                  name="orderId"
                  type="number"
                  min="1"
                  value={form.orderId}
                  onChange={handleChange}
                  placeholder="Ex.: 1042"
                  required
                />
              </label>
              <label className="form-field">
                <span>Valor total</span>
                <input
                  name="total"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.total}
                  onChange={handleChange}
                  placeholder="0,00"
                  required
                />
              </label>
            </>
          )}
          <label className="form-field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange} required>
              {INVOICE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Data de emissão</span>
            <input
              name="issueDate"
              type="date"
              value={form.issueDate}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span>Observações</span>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Observações da nota fiscal"
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Emitir nota'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

