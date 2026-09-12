import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notes, statusOptions } from '../../data/notes';
import styles from './NotasPage.module.css';

export default function NotasPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('');

  const statusFilter = searchParams.get('status');
  const statusLabel = statusOptions.find((s) => s.param === statusFilter)?.label;

  const filteredNotes = notes.filter(
    (note) =>
      (note.client.toLowerCase().includes(filter.toLowerCase()) ||
        note.number.includes(filter)) &&
      (!statusFilter || note.status.toLowerCase() === statusFilter)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Notas fiscais</h2>
          <p>Gerencie as notas fiscais emitidas.</p>
        </div>
        <button type="button" className={styles.primaryButton} onClick={() => navigate('/emitir')}>
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

      {statusLabel && (
        <div className={styles.activeFilter}>
          <span>
            Status: <strong>{statusLabel}</strong>
          </span>
          <button type="button" onClick={() => setSearchParams({})} aria-label="Limpar filtro">
            &times;
          </button>
        </div>
      )}

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
