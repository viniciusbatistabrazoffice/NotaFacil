import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useCheckout } from '../contexts/CheckoutContext';
import { formatCurrency } from '../utils/orders';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Dinheiro', icon: 'financial', description: 'Pagamento em dinheiro' },
  { id: 'card', name: 'Cartão', icon: 'card', description: 'Débito ou Crédito' },
  { id: 'pix', name: 'PIX', icon: 'qrcode', description: 'Transferência instantânea' },
];

export function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const { cart, paymentMethod, setPaymentMethod, paymentDetails, setPaymentDetails } = useCheckout();
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <>
        <div className="checkout-page-header">
          <h1 className="checkout-page-title">Carrinho vazio</h1>
          <p className="checkout-page-subtitle">Volte para selecionar produtos</p>
        </div>
        <div className="checkout-page-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-action btn-continue"
            onClick={() => navigate('/checkout/produtos')}
          >
            <Icon name="arrow-left" size={16} />
            Voltar para produtos
          </button>
        </div>
      </>
    );
  }

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setError('');
    setPaymentDetails({});
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (!paymentMethod) {
      setError('Selecione uma forma de pagamento');
      return;
    }

    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardHolder) {
        setError('Preencha os dados do cartão');
        return;
      }
    } else if (paymentMethod === 'pix') {
      if (!paymentDetails.pixKey) {
        setError('Informe a chave PIX');
        return;
      }
    }

    navigate('/checkout/resumo');
  };

  return (
    <>
      <div className="checkout-page-header">
        <div className="checkout-page-header-content">
          <div>
            <h1 className="checkout-page-title">Forma de Pagamento</h1>
            <p className="checkout-page-subtitle">Escolha como o cliente vai pagar</p>
          </div>
          <div className="checkout-page-breadcrumb">
            <span className="breadcrumb-step">
              <span className="breadcrumb-number">1</span>
              <span className="breadcrumb-label">Produtos</span>
            </span>
            <span className="breadcrumb-arrow">→</span>
            <span className="breadcrumb-step active">
              <span className="breadcrumb-number">2</span>
              <span className="breadcrumb-label">Pagamento</span>
            </span>
            <span className="breadcrumb-arrow">→</span>
            <span className="breadcrumb-step">
              <span className="breadcrumb-number">3</span>
              <span className="breadcrumb-label">Resumo</span>
            </span>
          </div>
        </div>
      </div>

      <div className="checkout-page-body">
        <div className="checkout-main-area">
          <div className="payment-container">
            <div className="payment-methods-grid">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`payment-method-btn ${paymentMethod === method.id ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <div className="payment-method-icon">
                    <Icon name={method.icon} size={32} />
                  </div>
                  <div className="payment-method-info">
                    <h3>{method.name}</h3>
                    <p>{method.description}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <div className="payment-method-check">
                      <Icon name="check" size={20} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {paymentMethod === 'card' && (
              <div className="payment-form-section">
                <h3 className="form-section-title">Dados do Cartão</h3>
                <div className="form-group">
                  <label htmlFor="cardNumber">Número do Cartão</label>
                  <input
                    id="cardNumber"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={paymentDetails.cardNumber || ''}
                    onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                    className="form-input"
                    maxLength="19"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardHolder">Titular do Cartão</label>
                  <input
                    id="cardHolder"
                    type="text"
                    placeholder="Nome do titular"
                    value={paymentDetails.cardHolder || ''}
                    onChange={(e) => handlePaymentDetailsChange('cardHolder', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Validade</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      placeholder="MM/AA"
                      value={paymentDetails.cardExpiry || ''}
                      onChange={(e) => handlePaymentDetailsChange('cardExpiry', e.target.value)}
                      className="form-input"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvv">CVV</label>
                    <input
                      id="cardCvv"
                      type="text"
                      placeholder="000"
                      value={paymentDetails.cardCvv || ''}
                      onChange={(e) => handlePaymentDetailsChange('cardCvv', e.target.value)}
                      className="form-input"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="payment-form-section">
                <h3 className="form-section-title">Chave PIX</h3>
                <div className="form-group">
                  <label htmlFor="pixKey">Chave PIX</label>
                  <input
                    id="pixKey"
                    type="text"
                    placeholder="CPF, Email, Telefone ou Chave Aleatória"
                    value={paymentDetails.pixKey || ''}
                    onChange={(e) => handlePaymentDetailsChange('pixKey', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="payment-form-section">
                <h3 className="form-section-title">Dinheiro</h3>
                <div className="form-group">
                  <label htmlFor="cashAmount">Valor recebido</label>
                  <input
                    id="cashAmount"
                    type="number"
                    placeholder="0.00"
                    value={paymentDetails.cashAmount || ''}
                    onChange={(e) => handlePaymentDetailsChange('cashAmount', e.target.value)}
                    className="form-input"
                    step="0.01"
                    min="0"
                  />
                </div>
                {paymentDetails.cashAmount && (
                  <div className="cash-change-info">
                    <div className="cash-change-row">
                      <span>Valor da venda:</span>
                      <strong>{formatCurrency(total)}</strong>
                    </div>
                    <div className="cash-change-row">
                      <span>Valor recebido:</span>
                      <strong>{formatCurrency(parseFloat(paymentDetails.cashAmount) || 0)}</strong>
                    </div>
                    <div className="cash-change-row total">
                      <span>Troco:</span>
                      <strong>{formatCurrency(Math.max(0, parseFloat(paymentDetails.cashAmount) - total))}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="cart-panel">
            <div className="cart-panel-header">
              <h2 className="cart-panel-title">
                <Icon name="shopping-cart" size={18} />
                Resumo
              </h2>
            </div>

            <div className="payment-summary">
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">{item.quantity}x</span>
                    </div>
                    <span className="summary-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

              <div className="summary-total-section">
                <div className="summary-total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="summary-total-row final">
                  <span>Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>
            </div>

            <div className="cart-actions">
              <button
                type="button"
                className="btn-action btn-cancel"
                onClick={() => navigate('/checkout/produtos')}
              >
                <Icon name="arrow-left" size={16} />
                Voltar
              </button>
              <button
                type="button"
                className="btn-action btn-continue"
                onClick={handleContinue}
              >
                Próximo
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
