import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import styles from './auth.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login', {
        state: { message: 'Conta criada com sucesso. Faça login para continuar.' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Criar conta</h2>
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
        id="email"
        name="email"
        label="E-mail"
        type="email"
        value={form.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />
      <TextField
        id="password"
        name="password"
        label="Senha"
        type="password"
        value={form.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />
      <Button type="submit" loading={loading}>
        Registrar
      </Button>
      <div className={styles.links}>
        <Link to="/login">Já tenho conta</Link>
      </div>
    </form>
  );
}
