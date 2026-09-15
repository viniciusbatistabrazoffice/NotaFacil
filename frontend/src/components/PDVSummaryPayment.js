import { Icon } from './Icon';
import { formatCurrency } from '../utils/orders';

const PAYMENT_METHOD_ICONS = {
  cash: 'dollar-sign',
  card: 'credit-card',
  pix: 'zap',
};

const PAYMENT_METHOD_LABELS = {
  cash: 'Dinheiro',
  card: 'Cartão',
  pix: 'PIX',
};

export function PDVSummaryPayment({ method, details, total }) {
  const getPaymentIcon = (paymentMethod) => {
    return PAYMENT_METHOD_ICONS[paymentMethod] || 'credit-card';
  };

  const renderPaymentDetails = () => {
    switch (method) {
      case 'card':
        return (
          <div className="pdv-payment-details">
            <div className="pdv-payment-detail-row">
              <span className="pdv-payment-label">Titular</span>
              <span className="pdv-payment-value">{details.cardHolder}</span>
            </div>
            <div className="pdv-payment-detail-row">
              <span className="pdv-payment-label">Número</span>
              <span className="pdv-payment-value">
                ****-****-****-{details.cardNumber?.slice(-4)}
              </span>
            </div>
          </div>
        );
      case 'pix':
        return (
          <div className="pdv-payment-details">
            <div className="pdv-payment-detail-row">
              <span className="pdv-payment-label">Chave PIX</span>
              <span className="pdv-payment-value">{details.pixKey}</span>
            </div>
          </div>
        );
      case 'cash':
        const change = parseFloat(details.cashAmount) - total;
        return (
          <div className="pdv-payment-details">
            <div className="pdv-payment-detail-row">
              <span className="pdv-payment-label">Valor Recebido</span>
              <span className="pdv-payment-value">
                {formatCurrency(details.cashAmount)}
              </span>
            </div>
            <div className="pdv-payment-detail-row pdv-payment-change">
              <span className="pdv-payment-label">Troco</span>
              <span className="pdv-payment-value">
                {formatCurrency(change)}
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pdv-summary-card">
      <div className="pdv-summary-card-header">
        <Icon name={getPaymentIcon(method)} size={20} />
        <h2>Pagamento</h2>
      </div>

      <div className="pdv-payment-method">
        <div className="pdv-payment-method-badge">
          {PAYMENT_METHOD_LABELS[method]}
        </div>
      </div>

      {renderPaymentDetails()}
    </div>
  );
}
