import type { AlertItem } from '../types/mes';

interface AlertFeedProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
}

export function AlertFeed({ alerts, onResolveAlert }: AlertFeedProps) {
  return (
    <div style={styles.wrapper}>
      {alerts.length === 0 ? (
        <div style={styles.emptyState}>No live alerts at the moment.</div>
      ) : (
        alerts.map((alert) => (
          <article key={alert.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.badge}>{alert.severity.toUpperCase()}</div>
                <h3 style={styles.title}>{alert.title}</h3>
              </div>
              <span style={styles.timestamp}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
            <p style={styles.description}>{alert.description}</p>
            <div style={styles.meta}>{alert.line || alert.stageName || 'Plant-wide'}</div>
            <div style={styles.actions}>
              <button style={styles.resolveButton} onClick={() => onResolveAlert(alert.id)}>Resolve</button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'grid', gap: '0.75rem' },
  card: { borderRadius: '1rem', background: 'white', border: '1px solid #e2e8f0', padding: '1rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' },
  badge: { display: 'inline-flex', padding: '0.25rem 0.5rem', borderRadius: '999px', background: '#0f2741', color: 'white', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.45rem' },
  title: { margin: 0, fontSize: '1rem' },
  timestamp: { color: '#94a3b8', fontSize: '0.8rem' },
  description: { margin: '0.55rem 0 0', color: '#334155' },
  meta: { marginTop: '0.55rem', color: '#64748b', fontSize: '0.9rem' },
  actions: { marginTop: '0.8rem', display: 'flex' },
  resolveButton: { border: 'none', borderRadius: '0.8rem', padding: '0.75rem 0.95rem', background: '#0f2741', color: 'white', fontWeight: 700, cursor: 'pointer' },
  emptyState: { padding: '1rem', borderRadius: '1rem', background: '#f8fafc', border: '1px dashed #cbd5e1', color: '#64748b' },
};