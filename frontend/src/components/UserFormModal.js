import { useState } from 'react';
import { Modal } from './Modal';

export function UserFormModal({ user, saving, error, onClose, onSubmit }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'password' || name === 'confirmPassword') {
      setLocalError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError('As senhas não coincidem.');
      return;
    }
    const payload = { name: form.name.trim(), email: form.email.trim() };
    if (form.password) {
      payload.password = form.password;
    }
    onSubmit(payload);
  };

  return (
    <Modal
      title={isEdit ? 'Editar usuário' : 'Novo usuário'}
      busy={saving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Nome</span>
            <input
              name="name"
              autoComplete="off"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          </label>
          <label className="form-field">
            <span>E-mail</span>
            <input
              name="email"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@empresa.com"
              required
            />
          </label>
          <label className="form-field">
            <span>{isEdit ? 'Nova senha' : 'Senha'}</span>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder={
                isEdit ? 'Deixe em branco para manter a atual' : '••••••••'
              }
              required={!isEdit}
            />
          </label>
          <label className="form-field">
            <span>Confirmar senha</span>
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={
                isEdit ? 'Repita a nova senha' : 'Repita a senha'
              }
              required={!isEdit || form.password !== ''}
            />
          </label>
          {(localError || error) && (
            <p className="form-error">{localError || error}</p>
          )}
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
          <button
            type="submit"
            className="dash-btn dash-btn--primary"
            disabled={saving}
          >
            {saving
              ? 'Salvando...'
              : isEdit
                ? 'Salvar alterações'
                : 'Criar usuário'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
