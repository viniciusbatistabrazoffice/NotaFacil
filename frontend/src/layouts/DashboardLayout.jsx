import { memo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statusOptions, countByStatus } from '../data/notes';
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

const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const ShirtIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
);

const ScissorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);

const CrownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

const CollapseIcon = ({ collapsed }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
  </svg>
);

const Sidebar = memo(function Sidebar({ user, logout, collapsed, onToggle }) {
  const location = useLocation();
  const activeStatus =
    location.pathname === '/notas'
      ? new URLSearchParams(location.search).get('status')
      : null;

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const avatarInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'US';

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.brandRow}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>NotaFácil</span>
          <span className={styles.brandTag}>Gestão para confecção</span>
        </div>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
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

      <NavLink to="/emitir" className={styles.emitButton} title="Emitir nota">
        <PlusIcon /> <span>Emitir nota</span>
      </NavLink>

      <div className={styles.navGroup}>
        <span className={styles.navTitle}>Principal</span>
        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={linkClass} title="Visão geral">
            <ChartIcon /> <span>Visão geral</span>
          </NavLink>
          <NavLink to="/pedidos" className={linkClass} title="Pedidos">
            <BagIcon /> <span>Pedidos</span>
          </NavLink>
          <NavLink to="/notas" className={linkClass} title="Notas fiscais" end>
            <FileTextIcon /> <span>Notas fiscais</span>
          </NavLink>
        </nav>
      </div>

      <div className={styles.navGroup}>
        <span className={styles.navTitle}>Confecção</span>
        <nav className={styles.nav}>
          <NavLink to="/produtos" className={linkClass} title="Produtos">
            <ShirtIcon /> <span>Produtos</span>
          </NavLink>
          <NavLink to="/producao" className={linkClass} title="Produção">
            <ScissorsIcon /> <span>Produção</span>
          </NavLink>
          <NavLink to="/estoque" className={linkClass} title="Estoque">
            <PackageIcon /> <span>Estoque</span>
          </NavLink>
          <NavLink to="/clientes" className={linkClass} title="Clientes">
            <UsersIcon /> <span>Clientes</span>
          </NavLink>
        </nav>
      </div>

      <div className={styles.navGroup}>
        <span className={styles.navTitle}>Sistema</span>
        <nav className={styles.nav}>
          <NavLink to="/relatorios" className={linkClass} title="Relatórios">
            <BarChartIcon /> <span>Relatórios</span>
          </NavLink>
          <NavLink to="/configuracoes" className={linkClass} title="Configurações">
            <SettingsIcon /> <span>Configurações</span>
          </NavLink>
        </nav>
      </div>

      <div className={styles.labelsGroup}>
        <span className={styles.navTitle}>Status das notas</span>
        <div className={styles.labels}>
          {statusOptions.map(({ label, param, color }) => {
            const isActive = activeStatus === param;
            return (
              <NavLink
                key={param}
                to={isActive ? '/notas' : `/notas?status=${param}`}
                className={`${styles.label} ${isActive ? styles.labelActive : ''}`}
                title={label}
              >
                <TagIcon /> <span className={styles.labelText}>{label}</span>
                <span className={styles.count}>{countByStatus(param)}</span>
                <span className={styles.dot} style={{ background: color }} />
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className={styles.planCard}>
        <div className={styles.planHeader}>
          <CrownIcon />
          <span className={styles.planName}>Plano Gratuito</span>
        </div>
        <p className={styles.planText}>Aproveite recursos ilimitados com o Pro.</p>
        <button type="button" className={styles.upgradeButton}>
          Fazer upgrade
        </button>
      </div>

      <div className={styles.sidebarFooter}>
        <button type="button" className={styles.logout} onClick={logout} title="Sair">
          <LogoutIcon /> <span>Sair</span>
        </button>
        <span className={styles.version}>v1.0.0</span>
      </div>
    </aside>
  );
});

const titles = {
  '/dashboard': 'Visão geral',
  '/pedidos': 'Pedidos',
  '/notas': 'Notas fiscais',
  '/emitir': 'Emitir nota fiscal',
  '/produtos': 'Produtos',
  '/producao': 'Produção',
  '/estoque': 'Estoque',
  '/clientes': 'Clientes',
  '/relatorios': 'Relatórios',
  '/configuracoes': 'Configurações',
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const avatarInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'US';

  const today = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className={styles.shell}>
      <Sidebar
        user={user}
        logout={logout}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1 className={styles.pageTitle}>{titles[location.pathname] || 'NotaFácil'}</h1>
            <span className={styles.date}>{today}</span>
          </div>

          <div className={styles.topbarRight}>
            <button type="button" className={styles.iconButton} aria-label="Notificações">
              <BellIcon />
              <span className={styles.badge} />
            </button>

            <div className={styles.userBlock}>
              <div className={styles.topbarAvatar}>{avatarInitials}</div>
              <span className={styles.topbarName}>{user?.username}</span>
            </div>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
