import { Icon } from './Icon';
import { formatDate } from '../utils/orders';

function SupplierRow({ supplier, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <strong>{supplier.name}</strong>
        <span className="dash-table-muted d-block">{supplier.document}</span>
      </td>
      <td>{supplier.category}</td>
      <td>{supplier.email}</td>
      <td>{supplier.phone}</td>
      <td>
        {supplier.city}/{supplier.state}
      </td>
      <td>{formatDate(supplier.createdAt)}</td>
      <td>
        <div className="users-actions">
          <button
            type="button"
            className="icon-btn"
            title="Editar"
            aria-label={`Editar ${supplier.name}`}
            onClick={() => onEdit(supplier)}
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            title="Excluir"
            aria-label={`Excluir ${supplier.name}`}
            onClick={() => onDelete(supplier)}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function SuppliersTable({ suppliers, loading, error, onEdit, onDelete }) {
  return (
    <div className="dash-card">
      {error && <p className="form-error m-3">{error}</p>}
      <div className="table-responsive">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Fornecedor</th>
              <th>Categoria</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Cidade/UF</th>
              <th>Criado em</th>
              <th className="users-col-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="orders-empty">
                  Carregando fornecedores...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan="7" className="orders-empty">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <SupplierRow
                  key={supplier.id}
                  supplier={supplier}
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
