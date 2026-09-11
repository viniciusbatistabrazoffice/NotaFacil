import styles from './Button.module.css';

export default function Button({ children, loading = false, variant = 'primary', ...props }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
