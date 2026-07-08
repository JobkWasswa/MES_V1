export type AlertSeverity = 'critical' | 'minor' | 'paused';
export type OperatorStageStatus = 'pending' | 'available' | 'running' | 'paused' | 'completed';

export interface ChecklistItem {
  id: string;
  itemText: string;
  isRequired: boolean;
}

export interface QuantityMetric {
  id: string;
  metricName: string;
  unitLabel: string;
  minValue: number | null;
  maxValue: number | null;
}

export interface QcQuestion {
  id: string;
  questionText: string;
  responseType: 'pass_fail' | 'numeric' | 'free_text';
  numericMinValue?: number | null;
  numericMaxValue?: number | null;
}

export interface OperatorStage {
  id: string;
  jobId: string;
  jobName: string;
  productName: string;
  stageName: string;
  stationTag: string;
  estimatedDurationMinutes: number;
  status: OperatorStageStatus;
  checklistItems: ChecklistItem[];
  quantityMetrics: QuantityMetric[];
  qcQuestions: QcQuestion[];
}

export interface OperatorBatchLog {
  id: string;
  stageId: string;
  batchNumber: number;
  loggedAt: string;
  values: Record<string, number>;
  notes: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  line?: string;
  jobName?: string;
  stageName?: string;
  severity: AlertSeverity;
  isResolved: boolean;
  timestamp: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  category?: string;
}