import { Modal } from './Modal';
import { formatOrderId } from '../utils/orders';

export function DeleteOrderModal({ order, deleting, error, onClose, onConfirm }) {
  return (
    <Modal title="Remover pedido" busy={deleting} onClose={onClose}>
      <div className="user-modal-body">
        <p className="user-modal-text">
          Tem certeza que deseja remover o pedido{' '}
          <strong>{formatOrderId(order.id)}</strong> de{' '}
          <strong>{order.clientName}</strong>? Esta ação não pode ser desfeita.
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
