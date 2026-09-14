import { Icon } from './Icon';
import { formatCurrency, formatDate } from '../utils/orders';

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <strong>{product.name}</strong>
        <span className="dash-table-muted d-block">{product.code}</span>
      </td>
      <td>{product.category}</td>
      <td>{product.sizes}</td>
      <td>{formatCurrency(product.price)}</td>
      <td>{formatDate(product.createdAt)}</td>
      <td>
        <div className="users-actions">
          <button
            type="button"
            className="icon-btn"
            title="Editar"
            aria-label={`Editar ${product.name}`}
            onClick={() => onEdit(product)}
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            title="Excluir"
            aria-label={`Excluir ${product.name}`}
            onClick={() => onDelete(product)}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ProductsTable({ products, loading, error, onEdit, onDelete }) {
  return (
    <div className="dash-card">
      {error && <p className="form-error m-3">{error}</p>}
      <div className="table-responsive">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Tamanhos</th>
              <th>Preço</th>
              <th>Criado em</th>
              <th className="users-col-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="orders-empty">
                  Carregando produtos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="orders-empty">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
