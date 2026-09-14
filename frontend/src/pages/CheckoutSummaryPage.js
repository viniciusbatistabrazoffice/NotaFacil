import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useCheckout } from '../contexts/CheckoutContext';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';
import { formatCurrency } from '../utils/orders';

const PAYMENT_METHOD_LABELS = {
  cash: 'Dinheiro',
  card: 'Cartão',
  pix: 'PIX',
};

export function CheckoutSummaryPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { cart, paymentMethod, paymentDetails, clearCart } = useCheckout();
  const [saving, setSaving] = useState(false);
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

  const handleConfirmSale = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        paymentDetails,
        total,
      };

      await apiRequest('/orders', {
        method: 'POST',
        body: payload,
        token,
      });

      clearCart();
      navigate('/caixa', { replace: true });
    } catch (err) {
      setError(translateError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="checkout-page-header">
        <div className="checkout-page-header-content">
          <div>
            <h1 className="checkout-page-title">Resumo da Venda</h1>
            <p className="checkout-page-subtitle">Revise os dados antes de confirmar</p>
          </div>
          <div className="checkout-page-breadcrumb">
            <span className="breadcrumb-step">
              <span className="breadcrumb-number">1</span>
              <span className="breadcrumb-label">Produtos</span>
            </span>
            <span className="breadcrumb-arrow">→</span>
            <span className="breadcrumb-step">
              <span className="breadcrumb-number">2</span>
              <span className="breadcrumb-label">Pagamento</span>
            </span>
            <span className="breadcrumb-arrow">→</span>
            <span className="breadcrumb-step active">
              <span className="breadcrumb-number">3</span>
              <span className="breadcrumb-label">Resumo</span>
            </span>
          </div>
        </div>
      </div>

      <div className="checkout-page-body">
        <div className="checkout-main-area">
          <div className="summary-section">
            <h2>Produtos</h2>
          <div className="summary-products">
            {cart.map((item) => (
              <div key={item.id} className="summary-product-row">
                <div className="product-info">
                  <h4>{item.name}</h4>
                  <p className="product-code">{item.code}</p>
                </div>
                <div className="product-quantity">
                  <span>{item.quantity}x</span>
                </div>
                <div className="product-unit-price">
                  <span>{formatCurrency(item.price)}</span>
                </div>
                <div className="product-total">
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <h2>Pagamento</h2>
          <div className="payment-summary">
            <div className="payment-method-display">
              <span className="label">Forma de Pagamento:</span>
              <strong>{PAYMENT_METHOD_LABELS[paymentMethod]}</strong>
            </div>

            {paymentMethod === 'card' && (
              <div className="payment-details-display">
                <p><span className="label">Titular:</span> {paymentDetails.cardHolder}</p>
                <p><span className="label">Número:</span> ****-****-****-{paymentDetails.cardNumber?.slice(-4)}</p>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="payment-details-display">
                <p><span className="label">Chave PIX:</span> {paymentDetails.pixKey}</p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="payment-details-display">
                <p><span className="label">Valor Recebido:</span> {formatCurrency(paymentDetails.cashAmount)}</p>
                <p><span className="label">Troco:</span> {formatCurrency(parseFloat(paymentDetails.cashAmount) - total)}</p>
              </div>
            )}
          </div>

          <div className="summary-divider" />

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="total-row total-final">
              <span>Total:</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

            <div className="checkout-actions">
              <button
                type="button"
                className="btn-action btn-cancel"
                onClick={() => navigate('/checkout/pagamento')}
                disabled={saving}
              >
                <Icon name="arrow-left" size={16} />
                Voltar
              </button>
              <button
                type="button"
                className="btn-action btn-continue"
                onClick={handleConfirmSale}
                disabled={saving}
              >
                {saving ? 'Processando...' : 'Confirmar Venda'}
                <Icon name="check" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
