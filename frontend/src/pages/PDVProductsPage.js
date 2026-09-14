import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useCheckout } from '../contexts/CheckoutContext';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/orders';

export function PDVProductsPage() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCheckout();
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.code?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = (product) => {
    const quantity = parseInt(selectedQuantities[product.id] || 1, 10);
    addToCart(product, quantity);
    setSelectedQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const handleQuantityChange = (productId, quantity) => {
    const numQuantity = parseInt(quantity, 10);
    if (numQuantity > 0) {
      setSelectedQuantities((prev) => ({ ...prev, [productId]: numQuantity }));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div className="checkout-page-header">
        <div className="checkout-page-header-content">
          <div>
            <h1 className="checkout-page-title">Ponto de Venda</h1>
            <p className="checkout-page-subtitle">Selecione os produtos para processar a venda</p>
          </div>
          <div className="checkout-page-breadcrumb">
            <span className="breadcrumb-step active">
              <span className="breadcrumb-number">1</span>
              <span className="breadcrumb-label">Produtos</span>
            </span>
            <span className="breadcrumb-arrow">→</span>
            <span className="breadcrumb-step">
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
          <div className="checkout-products-container">
            <div className="products-search-bar">
              <div className="search-input-wrapper">
                <Icon name="search" size={16} />
                <input
                  type="search"
                  placeholder="Buscar produtos por nome ou código..."
                  aria-label="Buscar produtos"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="search-input"
                />
              </div>
              <div className="search-info">
                {filteredProducts.length} produto(s) encontrado(s)
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="products-list">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Carregando produtos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <Icon name="products" size={48} />
                  <p>Nenhum produto encontrado</p>
                  <small>Tente ajustar sua busca</small>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-item-content">
                      <div className="product-item-header">
                        <h3 className="product-item-name">{product.name}</h3>
                        {product.code && (
                          <span className="product-item-code">{product.code}</span>
                        )}
                      </div>
                      {product.category && (
                        <p className="product-item-category">{product.category}</p>
                      )}
                      <div className="product-item-price">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                    <div className="product-item-actions">
                      <div className="quantity-input-group">
                        <input
                          type="number"
                          min="1"
                          value={selectedQuantities[product.id] || 1}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="quantity-input"
                          aria-label="Quantidade"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-add-to-cart"
                        onClick={() => handleAddProduct(product)}
                        title="Adicionar ao carrinho"
                      >
                        <Icon name="plus" size={16} />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="cart-panel">
            <div className="cart-panel-header">
              <h2 className="cart-panel-title">
                <Icon name="shopping-cart" size={18} />
                Carrinho
              </h2>
              <span className="cart-badge">{cart.length}</span>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <Icon name="shopping-cart" size={40} />
                <p>Carrinho vazio</p>
                <small>Adicione produtos para continuar</small>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-meta">
                          <span className="cart-item-qty">{item.quantity}x</span>
                          <span className="cart-item-unit-price">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="cart-item-total-price">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                      <div className="cart-item-controls">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value, 10))
                          }
                          className="cart-qty-input"
                          aria-label="Quantidade no carrinho"
                        />
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => removeFromCart(item.id)}
                          title="Remover do carrinho"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-section">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="cart-total-row">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                </div>
              </>
            )}

            <div className="cart-actions">
              <button
                type="button"
                className="btn-action btn-cancel"
                onClick={() => navigate('/')}
              >
                <Icon name="x" size={16} />
                Cancelar
              </button>
              <button
                type="button"
                className="btn-action btn-continue"
                onClick={() => navigate('/pdv/pagamento')}
                disabled={cart.length === 0}
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
