import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

import { demoOperatorStages } from './demoData';
import type { AuthUser } from '../types/auth';
import type { AlertItem, OperatorBatchLog, OperatorStage } from '../types/mes';

interface FaultInput {
  title: string;
  description: string;
  severity: 'critical' | 'minor';
  category?: string;
}

interface OperatorContextValue {
  user: AuthUser;
  token: string;
  stages: OperatorStage[];
  batches: OperatorBatchLog[];
  faults: AlertItem[];
  activeStageId: string | null;
  setActiveStageId: (stageId: string | null) => void;
  startStage: (stageId: string) => Promise<void>;
  logBatch: (stageId: string, values: Record<string, number>, notes?: string) => Promise<void>;
  completeStage: (stageId: string, sessionId?: string) => Promise<void>;
  reportFault: (stageId: string, fault: FaultInput) => Promise<void>;
}

const OperatorContext = createContext<OperatorContextValue | null>(null);

interface OperatorProviderProps {
  token: string;
  user: AuthUser;
  children: ReactNode;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function OperatorProvider({ token, user, children }: OperatorProviderProps) {
  const [stages, setStages] = useState<OperatorStage[]>(demoOperatorStages);
  const [batches, setBatches] = useState<OperatorBatchLog[]>([]);
  const [faults, setFaults] = useState<AlertItem[]>([]);
  const [activeStageId, setActiveStageId] = useState<string | null>(demoOperatorStages[0]?.id ?? null);

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

  const startStage = async (stageId: string) => {
    socket.emit('operator:startStage', { stageId, user });
    setStages((current) => current.map((stage) => (stage.id === stageId ? { ...stage, status: 'running' } : stage)));
    setActiveStageId(stageId);
  };

  const logBatch = async (stageId: string, values: Record<string, number>, notes = '') => {
    const batchNumber = batches.filter((entry) => entry.stageId === stageId).length + 1;
    const nextBatch: OperatorBatchLog = {
      id: crypto.randomUUID(),
      stageId,
      batchNumber,
      loggedAt: new Date().toISOString(),
      values,
      notes,
    };

    socket.emit('operator:logBatch', nextBatch);
    setBatches((current) => [nextBatch, ...current]);
  };

  const completeStage = async (stageId: string, sessionId?: string) => {
    socket.emit('operator:completeStage', { stageId, sessionId, user });
    setStages((current) => current.map((stage) => (stage.id === stageId ? { ...stage, status: 'completed' } : stage)));
  };

  const reportFault = async (stageId: string, fault: FaultInput) => {
    const stage = stages.find((candidate) => candidate.id === stageId);
    const report: AlertItem = {
      id: crypto.randomUUID(),
      title: fault.title,
      description: fault.description,
      line: stage?.stationTag,
      stageName: stage?.stageName,
      jobName: stage?.jobName,
      severity: fault.severity,
      isResolved: false,
      timestamp: new Date().toISOString(),
      category: fault.category,
    };

    socket.emit('operator:reportFault', report);
    setFaults((current) => [report, ...current]);
    setStages((current) => current.map((candidate) => (candidate.id === stageId ? { ...candidate, status: 'paused' } : candidate)));
  };

  return (
    <OperatorContext.Provider
      value={{ user, token, stages, batches, faults, activeStageId, setActiveStageId, startStage, logBatch, completeStage, reportFault }}
    >
      {children}
    </OperatorContext.Provider>
  );
}

export function useOperator() {
  const context = useContext(OperatorContext);

  if (!context) {
    throw new Error('useOperator must be used within OperatorProvider');
  }

  return context;
}