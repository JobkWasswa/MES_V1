import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

import { demoManagerAlerts } from './demoData';
import type { AuthUser } from '../types/auth';
import type { AlertItem } from '../types/mes';

interface ManagerContextValue {
  user: AuthUser;
  token: string;
  alerts: AlertItem[];
  liveAlerts: AlertItem[];
  criticalAlerts: AlertItem[];
  resolveFault: (alertId: string, notes: string, resolvedBy: string) => Promise<void>;
}

const ManagerContext = createContext<ManagerContextValue | null>(null);

interface ManagerProviderProps {
  token: string;
  user: AuthUser;
  children: ReactNode;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ManagerProvider({ token, user, children }: ManagerProviderProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>(demoManagerAlerts);

  const socket = useMemo<Socket>(() => {
    return io(apiBaseUrl, {
      autoConnect: false,
      transports: ['websocket'],
      auth: { token },
    });
  }, [token]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket]);

  const resolveFault = async (alertId: string, notes: string, resolvedBy: string) => {
    socket.emit('manager:resolveFault', { alertId, notes, resolvedBy });
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === alertId ? { ...alert, isResolved: true, resolutionNotes: notes, resolvedBy } : alert
      )
    );
  };

  const liveAlerts = alerts.filter((alert) => !alert.isResolved);
  const criticalAlerts = liveAlerts.filter((alert) => alert.severity === 'critical');

  return (
    <ManagerContext.Provider value={{ user, token, alerts, liveAlerts, criticalAlerts, resolveFault }}>
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const context = useContext(ManagerContext);

  if (!context) {
    throw new Error('useManager must be used within ManagerProvider');
  }

  return context;
}