import { Icon } from './Icon';
import { formatDate } from '../utils/orders';
import { isLowStock } from '../utils/supplies';

function SupplyRow({ supply, onEdit, onDelete }) {
  const lowStock = isLowStock(supply);

  return (
    <tr>
      <td>
        <strong>{supply.name}</strong>
      </td>
      <td>{supply.category}</td>
      <td>
        {supply.stock} {supply.unit}
      </td>
      <td>
        {supply.minStock} {supply.unit}
      </td>
      <td>
        <span
          className={`status-badge status-badge--${lowStock ? 'amber' : 'green'}`}
        >
          {lowStock ? 'Estoque baixo' : 'Normal'}
        </span>
      </td>
      <td>{formatDate(supply.createdAt)}</td>
      <td>
        <div className="users-actions">
          <button
            type="button"
            className="icon-btn"
            title="Editar"
            aria-label={`Editar ${supply.name}`}
            onClick={() => onEdit(supply)}
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            title="Excluir"
            aria-label={`Excluir ${supply.name}`}
            onClick={() => onDelete(supply)}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function SuppliesTable({ supplies, loading, error, onEdit, onDelete }) {
  return (
    <div className="dash-card">
      {error && <p className="form-error m-3">{error}</p>}
      <div className="table-responsive">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th>Estoque mínimo</th>
              <th>Situação</th>
              <th>Criado em</th>
              <th className="users-col-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="orders-empty">
                  Carregando insumos...
                </td>
              </tr>
            ) : supplies.length === 0 ? (
              <tr>
                <td colSpan="7" className="orders-empty">
                  Nenhum insumo encontrado.
                </td>
              </tr>
            ) : (
              supplies.map((supply) => (
                <SupplyRow
                  key={supply.id}
                  supply={supply}
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
