import { memo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './DashboardLayout.module.css';

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const Sidebar = memo(function Sidebar({ user, logout }) {
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const avatarInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'US';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandBlock}>
        <span className={styles.brand}>NotaFácil</span>
        <span className={styles.brandTag}>Gestão de notas</span>
      </div>

      <div className={styles.profile}>
        <div className={styles.avatar}>{avatarInitials}</div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>{user?.username || 'Usuário'}</span>
          <span className={styles.profileEmail}>{user?.email || 'usuario@notafacil.com'}</span>
          <span className={styles.profileStatus}>
            <span className={styles.statusDot} /> Online
          </span>
        </div>
      </div>

      <div className={styles.navGroup}>
        <span className={styles.navTitle}>Principal</span>
        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={linkClass}>
            <ChartIcon /> Visão geral
          </NavLink>
          <NavLink to="/notas" className={linkClass}>
            <FileTextIcon /> Notas
          </NavLink>
          <NavLink to="/relatorios" className={linkClass}>
            <BarChartIcon /> Relatórios
          </NavLink>
        </nav>
      </div>

      <div className={styles.navGroup}>
        <span className={styles.navTitle}>Sistema</span>
        <nav className={styles.nav}>
          <NavLink to="/configuracoes" className={linkClass}>
            <SettingsIcon /> Configurações
          </NavLink>
        </nav>
      </div>

      <div className={styles.sidebarFooter}>
        <button type="button" className={styles.logout} onClick={logout}>
          <LogoutIcon /> Sair
        </button>
        <span className={styles.version}>v1.0.0</span>
      </div>
    </aside>
  );
});

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <Sidebar user={user} logout={logout} />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.user}>{user?.username}</span>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
