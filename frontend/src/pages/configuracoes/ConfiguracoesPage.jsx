import { useState } from 'react';
import styles from './ConfiguracoesPage.module.css';

export default function ConfiguracoesPage() {
  const [form, setForm] = useState({
    companyName: '',
    cnpj: '',
    email: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Configurações</h2>
        <p>Gerencie os dados da sua empresa e conta.</p>
      </header>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <label className={styles.field}>
          <span>Razão social</span>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Nome da empresa"
          />
        </label>

        <label className={styles.field}>
          <span>CNPJ</span>
          <input
            type="text"
            name="cnpj"
            value={form.cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
          />
        </label>

        <label className={styles.field}>
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contato@empresa.com"
          />
        </label>

        <button type="submit" className={styles.saveButton}>
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
