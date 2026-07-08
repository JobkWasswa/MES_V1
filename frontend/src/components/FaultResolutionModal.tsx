import { useState } from 'react';

import type { AlertItem } from '../types/mes';

type ResolutionChoice = 'dismiss_log' | 'pause_process' | 'emergency_stop';

interface FaultResolutionModalProps {
  alert: AlertItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resolution: {
    alertId: string;
    choice: ResolutionChoice;
    notes: string;
  }) => void;
}

export function FaultResolutionModal({ alert, isOpen, onClose, onSubmit }: FaultResolutionModalProps) {
  const [choice, setChoice] = useState<ResolutionChoice | null>(null);
  const [notes, setNotes] = useState('');

  if (!isOpen || !alert) {
    return null;
  }

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Fault resolution</h2>
        <p style={styles.subtitle}>{alert.title}</p>

        <div style={styles.options}>
          {([
            ['dismiss_log', 'Dismiss and log'],
            ['pause_process', 'Pause process'],
            ['emergency_stop', 'Emergency stop'],
          ] as const).map(([value, label]) => (
            <label key={value} style={styles.option}>
              <input type="radio" checked={choice === value} onChange={() => setChoice(value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <label style={styles.field}>
          Notes
          <textarea style={styles.textarea} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>

        <div style={styles.actions}>
          <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button
            style={styles.submitButton}
            onClick={() => {
              if (!choice) return;
              onSubmit({ alertId: alert.id, choice, notes: notes.trim() });
              setChoice(null);
              setNotes('');
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.56)', display: 'grid', placeItems: 'center', padding: '1rem', zIndex: 50 },
  modal: { width: 'min(100%, 560px)', background: 'white', borderRadius: '1.25rem', padding: '1.25rem', boxShadow: '0 30px 90px rgba(15, 23, 42, 0.22)' },
  title: { margin: 0 },
  subtitle: { margin: '0.35rem 0 1rem', color: '#64748b' },
  options: { display: 'grid', gap: '0.75rem', marginBottom: '1rem' },
  option: { display: 'flex', gap: '0.6rem', alignItems: 'center', border: '1px solid #dbe4ee', borderRadius: '0.9rem', padding: '0.85rem 0.95rem' },
  field: { display: 'grid', gap: '0.35rem', fontWeight: 600 },
  textarea: { minHeight: '110px', borderRadius: '0.85rem', border: '1px solid #dbe4ee', padding: '0.85rem', fontSize: '1rem' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' },
  cancelButton: { border: '1px solid #cbd5e1', borderRadius: '0.85rem', padding: '0.8rem 1rem', background: 'white', cursor: 'pointer', fontWeight: 700 },
  submitButton: { border: 'none', borderRadius: '0.85rem', padding: '0.8rem 1rem', background: '#0f2741', color: 'white', cursor: 'pointer', fontWeight: 700 },
};