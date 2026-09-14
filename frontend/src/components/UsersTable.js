import { Icon } from './Icon';
import { formatDate } from '../utils/orders';
import { getInitials } from '../utils/users';

function UserRow({ user, isSelf, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div className="user-cell">
          <span className="sidebar-avatar user-cell-avatar">
            {getInitials(user.name)}
          </span>
          <strong>{user.name}</strong>
          {isSelf && (
            <span className="status-badge status-badge--blue">Você</span>
          )}
        </div>
      </td>
      <td>{user.email}</td>
      <td>{formatDate(user.createdAt)}</td>
      <td>
        <div className="users-actions">
          <button
            type="button"
            className="icon-btn"
            title="Editar"
            aria-label={`Editar ${user.name}`}
            onClick={() => onEdit(user)}
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            title={
              isSelf
                ? 'Você não pode excluir sua própria conta'
                : 'Excluir'
            }
            aria-label={`Excluir ${user.name}`}
            disabled={isSelf}
            onClick={() => onDelete(user)}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function UsersTable({
  users,
  loading,
  error,
  currentUserId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="dash-card">
      {error && <p className="form-error m-3">{error}</p>}
      <div className="table-responsive">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Criado em</th>
              <th className="users-col-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="orders-empty">
                  Carregando usuários...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="orders-empty">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelf={user.id === currentUserId}
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
