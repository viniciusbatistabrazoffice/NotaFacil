import { useState } from 'react';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

const SETTINGS_KEY = 'notafacil.settings';

const DEFAULT_SETTINGS = {
  currency: 'BRL',
  orderPrefix: 'PED',
  invoicePrefix: 'NF',
  productionAlerts: true,
  dueDateAlerts: true,
  dailySummary: false,
};

function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsPage() {
  const { tenant, user } = useAuth();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const saveSettings = (event) => {
    event.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
  };

  return (
    <div className="dashboard-content settings-page">
      <div className="dashboard-page-header settings-page-header">
        <div>
          <span className="settings-eyebrow">Ambiente de trabalho</span>
          <h1>Configurações</h1>
          <p>Personalize a operação da sua confecção.</p>
        </div>
      </div>

      <form onSubmit={saveSettings}>
        <section className="dash-card settings-company-card">
          <div className="settings-company-mark"><Icon name="settings" size={25} /></div>
          <div className="settings-company-copy">
            <span>Empresa</span>
            <h2>{tenant?.name ?? 'Gestão de Confecção'}</h2>
            <p>Ambiente da empresa ativo para {user?.email ?? 'sua equipe'}.</p>
          </div>
          <span className="settings-active-badge">Ambiente ativo</span>
        </section>

        <div className="settings-layout">
          <div className="settings-main">
            <section className="dash-card settings-section">
              <div className="dash-card-header">
                <div><h2>Preferências da operação</h2><span>Defina os padrões usados em novos registros.</span></div>
              </div>
              <div className="settings-fields">
                <label className="form-field">
                  <span>Moeda principal</span>
                  <select name="currency" value={settings.currency} onChange={updateSetting}>
                    <option value="BRL">Real brasileiro (R$)</option>
                    <option value="USD">Dólar americano (US$)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </label>
                <label className="form-field">
                  <span>Prefixo dos pedidos</span>
                  <input name="orderPrefix" value={settings.orderPrefix} onChange={updateSetting} maxLength={8} required />
                </label>
                <label className="form-field">
                  <span>Prefixo das notas fiscais</span>
                  <input name="invoicePrefix" value={settings.invoicePrefix} onChange={updateSetting} maxLength={8} required />
                </label>
              </div>
            </section>

            <section className="dash-card settings-section">
              <div className="dash-card-header">
                <div><h2>Notificações</h2><span>Escolha os avisos relevantes para a rotina da equipe.</span></div>
              </div>
              <div className="settings-toggle-list">
                <label className="settings-toggle-row">
                  <span className="settings-toggle-icon settings-toggle-icon--amber"><Icon name="scissors" size={17} /></span>
                  <span className="settings-toggle-copy"><strong>Alertas de produção</strong><small>Avisar quando pedidos exigirem atenção na produção.</small></span>
                  <input name="productionAlerts" type="checkbox" checked={settings.productionAlerts} onChange={updateSetting} />
                  <span className="settings-switch" />
                </label>
                <label className="settings-toggle-row">
                  <span className="settings-toggle-icon settings-toggle-icon--green"><Icon name="financial" size={17} /></span>
                  <span className="settings-toggle-copy"><strong>Vencimentos financeiros</strong><small>Notificar contas a pagar e a receber próximas do vencimento.</small></span>
                  <input name="dueDateAlerts" type="checkbox" checked={settings.dueDateAlerts} onChange={updateSetting} />
                  <span className="settings-switch" />
                </label>
                <label className="settings-toggle-row">
                  <span className="settings-toggle-icon settings-toggle-icon--blue"><Icon name="reports" size={17} /></span>
                  <span className="settings-toggle-copy"><strong>Resumo diário</strong><small>Receber o consolidado da operação ao fim de cada dia.</small></span>
                  <input name="dailySummary" type="checkbox" checked={settings.dailySummary} onChange={updateSetting} />
                  <span className="settings-switch" />
                </label>
              </div>
            </section>
          </div>

          <aside className="settings-side">
            <section className="dash-card settings-security-card">
              <span className="settings-security-icon"><Icon name="person" size={20} /></span>
              <h2>Sua conta</h2>
              <p>Dados de acesso e permissões da conta atual.</p>
              <dl><div><dt>Usuário</dt><dd>{user?.name ?? 'Usuário'}</dd></div><div><dt>E-mail</dt><dd>{user?.email ?? 'Não informado'}</dd></div></dl>
              <a href="/perfil" className="dash-btn dash-btn--ghost">Gerenciar perfil</a>
            </section>
            <section className="settings-local-note">
              <Icon name="settings" size={16} />
              <span>As preferências desta tela são salvas neste navegador.</span>
            </section>
          </aside>
        </div>

        <div className="settings-save-bar">
          {saved && <span>Configurações salvas com sucesso.</span>}
          <button type="submit" className="dash-btn dash-btn--primary"><Icon name="settings" size={15} />Salvar configurações</button>
        </div>
      </form>
    </div>
  );
}