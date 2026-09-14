import { Icon } from './Icon';
import { formatDate } from '../utils/orders';
import { getInitials } from '../utils/users';

function ClientRow({ client, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div className="user-cell">
          <span className="sidebar-avatar user-cell-avatar">
            {getInitials(client.name)}
          </span>
          <strong>{client.name}</strong>
        </div>
      </td>
      <td>{client.document}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        {client.city}/{client.state}
      </td>
      <td>{formatDate(client.createdAt)}</td>
      <td>
        <div className="users-actions">
          <button
            type="button"
            className="icon-btn"
            title="Editar"
            aria-label={`Editar ${client.name}`}
            onClick={() => onEdit(client)}
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            title="Excluir"
            aria-label={`Excluir ${client.name}`}
            onClick={() => onDelete(client)}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ClientsTable({ clients, loading, error, onEdit, onDelete }) {
  return (
    <div className="dash-card">
      {error && <p className="form-error m-3">{error}</p>}
      <div className="table-responsive">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CNPJ/CPF</th>
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
                  Carregando clientes...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan="7" className="orders-empty">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
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
