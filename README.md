# ALTRIX HEALTH — AI-Powered Personal Health Copilot
### AI Health Intelligence Command Center (v2.0)

> **"Your health, beautifully connected."**  
> *Every report tells a story. Understand yours with AI-powered clarity.*

---

## 🌟 Overview & Architecture

**ALTRIX HEALTH** is a next-generation personal health intelligence dashboard designed with a futuristic medical aesthetic (midnight navy, luminous turquoise, cyan, electric blue, and glassmorphic surfaces). It unifies clinical diagnostic reports, prescriptions, longitudinal vitals, and physician encounters into an interactive **Living Health Map** and an **AI Health Copilot**.

### 🧬 Core Systems & Features

1. **Living Health Map (Signature Hero Centerpiece)**
   - Futuristic SVG anatomical silhouette with organic contours, skeletal alignment, and pulsating organ landmarks.
   - Connected orbital nodes representing 6 core physiological systems:
     * **Heart & Cardiovascular Records** (BP, Heart Rate, ECG waveforms)
     * **Brain & Neurological Records** (Sleep EEG, Cranial evaluations)
     * **Lungs & Respiratory Records** (Spirometry, SpO2, Chest Radiographs)
     * **Laboratory & Metabolic Records** (HbA1c, Glycemic markers, Lipid panel)
     * **Bones & Musculoskeletal Records** (DEXA bone density, Spine MRI, Vitamin D3)
     * **General Medical Records** (BMI, TSH, Vaccinations, Immunizations)
   - Dynamic record counts synchronized with active profile storage.
   - Interactive hover circuits and click-to-filter inspection modal.
   - Real-time Contextual Live Information Panel updating dynamically on selection.
   - Clear clinical disclaimer: *Visualization of recorded medical information, not a body scanner or diagnostic tool.*

2. **Personalized Hero & Live Vitals Matrix**
   - Editorial typography with glowing gradient headings.
   - Quick action triggers: **"Analyze a Report"** and **"Explore Health Timeline"**.
   - Live vitals ticker showing Blood Pressure, Resting Pulse, SpO2, and HbA1c.

3. **Floating AI Health Copilot**
   - High-contrast glowing cyan border with contextual conversation feed.
   - Multi-prompt quick actions:
     * *Explain my latest lab results.*
     * *Summarize my prescriptions.*
     * *What should I ask my doctor?*
   - Real clinical reasoning engine citing actual stored medical records and reference standards.
   - Strict medical safety guardrails: explains medical terminology in plain language, acknowledges clinical uncertainty, never fabricates diagnoses, and advises consulting licensed physicians.
   - Dual-mode support: Local Clinical Intelligence Engine (Instant Demo Mode) and Google Gemini 1.5 Pro API integration.

4. **Smart Health Overview (4 Distinct Metric Treatments)**
   - **Medical Records:** 7 indexed reports across 6 physiological systems.
   - **Medication Records:** Active regimens, refill countdowns, zero contraindications.
   - **Laboratory Results:** 28 biomarkers tracked, 25 within reference standards, 3 flagged.
   - **Healthcare Visits:** Clinical encounters with specialized practitioners and facilities.

5. **AI Insight Stream**
   - Categorized clinical highlights with restrained color coding:
     * **Red:** Abnormal lab flags exceeding standard reference thresholds (e.g. HbA1c 6.8%, LDL 138 mg/dL).
     * **Amber:** Extracted fields requiring user verification (e.g. blurred dosage frequency on prescription).
     * **Teal:** Follow-up milestones explicitly scheduled by physicians.
   - One-click *Mark as Reviewed* action and direct source document linking.

6. **Connected Health Timeline**
   - Vertical luminous glowing spine linking chronological diagnostic events.
   - Filters for All, Labs, Prescriptions, Consultations, and Imaging.
   - Clickable event cards opening detailed clinical modals.

7. **Health Journey Analytics**
   - Interactive SVG radial donut chart illustrating record distribution across clinical categories.
   - Real-time count in donut center with 100% OCR indexing badge.
   - Recent clinical documents table with file format tags, dates, and verification status.

8. **Beautiful Document Upload Pipeline**
   - Drag-and-drop file dropzone supporting PDF, JPG, JPEG, and PNG.
   - 1-click **Quick Demo Loaders** (*Try Demo Lab Report*, *Try Demo Prescription*).
   - Multi-stage animated extraction progress:
     1. Encrypted client upload & hash validation
     2. Optical Character Recognition (OCR) extraction
     3. Medical entity & reference range structuring
     4. AI plain-language summary synthesis
   - **In-Place Editable Review Table:** Users can adjust test names, values, units, reference ranges, and clinical flags before saving.
   - Immediate synchronization into the Living Health Map, metrics, and timeline upon saving.

