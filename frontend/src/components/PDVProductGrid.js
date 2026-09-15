import { Icon } from './Icon';
import { formatCurrency } from '../utils/orders';

export function PDVProductGrid({
  products,
  loading,
  error,
  selectedQuantities,
  onQuantityChange,
  onAddProduct,
}) {
  if (loading) {
    return (
      <div className="pdv-products-loading">
        <div className="pdv-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdv-products-error">
        <Icon name="alert-circle" size={48} />
        <p>Erro ao carregar produtos</p>
        <small>{error}</small>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pdv-products-empty">
        <Icon name="products" size={48} />
        <p>Nenhum produto encontrado</p>
        <small>Tente ajustar sua busca</small>
      </div>
    );
  }

  return (
    <div className="pdv-products-grid">
      {products.map((product) => (
        <div key={product.id} className="pdv-product-card">
          <div className="pdv-product-header">
            <h3 className="pdv-product-name">{product.name}</h3>
            {product.code && (
              <span className="pdv-product-code">{product.code}</span>
            )}
          </div>

          {product.category && (
            <p className="pdv-product-category">{product.category}</p>
          )}

          <div className="pdv-product-price">
            {formatCurrency(product.price)}
          </div>

          <div className="pdv-product-actions">
            <input
              type="number"
              min="1"
              value={selectedQuantities[product.id] || 1}
              onChange={(e) => onQuantityChange(product.id, e.target.value)}
              className="pdv-product-qty"
              aria-label="Quantidade"
            />
            <button
              type="button"
              className="pdv-btn pdv-btn-add"
              onClick={() => onAddProduct(product)}
              title="Adicionar ao carrinho"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
