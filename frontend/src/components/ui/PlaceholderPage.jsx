import styles from './PlaceholderPage.module.css';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>

      <div className={styles.card}>
        <span className={styles.badge}>Em breve</span>
        <p className={styles.text}>Este módulo está em desenvolvimento.</p>
      </div>
    </div>
  );
}
