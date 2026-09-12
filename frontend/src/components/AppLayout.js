import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';

const NAV_SECTIONS = [
  {
    title: 'Menu',
    items: [
      { to: '/', end: true, icon: 'dashboard', label: 'Dashboard' },
      { to: '/notas-fiscais', icon: 'invoice', label: 'Notas Fiscais' },
      { to: '/clientes', icon: 'clients', label: 'Clientes' },
      { to: '/produtos', icon: 'products', label: 'Produtos' },
      { to: '/relatorios', icon: 'reports', label: 'Relatórios' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { to: '/configuracoes', icon: 'settings', label: 'Configurações' },
      { to: '/ajuda', icon: 'help', label: 'Ajuda' },
    ],
  },
];

function SidebarBrand({ collapsed, onToggle }) {
  const { tenant } = useAuth();

  return (
    <div className="sidebar-brand">
      <span className="sidebar-logo">
        <Icon name="logo" size={18} />
      </span>
      <div className="sidebar-brand-text">
        <span className="sidebar-brand-name">NotaFácil</span>
        {tenant?.name && (
          <span className="sidebar-brand-tenant">{tenant.name}</span>
        )}
      </div>
      {onToggle && (
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggle}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <Icon name={collapsed ? 'expand' : 'collapse'} />
        </button>
      )}
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className="sidebar-scroll">
      {NAV_SECTIONS.map((section) => (
        <div className="sidebar-section" key={section.title}>
          <span className="sidebar-section-title">{section.title}</span>
          <ul className="nav flex-column sidebar-nav">
            {section.items.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  title={item.label}
                  className={({ isActive }) =>
                    `nav-link sidebar-link${isActive ? ' active' : ''}`
                  }
                >
                  <Icon name={item.icon} />
                  <span className="sidebar-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarUser() {
  const { user, logout } = useAuth();
  const initials = (user?.name ?? '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="sidebar-user">
      <span className="sidebar-avatar">{initials}</span>
      <div className="sidebar-user-info">
        <span className="sidebar-user-name">{user?.name}</span>
        {user?.email && (
          <span className="sidebar-user-email">{user.email}</span>
        )}
      </div>
      <button
        type="button"
        className="sidebar-logout"
        onClick={logout}
        title="Sair"
        aria-label="Sair"
      >
        <Icon name="logout" />
      </button>
    </div>
  );
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <aside
        className={`app-sidebar d-none d-lg-flex flex-column flex-shrink-0 p-3 text-bg-dark${
          collapsed ? ' collapsed' : ''
        }`}
      >
        <SidebarBrand
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <SidebarNav />
        <SidebarUser />
      </aside>

      <div className="app-main">
        <nav className="navbar navbar-dark bg-dark d-lg-none sticky-top">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#appSidebar"
              aria-controls="appSidebar"
              aria-label="Abrir menu"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <span className="navbar-brand mb-0 d-flex align-items-center gap-2">
              <span className="sidebar-logo sidebar-logo-sm">
                <Icon name="logo" size={14} />
              </span>
              NotaFácil
            </span>
          </div>
        </nav>

        <main className="app-content">
          <Outlet />
        </main>
      </div>

      <div
        className="offcanvas offcanvas-start text-bg-dark app-sidebar-panel"
        tabIndex="-1"
        id="appSidebar"
        aria-labelledby="appSidebarLabel"
      >
        <div className="offcanvas-header">
          <span
            className="offcanvas-title d-flex align-items-center gap-2"
            id="appSidebarLabel"
          >
            <span className="sidebar-logo sidebar-logo-sm">
              <Icon name="logo" size={14} />
            </span>
            NotaFácil
          </span>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Fechar"
          />
        </div>
        <div className="offcanvas-body d-flex flex-column p-3">
          <SidebarNav />
          <SidebarUser />
        </div>
      </div>
    </div>
  );
}
