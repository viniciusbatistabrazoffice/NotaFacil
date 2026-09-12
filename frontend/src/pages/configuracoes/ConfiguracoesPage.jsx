import { useState } from 'react';
import styles from './ConfiguracoesPage.module.css';

const tabs = ['Perfil', 'Empresa', 'Notificações', 'Segurança'];

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('Perfil');
  const [profile, setProfile] = useState({
    name: 'Usuário Admin',
    email: 'admin@notafacil.com',
    phone: '(11) 98765-4321',
  });
  const [company, setCompany] = useState({
    name: 'Minha Empresa LTDA',
    cnpj: '00.000.000/0000-00',
    address: 'Av. Paulista, 1000',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: true,
  });

  const handleProfile = (e) => setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleCompany = (e) => setCompany((c) => ({ ...c, [e.target.name]: e.target.value }));
  const handleNotifications = (key) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Configurações</h2>
        <p>Gerencie sua conta, empresa e preferências.</p>
      </header>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {activeTab === 'Perfil' && (
          <div className={styles.section}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarLarge}>UA</div>
              <button type="button" className={styles.uploadButton}>
                <CameraIcon /> Alterar foto
              </button>
            </div>

            <div className={styles.fields}>
              <label className={styles.field}>
                <span>Nome completo</span>
                <input type="text" name="name" value={profile.name} onChange={handleProfile} />
              </label>
              <label className={styles.field}>
                <span>E-mail</span>
                <input type="email" name="email" value={profile.email} onChange={handleProfile} />
              </label>
              <label className={styles.field}>
                <span>Telefone</span>
                <input type="tel" name="phone" value={profile.phone} onChange={handleProfile} />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'Empresa' && (
          <div className={styles.section}>
            <div className={styles.fields}>
              <label className={styles.field}>
                <span>Razão social</span>
                <input type="text" name="name" value={company.name} onChange={handleCompany} />
              </label>
              <label className={styles.field}>
                <span>CNPJ</span>
                <input type="text" name="cnpj" value={company.cnpj} onChange={handleCompany} />
              </label>
              <label className={styles.field}>
                <span>Endereço</span>
                <input type="text" name="address" value={company.address} onChange={handleCompany} />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'Notificações' && (
          <div className={styles.section}>
            <div className={styles.toggles}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <BellIcon />
                  <div>
                    <strong>E-mail</strong>
                    <p>Receba atualizações por e-mail.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${styles.toggle} ${notifications.email ? styles.on : ''}`}
                  onClick={() => handleNotifications('email')}
                />
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <BellIcon />
                  <div>
                    <strong>SMS</strong>
                    <p>Receba alertas importantes por SMS.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${styles.toggle} ${notifications.sms ? styles.on : ''}`}
                  onClick={() => handleNotifications('sms')}
                />
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <BellIcon />
                  <div>
                    <strong>Marketing</strong>
                    <p>Novidades e promoções do NotaFácil.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${styles.toggle} ${notifications.marketing ? styles.on : ''}`}
                  onClick={() => handleNotifications('marketing')}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Segurança' && (
          <div className={styles.section}>
            <div className={styles.securityBox}>
              <div className={styles.securityIcon}>
                <LockIcon />
              </div>
              <div>
                <strong>Alterar senha</strong>
                <p>Última alteração há 30 dias.</p>
              </div>
              <button type="button" className={styles.outlineButton}>Redefinir</button>
            </div>

            <div className={styles.securityBox}>
              <div className={styles.securityIcon}>
                <LockIcon />
              </div>
              <div>
                <strong>Autenticação de dois fatores</strong>
                <p>Adicione uma camada extra de segurança.</p>
              </div>
              <button type="button" className={styles.outlineButton}>Ativar</button>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <button type="button" className={styles.saveButton}>
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
