import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

import { demoManagerAlerts } from './demoData';
import type { AuthUser } from '../types/auth';
import type { AlertItem } from '../types/mes';

interface ExecutiveContextValue {
  user: AuthUser;
  token: string;
  criticalAlerts: AlertItem[];
}

const ExecutiveContext = createContext<ExecutiveContextValue | null>(null);

interface ExecutiveProviderProps {
  token: string;
  user: AuthUser;
  children: ReactNode;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ExecutiveProvider({ token, user, children }: ExecutiveProviderProps) {
  const [criticalAlerts, setCriticalAlerts] = useState<AlertItem[]>(
    demoManagerAlerts.filter((alert) => alert.severity === 'critical')
  );

  const socket = useMemo<Socket>(() => {
    return io(apiBaseUrl, {
      autoConnect: false,
      transports: ['websocket'],
      auth: { token },
    });
  }, [token]);

  useEffect(() => {
    socket.connect();
    socket.on('executive:criticalFault', (alert: AlertItem) => {
      setCriticalAlerts((current) => [alert, ...current.filter((candidate) => candidate.id !== alert.id)]);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket]);

  return <ExecutiveContext.Provider value={{ user, token, criticalAlerts }}>{children}</ExecutiveContext.Provider>;
}

export function useExecutive() {
  const context = useContext(ExecutiveContext);

  if (!context) {
    throw new Error('useExecutive must be used within ExecutiveProvider');
  }

  return context;
}