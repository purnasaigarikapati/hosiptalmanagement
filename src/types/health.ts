export type OrganSystem = 
  | 'cardiovascular' 
  | 'neurological' 
  | 'respiratory' 
  | 'metabolic' 
  | 'musculoskeletal' 
  | 'general';

export type VerificationStatus = 'verified' | 'needs_review';

export interface LabTest {
  name: string;
  value: string;
  unit: string;
  refRange: string;
  status: 'normal' | 'high' | 'low' | 'needs_review';
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: string;
  organSystem: OrganSystem;
  date: string;
  doctor: string;
  facility: string;
  documentType: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  verificationStatus: VerificationStatus;
  summary: string;
  tests: LabTest[];
}

export interface OrganNode {
  id: OrganSystem;
  title: string;
  organ: string;
  recordsCount: number;
  status: string;
  statusColor: 'teal' | 'amber' | 'red';
  vitals: string;
  keyFindings: string;
  lastReportDate: string;
  icon: string;
  position: { x: number; y: number };
}

export interface MetricCardData {
  total: number;
  recentCount?: number;
  active?: number;
  totalPrescriptions?: number;
  refillsDue?: number;
  totalParameters?: number;
  inRange?: number;
  flagged?: number;
  totalEncounters?: number;
  specialistsConsulted?: number;
  facilities?: number;
  caption: string;
  badge: string;
}

export interface MetricsSummary {
  medicalRecords: MetricCardData;
  medications: MetricCardData;
  labResults: MetricCardData;
  healthcareVisits: MetricCardData;
}

export interface AIInsight {
  id: string;
  type: 'abnormal_lab' | 'verification_required' | 'doctor_followup';
  severity: 'red' | 'amber' | 'teal';
  title: string;
  value: string;
  reference: string;
  sourceDocument: string;
  date: string;
  reviewStatus: 'needs_attention' | 'reviewed' | 'scheduled';
  recommendation: string;
  organSystem: OrganSystem;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: string;
  category: OrganSystem;
  doctor: string;
  facility: string;
  sourceDocument: string;
  verificationStatus: string;
  statusColor: 'teal' | 'amber' | 'red';
  highlights: string[];
  recordId: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  doctor: string;
  startDate: string;
  refillDate: string;
  status: 'active' | 'completed' | 'paused';
  category: string;
  flag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citedRecords?: string[];
  suggestedFollowUps?: string[];
}

export interface ExtractedDocumentData {
  title: string;
  category: string;
  organSystem: OrganSystem;
  documentType: string;
  doctor: string;
  facility: string;
  date: string;
  confidenceScore: number;
  tests: LabTest[];
  aiSummary: string;
  flags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  abhaId: string;
  bloodGroup: string;
  role: string;
  avatar?: string;
  lastLogin?: string;
}

export type ThemeColor = 'cyan' | 'emerald' | 'sapphire' | 'amethyst' | 'amber' | 'rose';

export interface ThemeOption {
  id: ThemeColor;
  name: string;
  description: string;
  primaryColor: string;
  glowColor: string;
  previewClass: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}


