import { useAuth } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';

const placeholderCards = [
  { title: 'Notas emitidas', value: '—' },
  { title: 'Pendentes', value: '—' },
  { title: 'Faturamento (mês)', value: '—' },
  { title: 'Clientes ativos', value: '—' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className={styles.header}>
        <h2>Olá, {user?.username}</h2>
        <p>Resumo das suas notas e atividades recentes.</p>
      </div>
      <div className={styles.grid}>
        {placeholderCards.map((card) => (
          <article key={card.title} className={styles.card}>
            <h3>{card.title}</h3>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
