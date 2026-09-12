import { useEffect, useState } from 'react';
import styles from './Splash.module.css';

const MIN_DURATION_MS = 900;
const FADE_MS = 350;

export default function Splash() {
  const [state, setState] = useState('visible');

  useEffect(() => {
    const showTimer = setTimeout(() => setState('leaving'), MIN_DURATION_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (state !== 'leaving') return undefined;
    const hideTimer = setTimeout(() => setState('gone'), FADE_MS);
    return () => clearTimeout(hideTimer);
  }, [state]);

  if (state === 'gone') return null;

  return (
    <div className={`${styles.splash} ${state === 'leaving' ? styles.leaving : ''}`}>
      <span className={styles.brand}>NotaFácil</span>
      <span className={styles.tag}>Gestão para confecção</span>
      <span className={styles.spinner} />
    </div>
  );
}
