import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const tenant = searchParams.get('tenant') ?? '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { tenant, token, password: form.password },
      });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  const missingParams = !token || !tenant;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">NotaFácil</h1>
        <p className="auth-subtitle">Definir nova senha</p>

        {missingParams ? (
          <div className="form-error">
            <p>Link inválido. Solicite uma nova redefinição de senha.</p>
            <Link to="/forgot-password">Recuperar senha</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Nova senha</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>

            <label className="form-field">
              <span>Confirmar senha</span>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar senha'}
            </button>
          </form>
        )}

        {!missingParams && (
          <div className="auth-links">
            <Link to="/login">Voltar para o login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
