import { useEffect, useState } from 'react';

import { UnifiedLogin } from './components/UnifiedLogin';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { ManagerHome } from './components/ManagerHome';
import { OperatorHome } from './components/OperatorHome';
import { OperatorRuntime } from './components/OperatorRuntime';
import { ExecutiveProvider } from './contexts/ExecutiveContext';
import { ManagerProvider } from './contexts/ManagerContext';
import { OperatorProvider } from './contexts/OperatorContext';
import type { AuthSession } from './types/auth';

const STORAGE_KEY = 'mes_auth_session';

function loadStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadStoredSession());
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const handleSignOut = () => {
    setActiveStageId(null);
    setSession(null);
  };

  if (!session) {
    return <UnifiedLogin onAuthenticated={setSession} />;
  }

  if (session.user.role === 'executive') {
    return (
      <ExecutiveProvider token={session.token} user={session.user}>
        <ExecutiveDashboard onSignOut={handleSignOut} />
      </ExecutiveProvider>
    );
  }

  if (session.user.role === 'manager') {
    return (
      <ManagerProvider token={session.token} user={session.user}>
        <ManagerHome onSignOut={handleSignOut} />
      </ManagerProvider>
    );
  }

  return (
    <OperatorProvider token={session.token} user={session.user}>
      {activeStageId ? (
        <OperatorRuntime stageId={activeStageId} onBack={() => setActiveStageId(null)} />
      ) : (
        <OperatorHome onSelectStage={setActiveStageId} onSignOut={handleSignOut} />
      )}
    </OperatorProvider>
  );
}

export default App;
