import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../utils/users';
import { Icon } from './Icon';
import { Logo } from './Logo';

const NAV_SECTIONS = [
  {
    title: 'Operações',
    items: [
      { to: '/', end: true, icon: 'dashboard', label: 'Dashboard' },
      { to: '/pedidos', icon: 'orders', label: 'Pedidos' },
      { to: '/notas-fiscais', icon: 'invoice', label: 'Notas Fiscais' },
      { to: '/producao', icon: 'scissors', label: 'Produção' },
      { to: '/pdv', icon: 'shopping-cart', label: 'PDV' },
    ],
  },
  {
    title: 'Cadastros',
    items: [
      { to: '/clientes', icon: 'clients', label: 'Clientes' },
      { to: '/produtos', icon: 'products', label: 'Modelos e Produtos' },
      { to: '/insumos', icon: 'materials', label: 'Tecidos e Insumos' },
      { to: '/fornecedores', icon: 'suppliers', label: 'Fornecedores' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { to: '/financeiro', icon: 'financial', label: 'Financeiro' },
      { to: '/relatorios', icon: 'reports', label: 'Relatórios' },
      { to: '/usuarios', icon: 'users', label: 'Usuários' },
      { to: '/configuracoes', icon: 'settings', label: 'Configurações' },
    ],
  },
];

const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

const EXTRA_TITLES = { '/perfil': 'Meu Perfil' };

function getPageTitle(pathname) {
  const item = NAV_ITEMS.find((nav) =>
    nav.end ? pathname === nav.to : pathname.startsWith(nav.to)
  );
  return item?.label ?? EXTRA_TITLES[pathname] ?? 'NotaFácil';
}

function SidebarBrand() {
  const { tenant } = useAuth();

  return (
    <div className="sidebar-brand">
      <Logo size={36} className="sidebar-logo" />
      <div className="sidebar-brand-text">
        <span className="sidebar-brand-name">NotaFácil</span>
        <span className="sidebar-brand-tenant">
          {tenant?.name ?? 'Gestão de Confecção'}
        </span>
      </div>
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

function SidebarContent({ showBrand = false, showVersion = false }) {
  return (
    <>
      {showBrand && <SidebarBrand />}
      <SidebarNav />
      {showVersion && <div className="sidebar-footer-version">NotaFácil v1.0</div>}
    </>
  );
}

function Topbar({ onToggleSidebar }) {
  const { user, tenant, logout } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="topbar navbar sticky-top" data-bs-theme="dark">
      <div className="container-fluid">
        <div className="topbar-zone">
          <button
            type="button"
            className="topbar-toggler d-lg-none"
            data-bs-toggle="offcanvas"
            data-bs-target="#appSidebar"
            aria-controls="appSidebar"
            aria-label="Abrir menu"
          >
            <Icon name="menu" size={20} />
          </button>
          <button
            type="button"
            className="topbar-toggler d-none d-lg-inline-flex"
            onClick={onToggleSidebar}
            aria-label="Alternar menu"
          >
            <Icon name="menu" size={20} />
          </button>

          <nav className="topbar-breadcrumb" aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Início</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {pageTitle}
              </li>
            </ol>
          </nav>
        </div>

        <div className="topbar-search d-none d-md-flex">
          <Icon name="search" />
          <input type="search" placeholder="Buscar..." aria-label="Buscar" />
        </div>

        <div className="topbar-zone topbar-zone-end gap-1">
          <div className="dropdown">
            <button
              type="button"
              className="topbar-icon-btn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Notificações"
            >
              <Icon name="bell" size={18} />
              <span className="topbar-dot" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end topbar-notifications">
              <li>
                <h6 className="dropdown-header">Notificações</h6>
              </li>
              <li>
                <span className="dropdown-item-text topbar-notifications-empty">
                  Nenhuma notificação no momento.
                </span>
              </li>
            </ul>
          </div>

          <span className="topbar-divider d-none d-md-block" />

          <div className="dropdown">
            <button
              type="button"
              className="topbar-user dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="sidebar-avatar">{getInitials(user?.name)}</span>
              <span className="topbar-user-text d-none d-sm-flex">
                <span className="topbar-user-name">{user?.name}</span>
                <span className="topbar-user-tenant">{tenant?.name}</span>
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end topbar-user-menu">
              <li className="topbar-user-header">
                <span className="sidebar-avatar">
                  {getInitials(user?.name)}
                </span>
                <div className="topbar-user-header-text">
                  <span>{user?.name}</span>
                  <span className="text-muted">{user?.email}</span>
                </div>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link
                  to="/perfil"
                  className="dropdown-item d-flex align-items-center gap-2"
                >
                  <Icon name="person" />
                  Meu perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/configuracoes"
                  className="dropdown-item d-flex align-items-center gap-2"
                >
                  <Icon name="settings" />
                  Configurações
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2 text-danger"
                  onClick={logout}
                >
                  <Icon name="logout" />
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
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
        <SidebarContent showBrand showVersion />
      </aside>

      <div className="app-main">
        <Topbar onToggleSidebar={() => setCollapsed((value) => !value)} />

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
        <div className="offcanvas-header app-sidebar-panel-header">
          <SidebarBrand />
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Fechar"
          />
        </div>
        <div className="offcanvas-body d-flex flex-column p-3">
          <SidebarContent showVersion />
        </div>
      </div>
    </div>
  );
}
