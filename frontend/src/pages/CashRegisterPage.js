import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { FinancialTransactionModal } from '../components/FinancialTransactionModal';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';
import { formatCurrency } from '../utils/orders';

const DAILY_FLOW = [
  { day: '04', value: 38 },
  { day: '05', value: 54 },
  { day: '06', value: 29 },
  { day: '07', value: 66 },
  { day: '08', value: 47 },
  { day: '09', value: 82 },
  { day: '10', value: 70 },
];

export function CashRegisterPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('Hoje');
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formType, setFormType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [savedTransactions, cashSummary, savedOrders] = await Promise.all([
        apiRequest('/financial/transactions', { token }),
        apiRequest('/financial/cash-summary', { token }),
        apiRequest('/orders', { token }),
      ]);
      setTransactions(savedTransactions);
      setSummary(cashSummary);
      setOrders(savedOrders);
    } catch (err) {
      setLoadError(translateError(err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const visibleTransactions = transactions.filter(
    (transaction) => filter === 'all' || transaction.type === filter,
  );
  const receivable = transactions
    .filter((transaction) => transaction.type === 'income' && transaction.status === 'pending')
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const formatTransactionDate = (transaction) => {
    const value = transaction.settledAt ?? transaction.dueDate ?? transaction.createdAt;
    return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const closeForm = () => {
    if (!saving) {
      setFormType(null);
      setFormError('');
    }
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      await apiRequest('/financial/transactions', {
        method: 'POST',
        body: payload,
        token,
      });
      setFormType(null);
      await reload();
    } catch (err) {
      setFormError(translateError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-content cash-page">
      <div className="dashboard-page-header cash-page-header">
        <div>
          <span className="cash-eyebrow">Controle financeiro</span>
          <h1>Caixa</h1>
          <p>O movimento da sua operação, em tempo real.</p>
        </div>
        <div className="cash-header-actions">
          <select
            className="cash-period-select"
            aria-label="Selecionar período"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option>Hoje</option>
            <option>Esta semana</option>
            <option>Este mês</option>
          </select>
          <button type="button" className="dash-btn cash-btn-checkout" onClick={() => navigate('/checkout/produtos')}>
            <Icon name="shopping-cart" size={16} />
            Nova Venda
          </button>
          <button type="button" className="dash-btn cash-btn-income" onClick={() => setFormType('income')}>
            <Icon name="plus" size={16} />
            Nova entrada
          </button>
          <button type="button" className="dash-btn cash-btn-expense" onClick={() => setFormType('expense')}>
            <Icon name="plus" size={16} />
            Nova saída
          </button>
        </div>
      </div>

      <section className="cash-hero" aria-label="Resumo do caixa">
        <div className="cash-hero-balance">
          <span>Saldo disponível</span>
          <strong>{formatCurrency(summary.balance)}</strong>
          <p><b>{transactions.length}</b> lançamento(s) no ambiente</p>
        </div>
        <div className="cash-hero-divider" />
        <div className="cash-hero-meta">
          <span className="cash-meta-label">Resultado de {period.toLowerCase()}</span>
          <strong>{formatCurrency(summary.income - summary.expense)}</strong>
          <span className="cash-positive">Lançamentos confirmados</span>
        </div>
        <div className="cash-sparkline" aria-label="Fluxo de caixa dos últimos sete dias">
          {DAILY_FLOW.map((item, index) => (
            <div className="cash-sparkline-item" key={item.day}>
              <span className={index === DAILY_FLOW.length - 1 ? 'is-current' : ''} style={{ height: `${item.value}%` }} />
              <small>{item.day}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="cash-summary-card cash-summary-card--income">
            <span className="cash-summary-icon"><Icon name="financial" size={18} /></span>
            <span>Entradas</span>
            <strong>{formatCurrency(summary.income)}</strong>
            <small>Recebimentos confirmados</small>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="cash-summary-card cash-summary-card--expense">
            <span className="cash-summary-icon"><Icon name="financial" size={18} /></span>
            <span>Saídas</span>
            <strong>{formatCurrency(summary.expense)}</strong>
            <small>Pagamentos confirmados</small>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="cash-summary-card cash-summary-card--forecast">
            <span className="cash-summary-icon"><Icon name="reports" size={18} /></span>
            <span>A receber</span>
            <strong>{formatCurrency(receivable)}</strong>
            <small>Lançamentos pendentes</small>
          </div>
        </div>
      </div>

      <section className="dash-card cash-transactions-card">
        <div className="dash-card-header cash-transactions-header">
          <div>
            <h2>Últimos lançamentos</h2>
            <span>Movimentações registradas no caixa</span>
          </div>
          <div className="cash-filter" role="group" aria-label="Filtrar lançamentos">
            <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todos</button>
            <button type="button" className={filter === 'income' ? 'active' : ''} onClick={() => setFilter('income')}>Entradas</button>
            <button type="button" className={filter === 'expense' ? 'active' : ''} onClick={() => setFilter('expense')}>Saídas</button>
          </div>
        </div>
        {loadError && <p className="form-error m-3">{loadError}</p>}
        <div className="table-responsive">
          <table className="dash-table cash-table">
            <thead>
              <tr>
                <th>Lançamento</th>
                <th>Categoria</th>
                <th>Data</th>
                <th className="cash-value-heading">Valor</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="orders-empty">Carregando lançamentos...</td></tr>
              ) : visibleTransactions.length === 0 ? (
                <tr><td colSpan="4" className="orders-empty">Nenhum lançamento encontrado.</td></tr>
              ) : visibleTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <span className={`cash-transaction-icon cash-transaction-icon--${transaction.type}`}>
                      <Icon name={transaction.type === 'income' ? 'plus' : 'financial'} size={15} />
                    </span>
                    <strong>{transaction.description}</strong>
                  </td>
                  <td><span className="cash-category">{transaction.category}</span></td>
                  <td className="dash-table-muted">{formatTransactionDate(transaction)}</td>
                  <td className={`cash-amount cash-amount--${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {formType && (
        <FinancialTransactionModal
          type={formType}
          orders={orders}
          saving={saving}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
