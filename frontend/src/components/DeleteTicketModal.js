import { Modal } from './Modal';

export function DeleteTicketModal({ ticket, deleting, error, onClose, onConfirm }) {
  return (
    <Modal title="Remover chamado" busy={deleting} onClose={onClose}>
      <div className="user-modal-body">
        <p className="user-modal-text">
          Tem certeza que deseja remover o chamado{' '}
          <strong>{ticket.subject}</strong>? Esta ação não pode ser desfeita.
        </p>
        {error && <p className="form-error">{error}</p>}
      </div>
      <div className="user-modal-footer">
        <button
          type="button"
          className="dash-btn dash-btn--ghost"
          onClick={onClose}
          disabled={deleting}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="dash-btn dash-btn--danger"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Removendo...' : 'Remover'}
        </button>
      </div>
    </Modal>
  );
}
