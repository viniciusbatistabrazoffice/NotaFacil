import { Icon } from './Icon';
import { formatCurrency } from '../utils/orders';

const PAYMENT_METHOD_LABELS = {
  cash: 'Dinheiro',
  card: 'Cartao',
  pix: 'PIX',
  credit_card: 'Cartao de Credito',
  debit_card: 'Cartao de Debito',
  bank_transfer: 'Transferencia',
  boleto: 'Boleto',
};

function formatDateTime(value) {
  if (!value) return new Date().toLocaleString('pt-BR');
  return new Date(value).toLocaleString('pt-BR');
}

function buildPrintHTML(receiptEl) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Recibo - NotaFacil</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 80mm;
    font-family: 'Courier New', Courier, monospace;
    font-size: 11px;
    color: #1f2937;
    line-height: 1.5;
    padding: 8mm;
  }
  .receipt-header { text-align: center; margin-bottom: 6px; }
  .receipt-company-name {
    font-size: 18px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
  }
  .receipt-subtitle {
    font-size: 10px; color: #6b7280;
    text-transform: uppercase; letter-spacing: 1px; margin: 4px 0 8px;
  }
  .receipt-divider {
    border: none; border-top: 1px dashed #999; margin: 8px 0;
  }
  .receipt-divider-double { border-top-width: 2px; }
  .receipt-info { display: flex; flex-direction: column; gap: 2px; }
  .receipt-info-row {
    display: flex; justify-content: space-between; font-size: 10px;
  }
  .receipt-info-row span:first-child { color: #6b7280; }
  .receipt-info-row span:last-child { font-weight: 600; }
  .receipt-items-header {
    display: grid; grid-template-columns: 1fr 30px 60px 60px;
    gap: 4px; font-size: 9px; font-weight: 700;
    text-transform: uppercase; color: #6b7280; padding: 2px 0;
  }
  .receipt-items { display: flex; flex-direction: column; gap: 3px; }
  .receipt-item {
    display: grid; grid-template-columns: 1fr 30px 60px 60px;
    gap: 4px; font-size: 10px;
  }
  .receipt-col-desc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .receipt-col-qty { text-align: center; }
  .receipt-col-price, .receipt-col-total { text-align: right; }
  .receipt-totals, .receipt-payment {
    display: flex; flex-direction: column; gap: 2px;
  }
  .receipt-total-row {
    display: flex; justify-content: space-between; font-size: 11px;
  }
  .receipt-total-final {
    font-size: 14px; font-weight: 700; margin-top: 2px; padding-top: 2px;
  }
  .receipt-discount span:last-child { color: #dc2626; }
  .receipt-change span:last-child { color: #10b981; font-weight: 700; }
  .receipt-footer { text-align: center; margin-top: 4px; }
  .receipt-footer p { margin: 4px 0; font-size: 11px; font-weight: 600; }
  .receipt-footer-small { font-size: 9px !important; color: #9ca3af; font-weight: 400 !important; }
</style>
</head>
<body>${receiptEl.innerHTML}</body>
</html>`;
}

export function SaleReceiptModal({ sale, paymentMethod, paymentDetails, onClose, onNewSale }) {
  const items = sale?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.unitPrice ?? item.price ?? 0);
    const qty = Number(item.quantity ?? 0);
    return sum + price * qty;
  }, 0);
  const discount = Number(sale?.discount ?? 0);
  const total = Number(sale?.total ?? subtotal - discount);
  const amountPaid = Number(
    sale?.amountPaid ?? paymentDetails?.cashAmount ?? total
  );
  const change = Number(sale?.change ?? Math.max(0, amountPaid - total));

  const handlePrint = () => {
    const receiptEl = document.getElementById('receipt-print-area');
    if (!receiptEl) return;

    const printWindow = window.open('', '_blank', 'width=350,height=600');
    if (!printWindow) return;

    printWindow.document.write(buildPrintHTML(receiptEl));
    printWindow.document.close();
    printWindow.focus();
    printWindow.onafterprint = () => printWindow.close();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <div className="receipt-modal-backdrop" onClick={onClose}>
      <div
        className="receipt-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-modal-actions">
          <button
            type="button"
            className="receipt-btn receipt-btn-print"
            onClick={handlePrint}
          >
            <Icon name="printer" size={16} />
            Imprimir
          </button>
          <button
            type="button"
            className="receipt-btn receipt-btn-new-sale"
            onClick={onNewSale}
          >
            <Icon name="plus" size={16} />
            Nova Venda
          </button>
          <button
            type="button"
            className="receipt-btn receipt-btn-close"
            onClick={onClose}
          >
            <Icon name="close" size={16} />
            Fechar
          </button>
        </div>

        <div className="receipt-paper" id="receipt-print-area">
          <div className="receipt-header">
            <h2 className="receipt-company-name">NotaFacil</h2>
            <p className="receipt-subtitle">Comprovante de Venda</p>
            <div className="receipt-divider receipt-divider-double" />
          </div>

          <div className="receipt-info">
            <div className="receipt-info-row">
              <span>Venda:</span>
              <span>#{(sale?.id || '').substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="receipt-info-row">
              <span>Data:</span>
              <span>{formatDateTime(sale?.createdAt)}</span>
            </div>
            {sale?.clientName && (
              <div className="receipt-info-row">
                <span>Cliente:</span>
                <span>{sale.clientName}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider" />

          <div className="receipt-items-header">
            <span className="receipt-col-desc">Item</span>
            <span className="receipt-col-qty">Qtd</span>
            <span className="receipt-col-price">Preco</span>
            <span className="receipt-col-total">Total</span>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-items">
            {items.map((item, index) => {
              const price = Number(item.unitPrice ?? item.price ?? 0);
              const qty = Number(item.quantity ?? 0);
              return (
                <div key={item.id || index} className="receipt-item">
                  <span className="receipt-col-desc">{item.productName || item.name}</span>
                  <span className="receipt-col-qty">{qty}</span>
                  <span className="receipt-col-price">{formatCurrency(price)}</span>
                  <span className="receipt-col-total">{formatCurrency(price * qty)}</span>
                </div>
              );
            })}
          </div>

          <div className="receipt-divider" />

          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="receipt-total-row receipt-discount">
                <span>Desconto:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="receipt-total-row receipt-total-final">
              <span>TOTAL:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="receipt-payment">
            <div className="receipt-total-row">
              <span>Pagamento:</span>
              <span>{PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod || 'N/A'}</span>
            </div>
            <div className="receipt-total-row">
              <span>Valor Pago:</span>
              <span>{formatCurrency(amountPaid)}</span>
            </div>
            {change > 0 && (
              <div className="receipt-total-row receipt-change">
                <span>Troco:</span>
                <span>{formatCurrency(change)}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider receipt-divider-double" />

          <div className="receipt-footer">
            <p>Obrigado pela compra!</p>
            <p className="receipt-footer-small">NotaFacil - Sistema de Gestao</p>
          </div>
        </div>
      </div>
    </div>
  );
}
