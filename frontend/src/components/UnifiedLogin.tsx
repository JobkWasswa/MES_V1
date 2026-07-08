import { useState } from 'react';
import axios from 'axios';

import type { AuthRole, AuthSession } from '../types/auth';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const roleOptions: Array<{ id: AuthRole; label: string; hint: string }> = [
  { id: 'executive', label: 'Executive', hint: 'Company email and password' },
  { id: 'manager', label: 'Manager', hint: 'Registered email and password' },
  { id: 'operator', label: 'Operator', hint: 'Mobile number and PIN' },
];

interface UnifiedLoginProps {
  onAuthenticated: (session: AuthSession) => void;
}

export function UnifiedLogin({ onAuthenticated }: UnifiedLoginProps) {
  const [role, setRole] = useState<AuthRole>('executive');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload =
        role === 'operator'
          ? { identifier: identifier.trim(), pin: pin.trim() }
          : { identifier: identifier.trim(), password };

      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, payload);
      const session: AuthSession = {
        token: response.data.token,
        user: {
          id: response.data.user.id,
          name: response.data.user.name,
          role: response.data.user.role,
          identifier: identifier.trim(),
        },
      };

      localStorage.setItem('mes_auth_session', JSON.stringify(session));
      onAuthenticated(session);
    } catch (submitError: any) {
      const message = submitError?.response?.data?.message || submitError.message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroBadge}>Dojo Hub Uganda MES</div>
        <h1 style={styles.heroTitle}>Workspace access for every role</h1>
        <p style={styles.heroText}>
          Sign in with the backend auth service and load the right shell for executives,
          managers, and operators.
        </p>
        <div style={styles.heroStats}>
          <div style={styles.statCard}><strong>3</strong><span>Roles</span></div>
          <div style={styles.statCard}><strong>JWT</strong><span>Session auth</span></div>
          <div style={styles.statCard}><strong>Live</strong><span>Socket hooks</span></div>
        </div>
      </div>

      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Workspace Access</h2>
        <p style={styles.panelSubtitle}>Select your role and sign in to continue.</p>

        <div style={styles.roleRow}>
          {roleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRole(option.id)}
              style={{
                ...styles.roleButton,
                ...(role === option.id ? styles.roleButtonActive : {}),
              }}
            >
              <span style={styles.roleLabel}>{option.label}</span>
              <span style={styles.roleHint}>{option.hint}</span>
            </button>
          ))}
        </div>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <form onSubmit={submitLogin} style={styles.form}>
          <label style={styles.label}>
            {role === 'operator' ? 'Mobile Number' : 'Corporate Email Address'}
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              type={role === 'operator' ? 'tel' : 'email'}
              placeholder={role === 'operator' ? 'e.g. +256700123456' : 'exec@dojohub.com'}
              style={styles.input}
            />
          </label>

          {role === 'operator' ? (
            <label style={styles.label}>
              PIN
              <input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                inputMode="numeric"
                maxLength={4}
                placeholder="4-digit PIN"
                style={styles.input}
              />
            </label>
          ) : (
            <label style={styles.label}>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Enter your password"
                style={styles.input}
              />
            </label>
          )}

          <button type="submit" disabled={loading} style={styles.submitButton}>
            {loading ? 'Authenticating...' : 'Authenticate & Enter Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.15fr) minmax(380px, 0.85fr)',
    background: 'linear-gradient(135deg, #07111f 0%, #0f2741 55%, #f5f7fb 55%, #f5f7fb 100%)',
    color: '#0f172a',
  },
  hero: {
    padding: '5rem 4rem',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1.25rem',
  },
  heroBadge: {
    display: 'inline-flex',
    width: 'fit-content',
    padding: '0.5rem 0.9rem',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  heroTitle: {
    margin: 0,
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    lineHeight: 1.02,
    maxWidth: '11ch',
  },
  heroText: {
    margin: 0,
    maxWidth: '56ch',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.78)',
  },
  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '0.85rem',
    maxWidth: '560px',
    marginTop: '1rem',
  },
  statCard: {
    borderRadius: '1rem',
    padding: '1rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    color: 'white',
  },
  panel: {
    background: 'white',
    margin: '2rem',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.18)',
    alignSelf: 'center',
  },
  panelTitle: {
    margin: 0,
    fontSize: '1.9rem',
  },
  panelSubtitle: {
    margin: '0.45rem 0 1.25rem',
    color: '#64748b',
  },
  roleRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  roleButton: {
    border: '1px solid #dbe4ee',
    borderRadius: '1rem',
    background: '#f8fafc',
    padding: '0.9rem 0.85rem',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  roleButtonActive: {
    background: '#0f2741',
    color: 'white',
    borderColor: '#0f2741',
  },
  roleLabel: {
    fontWeight: 700,
  },
  roleHint: {
    fontSize: '0.82rem',
    color: 'inherit',
    opacity: 0.72,
  },
  errorBox: {
    borderRadius: '0.9rem',
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    padding: '0.9rem 1rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'grid',
    gap: '0.95rem',
  },
  label: {
    display: 'grid',
    gap: '0.45rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  input: {
    borderRadius: '0.9rem',
    border: '1px solid #dbe4ee',
    padding: '0.95rem 1rem',
    fontSize: '1rem',
    outline: 'none',
  },
  submitButton: {
    marginTop: '0.4rem',
    border: 'none',
    borderRadius: '1rem',
    padding: '1rem 1.2rem',
    background: '#0f2741',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
