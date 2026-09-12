import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notes } from '../../data/notes';
import styles from './EmitirNotaPage.module.css';

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

const FileTextIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);

const ListIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);

const InfoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const onlyDigits = (value) => value.replace(/\D/g, '');

const maskDocumento = (value) => {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

const maskTelefone = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  const masked = digits.replace(/(\d{2})(\d)/, '($1) $2');
  return digits.length <= 10
    ? masked.replace(/(\d{4})(\d)/, '$1-$2')
    : masked.replace(/(\d{5})(\d)/, '$1-$2');
};

const maskCep = (value) =>
  onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

const MASKS = { documento: maskDocumento, telefone: maskTelefone, cep: maskCep };

const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const newItem = () => ({
  id: crypto.randomUUID(),
  descricao: '',
  quantidade: 1,
  valorUnitario: '',
});

export default function EmitirNotaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tipo: 'nfse',
    dataEmissao: new Date().toISOString().slice(0, 10),
    destinatario: '',
    documento: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    desconto: '',
    observacoes: '',
  });
  const [items, setItems] = useState([newItem()]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const masked = MASKS[name] ? MASKS[name](value) : value;
    setForm((prev) => ({ ...prev, [name]: masked }));
  };

  const updateItem = (id, field, value) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

  const addItem = () => setItems((prev) => [...prev, newItem()]);

  const removeItem = (id) =>
    setItems((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev
    );

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0),
    0
  );
  const desconto = Math.min(Number(form.desconto) || 0, subtotal);
  const total = subtotal - desconto;
  const numeroNota = String(notes.length + 1).padStart(4, '0');

  const handleSubmit = (e) => {
    e.preventDefault();
    notes.push({
      id: Date.now(),
      number: numeroNota,
      client: form.destinatario,
      value: formatBRL(total),
      status: 'Emitida',
    });
    alert(`Nota fiscal ${numeroNota} emitida com sucesso!`);
    navigate('/notas');
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeftIcon /> Voltar
      </button>

      <header className={styles.header}>
        <h2>Emitir nota fiscal</h2>
        <p>Preencha os dados abaixo para emitir uma nova nota.</p>
      </header>

      <form className={styles.layout} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FileTextIcon />
              <h3>Dados da nota</h3>
            </div>

            <div className={styles.fields}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Tipo de nota</span>
                  <select name="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="nfse">NFS-e — Serviço</option>
                    <option value="nfe">NF-e — Produto</option>
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Data de emissão</span>
                  <input
                    type="date"
                    name="dataEmissao"
                    value={form.dataEmissao}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <UserIcon />
              <h3>Destinatário</h3>
            </div>

            <div className={styles.fields}>
              <label className={styles.field}>
                <span>Nome / Razão social</span>
                <input
                  type="text"
                  name="destinatario"
                  value={form.destinatario}
                  onChange={handleChange}
                  placeholder="Nome do cliente"
                  required
                />
              </label>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span>CPF/CNPJ</span>
                  <input
                    type="text"
                    name="documento"
                    value={form.documento}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Telefone</span>
                  <input
                    type="tel"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="cliente@email.com"
                />
              </label>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <MapPinIcon />
              <h3>Endereço</h3>
            </div>

            <div className={styles.fields}>
              <div className={styles.row3}>
                <label className={styles.field}>
                  <span>CEP</span>
                  <input
                    type="text"
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                  />
                </label>

                <label className={styles.field}>
                  <span>Cidade</span>
                  <input
                    type="text"
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Cidade"
                  />
                </label>

                <label className={styles.field}>
                  <span>UF</span>
                  <select name="uf" value={form.uf} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Logradouro</span>
                  <input
                    type="text"
                    name="logradouro"
                    value={form.logradouro}
                    onChange={handleChange}
                    placeholder="Rua, avenida..."
                  />
                </label>

                <label className={styles.field}>
                  <span>Número</span>
                  <input
                    type="text"
                    name="numero"
                    value={form.numero}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </label>
              </div>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Complemento</span>
                  <input
                    type="text"
                    name="complemento"
                    value={form.complemento}
                    onChange={handleChange}
                    placeholder="Sala, bloco... (opcional)"
                  />
                </label>

                <label className={styles.field}>
                  <span>Bairro</span>
                  <input
                    type="text"
                    name="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                    placeholder="Bairro"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeaderBetween}>
              <div className={styles.cardHeader}>
                <ListIcon />
                <h3>Itens da nota</h3>
              </div>
              <button type="button" className={styles.addItem} onClick={addItem}>
                <PlusIcon /> Adicionar item
              </button>
            </div>

            <div className={styles.itemsHead}>
              <span>Descrição</span>
              <span>Qtd.</span>
              <span>Valor unit.</span>
              <span>Total</span>
              <span />
            </div>

            {items.map((item) => (
              <div className={styles.itemRow} key={item.id}>
                <input
                  type="text"
                  className={styles.itemDesc}
                  value={item.descricao}
                  onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                  placeholder="Ex.: Consultoria mensal"
                  required
                />
                <input
                  type="number"
                  value={item.quantidade}
                  onChange={(e) => updateItem(item.id, 'quantidade', e.target.value)}
                  min="1"
                  step="1"
                  required
                />
                <input
                  type="number"
                  value={item.valorUnitario}
                  onChange={(e) => updateItem(item.id, 'valorUnitario', e.target.value)}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  required
                />
                <span className={styles.itemTotal}>
                  {formatBRL(
                    (Number(item.quantidade) || 0) *
                      (Number(item.valorUnitario) || 0)
                  )}
                </span>
                <button
                  type="button"
                  className={styles.removeItem}
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  aria-label="Remover item"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <InfoIcon />
              <h3>Informações adicionais</h3>
            </div>

            <div className={styles.fields}>
              <label className={styles.field}>
                <span>Observações</span>
                <textarea
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  placeholder="Informações complementares da nota (opcional)"
                  rows="3"
                />
              </label>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.secondary} onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className={styles.primary}>
              Emitir nota fiscal
            </button>
          </div>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryTitle}>Resumo da nota</span>

            <div className={styles.summaryRow}>
              <span>Número</span>
              <strong>#{numeroNota}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Tipo</span>
              <strong>{form.tipo === 'nfe' ? 'NF-e' : 'NFS-e'}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Destinatário</span>
              <strong>{form.destinatario || '—'}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Itens</span>
              <strong>{items.length}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <strong>{formatBRL(subtotal)}</strong>
            </div>

            <label className={styles.summaryField}>
              <span>Desconto (R$)</span>
              <input
                type="number"
                name="desconto"
                value={form.desconto}
                onChange={handleChange}
                placeholder="0,00"
                min="0"
                step="0.01"
              />
            </label>

            <div className={styles.divider} />

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <strong>{formatBRL(total)}</strong>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
