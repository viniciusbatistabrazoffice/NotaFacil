import { useState } from 'react';
import { Modal } from './Modal';
import { PRODUCTION_STAGE_OPTIONS } from '../utils/production';

export function ProductionFormModal({ item, saving, error, onClose, onSubmit }) {
  const [form, setForm] = useState({
    stage: item.stage,
    progress: item.progress,
    dueDate: item.dueDate,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      stage: form.stage,
      progress: Math.min(100, Math.max(0, Number(form.progress))),
      dueDate: form.dueDate,
    });
  };

  return (
    <Modal title={`Atualizar ${item.id}`} busy={saving} onClose={onClose}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Etapa</span>
            <select name="stage" value={form.stage} onChange={handleChange} required>
              {PRODUCTION_STAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Progresso (%)</span>
            <input
              name="progress"
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-field">
            <span>Previsão de entrega</span>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
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
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
