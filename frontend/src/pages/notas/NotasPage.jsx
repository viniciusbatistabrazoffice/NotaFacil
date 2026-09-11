import { useState } from 'react';
import styles from './NotasPage.module.css';

const notes = [
  { id: 1, number: '0001', client: 'Cliente A', value: 'R$ 1.200,00', status: 'Emitida' },
  { id: 2, number: '0002', client: 'Cliente B', value: 'R$ 850,00', status: 'Pendente' },
  { id: 3, number: '0003', client: 'Cliente C', value: 'R$ 2.400,00', status: 'Cancelada' },
];

export default function NotasPage() {
  const [filter, setFilter] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.client.toLowerCase().includes(filter.toLowerCase()) ||
      note.number.includes(filter)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Notas fiscais</h2>
          <p>Gerencie as notas fiscais emitidas.</p>
        </div>
        <button type="button" className={styles.primaryButton}>
          Emitir nota
        </button>
      </header>

      <input
        type="text"
        placeholder="Buscar por cliente ou número..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={styles.search}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotes.map((note) => (
            <tr key={note.id}>
              <td>{note.number}</td>
              <td>{note.client}</td>
              <td>{note.value}</td>
              <td>
                <span className={`${styles.badge} ${styles[note.status.toLowerCase()]}`}>
                  {note.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
