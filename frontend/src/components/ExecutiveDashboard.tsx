import { useMemo, useState } from 'react';

import { useExecutive } from '../contexts/ExecutiveContext';

interface ExecutiveDashboardProps {
  onSignOut?: () => void;
}

type NavItem = 'overview' | 'managers' | 'lines' | 'jobs' | 'analytics';

const navItems: Array<{ id: NavItem; label: string; icon: string }> = [
  { id: 'overview', label: 'Enterprise Overview', icon: '▣' },
  { id: 'managers', label: 'Manager Accounts', icon: '◫' },
  { id: 'lines', label: 'Production Lines', icon: '▤' },
  { id: 'jobs', label: 'Active Jobs', icon: '▥' },
  { id: 'analytics', label: 'Historical Analytics', icon: '▦' },
];

export function ExecutiveDashboard({ onSignOut }: ExecutiveDashboardProps) {
  const { user, criticalAlerts } = useExecutive();
  const [activeNav, setActiveNav] = useState<NavItem>('overview');

  const metrics = useMemo(
    () => [
      { label: 'Active Production Lines', value: '4', trend: '↗ Stable', tint: '#e2e8f0', icon: '⌂' },
      { label: 'Active Operating Managers', value: '3', trend: '↗ +1 this week', tint: '#dcfce7', icon: '◔' },
      { label: 'Monthly Volume Target', value: '84%', trend: '↗ +6%', tint: '#dbeafe', icon: '◎' },
      { label: 'Critical Alerts', value: `${criticalAlerts.length}`, trend: criticalAlerts.length > 0 ? '↘ Needs attention' : '↗ All clear', tint: '#fee2e2', icon: '△' },
    ],
    [criticalAlerts.length]
  );

  const topAlert = criticalAlerts[0];

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBrand}>
          <div style={styles.brandMark}>▣</div>
          <div>
            <div style={styles.sidebarTitle}>Dojo Hub Uganda</div>
            <div style={styles.sidebarSubtitle}>Executive Console</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const active = activeNav === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.topBar}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {user.name.split(' ')[0] || user.name}</h1>
            <div style={styles.timeRow}>◷ Friday, July 3, 2026 03:02 PM</div>
          </div>

          <div style={styles.topActions}>
            <button type="button" style={styles.bellButton} aria-label="Notifications">🔔</button>
            <div style={styles.onlinePill}>
              <span style={styles.onlineDot} />
              System Online
            </div>
          </div>
        </header>

        <section style={styles.content}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Strategic Overview</h2>
            <p style={styles.sectionSubtitle}>Plant-wide performance snapshot — Friday, July 3</p>
          </div>

          <div style={styles.metricsGrid}>
            {metrics.map((metric) => (
              <article key={metric.label} style={styles.metricCard}>
                <div style={{ ...styles.metricIcon, background: metric.tint }}>{metric.icon}</div>
                <div style={styles.metricTrend}>{metric.trend}</div>
                <div style={styles.metricValue}>{metric.value}</div>
                <div style={styles.metricLabel}>{metric.label}</div>
              </article>
            ))}
          </div>

          <div style={styles.lowerGrid}>
            <section style={{ ...styles.panel, gridColumn: '1 / span 2' }}>
              <div style={styles.panelHeader}>
                <div style={styles.panelTitleRow}>
                  <span style={styles.warningIcon}>⚠</span>
                  <h3 style={styles.panelTitle}>Lines Without Managers</h3>
                </div>
                <button type="button" style={styles.linkButton}>View All ›</button>
              </div>

              <div style={styles.centerState}>
                <div style={styles.centerIcon}>✓</div>
                <div style={styles.centerTitle}>All Lines Assigned</div>
                <div style={styles.centerText}>Every production line has a manager.</div>
              </div>
            </section>

            <section style={styles.panel}>
              <h3 style={styles.panelTitle}>Quick Actions</h3>
              <div style={styles.quickStack}>
                <button style={styles.quickButton} type="button">
                  <span style={styles.quickIcon}>◉</span>
                  Add Manager Account
                  <span style={styles.quickArrow}>›</span>
                </button>
                <button style={styles.quickButton} type="button">
                  <span style={styles.quickIcon}>＋</span>
                  Create Production Line
                  <span style={styles.quickArrow}>›</span>
                </button>
              </div>
            </section>

            <section style={styles.panel}>
              <h3 style={styles.panelTitle}>Critical Alerts</h3>
              {topAlert ? (
                <div style={styles.alertCard}>
                  <div style={styles.alertHeader}>
                    <span style={styles.alertBadge}>⚠</span>
                    <div style={styles.alertTitleBlock}>
                      <div style={styles.alertTitle}>{topAlert.title}</div>
                      <div style={styles.alertSub}>{topAlert.line || 'Plant-wide'}</div>
                    </div>
                  </div>
                  <div style={styles.alertTime}>◷ {new Date(topAlert.timestamp).toLocaleTimeString()}</div>
                </div>
              ) : (
                <div style={styles.emptyState}>No critical alerts right now.</div>
              )}
            </section>
          </div>
        </section>

        <button type="button" onClick={onSignOut} style={styles.signOutButton}>
          Sign out
        </button>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '18rem minmax(0, 1fr)',
    background: '#f5f7fb',
    color: '#0f172a',
  },
  sidebar: {
    background: 'linear-gradient(180deg, #07111d 0%, #0d2238 100%)',
    color: 'white',
    padding: '1rem 0.9rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxShadow: '8px 0 24px rgba(15, 23, 42, 0.18)',
  },
  sidebarBrand: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
    padding: '0.6rem 0.5rem 1rem',
  },
  brandMark: {
    width: '2.7rem',
    height: '2.7rem',
    borderRadius: '0.8rem',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    fontWeight: 800,
  },
  sidebarTitle: { fontSize: '1rem', fontWeight: 800, lineHeight: 1.1 },
  sidebarSubtitle: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.68)' },
  nav: { display: 'grid', gap: '0.55rem', marginTop: '0.5rem' },
  navItem: {
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '0.85rem',
    background: 'transparent',
    color: 'rgba(255,255,255,0.74)',
    padding: '0.88rem 0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textAlign: 'left',
    fontWeight: 600,
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.08)',
    color: 'white',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  navIcon: {
    width: '1.8rem',
    height: '1.8rem',
    borderRadius: '0.6rem',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    fontSize: '0.95rem',
    flexShrink: 0,
  },
  main: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1.1rem 1.2rem',
    gap: '1rem',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.2rem 0.35rem 0.7rem',
  },
  welcomeTitle: {
    margin: 0,
    fontSize: '1.5rem',
    letterSpacing: '-0.03em',
    color: '#0f172a',
  },
  timeRow: {
    marginTop: '0.3rem',
    color: '#64748b',
    fontSize: '0.95rem',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  bellButton: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '50%',
    border: 'none',
    background: 'white',
    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
    cursor: 'pointer',
  },
  onlinePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 0.9rem',
    borderRadius: '999px',
    background: '#e7f7e8',
    color: '#115e2f',
    fontWeight: 700,
  },
  onlineDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    background: '#22c55e',
  },
  content: {
    display: 'grid',
    gap: '1rem',
  },
  sectionHeader: {
    padding: '0 0.35rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.45rem',
    letterSpacing: '-0.03em',
  },
  sectionSubtitle: {
    margin: '0.35rem 0 0',
    color: '#64748b',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '0.85rem',
  },
  metricCard: {
    background: 'white',
    borderRadius: '1rem',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    padding: '1rem',
    minHeight: '8.7rem',
    display: 'grid',
    alignContent: 'space-between',
  },
  metricIcon: {
    width: '2.1rem',
    height: '2.1rem',
    borderRadius: '0.7rem',
    display: 'grid',
    placeItems: 'center',
    color: '#334155',
    fontSize: '1rem',
    fontWeight: 800,
  },
  metricTrend: {
    marginTop: '0.25rem',
    color: '#16a34a',
    fontSize: '0.85rem',
    fontWeight: 700,
    textAlign: 'right',
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#0f172a',
    lineHeight: 1,
  },
  metricLabel: {
    color: '#64748b',
    fontSize: '0.9rem',
    lineHeight: 1.3,
  },
  lowerGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 22rem',
    gap: '1rem',
  },
  panel: {
    background: 'white',
    borderRadius: '1.1rem',
    border: '1px solid rgba(148, 163, 184, 0.18)',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
    padding: '1rem 1rem 1.1rem',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  panelTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
  },
  warningIcon: { color: '#f59e0b' },
  panelTitle: { margin: 0, fontSize: '1rem', fontWeight: 800 },
  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#475569',
    fontWeight: 700,
    cursor: 'pointer',
  },
  centerState: {
    minHeight: '15.2rem',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    padding: '1rem',
  },
  centerIcon: {
    width: '2.1rem',
    height: '2.1rem',
    borderRadius: '50%',
    border: '3px solid #22c55e',
    color: '#22c55e',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  centerTitle: { fontWeight: 800, color: '#334155' },
  centerText: { color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' },
  quickStack: {
    marginTop: '0.95rem',
    display: 'grid',
    gap: '0.75rem',
  },
  quickButton: {
    border: 'none',
    borderRadius: '0.95rem',
    background: '#173552',
    color: 'white',
    padding: '1rem',
    display: 'grid',
    gridTemplateColumns: '2.3rem 1fr auto',
    alignItems: 'center',
    gap: '0.7rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(15, 39, 65, 0.18)',
  },
  quickIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.6rem',
    background: 'rgba(255,255,255,0.08)',
    display: 'grid',
    placeItems: 'center',
    fontSize: '0.95rem',
  },
  quickArrow: { opacity: 0.72, fontSize: '1.2rem' },
  alertCard: {
    marginTop: '0.95rem',
    padding: '0.9rem',
    borderRadius: '1rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.65rem',
  },
  alertBadge: {
    color: '#ef4444',
    fontSize: '0.95rem',
    fontWeight: 800,
    marginTop: '0.1rem',
  },
  alertTitleBlock: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: 800,
    fontSize: '0.95rem',
    color: '#111827',
  },
  alertSub: {
    color: '#64748b',
    fontSize: '0.82rem',
    marginTop: '0.15rem',
  },
  alertTime: {
    marginTop: '0.55rem',
    color: '#94a3b8',
    fontSize: '0.8rem',
  },
  emptyState: {
    marginTop: '0.95rem',
    padding: '0.95rem',
    borderRadius: '1rem',
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    color: '#64748b',
    textAlign: 'center',
  },
  signOutButton: {
    position: 'absolute',
    right: '1rem',
    bottom: '1rem',
    border: '1px solid #cbd5e1',
    background: 'white',
    color: '#0f172a',
    padding: '0.8rem 1rem',
    borderRadius: '0.9rem',
    cursor: 'pointer',
    fontWeight: 700,
  },
};
