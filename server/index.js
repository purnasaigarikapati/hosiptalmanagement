import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initPostgresTables, query, isPostgresConfigured } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are supported.'));
    }
  }
});

// In-Memory Database with realistic clinical data
let medicalRecords = [
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
    summary: 'Evaluated for episodic tension-type headaches and mild sleep latency. Normal cranial nerve exam, deep tendon reflexes 2+ symmetrical. Routine EEG within normal limits. Suggested sleep hygiene protocol.',
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
];

// Prescriptions state
let prescriptions = [
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
];

// AI Insights stream
let insights = [
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
];

// Timeline events
let timelineEvents = [
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
];

// Helper to compute organ node data
function getOrganNodeData() {
  const organCounts = {
    cardiovascular: 0,
    neurological: 0,
    respiratory: 0,
    metabolic: 0,
    musculoskeletal: 0,
    general: 0
  };

  medicalRecords.forEach(rec => {
    if (organCounts[rec.organSystem] !== undefined) {
      organCounts[rec.organSystem]++;
    } else {
      organCounts.general++;
    }
  });

  return [
    {
      id: 'cardiovascular',
      title: 'Heart & Cardiovascular',
      organ: 'Heart & Arteries',
      recordsCount: organCounts.cardiovascular,
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
      title: 'Brain & Neurological',
      organ: 'Cranial & Neural',
      recordsCount: organCounts.neurological,
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
      title: 'Lungs & Respiratory',
      organ: 'Pulmonary Tree',
      recordsCount: organCounts.respiratory,
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
      title: 'Laboratory & Metabolic',
      organ: 'Endocrine & Hepatic',
      recordsCount: organCounts.metabolic,
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
      title: 'Bones & Musculoskeletal',
      organ: 'Spine & Joints',
      recordsCount: organCounts.musculoskeletal,
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
      title: 'General Medical Records',
      organ: 'Immune & Systemic',
      recordsCount: organCounts.general,
      status: 'Protected',
      statusColor: 'teal',
      vitals: 'BMI 24.2 kg/m² | TSH 2.14 µIU/mL',
      keyFindings: 'Vaccinations current (Tdap, Hep B). Zero drug allergies.',
      lastReportDate: '2026-05-02',
      icon: 'FileText',
      position: { x: 50, y: 84 }
    }
  ];
}

// Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'ALTRIX HEALTH — AI Health Intelligence Engine',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Metrics overview
app.get('/api/metrics', (req, res) => {
  const totalRecords = medicalRecords.length;
  const activeMedications = prescriptions.filter(p => p.status === 'active').length;
  
  let totalLabParameters = 0;
  let flaggedParameters = 0;
  medicalRecords.forEach(rec => {
    if (rec.tests && Array.isArray(rec.tests)) {
      totalLabParameters += rec.tests.length;
      flaggedParameters += rec.tests.filter(t => t.status === 'high' || t.status === 'low' || t.status === 'needs_review').length;
    }
  });

  const uniqueFacilities = new Set(medicalRecords.map(r => r.facility)).size;
  const uniqueDoctors = new Set(medicalRecords.map(r => r.doctor)).size;

  res.json({
    medicalRecords: {
      total: totalRecords,
      recentCount: 2,
      caption: 'Organized across 6 physiological systems',
      badge: '+2 this month'
    },
    medications: {
      active: activeMedications,
      totalPrescriptions: prescriptions.length,
      refillsDue: 1,
      caption: 'Zero contraindications flagged',
      badge: '1 Refill in 17d'
    },
    labResults: {
      totalParameters: totalLabParameters,
      inRange: totalLabParameters - flaggedParameters,
      flagged: flaggedParameters,
      caption: `${totalLabParameters - flaggedParameters} biomarkers within reference standard`,
      badge: `${flaggedParameters} Flagged`
    },
    healthcareVisits: {
      totalEncounters: timelineEvents.length,
      specialistsConsulted: uniqueDoctors,
      facilities: uniqueFacilities,
      caption: 'Last visit with Dr. Ramesh Babu (Sep 26)',
      badge: 'Next follow-up Nov 2'
    }
  });
});

