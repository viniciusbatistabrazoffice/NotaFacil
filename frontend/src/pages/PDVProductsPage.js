import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PDVCart } from '../components/PDVCart';
import { PDVProductGrid } from '../components/PDVProductGrid';
import { useCheckout } from '../contexts/CheckoutContext';
import { useProducts } from '../hooks/useProducts';

export function PDVProductsPage() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCheckout();
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    product.code?.toLowerCase().includes(debouncedSearch.toLowerCase())
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

  return (
    <div className="pdv-container">
      <div className="pdv-header">
        <div className="pdv-header-content">
          <div className="pdv-header-title">
            <h1>Ponto de Venda</h1>
            <p>Selecione os produtos para processar a venda</p>
          </div>
          <div className="pdv-breadcrumb">
            <span className="pdv-breadcrumb-step active">
              <span className="pdv-breadcrumb-number">1</span>
              Produtos
            </span>
            <span className="pdv-breadcrumb-arrow">→</span>
            <span className="pdv-breadcrumb-step">
              <span className="pdv-breadcrumb-number">2</span>
              Pagamento
            </span>
            <span className="pdv-breadcrumb-arrow">→</span>
            <span className="pdv-breadcrumb-step">
              <span className="pdv-breadcrumb-number">3</span>
              Resumo
            </span>
          </div>
        </div>
      </div>

      <div className="pdv-content">
        <div className="pdv-main">
          <div className="pdv-search">
            <div className="pdv-search-input-wrapper">
              <Icon name="search" size={18} />
              <input
                type="search"
                placeholder="Buscar por nome ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pdv-search-input"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  className="pdv-search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Limpar busca"
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>
            <div className="pdv-search-info">
              {filteredProducts.length} produto(s)
            </div>
          </div>

          <PDVProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            selectedQuantities={selectedQuantities}
            onQuantityChange={handleQuantityChange}
            onAddProduct={handleAddProduct}
          />
        </div>

        <PDVCart
          cart={cart}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => navigate('/pdv/pagamento')}
          onCancel={() => navigate('/')}
          disabled={false}
        />
      </div>
    </div>
  );
}
