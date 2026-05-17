export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type CaseStatus = 'new' | 'analyzing' | 'pending_action' | 'contained' | 'closed' | 'false_positive';
export type PolicyStatus = 'active' | 'simulation' | 'disabled';
export type PolicyAction = 'block' | 'quarantine' | 'alert' | 'log';
export type Channel = 'email' | 'cloud' | 'web' | 'usb' | 'print';
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface Case {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: CaseStatus;
  origin: string;
  receivedAt: string;
  assignedTo: string;
  policyViolated: string;
  summary: string;
  sourceChannel: Channel;
  destination: string;
  user: string;
  device: string;
  department: string;
}

export interface DetectedField {
  type: string;
  count: number;
  samples: string[];
  masked: boolean;
}

export interface Evidence {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  hash: string;
  source: string;
  classification: DataClassification;
  risk: Severity;
  detectedFields: DetectedField[];
  previewAvailable: boolean;
  capturedAt: string;
  origin: string;
  destination: string;
}

export interface Policy {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  severity: Severity;
  status: PolicyStatus;
  channels: Channel[];
  action: PolicyAction;
  owner: string;
  lastUpdated: string;
  triggerCount: number;
  notifyUser: boolean;
  logIncident: boolean;
  sendForReview: boolean;
  notificationChannel: string;
  includeAttachments: boolean;
}

export interface AIAnalysis {
  id: string;
  caseId: string;
  technicalSummary: string;
  severity: Severity;
  policyViolated: string;
  destination: string;
  risk: string;
  impact: string;
  lgpdBasis: string;
  recommendation: string;
  businessRisk: string[];
  responsePlan: string[];
  controlImprovements: string[];
  falsePositiveAssessment: string;
  confidenceLevel: number;
  generatedAt: string;
}

export interface AuditLog {
  id: string;
  caseId: string;
  actor: string;
  action: string;
  timestamp: string;
  details: string;
  type: 'system' | 'analyst' | 'policy' | 'export';
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  taskType?: string;
  structured?: {
    summary?: string;
    businessRisk?: string[];
    responsePlan?: string[];
    controlImprovements?: string[];
    falsePositiveNote?: string;
  };
}

export interface IncidentReport {
  id: string;
  caseId: string;
  generatedAt: string;
  generatedBy: string;
  role: string;
  classification: string;
  executiveSummary: string;
  evidences: string[];
  dataInvolved: string[];
  recommendedActions: string[];
  status: string;
  treatment: string;
  finalDecision: string;
}

export interface EventFlowStep {
  label: string;
  value: string;
  icon: string;
  risk?: boolean;
}

export interface AlertPayload {
  source: string;
  eventId?: string;
  title: string;
  severity: string;
  channel: string;
  user: string;
  device?: string;
  department?: string;
  destination: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  policy: string;
  detectedFields?: Array<{ type: string; count: number }>;
  rawText?: string;
}

export interface ImportAlertResult {
  ok: boolean;
  case?: Case;
  errors?: string[];
}
