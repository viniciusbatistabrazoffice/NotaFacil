import { Modal } from './Modal';
import { formatInvoiceNumber } from '../utils/invoices';

export function DeleteInvoiceModal({ invoice, deleting, error, onClose, onConfirm }) {
  return (
    <Modal title="Remover nota fiscal" busy={deleting} onClose={onClose}>
      <div className="user-modal-body">
        <p className="user-modal-text">
          Tem certeza que deseja remover a nota{' '}
          <strong>{formatInvoiceNumber(invoice.number)}</strong> de{' '}
          <strong>{invoice.clientName}</strong>? Esta ação não pode ser
          desfeita.
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
