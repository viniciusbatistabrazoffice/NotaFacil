import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translateError } from '../utils/errors';

export function LoginPage() {
  const { login, isAuthenticated, tenant } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenant: tenant?.slug ?? '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">NotaFácil</h1>
        <p className="auth-subtitle">Entre na sua conta</p>

        <form onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Empresa</span>
            <input
              name="tenant"
              value={form.tenant}
              onChange={handleChange}
              placeholder="minha-empresa"
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
              placeholder="voce@empresa.com"
              required
            />
          </label>

          <label className="form-field">
            <span>Senha</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">Esqueci minha senha</Link>
          <Link to="/register">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}
