import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { FinancialTransactionModal } from '../components/FinancialTransactionModal';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';
import { formatCurrency } from '../utils/orders';

const EXPENSE_COLORS = ['#f59e0b', '#60a5fa', '#f472b6', '#94a3b8', '#34d399'];

function formatShortDate(value) {
  if (!value) return 'Sem data';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function FinancialPage() {
  const { token } = useAuth();
  const [period, setPeriod] = useState('Setembro de 2026');
  const [accountFilter, setAccountFilter] = useState('all');
  const [overview, setOverview] = useState({
    income: 0,
    expense: 0,
    netIncome: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [expenseTotals, setExpenseTotals] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formType, setFormType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [financialOverview, report, savedTransactions, savedOrders] = await Promise.all([
        apiRequest('/financial/overview', { token }),
        apiRequest('/financial/report', { token }),
        apiRequest('/financial/transactions', { token }),
        apiRequest('/orders', { token }),
      ]);
      setOverview(financialOverview);
      setExpenseTotals(report.expensesByCategory ?? {});
      setTransactions(savedTransactions);
      setOrders(savedOrders);
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

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
    } catch (requestError) {
      setFormError(translateError(requestError));
    } finally {
      setSaving(false);
    }
  };

  const pendingBills = transactions
    .filter((transaction) => transaction.status === 'pending')
    .filter((transaction) => accountFilter === 'all' || transaction.type === accountFilter);
  const totalExpenses = Object.values(expenseTotals).reduce(
    (total, value) => total + Number(value),
    0,
  );
  const expenses = Object.entries(expenseTotals).map(([label, amount], index) => ({
    label,
    amount: Number(amount),
    value: totalExpenses ? Math.round((Number(amount) / totalExpenses) * 100) : 0,
    color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
  }));
  const maxTransactionAmount = Math.max(
    ...transactions.map((transaction) => Number(transaction.amount)),
    1,
  );
  const chartTransactions = transactions.slice(0, 6).reverse();
  const margin = overview.income ? (overview.netIncome / overview.income) * 100 : 0;

  return (
    <div className="dashboard-content financial-page">
      <div className="dashboard-page-header financial-page-header">
        <div>
          <span className="financial-eyebrow">Visão estratégica</span>
          <h1>Financeiro</h1>
          <p>Planeje o crescimento da sua confecção com segurança.</p>
        </div>
        <div className="financial-actions">
          <select className="cash-period-select" aria-label="Selecionar mês" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>Setembro de 2026</option>
            <option>Agosto de 2026</option>
            <option>Julho de 2026</option>
          </select>
          <button type="button" className="dash-btn financial-export-btn" onClick={reload}>
            <Icon name="reports" size={16} />
            Atualizar dados
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

      <section className="financial-highlight" aria-label="Resultado financeiro do mês">
        <div className="financial-highlight-copy">
          <span>Resultado líquido em {period}</span>
          <strong>{formatCurrency(overview.netIncome)}</strong>
          <p><b>{transactions.length}</b> lançamento(s) registrados</p>
        </div>
        <div className="financial-highlight-stats">
          <div><span>Receita realizada</span><strong>{formatCurrency(overview.income)}</strong></div>
          <div><span>Margem líquida</span><strong>{margin.toFixed(1).replace('.', ',')}%</strong></div>
          <div><span>Contas pendentes</span><strong>{formatCurrency(overview.accountsReceivable + overview.accountsPayable)}</strong></div>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="financial-kpi"><span className="stat-icon stat-icon--green"><Icon name="financial" size={19} /></span><span><small>Receita realizada</small><strong>{formatCurrency(overview.income)}</strong><em>Lançamentos confirmados</em></span></div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="financial-kpi"><span className="stat-icon stat-icon--amber"><Icon name="financial" size={19} /></span><span><small>Despesas totais</small><strong>{formatCurrency(overview.expense)}</strong><em>Lançamentos confirmados</em></span></div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="financial-kpi"><span className="stat-icon stat-icon--blue"><Icon name="invoice" size={19} /></span><span><small>Contas a receber</small><strong>{formatCurrency(overview.accountsReceivable)}</strong><em>Lançamentos pendentes</em></span></div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="financial-kpi"><span className="stat-icon stat-icon--purple"><Icon name="orders" size={19} /></span><span><small>Contas a pagar</small><strong>{formatCurrency(overview.accountsPayable)}</strong><em>Lançamentos pendentes</em></span></div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <section className="dash-card financial-chart-card">
            <div className="dash-card-header"><div><h2>Últimos lançamentos</h2><span>Valores registrados pela operação</span></div><span className="financial-legend"><i className="income" />Entradas <i className="expense" />Saídas</span></div>
            <div className="financial-chart" role="img" aria-label="Gráfico dos últimos lançamentos financeiros">
              {chartTransactions.length === 0 ? <span className="orders-empty">Sem dados para exibir.</span> : chartTransactions.map((transaction) => (
                <div className="financial-bar-group" key={transaction.id}>
                  <div className="financial-bars"><span className={`financial-bar financial-bar--${transaction.type}`} style={{ height: `${Math.max((Number(transaction.amount) / maxTransactionAmount) * 100, 8)}%` }} /></div>
                  <small>{formatShortDate(transaction.dueDate ?? transaction.createdAt)}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="col-12 col-xl-4">
          <section className="dash-card financial-expense-card">
            <div className="dash-card-header"><div><h2>Despesas por categoria</h2><span>Distribuição do mês</span></div></div>
            <div className="financial-donut" style={{ background: expenses.length ? `conic-gradient(${expenses.map((expense, index) => `${expense.color} ${expenses.slice(0, index).reduce((total, item) => total + item.value, 0)}% ${expenses.slice(0, index + 1).reduce((total, item) => total + item.value, 0)}%`).join(', ')})` : 'conic-gradient(#334155 0 100%)' }}><div><strong>{formatCurrency(totalExpenses)}</strong><span>Total</span></div></div>
            <div className="financial-expense-legend">{expenses.length === 0 ? <span>Sem despesas registradas.</span> : expenses.map((expense) => <span key={expense.label}><i style={{ background: expense.color }} />{expense.label}<b>{expense.value}%</b></span>)}</div>
          </section>
        </div>
      </div>

      <section className="dash-card financial-bills-card">
        <div className="dash-card-header financial-bills-header">
          <div><h2>Próximos compromissos</h2><span>Contas pendentes registradas no sistema</span></div>
          <div className="cash-filter" role="group" aria-label="Filtrar contas"><button type="button" className={accountFilter === 'all' ? 'active' : ''} onClick={() => setAccountFilter('all')}>Todos</button><button type="button" className={accountFilter === 'income' ? 'active' : ''} onClick={() => setAccountFilter('income')}>A receber</button><button type="button" className={accountFilter === 'expense' ? 'active' : ''} onClick={() => setAccountFilter('expense')}>A pagar</button></div>
        </div>
        {error && <p className="form-error m-3">{error}</p>}
        <div className="table-responsive"><table className="dash-table financial-bills-table"><thead><tr><th>Descrição</th><th>Vencimento</th><th>Tipo</th><th className="cash-value-heading">Valor</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="orders-empty">Carregando dados financeiros...</td></tr> : pendingBills.length === 0 ? <tr><td colSpan="4" className="orders-empty">Nenhuma conta pendente encontrada.</td></tr> : pendingBills.map((bill) => <tr key={bill.id}><td><strong>{bill.description}</strong></td><td className="dash-table-muted">{formatShortDate(bill.dueDate)}</td><td><span className={`financial-bill-type financial-bill-type--${bill.type}`}>{bill.type === 'income' ? 'Receber' : 'Pagar'}</span></td><td className={`cash-amount cash-amount--${bill.type}`}>{formatCurrency(bill.amount)}</td></tr>)}</tbody></table></div>
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