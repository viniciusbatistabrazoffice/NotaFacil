import styles from './Alert.module.css';

export default function Alert({ type = 'error', children }) {
  if (!children) return null;
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      {children}
    </div>
  );
}
