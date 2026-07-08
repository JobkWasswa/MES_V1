import type { AlertItem, OperatorStage } from '../types/mes';

export const demoOperatorStages: OperatorStage[] = [
  {
    id: 'stage-1',
    jobId: 'JOB-401',
    jobName: 'Mango Blend Run',
    productName: 'Mango Juice',
    stageName: 'Pulp Preparation',
    stationTag: 'LINE-A / PREP',
    estimatedDurationMinutes: 35,
    status: 'available',
    checklistItems: [
      { id: 'ck-1', itemText: 'Confirm fruit feed is ready', isRequired: true },
      { id: 'ck-2', itemText: 'Inspect vessel seals', isRequired: true },
    ],
    quantityMetrics: [
      { id: 'qm-1', metricName: 'Raw fruit weight', unitLabel: 'kg', minValue: 0, maxValue: 200 },
      { id: 'qm-2', metricName: 'Extract yield', unitLabel: 'L', minValue: 0, maxValue: 180 },
    ],
    qcQuestions: [
      { id: 'qc-1', questionText: 'Was the line sanitized?', responseType: 'pass_fail' },
    ],
  },
  {
    id: 'stage-2',
    jobId: 'JOB-402',
    jobName: 'Pineapple Batch',
    productName: 'Pineapple Drink',
    stageName: 'Heat Treatment',
    stationTag: 'LINE-B / UHT',
    estimatedDurationMinutes: 45,
    status: 'paused',
    checklistItems: [
      { id: 'ck-3', itemText: 'Validate target temperature', isRequired: true },
      { id: 'ck-4', itemText: 'Confirm pressure reading', isRequired: false },
    ],
    quantityMetrics: [
      { id: 'qm-3', metricName: 'Inlet temp', unitLabel: 'C', minValue: 70, maxValue: 95 },
    ],
    qcQuestions: [
      { id: 'qc-2', questionText: 'Is the hold time within range?', responseType: 'pass_fail' },
    ],
  },
];

export const demoManagerAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    title: 'Critical pump failure',
    description: 'A high-pressure pump fault was reported on Line A.',
    line: 'LINE-A',
    stageName: 'Pulp Preparation',
    severity: 'critical',
    isResolved: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    title: 'Material delay',
    description: 'Operator flagged a short pause waiting for ingredients.',
    line: 'LINE-B',
    stageName: 'Heat Treatment',
    severity: 'paused',
    isResolved: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'alert-3',
    title: 'Minor QC warning',
    description: 'Temperature variance is close to the tolerance band.',
    line: 'LINE-C',
    stageName: 'Packing',
    severity: 'minor',
    isResolved: false,
    timestamp: new Date().toISOString(),
  },
];