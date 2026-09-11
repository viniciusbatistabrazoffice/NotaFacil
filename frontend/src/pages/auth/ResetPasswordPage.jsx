import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import styles from './auth.module.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword: form.newPassword });
      navigate('/login', {
        state: { message: 'Senha redefinida com sucesso. Faça login.' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.form}>
        <h2 className={styles.title}>Link inválido</h2>
        <p className={styles.hint}>
          O link de redefinição está incompleto ou expirado. Solicite um novo.
        </p>
        <div className={styles.links}>
          <Link to="/forgot-password">Solicitar novo link</Link>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Redefinir senha</h2>
      <Alert>{error}</Alert>
      <TextField
        id="newPassword"
        name="newPassword"
        label="Nova senha"
        type="password"
        value={form.newPassword}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar senha"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      <Button type="submit" loading={loading}>
        Redefinir senha
      </Button>
    </form>
  );
}
