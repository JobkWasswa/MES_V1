import { useState } from 'react';

import { useOperator } from '../contexts/OperatorContext';

interface OperatorRuntimeProps {
  stageId: string;
  onBack: () => void;
}

export function OperatorRuntime({ stageId, onBack }: OperatorRuntimeProps) {
  const { startStage, logBatch, completeStage, reportFault } = useOperator();
  const [batchValues, setBatchValues] = useState<Record<string, string>>({});
  const [batchNotes, setBatchNotes] = useState('');

  const submitBatch = async () => {
    await logBatch(stageId, 
      Object.fromEntries(
        Object.entries(batchValues).map(([k, v]) => [k, Number(v) || 0])
      ), 
      batchNotes.trim()
    );
    setBatchNotes('');
    setBatchValues({});
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.linkButton} onClick={onBack}>Back to assignments</button>
        <h1 style={styles.title}>Production Stage {stageId}</h1>

        <div style={styles.actions}>
          <button style={styles.button} onClick={() => startStage(stageId)}>Start stage</button>
          <button style={styles.button} onClick={() => completeStage(stageId, stageId)}>Complete stage</button>
          <button
            style={styles.buttonDanger}
            onClick={() => {
              const notes = window.prompt('Enter fault details');
              if (notes) {
                void reportFault({
                  stageId,
                  jobId: 'job-' + stageId,
                  title: 'Runtime fault',
                  description: notes,
                  severity: 'CRITICAL',
                  category: 'runtime',
                });
              }
            }}
          >
            Report fault
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Batch logging</h2>
        <div style={styles.batchGrid}>
          <label style={styles.field}>
            Quantity produced
            <input
              style={styles.input}
              type="number"
              value={batchValues['quantity'] ?? ''}
              onChange={(event) => setBatchValues((current) => ({ ...current, 'quantity': event.target.value }))}
            />
          </label>
          <label style={styles.field}>
            Quality Score
            <input
              style={styles.input}
              type="number"
              value={batchValues['quality'] ?? ''}
              onChange={(event) => setBatchValues((current) => ({ ...current, 'quality': event.target.value }))}
            />
          </label>
        </div>

        <label style={styles.field}>
          Batch notes
          <textarea
            style={{ ...styles.input, minHeight: '96px', resize: 'vertical' }}
            value={batchNotes}
            onChange={(event) => setBatchNotes(event.target.value)}
          />
        </label>

        <button style={styles.button} onClick={() => void submitBatch()}>Log batch</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '1.25rem',
    display: 'grid',
    gap: '1rem',
    background: '#f3f7fb',
    color: '#0f172a',
  },
  card: {
    background: 'white',
    borderRadius: '1.2rem',
    padding: '1.15rem',
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
  },
  title: { margin: '0.5rem 0 0', fontSize: '1.75rem' },
  subtitle: { margin: '0.4rem 0 0', color: '#64748b' },
  linkButton: { border: 'none', background: 'transparent', color: '#0f2741', cursor: 'pointer', padding: 0, fontWeight: 700 },
  actions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1rem' },
  button: { border: 'none', borderRadius: '0.9rem', padding: '0.9rem 1rem', background: '#0f2741', color: 'white', fontWeight: 700, cursor: 'pointer' },
  buttonDanger: { border: '1px solid #fecaca', borderRadius: '0.9rem', padding: '0.9rem 1rem', background: '#fef2f2', color: '#b91c1c', fontWeight: 700, cursor: 'pointer' },
  sectionTitle: { margin: '0 0 0.8rem', fontSize: '1.1rem' },
  list: { margin: 0, paddingLeft: '1rem', display: 'grid', gap: '0.45rem' },
  listItem: { display: 'grid', gap: '0.2rem' },
  batchGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' },
  field: { display: 'grid', gap: '0.35rem', fontWeight: 600 },
  input: { borderRadius: '0.85rem', border: '1px solid #dbe4ee', padding: '0.85rem 0.95rem', fontSize: '1rem' },
  history: { display: 'grid', gap: '0.75rem', marginTop: '1rem' },
  historyItem: { padding: '0.85rem 0.95rem', borderRadius: '0.95rem', background: '#f8fafc', border: '1px solid #e2e8f0' },
  emptyState: { padding: '0.85rem 0.95rem', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '0.95rem' },
};