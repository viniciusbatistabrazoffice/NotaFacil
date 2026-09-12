import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';
import {
  formatCurrency,
  formatDate,
  formatOrderId,
  getStatusLabel,
  getStatusVariant,
} from '../utils/orders';

export function OrderDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    apiRequest(`/orders/${id}`, { token })
      .then(setOrder)
      .catch((err) => setError(translateError(err)))
      .finally(() => setLoading(false));
  }, [token, id]);

  return (
    <div className="dashboard-content">
      <Link to="/pedidos" className="order-back-link">
        ← Voltar para pedidos
      </Link>

      {loading ? (
        <div className="dash-card">
          <p className="orders-empty">Carregando pedido...</p>
        </div>
      ) : error ? (
        <div className="dash-card">
          <p className="form-error m-3">{error}</p>
        </div>
      ) : (
        order && (
          <>
            <div className="order-detail-header">
              <h1>Pedido {formatOrderId(order.id)}</h1>
              <span
                className={`status-badge status-badge--${getStatusVariant(order.status)}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="dash-card mb-4">
              <div className="dash-card-header">
                <h2>Informações</h2>
              </div>
              <div className="order-info-grid">
                <div className="order-info-item">
                  <span className="order-info-label">Cliente</span>
                  <span className="order-info-value">{order.clientName}</span>
                </div>
                <div className="order-info-item">
                  <span className="order-info-label">Data do pedido</span>
                  <span className="order-info-value">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="order-info-label">Previsão de entrega</span>
                  <span className="order-info-value">
                    {formatDate(order.deliveryDate)}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="order-info-label">Total de peças</span>
                  <span className="order-info-value">{order.itemsCount}</span>
                </div>
                {order.notes && (
                  <div className="order-info-item order-info-item--full">
                    <span className="order-info-label">Observações</span>
                    <span className="order-info-value">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <h2>Itens do pedido</h2>
              </div>
              <div className="table-responsive">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço unitário</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                        <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                    <tr className="order-total-row">
                      <td colSpan="3">Total do pedido</td>
                      <td>{formatCurrency(order.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
