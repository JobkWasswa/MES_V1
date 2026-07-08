import { useMemo, useState } from 'react';

import { AlertFeed } from './AlertFeed';
import { FaultResolutionModal } from './FaultResolutionModal';
import { useManager } from '../contexts/ManagerContext';
import type { AlertItem } from '../types/mes';

interface ManagerHomeProps {
  onSignOut?: () => void;
}

export function ManagerHome({ onSignOut }: ManagerHomeProps) {
  const { user, liveAlerts, resolveFault } = useManager();
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const summary = useMemo(() => {
    const critical = liveAlerts.filter((alert) => alert.severity === 'critical').length;
    return { total: liveAlerts.length, critical };
  }, [liveAlerts]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>Manager control</div>
          <h1 style={styles.title}>Welcome, {user.name}</h1>
          <p style={styles.subtitle}>{summary.total} live alerts, {summary.critical} critical</p>
        </div>
        <button style={styles.signOutButton} onClick={onSignOut}>Sign out</button>
      </header>

      <section style={styles.summaryRow}>
        <div style={styles.summaryCard}><strong>{summary.total}</strong><span>Open alerts</span></div>
        <div style={styles.summaryCard}><strong>{summary.critical}</strong><span>Critical faults</span></div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Live alert feed</h2>
        <AlertFeed
          alerts={liveAlerts}
          onResolveAlert={(id) => setSelectedAlert(liveAlerts.find((alert) => alert.id === id) ?? null)}
        />
      </section>

      <FaultResolutionModal
        alert={selectedAlert}
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        onSubmit={({ alertId, notes, choice }) => {
          resolveFault(alertId, notes, `${user.name} (${choice})`);
          setSelectedAlert(null);
        }}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', padding: '1.5rem', background: '#f3f7fb', color: '#0f172a' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' },
  kicker: { textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.4rem' },
  title: { margin: 0, fontSize: '2rem' },
  subtitle: { margin: '0.35rem 0 0', color: '#64748b' },
  signOutButton: { border: '1px solid #cbd5e1', background: 'white', borderRadius: '0.9rem', padding: '0.85rem 1rem', cursor: 'pointer', fontWeight: 700 },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1rem' },
  summaryCard: { background: 'white', borderRadius: '1rem', padding: '1rem', display: 'grid', gap: '0.25rem', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)' },
  section: { background: 'white', borderRadius: '1.25rem', padding: '1.25rem', boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1.2rem' },
};