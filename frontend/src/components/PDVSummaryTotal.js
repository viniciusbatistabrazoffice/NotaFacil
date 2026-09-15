import { Icon } from './Icon';
import { formatCurrency } from '../utils/orders';

export function PDVSummaryTotal({ items, onConfirm, onBack, loading, error }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pdv-summary-card pdv-summary-total-card">
      <div className="pdv-summary-total-content">
        <div className="pdv-summary-total-stats">
          <div className="pdv-summary-stat">
            <span className="pdv-summary-stat-label">Produtos</span>
            <span className="pdv-summary-stat-value">{items.length}</span>
          </div>
          <div className="pdv-summary-stat">
            <span className="pdv-summary-stat-label">Itens</span>
            <span className="pdv-summary-stat-value">{itemsCount}</span>
          </div>
        </div>

        <div className="pdv-summary-divider" />

        <div className="pdv-summary-total-amount">
          <span className="pdv-summary-total-label">Total</span>
          <span className="pdv-summary-total-value">
            {formatCurrency(total)}
          </span>
        </div>

        {error && (
          <div className="pdv-summary-error">
            <Icon name="alert-circle" size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="pdv-summary-actions">
          <button
            type="button"
            className="pdv-summary-btn pdv-summary-btn-secondary"
            onClick={onBack}
            disabled={loading}
          >
            <Icon name="arrow-left" size={16} />
            Voltar
          </button>
          <button
            type="button"
            className="pdv-summary-btn pdv-summary-btn-primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="pdv-summary-spinner" />
                Processando...
              </>
            ) : (
              <>
                <Icon name="check" size={16} />
                Confirmar Venda
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
