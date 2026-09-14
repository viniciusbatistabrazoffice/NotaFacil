import { useState } from 'react';
import { Modal } from './Modal';

const CATEGORIES = {
  income: ['Vendas', 'Serviços', 'Outros recebimentos'],
  expense: ['Insumos', 'Equipe', 'Logística', 'Operação', 'Outras despesas'],
};

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Dinheiro' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'bank_transfer', label: 'Transferência Bancária' },
  { value: 'pix', label: 'Pix' },
  { value: 'check', label: 'Cheque' },
  { value: 'other', label: 'Outro' },
];

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function FinancialTransactionModal({
  type,
  orders = [],
  saving,
  error,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    description: '',
    category: CATEGORIES[type][0],
    amount: '',
    dueDate: currentDate(),
    status: 'settled',
    paymentMethod: '',
    orderId: '',
  });

  const isIncome = type === 'income';
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      description: form.description.trim(),
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod || null,
      orderId: form.orderId ? Number(form.orderId) : null,
      type,
    });
  };

  return (
    <Modal title={isIncome ? 'Nova entrada' : 'Nova saída'} busy={saving} onClose={onClose}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="user-modal-body">
          <label className="form-field">
            <span>Descrição</span>
            <input name="description" value={form.description} onChange={handleChange} placeholder={isIncome ? 'Ex.: Recebimento de pedido' : 'Ex.: Compra de insumos'} required autoFocus />
          </label>
          <label className="form-field">
            <span>Categoria</span>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES[type].map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Valor</span>
            <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0,00" required />
          </label>
          <label className="form-field">
            <span>Data</span>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
          </label>
          <label className="form-field">
            <span>Situação</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="settled">Confirmado</option>
              <option value="pending">Pendente</option>
            </select>
          </label>
          <label className="form-field">
            <span>Forma de pagamento</span>
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="">Selecionar forma de pagamento</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Pedido relacionado</span>
            <select name="orderId" value={form.orderId} onChange={handleChange}>
              <option value="">Nenhum pedido</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} - {order.clientName}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="user-modal-footer">
          <button type="button" className="dash-btn dash-btn--ghost" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className={`dash-btn ${isIncome ? 'cash-btn-income' : 'cash-btn-expense'}`} disabled={saving}>{saving ? 'Salvando...' : isIncome ? 'Registrar entrada' : 'Registrar saída'}</button>
        </div>
      </form>
    </Modal>
  );
}