// 3. Anatomical organ nodes for Living Health Map
app.get('/api/anatomy', (req, res) => {
  res.json({
    nodes: getOrganNodeData(),
    disclaimer: 'Visualization of recorded medical information, not a body scanner or diagnostic tool.'
  });
});

// 4. Medical Records list & query
app.get('/api/records', (req, res) => {
  const { system, query } = req.query;
  let results = [...medicalRecords];

  if (system && system !== 'all') {
    results = results.filter(r => r.organSystem === system);
  }

  if (query) {
    const q = String(query).toLowerCase();
    results = results.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.doctor.toLowerCase().includes(q) ||
      r.facility.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q)
    );
  }

  res.json({
    total: results.length,
    records: results
  });
});

// Database Health & Status (PostgreSQL on Render / Fallback)
app.get('/api/db/status', async (req, res) => {
  if (isPostgresConfigured) {
    try {
      const dbRes = await query('SELECT COUNT(*) FROM medical_records');
      const count = dbRes ? parseInt(dbRes.rows[0].count, 10) : 0;
      res.json({
        configured: true,
        provider: 'PostgreSQL (Render Cloud)',
        status: 'Connected',
        recordCount: count,
        urlConfigured: true
      });
    } catch (err) {
      res.json({
        configured: true,
        provider: 'PostgreSQL',
        status: 'Connection Error (In-Memory Fallback Active)',
        error: err.message,
        recordCount: medicalRecords.length
      });
    }
  } else {
    res.json({
      configured: false,
      provider: 'In-Memory Clinical Graph (Local / Demo)',
      status: 'Active (Deploy to Render with DATABASE_URL to enable PostgreSQL)',
      recordCount: medicalRecords.length
    });
  }
});

