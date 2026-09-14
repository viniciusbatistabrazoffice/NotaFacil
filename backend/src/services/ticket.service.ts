import { Order } from '../entities/tenant/Order';
import { OrderItem } from '../entities/tenant/OrderItem';
import { OrderService } from './order.service';

const orderService = new OrderService();

export const MAX_TICKET_VOLUMES = 20;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
  }
  return new Date(value).toLocaleDateString('pt-BR');
}

function renderItems(items: OrderItem[]): string {
  if (items.length === 0) {
    return '<li class="empty">Nenhum item</li>';
  }
  return items
    .map(
      (item) =>
        `<li><span class="qty">${item.quantity}&times;</span>${escapeHtml(item.productName)}</li>`,
    )
    .join('');
}

function renderTicket(
  order: Order & { itemsCount: number },
  volume: number,
  volumes: number,
): string {
  const itemsCount = order.itemsCount ?? 0;
  return `
    <section class="ticket">
      <div class="ticket-head">
        <span class="brand">NotaF&aacute;cil</span>
        ${volumes > 1 ? `<span class="volume">Volume ${volume}/${volumes}</span>` : ''}
      </div>
      <div class="order-block">
        <span class="label">Pedido</span>
        <span class="order-id">#${order.id}</span>
      </div>
      <dl class="fields">
        <div class="field">
          <dt>Cliente</dt>
          <dd>${escapeHtml(order.clientName)}</dd>
        </div>
        <div class="field">
          <dt>Entrega prevista</dt>
          <dd>${formatDate(order.deliveryDate)}</dd>
        </div>
      </dl>
      <div class="contents">
        <span class="label">Conte&uacute;do (${itemsCount} ${itemsCount === 1 ? 'pe&ccedil;a' : 'pe&ccedil;as'})</span>
        <ul class="items">${renderItems(order.items)}</ul>
      </div>
      ${order.notes ? `<div class="notes"><span class="label">Observa&ccedil;&otilde;es</span><p>${escapeHtml(order.notes)}</p></div>` : ''}
      <div class="ticket-foot">Emitido em ${new Date().toLocaleString('pt-BR')}</div>
    </section>`;
}

function renderDocument(order: Order & { itemsCount: number }, volumes: number): string {
  const tickets = Array.from({ length: volumes }, (_, i) =>
    renderTicket(order, i + 1, volumes),
  ).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ticket do pedido #${order.id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #e5e7eb; color: #111; }
  .toolbar {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    padding: 10px; background: #1f2937; color: #fff; font-size: 14px;
  }
  .toolbar label { display: flex; align-items: center; gap: 6px; }
  .toolbar input {
    width: 56px; padding: 4px 6px; border-radius: 6px;
    border: 1px solid #4b5563; background: #111827; color: #fff; font-size: 14px;
  }
  .toolbar button {
    padding: 6px 18px; border: none; border-radius: 6px;
    background: #2563eb; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .toolbar button:hover { background: #1d4ed8; }
  .tickets { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px; }
  .ticket {
    width: 100mm; min-height: 140mm; padding: 6mm;
    background: #fff; border: 1.5px solid #111;
    display: flex; flex-direction: column; gap: 4mm;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .ticket-head {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 2mm; border-bottom: 1.5px solid #111; font-size: 11px;
  }
  .brand { font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  .volume { font-weight: 600; }
  .label { font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #555; }
  .order-block .order-id { display: block; font-size: 34px; font-weight: 800; line-height: 1.05; }
  .fields { display: flex; flex-direction: column; gap: 2.5mm; }
  .field dd { font-size: 15px; font-weight: 700; }
  .contents { border-top: 1px dashed #999; padding-top: 3mm; }
  .items { list-style: none; margin-top: 1.5mm; }
  .items li { display: flex; gap: 8px; padding: 1mm 0; font-size: 13px; border-bottom: 1px dotted #ccc; }
  .items li:last-child { border-bottom: none; }
  .items .qty { min-width: 32px; font-weight: 700; }
  .items .empty { color: #777; border-bottom: none; }
  .notes { border-top: 1px dashed #999; padding-top: 3mm; }
  .notes p { margin-top: 1mm; font-size: 12px; white-space: pre-wrap; }
  .ticket-foot { margin-top: auto; padding-top: 2mm; border-top: 1px solid #111; font-size: 9px; color: #555; }
  @media print {
    body { background: #fff; }
    .toolbar { display: none; }
    .tickets { padding: 0; gap: 0; }
    .ticket {
      width: auto; min-height: auto; border: none; box-shadow: none;
      page-break-after: always; break-after: page;
    }
    .ticket:last-child { page-break-after: auto; break-after: auto; }
    @page { size: 100mm 150mm; margin: 4mm; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <label for="volumes">Volumes</label>
    <input id="volumes" type="number" min="1" max="${MAX_TICKET_VOLUMES}" value="${volumes}">
    <button type="button" id="print-btn">Imprimir</button>
  </div>
  <div class="tickets">${tickets}</div>
  <script>
    (function () {
      var input = document.getElementById('volumes');
      input.addEventListener('change', function () {
        var n = parseInt(input.value, 10) || 1;
        n = Math.min(${MAX_TICKET_VOLUMES}, Math.max(1, n));
        var params = new URLSearchParams(location.search);
        params.set('volumes', n);
        location.search = params.toString();
      });
      document.getElementById('print-btn').addEventListener('click', function () {
        window.print();
      });
      window.addEventListener('load', function () {
        setTimeout(function () { window.print(); }, 150);
      });
    })();
  </script>
</body>
</html>`;
}

export class TicketService {
  async generateOrderTicket(
    schemaName: string,
    orderId: number,
    volumes = 1,
  ): Promise<string> {
    const order = await orderService.findById(schemaName, orderId);
    return renderDocument(order, volumes);
  }
}
