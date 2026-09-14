import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';
import { formatCurrency } from '../utils/orders';

const REPORTS = [
  { title: 'Vendas por cliente', description: 'Faturamento, pedidos e ticket médio', icon: 'clients', color: 'blue' },
  { title: 'Rentabilidade por produto', description: 'Receita e volume vendido por modelo', icon: 'products', color: 'green' },
  { title: 'Produção e entrega', description: 'Pedidos concluídos e produtividade', icon: 'scissors', color: 'amber' },
];

function createEmptyReport() {
  return {
    income: 0,
    expense: 0,
    netIncome: 0,
    completedOrders: 0,
    ticketAverage: 0,
    revenueByClient: [],
    products: [],
    monthlyRevenue: {},
  };
}

function getMonthlyPerformance(monthlyRevenue) {
  const months = [];
  const today = new Date();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const month = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      key,
      month: month.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      amount: Number(monthlyRevenue[key] ?? 0),
    });
  }
  const maxAmount = Math.max(...months.map((month) => month.amount), 1);
  return months.map((month) => ({ ...month, value: Math.max((month.amount / maxAmount) * 100, 4) }));
}

export function ReportsPage() {
  const { token } = useAuth();
  const [period, setPeriod] = useState('Este mês');
  const [ranking, setRanking] = useState('clients');
  const [report, setReport] = useState(createEmptyReport);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReport(await apiRequest('/financial/report', { token }));
    } catch (requestError) {
      setError(translateError(requestError));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const downloadReport = () => {
    const file = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio-financeiro.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const performance = getMonthlyPerformance(report.monthlyRevenue ?? {});
  const maxProductValue = Math.max(...(report.products ?? []).map((product) => product.value), 1);
  const margin = report.income ? (report.netIncome / report.income) * 100 : 0;
  const score = Math.max(0, Math.min(100, Math.round(Math.max(margin, 0) * 2)));
  const performanceLabel = report.netIncome > 0 ? 'Resultado positivo' : report.netIncome < 0 ? 'Atenção ao resultado' : 'Sem movimentação';

  return (
    <div className="dashboard-content reports-page">
      <div className="dashboard-page-header reports-page-header">
        <div>
          <span className="reports-eyebrow">Inteligência da operação</span>
          <h1>Relatórios</h1>
          <p>Transforme os números da confecção em decisões melhores.</p>
        </div>
        <div className="reports-actions">
          <select className="cash-period-select" aria-label="Selecionar período" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>Este mês</option><option>Últimos 3 meses</option><option>Este ano</option>
          </select>
          <button type="button" className="dash-btn reports-download-btn" onClick={downloadReport} disabled={loading}><Icon name="reports" size={16} />Baixar relatório</button>
          <button type="button" className="dash-btn dash-btn--ghost" onClick={reload} disabled={loading}>Atualizar</button>
        </div>
      </div>

      <section className="reports-spotlight" aria-label="Resumo de desempenho">
        <div><span>Desempenho geral</span><strong>{performanceLabel}</strong><p>Resultado líquido de <b>{formatCurrency(report.netIncome)}</b> em {period.toLowerCase()}.</p></div>
        <div className="reports-score"><span>Índice financeiro</span><strong>{score}</strong><small>/100</small></div>
        <div className="reports-score-track"><span style={{ width: `${score}%` }} /></div>
        <div className="reports-spotlight-meta"><span>Receita realizada</span><strong>{formatCurrency(report.income)}</strong><small>{report.completedOrders} pedido(s) concluído(s)</small></div>
      </section>

      {error && <p className="form-error">{error}</p>}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3"><div className="reports-kpi"><span className="stat-icon stat-icon--green"><Icon name="financial" size={19} /></span><div><small>Faturamento</small><strong>{formatCurrency(report.income)}</strong><em>Entradas confirmadas</em></div></div></div>
        <div className="col-12 col-sm-6 col-xl-3"><div className="reports-kpi"><span className="stat-icon stat-icon--blue"><Icon name="orders" size={19} /></span><div><small>Pedidos concluídos</small><strong>{report.completedOrders}</strong><em>Pedidos faturados ou finalizados</em></div></div></div>
        <div className="col-12 col-sm-6 col-xl-3"><div className="reports-kpi"><span className="stat-icon stat-icon--amber"><Icon name="invoice" size={19} /></span><div><small>Ticket médio</small><strong>{formatCurrency(report.ticketAverage)}</strong><em>Por recebimento confirmado</em></div></div></div>
        <div className="col-12 col-sm-6 col-xl-3"><div className="reports-kpi"><span className="stat-icon stat-icon--purple"><Icon name="scissors" size={19} /></span><div><small>Margem líquida</small><strong>{margin.toFixed(1).replace('.', ',')}%</strong><em>Sobre a receita confirmada</em></div></div></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-7"><section className="dash-card reports-chart-card"><div className="dash-card-header"><div><h2>Evolução do faturamento</h2><span>Receitas confirmadas nos últimos seis meses</span></div><strong>{formatCurrency(report.income)}</strong></div><div className="reports-chart" role="img" aria-label="Gráfico de evolução mensal do faturamento">{performance.map((item, index) => <div className="reports-bar-group" key={item.key}><span className={index === performance.length - 1 ? 'is-current' : ''} style={{ height: `${item.value}%` }} /><small>{item.month}</small></div>)}</div></section></div>
        <div className="col-12 col-xl-5"><section className="dash-card reports-products-card"><div className="dash-card-header"><div><h2>Produtos em destaque</h2><span>Por valor dos pedidos cadastrados</span></div></div><div className="reports-product-list">{loading ? <p className="orders-empty">Carregando produtos...</p> : report.products.length === 0 ? <p className="orders-empty">Nenhum produto encontrado.</p> : report.products.slice(0, 4).map((product) => <div className="reports-product" key={product.name}><div><strong>{product.name}</strong><span>{product.quantity.toLocaleString('pt-BR')} peças</span></div><div><b>{formatCurrency(product.value)}</b><span className="reports-progress"><i style={{ width: `${(product.value / maxProductValue) * 100}%` }} /></span></div></div>)}</div></section></div>
      </div>

      <section className="dash-card reports-ranking-card"><div className="dash-card-header reports-ranking-header"><div><h2>Ranking do período</h2><span>Dados consolidados da operação</span></div><div className="cash-filter" role="group" aria-label="Tipo de ranking"><button type="button" className={ranking === 'clients' ? 'active' : ''} onClick={() => setRanking('clients')}>Clientes</button><button type="button" className={ranking === 'products' ? 'active' : ''} onClick={() => setRanking('products')}>Produtos</button></div></div>{ranking === 'clients' ? <div className="table-responsive"><table className="dash-table reports-ranking-table"><thead><tr><th>Posição</th><th>Cliente</th><th>Pedidos</th><th className="cash-value-heading">Faturamento</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="orders-empty">Carregando ranking...</td></tr> : report.revenueByClient.length === 0 ? <tr><td colSpan="4" className="orders-empty">Nenhum recebimento confirmado encontrado.</td></tr> : report.revenueByClient.map((client, index) => <tr key={client.name}><td><span className={`reports-position reports-position--${index + 1}`}>{index + 1}</span></td><td><strong>{client.name}</strong></td><td>{client.orders}</td><td className="cash-amount">{formatCurrency(client.value)}</td></tr>)}</tbody></table></div> : <div className="reports-product-ranking">{report.products.length === 0 ? <p className="orders-empty">Nenhum produto encontrado.</p> : report.products.map((product, index) => <div key={product.name}><span className={`reports-position reports-position--${index + 1}`}>{index + 1}</span><strong>{product.name}</strong><span>{product.quantity.toLocaleString('pt-BR')} peças</span><b>{formatCurrency(product.value)}</b></div>)}</div>}</section>

      <section className="reports-library"><div className="reports-library-heading"><h2>Relatórios detalhados</h2><span>Os indicadores acima são atualizados pelos lançamentos e pedidos do tenant.</span></div><div className="row g-3">{REPORTS.map((item) => <div className="col-12 col-md-4" key={item.title}><button type="button" className="reports-library-item" onClick={downloadReport}><span className={`reports-library-icon reports-library-icon--${item.color}`}><Icon name={item.icon} size={20} /></span><span><strong>{item.title}</strong><small>{item.description}</small></span><Icon name="reports" size={16} /></button></div>)}</div></section>
    </div>
  );
}