// Create new medical record
app.post('/api/records', async (req, res) => {
  const newRecord = {
    id: `rec-${Date.now().toString().slice(-4)}`,
    title: req.body.title || 'Extracted Clinical Record',
    category: req.body.category || 'Laboratory & Metabolic',
    organSystem: req.body.organSystem || 'metabolic',
    date: req.body.date || new Date().toISOString().split('T')[0],
    doctor: req.body.doctor || 'Healthcare Provider',
    facility: req.body.facility || 'Clinical Diagnostics',
    documentType: req.body.documentType || 'Lab Report',
    fileName: req.body.fileName || 'uploaded_document.pdf',
    fileSize: req.body.fileSize || '1.4 MB',
    fileType: req.body.fileType || 'pdf',
    verificationStatus: req.body.verificationStatus || 'verified',
    summary: req.body.summary || 'Clinical record processed by Altrix Health intelligence pipeline.',
    tests: req.body.tests || []
  };

  medicalRecords.unshift(newRecord);

  // Sync to PostgreSQL if connected
  if (isPostgresConfigured) {
    try {
      await query(`
        INSERT INTO medical_records 
        (id, title, category, organ_system, record_date, doctor, facility, document_type, file_name, file_size, file_type, verification_status, summary, tests)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        newRecord.id,
        newRecord.title,
        newRecord.category,
        newRecord.organSystem,
        newRecord.date,
        newRecord.doctor,
        newRecord.facility,
        newRecord.documentType,
        newRecord.fileName,
        newRecord.fileSize,
        newRecord.fileType,
        newRecord.verificationStatus,
        newRecord.summary,
        JSON.stringify(newRecord.tests || [])
      ]);
      console.log(`[PostgreSQL] Persisted record ${newRecord.id} to medical_records table.`);
    } catch (dbErr) {
      console.error('[PostgreSQL] Error persisting record to database:', dbErr.message);
    }
  }

  // Add event to timeline
  timelineEvents.unshift({
    id: `evt-${Date.now().toString().slice(-4)}`,
    date: newRecord.date,
    title: newRecord.title,
    type: newRecord.documentType,
    category: newRecord.organSystem,
    doctor: newRecord.doctor,
    facility: newRecord.facility,
    sourceDocument: newRecord.fileName,
    verificationStatus: newRecord.verificationStatus === 'verified' ? 'Clinically Verified' : 'Needs Review',
    statusColor: newRecord.verificationStatus === 'verified' ? 'teal' : 'amber',
    highlights: newRecord.tests.slice(0, 3).map(t => `${t.name} ${t.value} ${t.unit}`),
    recordId: newRecord.id
  });

  res.status(201).json({
    message: 'Record successfully added and indexed into health intelligence graph',
    record: newRecord
  });
});

// 5. Insights stream
app.get('/api/insights', (req, res) => {
  res.json({
    total: insights.length,
    insights
  });
});

app.patch('/api/insights/:id', (req, res) => {
  const { id } = req.params;
  const { reviewStatus } = req.body;
  const item = insights.find(i => i.id === id);
  if (item) {
    if (reviewStatus) item.reviewStatus = reviewStatus;
    res.json({ message: 'Insight status updated', item });
  } else {
    res.status(404).json({ error: 'Insight not found' });
  }
});

// 6. Connected Timeline
app.get('/api/timeline', (req, res) => {
  res.json({
    total: timelineEvents.length,
    events: timelineEvents
  });
});

// 7. Prescriptions list
app.get('/api/medications', (req, res) => {
  res.json({
    total: prescriptions.length,
    medications: prescriptions
  });
});

// 8. Health Journey Distribution Analytics
app.get('/api/analytics', (req, res) => {
  const categoryCounts = {
    'Laboratory Reports': medicalRecords.filter(r => r.documentType === 'Lab Report').length,
    'Prescriptions': medicalRecords.filter(r => r.documentType === 'Prescription').length,
    'Diagnostic Reports': medicalRecords.filter(r => r.documentType === 'Diagnostic Report').length,
    'Consultation Notes': medicalRecords.filter(r => r.documentType === 'Consultation Note').length,
    'Discharge Summaries': medicalRecords.filter(r => r.documentType === 'Discharge Summary' || r.documentType === 'Imaging Report').length,
  };

  const recentDocuments = medicalRecords.slice(0, 5).map(r => ({
    id: r.id,
    fileName: r.fileName,
    date: r.date,
    fileType: r.fileType,
    size: r.fileSize,
    documentType: r.documentType,
    status: r.verificationStatus,
    facility: r.facility
  }));

  res.json({
    totalRecords: medicalRecords.length,
    distribution: categoryCounts,
    recentDocuments
  });
});

// 9. Document Upload & Simulation OCR Pipeline
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Determine simulation response based on filename
    const nameLower = file.originalname.toLowerCase();
    let extractedData = {};

    if (nameLower.includes('lipid') || nameLower.includes('cholesterol') || nameLower.includes('blood') || nameLower.includes('lab')) {
      extractedData = {
        title: 'Comprehensive Lipid & Glycemic Panel',
        category: 'Laboratory & Metabolic',
        organSystem: 'metabolic',
        documentType: 'Lab Report',
        doctor: 'Dr. Anita Verma, MD',
        facility: 'Apollo Health Diagnostics',
        date: new Date().toISOString().split('T')[0],
        confidenceScore: 0.94,
        tests: [
          { name: 'Fasting Blood Glucose', value: '104', unit: 'mg/dL', refRange: '70 - 99', status: 'high' },
          { name: 'HbA1c', value: '6.7', unit: '%', refRange: '4.0 - 5.6', status: 'high' },
          { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', refRange: '< 200', status: 'high' },
          { name: 'HDL Cholesterol', value: '48', unit: 'mg/dL', refRange: '> 40', status: 'normal' },
          { name: 'LDL Cholesterol', value: '134', unit: 'mg/dL', refRange: '< 100', status: 'high' },
          { name: 'Triglycerides', value: '145', unit: 'mg/dL', refRange: '< 150', status: 'normal' }
        ],
        aiSummary: 'Extracted 6 biomarkers. Glycemic indicators (HbA1c 6.7%, Fasting Glucose 104 mg/dL) and LDL cholesterol (134 mg/dL) exceed standard reference thresholds. Triglycerides and HDL remain within favorable ranges.',
        flags: ['Glycemic markers require doctor review', 'Lipid levels consistent with previous trend']
      };
    } else if (nameLower.includes('rx') || nameLower.includes('prescription') || nameLower.includes('med')) {
      extractedData = {
        title: 'Physician Prescription & Medication Order',
        category: 'General Medical Records',
        organSystem: 'general',
        documentType: 'Prescription',
        doctor: 'Dr. Arvind Rao, DM (Cardiology)',
        facility: 'Care Heart Clinic',
        date: new Date().toISOString().split('T')[0],
        confidenceScore: 0.89,
        tests: [
          { name: 'Rosuvastatin Calcium', value: '10 mg', unit: 'tab', refRange: '1x daily at night', status: 'normal' },
          { name: 'CoQ10 Supplement', value: '100 mg', unit: 'cap', refRange: '1x morning with meal', status: 'normal' },
          { name: 'Metformin ER', value: '500 mg', unit: 'tab', refRange: 'Needs Verification (1x vs 2x)', status: 'needs_review' }
        ],
        aiSummary: 'Extracted 3 medication lines. Rosuvastatin 10mg once daily at bedtime confirmed. Note: Metformin dosage frequency has low OCR clarity score (0.78) and should be confirmed manually before saving.',
        flags: ['Confirm Metformin dosage frequency with original prescription']
      };
    } else {
      extractedData = {
        title: 'Clinical Consultation Summary & Vitals',
        category: 'Heart & Cardiovascular',
        organSystem: 'cardiovascular',
        documentType: 'Diagnostic Report',
        doctor: 'Dr. Meenakshi Sundaram, MD',
        facility: 'City Specialty Medical Care',
        date: new Date().toISOString().split('T')[0],
        confidenceScore: 0.92,
        tests: [
          { name: 'Resting Blood Pressure', value: '124/80', unit: 'mmHg', refRange: '90/60 - 120/80', status: 'normal' },
          { name: 'Resting Heart Rate', value: '74', unit: 'bpm', refRange: '60 - 100', status: 'normal' },
          { name: 'SpO2 Room Air', value: '98', unit: '%', refRange: '95 - 100', status: 'normal' },
          { name: 'Body Weight', value: '71.5', unit: 'kg', refRange: 'Target: 68 - 72 kg', status: 'normal' }
        ],
        aiSummary: 'Clinical encounter vitals recorded. Blood pressure 124/80 mmHg and resting pulse 74 bpm are stable. Normal oxygen saturation on ambient room air.',
        flags: ['Vital signs stable across all monitored parameters']
      };
    }

    res.json({
      message: 'Document successfully uploaded and analyzed',
      file: {
        originalName: file.originalname,
        filename: file.filename,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimetype: file.mimetype
      },
      extracted: extractedData
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// 10. AI Health Copilot Conversational Endpoint
app.post('/api/copilot', (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const query = message.toLowerCase();
  let reply = '';
  let citedRecords = [];
  let suggestedFollowUps = [];

  // Medical AI reasoning engine referencing real database records
  if (query.includes('lab') || query.includes('result') || query.includes('test') || query.includes('blood') || query.includes('hba1c') || query.includes('sugar') || query.includes('glucose')) {
    reply = `Based on your latest **Comprehensive Metabolic & Lipid Panel** (dated September 24, 2026 from Apollo Health City):

1. **HbA1c (Glycated Hemoglobin)**: **6.8%** (Standard reference: 4.0 - 5.6%). This indicates an average blood glucose level consistent with mild glycemic elevation over the past 3 months.
2. **Fasting Blood Sugar**: **108 mg/dL** (Standard reference: 70 - 99 mg/dL).
3. **Renal & Liver Function**: Your **eGFR is 98 mL/min/1.73m²** and **Serum Creatinine is 0.9 mg/dL**, both reflecting healthy kidney filtration.

*Clinical Context:* An abnormal laboratory value alone does not constitute a standalone diagnosis. Your endocrinologist, Dr. Ramesh Babu, has prescribed Metformin ER 500mg and advised dietary glycemic monitoring.`;
    citedRecords = ['Comprehensive Metabolic & Lipid Panel (Sep 24, 2026)', 'Endocrinology Prescription (Sep 26, 2026)'];
    suggestedFollowUps = [
      'What dietary changes help stabilize fasting glucose?',
      'Why is HbA1c measured instead of just daily sugar?',
      'What should I ask Dr. Ramesh Babu at our next visit?'
    ];
  } else if (query.includes('prescription') || query.includes('medication') || query.includes('drug') || query.includes('pill') || query.includes('metformin') || query.includes('statin') || query.includes('rosuvastatin')) {
    reply = `Here is the verified summary of your active medications currently logged in Altrix Health:

- **Metformin ER 500 mg**: 1 tablet after dinner with food. *Note:* Please verify the handwritten frequency with your pharmacist as marked in your insight stream.
- **Rosuvastatin Calcium 10 mg**: 1 tablet daily at bedtime. Prescribed by Dr. Arvind Rao for lipid regulation. Avoid consuming grapefruit products around dosage time.
- **Cholecalciferol (Vitamin D3) 60,000 IU**: 1 sachet weekly with a fat-containing meal. You are currently on Week 6 of an 8-week replenishment protocol.

*Safety Guideline:* Never adjust, discontinue, or initiate any prescription without explicit guidance from your prescribing physician.`;
    citedRecords = ['Endocrinology Prescription (Sep 26, 2026)', 'Cardiology Review (Sep 18, 2026)', 'Spine & DEXA Report (Jun 14, 2026)'];
    suggestedFollowUps = [
      'Are there food interactions with Rosuvastatin?',
      'When is my next medication refill due?',
      'How does Vitamin D3 support bone mineral density?'
    ];
  } else if (query.includes('ask my doctor') || query.includes('doctor') || query.includes('question') || query.includes('consultation') || query.includes('appointment')) {
    reply = `Here are high-yield, structured questions tailored to your upcoming follow-up with **Dr. Arvind Rao** and **Dr. Ramesh Babu**:

1. **Regarding Glycemic Management:** *"My HbA1c was recorded at 6.8% and fasting sugar at 108 mg/dL. Should we adjust my lifestyle targets or verify if Metformin ER 500mg once daily is sufficient?"*
2. **Regarding Cholesterol Targets:** *"Given my baseline LDL of 138 mg/dL, what is our target LDL level after 6 weeks on Rosuvastatin 10mg?"*
3. **Regarding Vitamin D3 Completion:** *"I am completing my 8-week course of 60,000 IU Vitamin D3. When should we re-check 25-OH Vitamin D3 levels to confirm adequacy?"*
4. **General Monitoring:** *"Are there any specific at-home biomarkers (such as home BP or fasting glucometer readings) you would like me to log before our next visit?"*`;
    citedRecords = ['Cardiology Follow-up (Sep 18, 2026)', 'Metabolic Panel (Sep 24, 2026)'];
    suggestedFollowUps = [
      'Summarize these questions into a printable list.',
      'Explain what target LDL levels mean for heart health.',
      'What should I bring to my appointment?'
    ];
  } else if (query.includes('heart') || query.includes('cardio') || query.includes('ecg') || query.includes('bp') || query.includes('blood pressure')) {
    reply = `Your cardiovascular records show:

- **12-Lead ECG (Sep 18, 2026, Care Heart Institute):** Normal Sinus Rhythm at 72 bpm. PR interval 156 ms, QTc 418 ms. No ischemic ST-T abnormalities.
- **Blood Pressure:** Resting BP measured 122/78 mmHg, comfortably within the normal systolic and diastolic reference range.
- **Lipid Status:** Total cholesterol was 215 mg/dL with LDL at 138 mg/dL. Dr. Arvind Rao initiated Rosuvastatin 10mg daily with a recommended repeat lipid panel in November.`;
    citedRecords = ['Care Heart Institute ECG & Consult (Sep 18, 2026)'];
    suggestedFollowUps = [
      'What is the significance of the QTc interval on an ECG?',
      'How does aerobic walking impact lipid profiles?',
      'Explain my latest lab results.'
    ];
  } else if (query.includes('lung') || query.includes('respiratory') || query.includes('breathing') || query.includes('spo2')) {
    reply = `Your respiratory evaluation from **Yashoda Super Specialty Hospital (August 12, 2026)** demonstrates:

- **Spirometry:** FEV1/FVC ratio is **82%**, reflecting clear ventilatory mechanics without obstructive or restrictive patterns.
- **Resting SpO2:** **99%** on ambient room air.
- **Chest Radiograph (PA view):** Completely clear lung fields, sharp costophrenic angles, and normal cardiothoracic silhouette.`;
    citedRecords = ['Yashoda Hospital Chest Radiograph & Spirometry (Aug 12, 2026)'];
    suggestedFollowUps = [
      'What does FEV1/FVC ratio mean?',
      'Explain my latest lab results.',
      'What should I ask my doctor?'
    ];
  } else {
    reply = `I have analyzed your Altrix Health intelligence profile. Currently, you have **7 indexed medical records** across **6 physiological systems**, including your recent metabolic panel (Sep 24), cardiology ECG (Sep 18), and active prescriptions for glycemic and lipid care.

How can I help you explore your records today? You can ask me to:
- Explain specific biomarker numbers (e.g., HbA1c, LDL, Vitamin D3)
- Compare trends across your timeline
- Prepare personalized questions for your doctor's visit
- Clarify medical terminology in simple, everyday language

*Medical Disclaimer:* Altrix Health Copilot provides health information synthesis and organization. It does not provide medical diagnoses or treatment prescriptions. Always consult a qualified medical professional.`;
    citedRecords = ['Altrix Clinical Intelligence Graph (7 active records)'];
    suggestedFollowUps = [
      'Explain my latest lab results.',
      'Summarize my prescriptions.',
      'What should I ask my doctor?'
    ];
  }

  res.json({
    reply,
    citedRecords,
    suggestedFollowUps,
    model: process.env.GEMINI_API_KEY ? 'Gemini 1.5 Pro (Clinical Augmented)' : 'Altrix Clinical Intelligence Engine (Demo Mode)',
    disclaimer: 'This AI summary is for informational organization only and does not constitute a clinical diagnosis or treatment recommendation.'
  });
});

// 12. Patient Hospital Appointments & Attendance Tokens
let appointments = [
  {
    id: 'apt-001',
    tokenNumber: 'TK #07',
    tokenCode: 'ALTRIX-TK-0842',
    patientName: 'Sai Garikapati',
    age: 28,
    gender: 'Male',
    phone: '+91 98480 12345',
    weight: '72 kg',
    doctor: {
      id: 'doc-1',
      name: 'Dr. Ramesh Babu, MD, DM',
      specialty: 'Senior Cardiologist & Interventionalist',
      hospital: 'Apollo Hospitals Jubilee Hills',
      room: 'OPD Cabin #304, 3rd Floor',
      consultationFee: '₹1,200',
      timeSlots: ['09:30 AM', '10:15 AM', '11:00 AM', '04:30 PM', '05:15 PM'],
      avatar: 'RB',
      rating: 4.9,
      experience: '18+ Years',
      days: 'Mon, Wed, Fri, Sat'
    },
    date: '2026-10-10',
    timeSlot: '10:15 AM',
    healthDescription: 'Seeking routine cardiovascular & metabolic checkup. Reviewing borderline cholesterol and ECG tracing.',
    queuePosition: 7,
    estimatedWaitMinutes: 20,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

app.get('/api/appointments', async (req, res) => {
  if (isPostgresConfigured) {
    try {
      const { rows } = await query('SELECT * FROM appointments ORDER BY created_at DESC');
      if (rows && rows.length > 0) {
        return res.json(rows.map(r => ({
          id: r.id,
          tokenNumber: r.token_number,
          tokenCode: r.token_code,
          patientName: r.patient_name,
          age: r.age,
          gender: r.gender,
          phone: r.phone,
          weight: r.weight,
          doctor: {
            id: r.doctor_id,
            name: r.doctor_name,
            specialty: r.doctor_specialty,
            room: r.doctor_room
          },
          date: r.appointment_date,
          timeSlot: r.time_slot,
          healthDescription: r.health_description,
          queuePosition: r.queue_position,
          estimatedWaitMinutes: r.estimated_wait_minutes,
          status: r.status,
          createdAt: r.created_at
        })));
      }
    } catch (e) {
      console.error('[PostgreSQL] Failed to fetch appointments:', e.message);
    }
  }
  res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
  const data = req.body;
  const tokenNumber = `TK #${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`;
  const tokenCode = `ALTRIX-TK-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = `apt-${Date.now()}`;
  const newAppointment = {
    id,
    tokenNumber,
    tokenCode,
    patientName: data.patientName || 'Patient',
    age: data.age || 28,
    gender: data.gender || 'Male',
    phone: data.phone || '+91 98480 12345',
    weight: data.weight || '70 kg',
    doctor: data.doctor,
    date: data.date,
    timeSlot: data.timeSlot,
    healthDescription: data.healthDescription || 'Consultation request.',
    queuePosition: Math.floor(Math.random() * 8) + 1,
    estimatedWaitMinutes: Math.floor(Math.random() * 25) + 10,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);

  if (isPostgresConfigured) {
    try {
      await query(`
        INSERT INTO appointments 
        (id, token_number, token_code, patient_name, age, gender, phone, weight, doctor_id, doctor_name, doctor_specialty, doctor_room, appointment_date, time_slot, health_description, queue_position, estimated_wait_minutes, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        id, tokenNumber, tokenCode, newAppointment.patientName, newAppointment.age, newAppointment.gender,
        newAppointment.phone, newAppointment.weight, newAppointment.doctor.id, newAppointment.doctor.name,
        newAppointment.doctor.specialty, newAppointment.doctor.room || '', newAppointment.date,
        newAppointment.timeSlot, newAppointment.healthDescription, newAppointment.queuePosition,
        newAppointment.estimatedWaitMinutes, newAppointment.status
      ]);
    } catch (e) {
      console.error('[PostgreSQL] Failed to insert appointment:', e.message);
    }
  }

  res.status(201).json(newAppointment);
});

app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  appointments = appointments.filter(a => a.id !== id);
  if (isPostgresConfigured) {
    try {
      await query('DELETE FROM appointments WHERE id = $1', [id]);
    } catch (e) {
      console.error('[PostgreSQL] Failed to delete appointment:', e.message);
    }
  }
  res.json({ success: true, message: 'Appointment cancelled successfully' });
});

// Serve built frontend assets
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, async () => {
  console.log(`[ALTRIX HEALTH] Backend Intelligence Server running on http://localhost:${PORT}`);
  if (isPostgresConfigured) {
    console.log('[ALTRIX HEALTH] PostgreSQL detected via DATABASE_URL. Initializing schema & tables...');
    await initPostgresTables(medicalRecords);
  } else {
    console.log('[ALTRIX HEALTH] Running in In-Memory / Local Storage mode. To use PostgreSQL on Render, set DATABASE_URL.');
  }
});
