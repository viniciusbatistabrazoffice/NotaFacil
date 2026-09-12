import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { translateError } from '../utils/errors';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '',
    name: '',
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
      await register(form);
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
        <p className="auth-subtitle">Crie sua empresa e sua conta de administrador</p>

        <form onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Nome da empresa</span>
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Minha Empresa"
              required
            />
          </label>

          <label className="form-field">
            <span>Seu nome</span>
            <input
              name="name"
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
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Já tenho conta</Link>
        </div>
      </div>
    </div>
  );
}
