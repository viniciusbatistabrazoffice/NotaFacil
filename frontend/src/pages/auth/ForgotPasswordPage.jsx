import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';
import styles from './auth.module.css';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: '', text: '' });
    setLoading(true);
    try {
      const { message } = await authService.forgotPassword(identifier);
      setFeedback({ type: 'success', text: message });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Recuperar senha</h2>
      <p className={styles.hint}>
        Informe seu usuário ou e-mail para receber as instruções de redefinição.
      </p>
      <Alert type={feedback.type || 'error'}>{feedback.text}</Alert>
      <TextField
        id="identifier"
        name="identifier"
        label="Usuário ou e-mail"
        value={identifier}
        onChange={(event) => setIdentifier(event.target.value)}
        required
      />
      <Button type="submit" loading={loading}>
        Enviar instruções
      </Button>
      <div className={styles.links}>
        <Link to="/login">Voltar ao login</Link>
      </div>
    </form>
  );
}
