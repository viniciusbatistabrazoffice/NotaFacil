import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { fetchMockTickets } from '../services/mockTickets';

export function InboxWidget() {
  const [openTickets, setOpenTickets] = useState(0);

  useEffect(() => {
    fetchMockTickets({ status: 'open' }).then((tickets) => {
      setOpenTickets(tickets.length);
    });
  }, []);

  return (
    <div className="sidebar-inbox">
      <Link to="/ajuda" className="inbox-card">
        <div className="inbox-card-icon">
          <Icon name="help" size={20} />
        </div>
        <div className="inbox-card-content">
          <span className="inbox-card-label">Atendimentos</span>
          <span className="inbox-card-count">{openTickets}</span>
        </div>
        <div className="inbox-card-badge">{openTickets > 0 && openTickets}</div>
      </Link>
      <p className="inbox-card-hint">Chamados abertos</p>
    </div>
  );
}
