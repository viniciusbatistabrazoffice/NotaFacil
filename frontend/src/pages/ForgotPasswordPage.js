import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';

export function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: '' });
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email: form.email },
      });
      setResult(data);
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
        <p className="auth-subtitle">Recuperar senha</p>

        {result ? (
          <div className="form-success">
            <p>Se o e-mail existir, enviamos um link de redefinição.</p>
            {result.resetUrl && (
              <p>
                <a href={result.resetUrl}>Abrir link de redefinição (dev)</a>
              </p>
            )}
            <Link to="/login">Voltar para o login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>
          </form>
        )}

        {!result && (
          <div className="auth-links">
            <Link to="/login">Voltar para o login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
