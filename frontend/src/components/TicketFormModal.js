import { useState } from 'react';
import { Modal } from './Modal';
import { TICKET_PRIORITY_OPTIONS, TICKET_STATUS_OPTIONS } from '../utils/tickets';

export function TicketFormModal({ ticket, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(ticket);
  const [form, setForm] = useState({
    subject: ticket?.subject ?? '',
    requester: ticket?.requester ?? '',
    message: ticket?.message ?? '',
    priority: ticket?.priority ?? TICKET_PRIORITY_OPTIONS[0].value,
    status: ticket?.status ?? TICKET_STATUS_OPTIONS[0].value,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      subject: form.subject.trim(),
      requester: form.requester.trim(),
      message: form.message.trim(),
      priority: form.priority,
      status: form.status,
    });
  };

  return (
    <Modal title={isEdit ? 'Atualizar chamado' : 'Novo chamado'} busy={saving} onClose={onClose}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Assunto</span>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Resuma o problema ou dúvida"
              required
            />
          </label>
          <label className="form-field">
            <span>Solicitante</span>
            <input
              name="requester"
              value={form.requester}
              onChange={handleChange}
              placeholder="Nome do cliente ou empresa"
              required
            />
          </label>
          <label className="form-field">
            <span>Mensagem</span>
            <input
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Detalhe o chamado"
              required
            />
          </label>
          <label className="form-field">
            <span>Prioridade</span>
            <select name="priority" value={form.priority} onChange={handleChange} required>
              {TICKET_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {isEdit && (
            <label className="form-field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange} required>
                {TICKET_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Abrir chamado'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
