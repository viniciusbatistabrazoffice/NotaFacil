import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PDVSummaryProducts } from '../components/PDVSummaryProducts';
import { PDVSummaryPayment } from '../components/PDVSummaryPayment';
import { PDVSummaryTotal } from '../components/PDVSummaryTotal';
import { SaleReceiptModal } from '../components/SaleReceiptModal';
import { useCheckout } from '../contexts/CheckoutContext';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { translateError } from '../utils/errors';

export function PDVSummaryPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { cart, paymentMethod, paymentDetails, clearCart } = useCheckout();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [completedSale, setCompletedSale] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="pdv-summary-container">
        <div className="pdv-summary-header">
          <div className="pdv-summary-header-content">
            <div className="pdv-summary-header-title">
              <h1>Carrinho Vazio</h1>
              <p>Volte para selecionar produtos</p>
            </div>
          </div>
        </div>

        <div className="pdv-summary-empty">
          <Icon name="shopping-cart" size={64} />
          <h2>Nenhum produto no carrinho</h2>
          <p>Adicione produtos para continuar</p>
          <button
            type="button"
            className="pdv-summary-btn pdv-summary-btn-primary"
            onClick={() => navigate('/pdv')}
          >
            <Icon name="arrow-left" size={16} />
            Voltar para Produtos
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmSale = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      };

      const saleData = await apiRequest('/sales', {
        method: 'POST',
        body: payload,
        token,
      });

      setCompletedSale({
        ...saleData,
        items: saleData.items || cart.map((item) => ({
          productName: item.name,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      });
    } catch (err) {
      setError(translateError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCloseReceipt = () => {
    clearCart();
    navigate('/pdv', { replace: true });
  };

  if (completedSale) {
    return (
      <SaleReceiptModal
        sale={completedSale}
        paymentMethod={paymentMethod}
        paymentDetails={paymentDetails}
        onClose={handleCloseReceipt}
        onNewSale={handleCloseReceipt}
      />
    );
  }

  return (
    <div className="pdv-summary-container">
      <div className="pdv-summary-header">
        <div className="pdv-summary-header-content">
          <div className="pdv-summary-header-title">
            <h1>Resumo da Venda</h1>
            <p>Revise os dados antes de confirmar</p>
          </div>
          <div className="pdv-summary-breadcrumb">
            <span className="pdv-summary-breadcrumb-step">
              <span className="pdv-summary-breadcrumb-number">1</span>
              Produtos
            </span>
            <span className="pdv-summary-breadcrumb-arrow">→</span>
            <span className="pdv-summary-breadcrumb-step">
              <span className="pdv-summary-breadcrumb-number">2</span>
              Pagamento
            </span>
            <span className="pdv-summary-breadcrumb-arrow">→</span>
            <span className="pdv-summary-breadcrumb-step active">
              <span className="pdv-summary-breadcrumb-number">3</span>
              Resumo
            </span>
          </div>
        </div>
      </div>

      <div className="pdv-summary-content">
        <div className="pdv-summary-main">
          <PDVSummaryProducts items={cart} />
          <PDVSummaryPayment
            method={paymentMethod}
            details={paymentDetails}
            total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          />
        </div>

        <PDVSummaryTotal
          items={cart}
          onConfirm={handleConfirmSale}
          onBack={() => navigate('/pdv/pagamento')}
          loading={saving}
          error={error}
        />
      </div>
    </div>
  );
}
