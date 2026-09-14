import { Icon } from './Icon';

export function Modal({ title, busy = false, onClose, children }) {
  return (
    <div
      className="user-modal-backdrop"
      onClick={busy ? undefined : onClose}
    >
      <div
        className="user-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="user-modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            disabled={busy}
            aria-label="Fechar"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
