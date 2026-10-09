import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MedicalRecord, 
  OrganNode, 
  OrganSystem, 
  MetricsSummary, 
  AIInsight, 
  TimelineEvent, 
  Medication, 
  ChatMessage, 
  LabTest,
  ExtractedDocumentData,
  User
} from '../types/health';
import { translations, Language } from '../data/translations';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface HealthContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, abhaId?: string) => Promise<boolean>;
  logout: () => void;
  loginAsDemo: () => void;

  medicalRecords: MedicalRecord[];
  activeOrgan: OrganSystem | null;
  setActiveOrgan: (organ: OrganSystem | null) => void;
  organNodes: OrganNode[];
  metrics: MetricsSummary;
  insights: AIInsight[];
  timelineEvents: TimelineEvent[];
  medications: Medication[];
  
  selectedRecord: MedicalRecord | null;
  setSelectedRecord: (record: MedicalRecord | null) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  
  chatMessages: ChatMessage[];
  isCopilotLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  
  addRecordFromUpload: (data: ExtractedDocumentData, fileName: string) => void;
  updateInsightStatus: (id: string, status: 'reviewed' | 'needs_attention' | 'scheduled') => void;
  
  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  scrollToSection: (sectionId: string) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeOrgan, setActiveOrgan] = useState<OrganSystem | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Authentication State
  const DEFAULT_USER: User = {
    id: 'usr-001',
    name: 'Sai Garikapati',
    email: 'sai.garikapati@altrixhealth.ai',
    abhaId: '91-4820-1928-3410',
    bloodGroup: 'O+',
    role: 'Patient (Primary Account)',
    avatar: 'SG',
    lastLogin: 'Today, 10:24 AM'
  };

  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const login = async (email: string, password?: string): Promise<boolean> => {
    const namePart = email.includes('@') ? email.split('@')[0] : 'Member';
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const loggedUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: email.toLowerCase().includes('sai') ? 'Sai Garikapati' : `${capitalized} Health`,
      email: email,
      abhaId: '91-4820-1928-3410',
      bloodGroup: 'O+',
      role: 'Patient (Verified)',
      avatar: capitalized.slice(0, 2).toUpperCase(),
      lastLogin: 'Just now'
    };
    setUser(loggedUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    addToast('success', 'Authentication Successful', `Welcome back, ${loggedUser.name}!`);
    return true;
  };

  const signup = async (name: string, email: string, password?: string, abhaId?: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: name.trim() || 'New Member',
      email: email,
      abhaId: abhaId?.trim() || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodGroup: 'O+',
      role: 'Patient (New Profile)',
      avatar: (name.trim().slice(0, 2) || 'AL').toUpperCase(),
      lastLogin: 'Just now'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    addToast('success', 'Account Initialized', `Welcome to Altrix Health, ${newUser.name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthModalOpen(true);
    setAuthMode('login');
    addToast('info', 'Signed Out', 'You have been securely signed out of your session.');
  };

  const loginAsDemo = () => {
    setUser(DEFAULT_USER);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    addToast('success', 'Demo Profile Active', 'Logged in as Sai Garikapati with 7 indexed clinical records.');
  };

  // Initial State Data
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: 'rec-001',
      title: 'Comprehensive Metabolic & Lipid Panel',
      category: 'Laboratory & Metabolic',
      organSystem: 'metabolic',
      date: '2026-09-24',
      doctor: 'Dr. Anita Verma, MD (Pathology)',
      facility: 'Apollo Health City Diagnostics',
      documentType: 'Lab Report',
      fileName: 'apollo_lipid_metabolic_sep2026.pdf',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      verificationStatus: 'verified',
      summary: 'Elevated HbA1c (6.8%) and borderline LDL cholesterol (138 mg/dL). Fasting glucose slightly high at 108 mg/dL. Renal function and liver enzymes are within normal limits.',
      tests: [
        { name: 'HbA1c (Glycated Hemoglobin)', value: '6.8', unit: '%', refRange: '4.0 - 5.6', status: 'high' },
        { name: 'Fasting Blood Sugar (FBS)', value: '108', unit: 'mg/dL', refRange: '70 - 99', status: 'high' },
        { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', refRange: '< 200', status: 'high' },
        { name: 'LDL Cholesterol', value: '138', unit: 'mg/dL', refRange: '< 100', status: 'high' },
        { name: 'HDL Cholesterol', value: '46', unit: 'mg/dL', refRange: '> 40', status: 'normal' },
        { name: 'Triglycerides', value: '155', unit: 'mg/dL', refRange: '< 150', status: 'high' },
        { name: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', refRange: '0.7 - 1.3', status: 'normal' },
        { name: 'eGFR', value: '98', unit: 'mL/min/1.73m²', refRange: '> 90', status: 'normal' }
      ]
    },
    {
      id: 'rec-002',
      title: 'Cardiology Follow-up & 12-Lead ECG',
      category: 'Heart & Cardiovascular',
      organSystem: 'cardiovascular',
      date: '2026-09-18',
      doctor: 'Dr. Arvind Rao, DM (Cardiology)',
      facility: 'Care Heart Institute',
      documentType: 'Diagnostic Report',
      fileName: 'care_ecg_cardio_summary_sep2026.pdf',
      fileSize: '2.4 MB',
      fileType: 'pdf',
      verificationStatus: 'verified',
      summary: 'Normal Sinus Rhythm at 72 bpm. PR interval 156 ms, QTc 418 ms. Resting BP 122/78 mmHg. No ischemic ST-T changes. Recommend continuing Rosuvastatin 10mg daily and 30 mins brisk walking.',
      tests: [
        { name: 'Resting Heart Rate', value: '72', unit: 'bpm', refRange: '60 - 100', status: 'normal' },
        { name: 'Blood Pressure (Systolic)', value: '122', unit: 'mmHg', refRange: '90 - 120', status: 'normal' },
        { name: 'Blood Pressure (Diastolic)', value: '78', unit: 'mmHg', refRange: '60 - 80', status: 'normal' },
        { name: 'QTc Interval', value: '418', unit: 'ms', refRange: '< 450', status: 'normal' }
      ]
    },
    {
      id: 'rec-003',
      title: 'Pulmonary Function & Chest Radiograph',
      category: 'Lungs & Respiratory',
      organSystem: 'respiratory',
      date: '2026-08-12',
      doctor: 'Dr. S. K. Nambiar, MD (Pulmonology)',
      facility: 'Yashoda Super Specialty Hospital',
      documentType: 'Diagnostic Report',
      fileName: 'yashoda_chest_pft_aug2026.pdf',
      fileSize: '3.1 MB',
      fileType: 'pdf',
      verificationStatus: 'verified',
      summary: 'Chest X-Ray PA view: Clear lung fields, normal cardiothoracic ratio, costophrenic angles sharp. Spirometry FEV1/FVC ratio 82% (normal ventilatory pattern). SpO2 99% on room air.',
      tests: [
        { name: 'SpO2 (Pulse Oximetry)', value: '99', unit: '%', refRange: '95 - 100', status: 'normal' },
        { name: 'FEV1 / FVC Ratio', value: '82', unit: '%', refRange: '> 70', status: 'normal' },
        { name: 'Peak Expiratory Flow (PEF)', value: '480', unit: 'L/min', refRange: '400 - 600', status: 'normal' }
      ]
    },
    {
      id: 'rec-004',
      title: 'Neurological Consultation & Sleep EEG',
      category: 'Brain & Neurological',
      organSystem: 'neurological',
      date: '2026-07-29',
      doctor: 'Dr. Radhika Menon, DM (Neurology)',
      facility: 'KIMS Neuroscience Centre',
      documentType: 'Consultation Note',
      fileName: 'kims_neuro_eval_jul2026.pdf',
      fileSize: '1.5 MB',
      fileType: 'pdf',
      verificationStatus: 'verified',
      summary: 'Evaluated for episodic tension headaches and mild sleep latency. Normal cranial nerve exam, deep tendon reflexes 2+ symmetrical. Routine EEG within normal limits. Suggested sleep hygiene protocol.',
      tests: [
        { name: 'Cranial Nerve Exam', value: 'Intact (I-XII)', unit: 'grade', refRange: 'Normal', status: 'normal' },
        { name: 'Deep Tendon Reflexes', value: '2+', unit: 'scale', refRange: '2+', status: 'normal' },
        { name: 'EEG Background Alpha', value: '9.5', unit: 'Hz', refRange: '8.0 - 13.0', status: 'normal' }
      ]
    },
    {
      id: 'rec-005',
      title: 'Lumbar Spine MRI & DEXA Bone Mineral Density',
      category: 'Bones & Musculoskeletal',
      organSystem: 'musculoskeletal',
      date: '2026-06-14',
      doctor: 'Dr. P. V. Ramana, MS (Orthopedics)',
      facility: 'Star Hospitals Imaging & Spine Clinic',
      documentType: 'Imaging Report',
      fileName: 'star_spine_dexa_jun2026.pdf',
      fileSize: '4.2 MB',
      fileType: 'pdf',
      verificationStatus: 'verified',
      summary: 'Mild L4-L5 disc desiccation without canal stenosis or neural impingement. DEXA T-score: -0.8 (Normal bone density). Serum 25-OH Vitamin D3 is 22 ng/mL (insufficient; supplementation initiated).',
      tests: [
        { name: 'DEXA Spine T-Score', value: '-0.8', unit: 'SD', refRange: '> -1.0', status: 'normal' },
        { name: 'DEXA Hip T-Score', value: '-0.6', unit: 'SD', refRange: '> -1.0', status: 'normal' },
        { name: 'Serum 25-OH Vitamin D3', value: '22', unit: 'ng/mL', refRange: '30 - 100', status: 'low' }
      ]
    },
    {
      id: 'rec-006',
      title: 'Annual Preventive Health & Immunization Record',
      category: 'General Medical Records',
      organSystem: 'general',
      date: '2026-05-02',
      doctor: 'Dr. Meenakshi Sundaram, MD (Internal Medicine)',
      facility: 'Rainbow Wellness Clinic',
      documentType: 'Discharge Summary',
      fileName: 'rainbow_annual_wellness_may2026.pdf',
      fileSize: '1.2 MB',
      fileType: 'pdf',
      verificationStatus: 'verified',
      summary: 'Routine comprehensive checkup. BMI 24.2 kg/m². Vaccinations updated: Tdap booster administered, Hepatitis B surface antibody titers adequate (> 100 mIU/mL). No known drug allergies.',
      tests: [
        { name: 'BMI (Body Mass Index)', value: '24.2', unit: 'kg/m²', refRange: '18.5 - 24.9', status: 'normal' },
        { name: 'Anti-HBs Titers', value: '142', unit: 'mIU/mL', refRange: '> 10', status: 'normal' },
        { name: 'Thyroid Stimulating Hormone (TSH)', value: '2.14', unit: 'µIU/mL', refRange: '0.4 - 4.5', status: 'normal' }
      ]
    },
    {
      id: 'rec-007',
      title: 'Endocrinology Prescription & Care Plan',
      category: 'Laboratory & Metabolic',
      organSystem: 'metabolic',
      date: '2026-09-26',
      doctor: 'Dr. Ramesh Babu, DM (Endocrinology)',
      facility: 'Apollo Endocrine Specialty Care',
      documentType: 'Prescription',
      fileName: 'apollo_rx_endocrinology_sep2026.jpg',
      fileSize: '950 KB',
      fileType: 'jpg',
      verificationStatus: 'needs_review',
      summary: 'Prescription for metabolic management. Metformin sustained release 500 mg. Note: OCR indicates blurred dosage frequency (1x vs 2x daily after dinner) requiring patient confirmation.',
      tests: [
        { name: 'Prescribed: Metformin ER', value: '500 mg', unit: 'tab', refRange: 'Needs Review', status: 'needs_review' },
        { name: 'Prescribed: Rosuvastatin', value: '10 mg', unit: 'tab', refRange: '1x at bedtime', status: 'normal' },
        { name: 'Prescribed: Cholecalciferol (D3)', value: '60,000 IU', unit: 'sachet', refRange: '1x weekly x 8 wks', status: 'normal' }
      ]
    }
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 'rx-1',
      name: 'Metformin Hydrochloride (Extended Release)',
      dosage: '500 mg',
      frequency: 'Once daily after dinner',
      instructions: 'Take with food to minimize GI distress. Do not crush.',
      doctor: 'Dr. Ramesh Babu',
      startDate: '2026-09-26',
      refillDate: '2026-10-26',
      status: 'active',
      category: 'Metabolic / Glycemic Control',
      flag: 'Verification Recommended'
    },
    {
      id: 'rx-2',
      name: 'Rosuvastatin Calcium',
      dosage: '10 mg',
      frequency: 'Once daily at bedtime',
      instructions: 'Lipid management. Avoid grapefruit juice.',
      doctor: 'Dr. Arvind Rao',
      startDate: '2026-09-18',
      refillDate: '2026-11-18',
      status: 'active',
      category: 'Cardiovascular / Lipid Lowering',
      flag: 'Verified'
    },
    {
      id: 'rx-3',
      name: 'Cholecalciferol (Vitamin D3)',
      dosage: '60,000 IU',
      frequency: 'Once weekly for 8 weeks',
      instructions: 'Take with milk or meal containing healthy fats.',
      doctor: 'Dr. P. V. Ramana',
      startDate: '2026-06-15',
      refillDate: '2026-10-15',
      status: 'active',
      category: 'Musculoskeletal / Bone Health',
      flag: 'Verified'
    }
  ]);

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: 'ins-001',
      type: 'abnormal_lab',
      severity: 'red',
      title: 'Glycated Hemoglobin (HbA1c) Elevated',
      value: '6.8%',
      reference: 'Normal: 4.0 - 5.6% | Prediabetes: 5.7 - 6.4%',
      sourceDocument: 'apollo_lipid_metabolic_sep2026.pdf',
      date: '2026-09-24',
      reviewStatus: 'needs_attention',
      recommendation: 'Result reflects average blood glucose over the past 3 months. Discuss dietary glycemic index and medication timing with Dr. Ramesh Babu.',
      organSystem: 'metabolic'
    },
    {
      id: 'ins-002',
      type: 'abnormal_lab',
      severity: 'red',
      title: 'LDL Cholesterol Outside Optimal Range',
      value: '138 mg/dL',
      reference: 'Desirable: < 100 mg/dL | Borderline High: 130 - 159 mg/dL',
      sourceDocument: 'apollo_lipid_metabolic_sep2026.pdf',
      date: '2026-09-24',
      reviewStatus: 'reviewed',
      recommendation: 'Rosuvastatin 10mg was initiated by Dr. Rao on Sep 18. Follow-up lipid profile scheduled in 6 weeks to evaluate response.',
      organSystem: 'cardiovascular'
    },
    {
      id: 'ins-003',
      type: 'verification_required',
      severity: 'amber',
      title: 'Extracted Dosage Frequency Requires Verification',
      value: 'Metformin ER 500mg (1x vs 2x daily)',
      reference: 'OCR extraction confidence: 78%',
      sourceDocument: 'apollo_rx_endocrinology_sep2026.jpg',
      date: '2026-09-26',
      reviewStatus: 'needs_attention',
      recommendation: 'The handwritten line for Metformin frequency contains ink smudge. Please verify whether the physician advised once daily or twice daily.',
      organSystem: 'metabolic'
    },
    {
      id: 'ins-004',
      type: 'doctor_followup',
      severity: 'teal',
      title: 'Cardiology Follow-up Recommended',
      value: 'Repeat Lipid Profile in 6 Weeks',
      reference: 'Recorded by Dr. Arvind Rao, DM (Cardiology)',
      sourceDocument: 'care_ecg_cardio_summary_sep2026.pdf',
      date: '2026-09-18',
      reviewStatus: 'scheduled',
      recommendation: 'Target date: November 2, 2026. Schedule fasting lipid test 48 hours prior to the consult.',
      organSystem: 'cardiovascular'
    },
    {
      id: 'ins-005',
      type: 'doctor_followup',
      severity: 'teal',
      title: 'Vitamin D3 Sachet Completion Milestone',
      value: 'Week 6 of 8 Completed',
      reference: 'Recorded by Dr. P. V. Ramana',
      sourceDocument: 'star_spine_dexa_jun2026.pdf',
      date: '2026-06-14',
      reviewStatus: 'scheduled',
      recommendation: 'Complete remaining 2 weekly sachets of 60,000 IU. Repeat 25-OH Vitamin D3 level in December 2026.',
      organSystem: 'musculoskeletal'
    }
  ]);

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 'evt-1',
      date: '2026-09-26',
      title: 'Metabolic Care Plan & Metformin Rx',
      type: 'Prescription',
      category: 'metabolic',
      doctor: 'Dr. Ramesh Babu, DM',
      facility: 'Apollo Endocrine Specialty Care',
      sourceDocument: 'apollo_rx_endocrinology_sep2026.jpg',
      verificationStatus: 'Needs Review',
      statusColor: 'amber',
      highlights: ['Metformin ER 500mg', 'Dietary Glycemic Counseling'],
      recordId: 'rec-007'
    },
    {
      id: 'evt-2',
      date: '2026-09-24',
      title: 'Comprehensive Metabolic & Lipid Panel',
      type: 'Lab Report',
      category: 'metabolic',
      doctor: 'Dr. Anita Verma, MD',
      facility: 'Apollo Health City Diagnostics',
      sourceDocument: 'apollo_lipid_metabolic_sep2026.pdf',
      verificationStatus: 'Clinically Verified',
      statusColor: 'teal',
      highlights: ['HbA1c 6.8%', 'LDL 138 mg/dL', 'eGFR 98 mL/min'],
      recordId: 'rec-001'
    },
    {
      id: 'evt-3',
      date: '2026-09-18',
      title: 'Cardiology Review & 12-Lead ECG',
      type: 'Diagnostic Report',
      category: 'cardiovascular',
      doctor: 'Dr. Arvind Rao, DM',
      facility: 'Care Heart Institute',
      sourceDocument: 'care_ecg_cardio_summary_sep2026.pdf',
      verificationStatus: 'Clinically Verified',
      statusColor: 'teal',
      highlights: ['Normal Sinus Rhythm 72 bpm', 'BP 122/78 mmHg', 'Rosuvastatin Started'],
      recordId: 'rec-002'
    },
    {
      id: 'evt-4',
      date: '2026-08-12',
      title: 'Chest Radiograph & Spirometry Evaluation',
      type: 'Diagnostic Report',
      category: 'respiratory',
      doctor: 'Dr. S. K. Nambiar, MD',
      facility: 'Yashoda Super Specialty Hospital',
      sourceDocument: 'yashoda_chest_pft_aug2026.pdf',
      verificationStatus: 'Clinically Verified',
      statusColor: 'teal',
      highlights: ['Clear Lung Fields', 'FEV1/FVC 82%', 'SpO2 99%'],
      recordId: 'rec-003'
    },
    {
      id: 'evt-5',
      date: '2026-07-29',
      title: 'Neurology Consultation & Routine EEG',
      type: 'Consultation Note',
      category: 'neurological',
      doctor: 'Dr. Radhika Menon, DM',
      facility: 'KIMS Neuroscience Centre',
      sourceDocument: 'kims_neuro_eval_jul2026.pdf',
      verificationStatus: 'Clinically Verified',
      statusColor: 'teal',
      highlights: ['Normal Alpha 9.5 Hz', 'Intact Cranial Nerves', 'Sleep Protocol'],
      recordId: 'rec-004'
    },
    {
      id: 'evt-6',
      date: '2026-06-14',
      title: 'Lumbar Spine MRI & DEXA Bone Scan',
      type: 'Imaging Report',
      category: 'musculoskeletal',
      doctor: 'Dr. P. V. Ramana, MS',
      facility: 'Star Hospitals Imaging & Spine Clinic',
      sourceDocument: 'star_spine_dexa_jun2026.pdf',
      verificationStatus: 'Clinically Verified',
      statusColor: 'teal',
      highlights: ['Mild L4-L5 Desiccation', 'DEXA T-Score -0.8', 'Vitamin D3 22 ng/mL'],
      recordId: 'rec-005'
    },
    {
      id: 'evt-7',
      date: '2026-05-02',
      title: 'Annual Comprehensive Wellness Evaluation',
      type: 'Discharge Summary',
      category: 'general',
      doctor: 'Dr. Meenakshi Sundaram, MD',
      facility: 'Rainbow Wellness Clinic',
      sourceDocument: 'rainbow_annual_wellness_may2026.pdf',
      verificationStatus: 'Clinically Verified',
      statusColor: 'teal',
      highlights: ['BMI 24.2 kg/m²', 'Tdap Booster Given', 'Anti-HBs 142 mIU/mL'],
      recordId: 'rec-006'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello Sai. I am your **Altrix Health Copilot**. I've indexed your latest clinical records, including your metabolic lab panel from Apollo and cardiology review from Care Heart Institute. How can I help you understand your reports today?",
      timestamp: '10:30 AM',
      suggestedFollowUps: [
        'Explain my latest lab results.',
        'Summarize my prescriptions.',
        'What should I ask my doctor?'
      ]
    }
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState<boolean>(false);

  // Compute Organ Nodes
  const organNodes: OrganNode[] = [
    {
      id: 'cardiovascular',
      title: language === 'te' ? 'గుండె & రక్తనాళాలు' : 'Heart & Cardiovascular',
      organ: 'Heart & Arterial Tree',
      recordsCount: medicalRecords.filter(r => r.organSystem === 'cardiovascular').length,
      status: 'Monitored',
      statusColor: 'teal',
      vitals: 'BP 122/78 mmHg | Resting HR 72 bpm',
      keyFindings: 'Sinus rhythm normal. LDL 138 mg/dL on Rosuvastatin 10mg.',
      lastReportDate: '2026-09-18',
      icon: 'Heart',
      position: { x: 42, y: 38 }
    },
    {
      id: 'neurological',
      title: language === 'te' ? 'మెదడు & నాడీ వ్యవస్థ' : 'Brain & Neurological',
      organ: 'Cranial & Neural Network',
      recordsCount: medicalRecords.filter(r => r.organSystem === 'neurological').length,
      status: 'Stable',
      statusColor: 'teal',
      vitals: 'EEG Alpha 9.5 Hz | Reflexes 2+',
      keyFindings: 'Cranial nerves intact. Sleep hygiene regimen maintained.',
      lastReportDate: '2026-07-29',
      icon: 'Brain',
      position: { x: 50, y: 16 }
    },
    {
      id: 'respiratory',
      title: language === 'te' ? 'ఊపిరితిత్తులు & శ్వాస వ్యవస్థ' : 'Lungs & Respiratory',
      organ: 'Pulmonary Airways',
      recordsCount: medicalRecords.filter(r => r.organSystem === 'respiratory').length,
      status: 'Optimal',
      statusColor: 'teal',
      vitals: 'SpO2 99% Room Air | FEV1/FVC 82%',
      keyFindings: 'Normal lung volume. Chest radiograph clear bilateral fields.',
      lastReportDate: '2026-08-12',
      icon: 'Wind',
      position: { x: 58, y: 32 }
    },
    {
      id: 'metabolic',
      title: language === 'te' ? 'జీవక్రియ & ల్యాబ్ రికార్డులు' : 'Laboratory & Metabolic',
      organ: 'Endocrine & Hepatic Matrix',
      recordsCount: medicalRecords.filter(r => r.organSystem === 'metabolic').length,
      status: 'Attention Needed',
      statusColor: 'amber',
      vitals: 'HbA1c 6.8% | Fasting Glucose 108 mg/dL',
      keyFindings: 'Mild glycemic elevation. Metformin ER 500mg initiated.',
      lastReportDate: '2026-09-26',
      icon: 'Activity',
      position: { x: 40, y: 56 }
    },
    {
      id: 'musculoskeletal',
      title: language === 'te' ? 'ఎముకలు & కండరాల వ్యవస్థ' : 'Bones & Musculoskeletal',
      organ: 'Spine, Joints & Skeleton',
      recordsCount: medicalRecords.filter(r => r.organSystem === 'musculoskeletal').length,
      status: 'Supplementing',
      statusColor: 'teal',
      vitals: 'DEXA T-Score -0.8 | Vit D3 22 ng/mL',
      keyFindings: 'Bone density normal. Mild L4-L5 disc desiccation, taking Vitamin D3.',
      lastReportDate: '2026-06-14',
      icon: 'Shield',
      position: { x: 62, y: 68 }
    },
    {
      id: 'general',
      title: language === 'te' ? 'సాధారణ వైద్య రికార్డులు' : 'General Medical Records',
      organ: 'Immune & Systemic Health',
      recordsCount: medicalRecords.filter(r => r.organSystem === 'general').length,
      status: 'Protected',
      statusColor: 'teal',
      vitals: 'BMI 24.2 kg/m² | TSH 2.14 µIU/mL',
      keyFindings: 'Vaccinations current (Tdap, Hep B). Zero drug allergies.',
      lastReportDate: '2026-05-02',
      icon: 'FileText',
      position: { x: 50, y: 84 }
    }
  ];

  // Dynamic Metrics
  let totalLabParameters = 0;
  let flaggedParameters = 0;
  medicalRecords.forEach(rec => {
    if (rec.tests && Array.isArray(rec.tests)) {
      totalLabParameters += rec.tests.length;
      flaggedParameters += rec.tests.filter(t => t.status === 'high' || t.status === 'low' || t.status === 'needs_review').length;
    }
  });

  const metrics: MetricsSummary = {
    medicalRecords: {
      total: medicalRecords.length,
      recentCount: 2,
      caption: translations[language].recordsMonitored,
      badge: '+2 this month'
    },
    medications: {
      total: medications.length,
      active: medications.filter(m => m.status === 'active').length,
      refillsDue: 1,
      caption: translations[language].noContraindications,
      badge: '1 Refill in 17d'
    },
    labResults: {
      total: totalLabParameters,
      totalParameters: totalLabParameters,
      inRange: totalLabParameters - flaggedParameters,
      flagged: flaggedParameters,
      caption: translations[language].inReferenceRange,
      badge: `${flaggedParameters} Flagged`
    },
    healthcareVisits: {
      total: timelineEvents.length,
      totalEncounters: timelineEvents.length,
      specialistsConsulted: 4,
      facilities: 5,
      caption: translations[language].specialistCare,
      badge: 'Next follow-up Nov 2'
    }
  };

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateInsightStatus = (id: string, status: 'reviewed' | 'needs_attention' | 'scheduled') => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, reviewStatus: status } : i));
    addToast('success', 'Status Updated', 'Insight review status has been recorded.');
  };

  // Add Record From Upload pipeline
  const addRecordFromUpload = (data: ExtractedDocumentData, fileName: string) => {
    const newRecordId = `rec-${Date.now().toString().slice(-4)}`;
    const newRecord: MedicalRecord = {
      id: newRecordId,
      title: data.title,
      category: data.category,
      organSystem: data.organSystem,
      date: data.date,
      doctor: data.doctor,
      facility: data.facility,
      documentType: data.documentType,
      fileName: fileName,
      fileSize: '1.6 MB',
      fileType: fileName.endsWith('.pdf') ? 'pdf' : 'jpg',
      verificationStatus: data.tests.some(t => t.status === 'needs_review') ? 'needs_review' : 'verified',
      summary: data.aiSummary,
      tests: data.tests
    };

    setMedicalRecords(prev => [newRecord, ...prev]);

    // Add to timeline
    const newEvent: TimelineEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      date: data.date,
      title: data.title,
      type: data.documentType,
      category: data.organSystem,
      doctor: data.doctor,
      facility: data.facility,
      sourceDocument: fileName,
      verificationStatus: newRecord.verificationStatus === 'verified' ? 'Clinically Verified' : 'Needs Review',
      statusColor: newRecord.verificationStatus === 'verified' ? 'teal' : 'amber',
      highlights: data.tests.slice(0, 3).map(t => `${t.name}: ${t.value} ${t.unit}`),
      recordId: newRecordId
    };
    setTimelineEvents(prev => [newEvent, ...prev]);

    // Check for abnormal lab insights
    const abnormalTests = data.tests.filter(t => t.status === 'high' || t.status === 'low');
    abnormalTests.forEach(test => {
      const newInsight: AIInsight = {
        id: `ins-${Date.now().toString().slice(-4)}-${Math.random().toString().slice(-2)}`,
        type: 'abnormal_lab',
        severity: 'red',
        title: `${test.name} Outside Standard Reference`,
        value: `${test.value} ${test.unit}`,
        reference: `Ref: ${test.refRange}`,
        sourceDocument: fileName,
        date: data.date,
        reviewStatus: 'needs_attention',
        recommendation: `Recorded value is flagged as ${test.status}. Discuss with ${data.doctor} at next review.`,
        organSystem: data.organSystem
      };
      setInsights(prev => [newInsight, ...prev]);
    });

    addToast('success', 'Record Saved & Indexed', `"${data.title}" added to your Health Intelligence Graph.`);
  };

  // Copilot Chat
  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsCopilotLoading(true);

    try {
      // Attempt backend endpoint
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citedRecords: data.citedRecords,
          suggestedFollowUps: data.suggestedFollowUps
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('API unavailable, switching to local intelligence fallback');
      }
    } catch {
      // Local intelligent clinical fallback
      const q = text.toLowerCase();
      let reply = '';
      let cited: string[] = [];
      let followUps: string[] = [];

      if (q.includes('lab') || q.includes('result') || q.includes('blood') || q.includes('hba1c') || q.includes('sugar') || q.includes('glucose')) {
        reply = `Based on your latest **Comprehensive Metabolic & Lipid Panel** (Sep 24, 2026, Apollo Health City):

1. **HbA1c (Glycated Hemoglobin)**: **6.8%** (Standard reference: 4.0 - 5.6%). This indicates mild glycemic elevation over the past 90 days.
2. **Fasting Glucose**: **108 mg/dL** (Reference: 70 - 99 mg/dL).
3. **Renal Filtration**: **eGFR 98 mL/min/1.73m²** and **Serum Creatinine 0.9 mg/dL**, confirming normal kidney function.

*Clinical Context:* An abnormal laboratory value alone does not constitute a standalone diagnosis. Your endocrinologist, Dr. Ramesh Babu, has prescribed Metformin ER 500mg and advised dietary glycemic monitoring.`;
        cited = ['Comprehensive Metabolic Panel (Sep 24, 2026)', 'Apollo Endocrine Care (Sep 26, 2026)'];
        followUps = ['What dietary changes stabilize fasting glucose?', 'What should I ask Dr. Ramesh Babu?', 'Summarize my prescriptions.'];
      } else if (q.includes('prescription') || q.includes('medication') || q.includes('pill') || q.includes('metformin') || q.includes('statin')) {
        reply = `Here is your verified active medication regimen:

- **Metformin ER 500 mg**: 1 tablet after dinner with food. *(Note: Verification recommended for handwritten dose frequency).*
- **Rosuvastatin Calcium 10 mg**: 1 tablet daily at bedtime. Prescribed by Dr. Arvind Rao for lipid regulation. Avoid consuming grapefruit products around dosage time.
- **Cholecalciferol (Vitamin D3) 60,000 IU**: 1 sachet weekly with milk or meal. You are on Week 6 of an 8-week replenishment protocol.

*Safety Guideline:* Never alter or stop a prescription without consulting your doctor.`;
        cited = ['Endocrinology Prescription (Sep 26, 2026)', 'Care Heart Institute (Sep 18, 2026)'];
        followUps = ['Are there food interactions with Rosuvastatin?', 'When is my next refill due?', 'What should I ask my doctor?'];
      } else if (q.includes('ask') || q.includes('doctor') || q.includes('question') || q.includes('appointment')) {
        reply = `Here are structured questions for your next consultation:

1. **Glycemic Targets:** *"My HbA1c is 6.8%. Is our target < 6.5%, and should I maintain Metformin ER 500mg once daily?"*
2. **Lipid Goals:** *"With my baseline LDL at 138 mg/dL on Rosuvastatin 10mg, what is our target level at the 6-week repeat panel?"*
3. **Vitamin D3 Follow-up:** *"I am completing the 8-week course of 60,000 IU. When should we re-test 25-OH Vitamin D3?"*`;
        cited = ['Cardiology Follow-up (Sep 18, 2026)', 'Metabolic Panel (Sep 24, 2026)'];
        followUps = ['Explain my latest lab results.', 'Summarize my prescriptions.', 'What should I bring to my appointment?'];
      } else {
        reply = `I have indexed your **7 medical records** across **6 physiological systems**. You can ask me to explain test parameters, summarize your prescriptions, or generate talking points for your doctor.

*Medical Notice:* Altrix Copilot organizes and clarifies clinical information. It does not provide medical diagnoses or modify treatment plans.`;
        cited = ['Altrix Clinical Graph (7 records indexed)'];
        followUps = ['Explain my latest lab results.', 'Summarize my prescriptions.', 'What should I ask my doctor?'];
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citedRecords: cited,
        suggestedFollowUps: followUps
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const t = translations[language];

  return (
    <HealthContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        isAuthenticated,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        loginAsDemo,
        medicalRecords,
        activeOrgan,
        setActiveOrgan,
        organNodes,
        metrics,
        insights,
        timelineEvents,
        medications,
        selectedRecord,
        setSelectedRecord,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isProfileOpen,
        setIsProfileOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        chatMessages,
        isCopilotLoading,
        sendMessage,
        addRecordFromUpload,
        updateInsightStatus,
        toasts,
        addToast,
        removeToast,
        scrollToSection
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
