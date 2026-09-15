import { Icon } from './Icon';
import { formatCurrency } from '../utils/orders';

export function PDVCart({ cart, onRemove, onUpdateQuantity, onCheckout, onCancel, disabled }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pdv-cart-panel">
      <div className="pdv-cart-header">
        <div className="pdv-cart-title-section">
          <Icon name="shopping-cart" size={20} />
          <h2>Carrinho</h2>
        </div>
        <span className="pdv-cart-badge">{itemsCount}</span>
      </div>

      {cart.length === 0 ? (
        <div className="pdv-cart-empty">
          <Icon name="shopping-cart" size={48} />
          <p>Carrinho vazio</p>
          <small>Adicione produtos para continuar</small>
        </div>
      ) : (
        <>
          <div className="pdv-cart-items">
            {cart.map((item) => (
              <div key={item.id} className="pdv-cart-item">
                <div className="pdv-cart-item-info">
                  <div className="pdv-cart-item-name">{item.name}</div>
                  <div className="pdv-cart-item-price">
                    {formatCurrency(item.price)}
                  </div>
                </div>

                <div className="pdv-cart-item-controls">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.id, parseInt(e.target.value, 10))
                    }
                    className="pdv-cart-qty-input"
                    aria-label="Quantidade"
                  />
                  <div className="pdv-cart-item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <button
                    type="button"
                    className="pdv-cart-remove-btn"
                    onClick={() => onRemove(item.id)}
                    title="Remover"
                    aria-label="Remover produto"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pdv-cart-summary">
            <div className="pdv-summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="pdv-summary-row pdv-summary-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        </>
      )}

      <div className="pdv-cart-actions">
        <button
          type="button"
          className="pdv-btn pdv-btn-secondary"
          onClick={onCancel}
          disabled={disabled}
        >
          <Icon name="x" size={16} />
          Cancelar
        </button>
        <button
          type="button"
          className="pdv-btn pdv-btn-primary"
          onClick={onCheckout}
          disabled={cart.length === 0 || disabled}
        >
          Próximo
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
}
