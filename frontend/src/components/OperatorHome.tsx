import { useOperator } from '../contexts/OperatorContext';

interface OperatorHomeProps {
  onSelectStage: (stageId: string) => void;
  onSignOut?: () => void;
}

export function OperatorHome({ onSelectStage, onSignOut }: OperatorHomeProps) {
  const { startStage, completeStage, reportFault, connected } = useOperator();

  const mockStages = [
    { id: 'stage-1', name: 'Assembly Phase', job: 'Job-2024-001', duration: 45 },
    { id: 'stage-2', name: 'Quality Check', job: 'Job-2024-001', duration: 30 },
    { id: 'stage-3', name: 'Packaging', job: 'Job-2024-002', duration: 20 },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>Operator workspace</div>
          <h1 style={styles.title}>Welcome to Production</h1>
          <p style={styles.subtitle}>Status: {connected ? '🟢 Connected' : '🔴 Offline'}</p>
        </div>
        <button style={styles.signOutButton} onClick={onSignOut}>Sign out</button>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Assigned stages</h2>
        <div style={styles.grid}>
          {mockStages.map((stage) => (
            <article key={stage.id} style={styles.card}>
              <div style={styles.cardTopRow}>
                <div>
                  <div style={styles.cardBadge}>{stage.job}</div>
                  <h3 style={styles.cardTitle}>{stage.name}</h3>
                </div>
              </div>
              <p style={styles.cardMeta}>ETA: {stage.duration} minutes</p>
              <div style={styles.cardActions}>
                <button style={styles.secondaryButton} onClick={() => onSelectStage(stage.id)}>Open runtime</button>
                <button style={styles.primaryButton} onClick={() => startStage(stage.id)}>Start stage</button>
                <button style={styles.secondaryButton} onClick={() => completeStage(stage.id, stage.id)}>Complete</button>
                <button
                  style={styles.dangerButton}
                  onClick={() => {
                    const notes = window.prompt('Describe the fault');
                    if (notes) {
                      void reportFault({
                        stageId: stage.id,
                        jobId: stage.job,
                        title: 'Operator reported fault',
                        description: notes,
                        severity: 'MINOR',
                        category: 'operator_report',
                      });
                    }
                  }}
                >
                  Report fault
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Live notices</h2>
        <div style={styles.emptyState}>No unresolved faults right now.</div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '1.5rem',
    background: '#f3f7fb',
    color: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  kicker: {
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    fontSize: '0.72rem',
    color: '#64748b',
    marginBottom: '0.4rem',
  },
  title: { margin: 0, fontSize: '2rem' },
  subtitle: { margin: '0.35rem 0 0', color: '#64748b' },
  signOutButton: {
    border: '1px solid #cbd5e1',
    background: 'white',
    borderRadius: '0.9rem',
    padding: '0.85rem 1rem',
    cursor: 'pointer',
  },
  section: {
    background: 'white',
    borderRadius: '1.25rem',
    padding: '1.25rem',
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
    marginBottom: '1rem',
  },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1.2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
  },
  card: {
    border: '1px solid #dbe4ee',
    borderRadius: '1rem',
    padding: '1rem',
    background: '#fbfdff',
  },
  cardActive: {
    border: '1px solid #0f2741',
    borderRadius: '1rem',
    padding: '1rem',
    background: '#eff6ff',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  cardBadge: {
    display: 'inline-flex',
    padding: '0.3rem 0.55rem',
    borderRadius: '999px',
    background: '#e0f2fe',
    color: '#075985',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  cardTitle: { margin: 0, fontSize: '1.1rem' },
  cardText: { margin: '0.3rem 0 0', color: '#475569' },
  cardMeta: { margin: '0.9rem 0 0', color: '#64748b', fontSize: '0.92rem' },
  statusPill: {
    borderRadius: '999px',
    background: '#0f2741',
    color: 'white',
    padding: '0.35rem 0.6rem',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  cardActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '0.6rem',
    marginTop: '1rem',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '0.8rem',
    padding: '0.8rem 0.9rem',
    background: '#0f2741',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid #cbd5e1',
    borderRadius: '0.8rem',
    padding: '0.8rem 0.9rem',
    background: 'white',
    color: '#0f172a',
    fontWeight: 700,
    cursor: 'pointer',
  },
  dangerButton: {
    border: '1px solid #fecaca',
    borderRadius: '0.8rem',
    padding: '0.8rem 0.9rem',
    background: '#fef2f2',
    color: '#b91c1c',
    fontWeight: 700,
    cursor: 'pointer',
  },
  emptyState: {
    padding: '1rem',
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: '1rem',
    color: '#64748b',
  },
  noticeList: {
    display: 'grid',
    gap: '0.75rem',
  },
  noticeCard: {
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    background: '#fff7ed',
    padding: '0.9rem 1rem',
  },
  noticeText: { margin: '0.35rem 0', color: '#475569' },
};