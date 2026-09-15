import { Icon } from './Icon';
import { formatCurrency } from '../utils/orders';

export function PDVSummaryProducts({ items }) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="pdv-summary-card">
      <div className="pdv-summary-card-header">
        <Icon name="shopping-bag" size={20} />
        <h2>Produtos</h2>
        <span className="pdv-summary-badge">{items.length}</span>
      </div>

      <div className="pdv-summary-items">
        {items.map((item) => (
          <div key={item.id} className="pdv-summary-item">
            <div className="pdv-summary-item-info">
              <div className="pdv-summary-item-name">{item.name}</div>
              {item.code && (
                <div className="pdv-summary-item-code">{item.code}</div>
              )}
            </div>

            <div className="pdv-summary-item-qty">
              {item.quantity}x
            </div>

            <div className="pdv-summary-item-price">
              {formatCurrency(item.price)}
            </div>

            <div className="pdv-summary-item-total">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="pdv-summary-footer">
        <div className="pdv-summary-subtotal">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
      </div>
    </div>
  );
}
