import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '../components/Icon';
import { UserFormModal } from '../components/UserFormModal';
import { DeleteUserModal } from '../components/DeleteUserModal';
import { UsersTable } from '../components/UsersTable';
import { useUsers } from '../hooks/useUsers';
import { translateError } from '../utils/errors';
import { filterUsers } from '../utils/users';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, saveUser, deleteUser } = useUsers();
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState({ open: false, user: null });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const filteredUsers = filterUsers(users, search);

  const openForm = (user = null) => {
    setFormState({ open: true, user });
    setFormError('');
  };

  const closeForm = () => setFormState({ open: false, user: null });

  const openDelete = (user) => {
    setDeleteTarget(user);
    setDeleteError('');
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      await saveUser(formState.user?.id ?? null, payload);
      closeForm();
    } catch (err) {
      setFormError(translateError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(translateError(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-page-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie quem tem acesso à sua empresa</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn--primary"
          onClick={() => openForm()}
        >
          <Icon name="plus" size={14} />
          Novo usuário
        </button>
      </div>

      <div className="orders-filters">
        <div className="orders-search">
          <Icon name="search" size={14} />
          <input
            type="search"
            placeholder="Buscar por nome ou e-mail..."
            aria-label="Buscar usuários"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <UsersTable
        users={filteredUsers}
        loading={loading}
        error={error}
        currentUserId={currentUser?.id}
        onEdit={openForm}
        onDelete={openDelete}
      />

      {formState.open && (
        <UserFormModal
          user={formState.user}
          saving={saving}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
