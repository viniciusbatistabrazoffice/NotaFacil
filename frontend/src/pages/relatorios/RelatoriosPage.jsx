import styles from './RelatoriosPage.module.css';

const stats = [
  { label: 'Total emitido', value: 'R$ 4.450,00' },
  { label: 'Notas este mês', value: '3' },
  { label: 'Clientes atendidos', value: '2' },
  { label: 'Notas pendentes', value: '1' },
];

export default function RelatoriosPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Relatórios</h2>
        <p>Visão geral dos seus números e performance.</p>
      </header>

      <div className={styles.grid}>
        {stats.map((stat) => (
          <article key={stat.label} className={styles.card}>
            <span className={styles.label}>{stat.label}</span>
            <strong className={styles.value}>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.chart}>
        <h3>Resumo mensal</h3>
        <div className={styles.barGroup}>
          <div className={styles.barWrapper}>
            <span className={styles.barLabel}>Jan</span>
            <div className={styles.bar} style={{ width: '40%' }} />
          </div>
          <div className={styles.barWrapper}>
            <span className={styles.barLabel}>Fev</span>
            <div className={styles.bar} style={{ width: '65%' }} />
          </div>
          <div className={styles.barWrapper}>
            <span className={styles.barLabel}>Mar</span>
            <div className={styles.bar} style={{ width: '80%' }} />
          </div>
          <div className={styles.barWrapper}>
            <span className={styles.barLabel}>Abr</span>
            <div className={styles.bar} style={{ width: '55%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
