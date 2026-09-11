import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import styles from './auth.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.status === 401 || err.status === 403
        ? 'Usuário ou senha inválidos.'
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Entrar</h2>
      <Alert type="success">{location.state?.message}</Alert>
      <Alert>{error}</Alert>
      <TextField
        id="username"
        name="username"
        label="Usuário"
        value={form.username}
        onChange={handleChange}
        autoComplete="username"
        required
      />
      <TextField
        id="password"
        name="password"
        label="Senha"
        type="password"
        value={form.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
      />
      <Button type="submit" loading={loading}>
        Entrar
      </Button>
      <div className={styles.links}>
        <Link to="/forgot-password">Esqueci a senha</Link>
        <Link to="/register">Criar conta</Link>
      </div>
    </form>
  );
}
