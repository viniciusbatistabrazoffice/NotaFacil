import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

const FileTextIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

const DollarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const ShirtIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
);

const ScissorsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const TrendIcon = ({ up }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {up ? (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    ) : (
      <>
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </>
    )}
  </svg>
);

const stats = [
  { title: 'Faturamento (mês)', value: 'R$ 24.500', trend: '+8%', up: true, icon: <DollarIcon />, color: 'green' },
  { title: 'Pedidos em aberto', value: '18', trend: '+4', up: true, icon: <BagIcon />, color: 'blue' },
  { title: 'Peças produzidas (mês)', value: '1.240', trend: '+12%', up: true, icon: <ShirtIcon />, color: 'purple' },
  { title: 'Ordens em produção', value: '6', trend: '-2', up: false, icon: <ScissorsIcon />, color: 'yellow' },
];

const quickActions = [
  { to: '/emitir', label: 'Emitir nota', icon: <FileTextIcon /> },
  { to: '/pedidos', label: 'Novo pedido', icon: <BagIcon /> },
  { to: '/produtos', label: 'Novo produto', icon: <ShirtIcon /> },
  { to: '/clientes', label: 'Novo cliente', icon: <UsersIcon /> },
];

const productionOrders = [
  { id: 'OP-1042', item: 'Camiseta básica', qty: 300, progress: 68, deadline: '18/09' },
  { id: 'OP-1043', item: 'Calça jeans slim', qty: 150, progress: 45, deadline: '22/09' },
  { id: 'OP-1044', item: 'Vestido floral', qty: 200, progress: 82, deadline: '15/09' },
  { id: 'OP-1045', item: 'Moletom canguru', qty: 120, progress: 20, deadline: '29/09' },
];

const deliveryStatus = {
  'Pronto': 'pronto',
  'Em produção': 'emProducao',
  'Separando': 'separando',
};

const upcomingDeliveries = [
  { id: 'PED-089', client: 'Loja Vestta', pieces: 300, date: '15/09', status: 'Pronto' },
  { id: 'PED-090', client: 'Moda Center', pieces: 150, date: '18/09', status: 'Em produção' },
  { id: 'PED-091', client: 'Atacado Silva', pieces: 500, date: '22/09', status: 'Separando' },
  { id: 'PED-092', client: 'Boutique Lima', pieces: 80, date: '25/09', status: 'Em produção' },
];

const lowStock = [
  { item: 'Tecido malha penteada', left: '12 m', min: 'mín. 50 m' },
  { item: 'Linha branca (cone)', left: '3 un', min: 'mín. 20 un' },
  { item: 'Botão de pressão', left: '45 un', min: 'mín. 200 un' },
  { item: 'Etiqueta tamanho M', left: '80 un', min: 'mín. 300 un' },
];

const recentNotes = [
  { id: 1, number: '0001', client: 'Loja Vestta', value: 'R$ 1.200,00', status: 'Emitida', date: '11/09/2026' },
  { id: 2, number: '0002', client: 'Moda Center', value: 'R$ 850,00', status: 'Pendente', date: '10/09/2026' },
  { id: 3, number: '0003', client: 'Atacado Silva', value: 'R$ 2.400,00', status: 'Cancelada', date: '09/09/2026' },
  { id: 4, number: '0004', client: 'Boutique Lima', value: 'R$ 3.100,00', status: 'Emitida', date: '08/09/2026' },
];

const chartData = [
  { month: 'Jan', value: 35 },
  { month: 'Fev', value: 58 },
  { month: 'Mar', value: 72 },
  { month: 'Abr', value: 50 },
  { month: 'Mai', value: 90 },
  { month: 'Jun', value: 68 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Olá, {user?.username}</h2>
          <p>Resumo da sua confecção: produção, pedidos e faturamento.</p>
        </div>
        <button type="button" className={styles.primaryButton} onClick={() => navigate('/emitir')}>
          Emitir nota
        </button>
      </header>

      <section className={styles.grid}>
        {stats.map((card) => (
          <article key={card.title} className={`${styles.card} ${styles[card.color]}`}>
            <div className={styles.cardTop}>
              <div className={styles.iconCircle}>{card.icon}</div>
              <span className={`${styles.trend} ${card.up ? styles.up : styles.down}`}>
                <TrendIcon up={card.up} /> {card.trend}
              </span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.value}>{card.value}</span>
              <span className={styles.label}>{card.title}</span>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.actionsGrid}>
        {quickActions.map((action) => (
          <NavLink key={action.to} to={action.to} className={styles.actionButton}>
            {action.icon} <span>{action.label}</span>
          </NavLink>
        ))}
      </section>

      <section className={styles.lowerGrid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Faturamento mensal</h3>
            <span className={styles.subtitle}>Últimos 6 meses</span>
          </div>
          <div className={styles.chart}>
            {chartData.map((item) => (
              <div key={item.month} className={styles.column}>
                <span className={styles.barValue}>R$ {item.value}k</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className={styles.month}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Produção em andamento</h3>
            <NavLink to="/producao" className={styles.cardLink}>Ver todas</NavLink>
          </div>
          <div className={styles.opList}>
            {productionOrders.map((op) => (
              <div key={op.id} className={styles.opItem}>
                <div className={styles.opTop}>
                  <span className={styles.opName}>
                    <span className={styles.opId}>{op.id}</span> {op.item}
                  </span>
                  <span className={styles.opMeta}>{op.progress}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${op.progress}%` }} />
                </div>
                <span className={styles.opMeta}>{op.qty} peças · entrega {op.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.lowerGrid}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Próximas entregas</h3>
            <NavLink to="/pedidos" className={styles.cardLink}>Ver pedidos</NavLink>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Peças</th>
                <th>Entrega</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDeliveries.map((order) => (
                <tr key={order.id}>
                  <td className={styles.numberCell}>{order.id}</td>
                  <td>{order.client}</td>
                  <td>{order.pieces}</td>
                  <td className={styles.dateCell}>{order.date}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[deliveryStatus[order.status]]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Estoque baixo</h3>
            <NavLink to="/estoque" className={styles.cardLink}>Ver estoque</NavLink>
          </div>
          <ul className={styles.stockList}>
            {lowStock.map((stock) => (
              <li key={stock.item} className={styles.stockItem}>
                <div className={styles.stockInfo}>
                  <span className={styles.stockName}>{stock.item}</span>
                  <span className={styles.stockMeta}>{stock.min}</span>
                </div>
                <span className={styles.stockQty}>
                  <AlertIcon /> {stock.left}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Notas recentes</h3>
            <NavLink to="/notas" className={styles.cardLink}>Ver notas</NavLink>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentNotes.map((note) => (
                <tr key={note.id}>
                  <td className={styles.numberCell}>{note.number}</td>
                  <td>{note.client}</td>
                  <td>{note.value}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[note.status.toLowerCase()]}`}>
                      {note.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
