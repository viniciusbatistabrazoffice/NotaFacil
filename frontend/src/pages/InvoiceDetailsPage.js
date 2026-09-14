import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchMockInvoiceById } from '../services/mockInvoices';
import { translateError } from '../utils/errors';
import { formatCurrency, formatDate, formatOrderId } from '../utils/orders';
import {
  formatInvoiceNumber,
  getInvoiceStatusLabel,
  getInvoiceStatusVariant,
} from '../utils/invoices';

export function InvoiceDetailsPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetchMockInvoiceById(id)
      .then(setInvoice)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="dashboard-content">
      <Link to="/notas-fiscais" className="order-back-link">
        ← Voltar para notas fiscais
      </Link>

      {loading ? (
        <div className="dash-card">
          <p className="orders-empty">Carregando nota fiscal...</p>
        </div>
      ) : error ? (
        <div className="dash-card">
          <p className="form-error m-3">{error}</p>
        </div>
      ) : (
        invoice && (
          <>
            <div className="order-detail-header">
              <h1>{formatInvoiceNumber(invoice.number)}</h1>
              <span
                className={`status-badge status-badge--${getInvoiceStatusVariant(invoice.status)}`}
              >
                {getInvoiceStatusLabel(invoice.status)}
              </span>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <h2>Informações</h2>
              </div>
              <div className="order-info-grid">
                <div className="order-info-item">
                  <span className="order-info-label">Cliente</span>
                  <span className="order-info-value">{invoice.clientName}</span>
                </div>
                <div className="order-info-item">
                  <span className="order-info-label">Pedido</span>
                  <span className="order-info-value">
                    <Link to={`/pedidos/${invoice.orderId}`}>
                      {formatOrderId(invoice.orderId)}
                    </Link>
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="order-info-label">Data de emissão</span>
                  <span className="order-info-value">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="order-info-label">Valor total</span>
                  <span className="order-info-value">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
                {invoice.notes && (
                  <div className="order-info-item order-info-item--full">
                    <span className="order-info-label">Observações</span>
                    <span className="order-info-value">{invoice.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