9. **Premium Navigation & Localization**
   - Sleek collapsible sidebar with active glowing cyan indicator.
   - Global spotlight search (`Ctrl+K` or search button).
   - Instant language switcher between **English** and **తెలుగు (Telugu)**.
   - ABHA Health ID card (clearly labeled as Synthetic Demo Sandbox).
   - Patient profile modal and system settings.

10. **Futuristic Authentication (Login & Signup Pages)**
    - Dedicated standalone full-page routes at `/login` and `/signup`, plus accessible via in-app modal.
    - **Login Features:**
      * Email or 14-digit ABHA Health ID input
      * Secure password field with reveal toggle and recovery flow
      * **Instant Demo Login (Sai Garikapati)** 1-click test access
      * Biometric / Windows Hello simulation
      * ABHA Mobile OTP simulation
    - **Signup Features:**
      * Full name, email, and optional ABHA ID with automatic sandbox ID generator
      * Real-time **Password Security Strength Meter** (Weak $\to$ Moderate $\to$ Strong $\to$ Quantum-Grade)
      * Clinical privacy consent agreement
      * Quick **Prefill Demo Information** helper

---

## 🚀 Running the Application

### Prerequisites
- Node.js (v18 or higher recommended, tested on Node v24)
- npm (v9 or higher)

### Installation & Launch
```bash
# Navigate to the project directory
cd "C:\Users\saiga\.gemini\antigravity\scratch\altrix-health"

# Install dependencies (already pre-installed)
npm install

# Start both backend and frontend servers:
# Production Server (Backend + Built Frontend on Port 5000):
npm run start

# OR Development Server (Vite Hot-Reload on Port 3000):
npm run dev
```

### URLs
- **Main Command Center:** `http://localhost:3000` or `http://localhost:5000`
- **Login Page:** `http://localhost:3000/login` or `http://localhost:5000/login`
- **Signup Page:** `http://localhost:3000/signup` or `http://localhost:5000/signup`
- **Backend API:** `http://localhost:5000/api`

---

## 📁 Project Structure

```
altrix-health/
├── dist/                          # Built production assets
├── server/
│   └── index.js                   # Express backend server with multer upload & clinical AI engine
├── src/
│   ├── components/
│   │   ├── LivingHealthMap/
│   │   │   ├── AnatomyCanvas.tsx  # Holographic anatomical silhouette SVG
│   │   │   ├── LivingHealthMap.tsx# 6-node interactive centerpiece & live context panel
│   │   │   └── OrganDetailModal.tsx# Organ system clinical drill-down
│   │   ├── Modals/
│   │   │   ├── ProfileModal.tsx   # Patient demographics & ABHA sandbox ID
│   │   │   ├── RecordDetailModal.tsx # Document inspection & biomarker breakdown
│   │   │   ├── SearchModal.tsx    # Ctrl+K spotlight search
│   │   │   └── SettingsModal.tsx  # Model config & language settings
│   │   ├── AIInsightStream.tsx    # Red/Amber/Teal clinical insights
│   │   ├── DocumentUpload.tsx     # Drag-and-drop OCR pipeline & editable table
│   │   ├── FloatingCopilot.tsx    # AI Health Copilot conversation interface
│   │   ├── HealthJourneyAnalytics.tsx # Radial donut chart & document index
│   │   ├── HealthTimeline.tsx     # Connected chronological timeline
│   │   ├── HeroSection.tsx        # Hero greeting, tagline & vitals strip
│   │   ├── MedicalRecordsSection.tsx # Document repository
│   │   ├── MedicationsSection.tsx # Active prescription tracker
│   │   ├── MetricCards.tsx        # 4 distinct metric treatments
│   │   ├── Navbar.tsx             # Header with Telugu/English toggle & search
│   │   ├── Sidebar.tsx            # Collapsible navigation
│   │   └── ToastContainer.tsx     # Notification toasts
│   ├── context/
│   │   └── HealthContext.tsx      # Reactive health state & localized translations
│   ├── data/
│   │   └── translations.ts        # English and Telugu localization dictionary
│   ├── types/
│   │   └── health.ts              # Medical domain TypeScript models
│   ├── App.tsx                    # Main layout composition
│   ├── index.css                  # Futuristic theme tokens & glassmorphism
│   └── main.tsx                   # React root entry point
├── uploads/                       # Real uploaded clinical files
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Medical & Privacy Disclaimer

*ALTRIX HEALTH is an intelligence and record organization platform. All data, including ABHA IDs and clinical records, are presented for demonstration and personal record clarity. Altrix does not diagnose medical conditions, prescribe treatments, or substitute professional consultation with licensed healthcare providers.*
