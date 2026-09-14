import { Modal } from './Modal';

export function DeleteProductModal({ product, deleting, error, onClose, onConfirm }) {
  return (
    <Modal title="Excluir produto" busy={deleting} onClose={onClose}>
      <div className="user-modal-body">
        <p className="user-modal-text">
          Tem certeza que deseja excluir <strong>{product.name}</strong>? Esta
          ação não pode ser desfeita.
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
          {deleting ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </Modal>
  );
}
