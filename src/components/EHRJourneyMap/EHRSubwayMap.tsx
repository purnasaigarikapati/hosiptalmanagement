import React, { useState } from 'react';
import { 
  Search, 
  Activity, 
  FileText, 
  Pill, 
  Heart, 
  Layers, 
  Calendar, 
  Thermometer, 
  Check, 
  Plus, 
  X, 
  ArrowUpRight, 
  SlidersHorizontal, 
  Eye, 
  Filter, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ScanViewerModal, ScanDetail } from './ScanViewerModal';
import { useHealth } from '../../context/HealthContext';

type EHRCategory = 'all' | 'docs' | 'labs' | 'imaging' | 'medications' | 'visits' | 'emergency' | 'procedures' | 'app';

interface Specialist {
  name: string;
  role: string;
  avatar: string;
  count?: number;
}

export const EHRSubwayMap: React.FC = () => {
  const { theme, themeMode } = useHealth();
  const [activeFilter, setActiveFilter] = useState<EHRCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScan, setSelectedScan] = useState<ScanDetail | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Care Team Specialists matching the screenshot
  const specialists: Specialist[] = [
    { name: 'Dr. Diana Grand', role: 'Cardiologist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80' },
    { name: 'Dr. Frank Meten', role: 'Surgeon', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80', count: 6 },
    { name: 'Dr. Mary Shelton', role: 'Pulmonologist', avatar: 'https://images.unsplash.com/photo-1594824813583-a442a5c4e976?w=120&auto=format&fit=crop&q=80', count: 4 },
    { name: 'Dr. Jack Sikel', role: 'Oncologist', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80', count: 3 },
    { name: 'Dr. Jack Sikel', role: 'Therapist', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80', count: 1 },
  ];

  // Medical scans for inspector modal
  const sampleScans: Record<string, ScanDetail> = {
    ultrasound_diastolic: {
      id: 'us-01',
      title: 'Echocardiogram: Final Diastolic Dimension',
      type: 'Ultrasound',
      date: 'Aug 02, 2026',
      facility: 'Care Heart Institute (Echo Lab 2)',
      doctor: 'Dr. Diana Grand, FACC',
      parameters: [
        { label: 'Final Diastolic Dimension (LVEDD)', value: '47', unit: 'mm', status: 'normal' },
        { label: 'Left Ventricular Ejection Fraction', value: '62', unit: '%', status: 'normal' },
        { label: 'Interventricular Septum (IVSd)', value: '9.8', unit: 'mm', status: 'normal' },
      ],
      summary: 'Transthoracic echocardiogram demonstrates preserved left ventricular dimensions (LVEDD 47 mm). Normal systolic pump function with no segmental wall motion abnormalities.'
    },
    ultrasound_myocardial: {
      id: 'us-02',
      title: 'Echocardiogram: Left Ventricular Myocardial Mass',
      type: 'Ultrasound',
      date: 'Aug 02, 2026',
      facility: 'Care Heart Institute (Echo Lab 2)',
      doctor: 'Dr. Diana Grand, FACC',
      parameters: [
        { label: 'Myocardial Mass Index', value: '74', unit: 'g/m²', status: 'normal' },
        { label: 'Relative Wall Thickness', value: '0.38', unit: 'ratio', status: 'normal' },
        { label: 'E/A Ratio', value: '1.24', unit: 'ratio', status: 'normal' },
      ],
      summary: 'Calculated left ventricular myocardial mass is 74 g/m², well within normal concentric geometry bounds. Diastolic filling patterns consistent with age standard.'
    },
    mri_mitral: {
      id: 'mri-01',
      title: 'Cardiac MRI: Mitral Valve Functional CINE',
      type: 'MRI',
      date: 'Sep 01, 2026',
      facility: 'Apollo Health Imaging Complex',
      doctor: 'Dr. Arvind Rao, DM',
      parameters: [
        { label: 'Mitral Regurgitation Fraction', value: '4.2', unit: '%', status: 'normal' },
        { label: 'Effective Regurgitant Orifice', value: '0.04', unit: 'cm²', status: 'normal' },
        { label: 'Left Atrial Volume Index', value: '28', unit: 'mL/m²', status: 'normal' },
      ],
      summary: 'Cardiac Magnetic Resonance demonstrates physiological competent coaptation of the anterior and posterior mitral valve leaflets. Trace central jet with zero hemodynamic consequence.'
    },
    mri_pulmonal: {
      id: 'mri-02',
      title: 'Thoracic MRI: Pulmonary Arterial Inflow',
      type: 'MRI',
      date: 'Oct 03, 2026',
      facility: 'Yashoda Diagnostic Center',
      doctor: 'Dr. Mary Shelton, MD',
      parameters: [
        { label: 'Pulmonary Artery Systolic Velocity', value: '0.85', unit: 'm/s', status: 'normal' },
        { label: 'Main PA Diameter', value: '22', unit: 'mm', status: 'normal' },
      ],
      summary: 'Normal bifurcation and flow profile across main and branch pulmonary arteries. Zero sign of thromboembolic deformation.'
    },
    radiography_cardiac: {
      id: 'rad-01',
      title: 'Cardiac Radiography (Chest PA)',
      type: 'Radiography',
      date: 'Oct 04, 2026',
      facility: 'Apollo Diagnostics',
      doctor: 'Dr. Anita Verma, MD',
      parameters: [
        { label: 'Cardiothoracic Ratio (CTR)', value: '0.44', unit: 'ratio', status: 'normal' },
        { label: 'Aortic Contour', value: 'Sharp', unit: '', status: 'normal' },
      ],
      summary: 'Cardiac size within normal limits. Clear costophrenic recesses bilaterally. No pulmonary venous hypertension.'
    }
  };

  const isCategoryActive = (cat: EHRCategory) => {
    if (activeFilter === 'all') return true;
    return activeFilter === cat;
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden glass-panel border border-cyan-500/25 shadow-2xl transition-all duration-300">
      
      {/* ================= TOP EHR NAVIGATION BAR ================= */}
      <div className="p-4 sm:p-6 border-b border-cyan-500/15 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-white">
              Ehr.
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              JOURNEY
            </span>
          </div>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>

        {/* Category Filter Pills (Matching Screenshot) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'docs', label: 'Docs' },
            { id: 'labs', label: 'Labs' },
            { id: 'imaging', label: 'Imaging' },
            { id: 'medications', label: 'Medications' },
            { id: 'visits', label: 'Visits' },
            { id: 'emergency', label: 'Emergency' },
            { id: 'procedures', label: 'Procedures' },
            { id: 'app', label: 'App Use' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id as EHRCategory)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
                activeFilter === cat.id
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] border border-blue-400'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN SUBWAY STAGE LAYOUT ================= */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-[640px] overflow-hidden">
        
        {/* ================= LEFT CLINICAL OVERVIEW & CARE TEAM (3 Cols) ================= */}
        <div className="lg:col-span-3 p-4 sm:p-5 border-r border-cyan-500/15 space-y-4 bg-slate-950/40">
          
          {/* Active Condition Card: Coronary Artery Disease */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Recession period
              </span>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:text-white rounded transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-white leading-tight">
              Coronary Artery<br />Disease
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              19 markers recorded
            </p>

            <button className="absolute bottom-3.5 right-3.5 w-7 h-7 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition shadow">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Blue Doctor's Notes Pill */}
          <div 
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] cursor-pointer hover:brightness-105 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/20">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">Doctor's Notes</h4>
                  <p className="text-[10px] text-blue-100 opacity-90">24 entries verified</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-white opacity-80" />
            </div>

            {/* Micro Icon Indicators */}
            <div className="flex items-center gap-2.5 pt-1 border-t border-white/20 text-blue-100 text-xs">
              <Thermometer className="w-3.5 h-3.5" />
              <FileText className="w-3.5 h-3.5" />
              <Check className="w-3.5 h-3.5" />
              <span className="text-[10px] ml-auto font-mono opacity-80">Latest: 2d ago</span>
            </div>
          </div>

          {/* Attending Specialists Roster */}
          <div className="pt-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Care Team Specialists
            </p>
            <div className="space-y-2">
              {specialists.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-slate-850 hover:border-slate-700 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={doc.avatar} 
                      alt={doc.name} 
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/30"
                    />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition leading-tight">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{doc.role}</p>
                    </div>
                  </div>
                  {doc.count && (
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center border border-slate-700">
                      {doc.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT MAIN SUBWAY RAIL CIRCUIT CANVAS (9 Cols) ================= */}
        <div className="lg:col-span-9 relative p-6 sm:p-8 overflow-x-auto min-w-[780px]">
          
          {/* Subtle Ambient Background Grid & Curved Track Blueprint */}
          <div className="absolute inset-0 pointer-events-none cyber-grid opacity-30" />

          {/* SVG Vector Subway Rails */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Blue Rail Gradient */}
              <linearGradient id="blueRail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.9" />
              </linearGradient>

              {/* Grey Track Gradient */}
              <linearGradient id="greyRail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
              </linearGradient>

              {/* Glowing Pulse Filter */}
              <filter id="railGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Upper Rail (Cardiology Inspection -> Mitral Valve -> Ultrasound) */}
            <path 
              d="M 60 80 C 180 80, 240 60, 360 60 C 440 60, 520 80, 620 90" 
              stroke="url(#blueRail)" 
              strokeWidth="2.5" 
              fill="none" 
              filter="url(#railGlow)"
              className="circuit-path"
            />

            {/* Middle Branch Track (Hemoglobin -> Ultrasound Scan Cards) */}
            <path 
              d="M 120 180 C 220 180, 260 210, 340 220 C 420 230, 480 200, 540 200" 
              stroke="url(#blueRail)" 
              strokeWidth="2.5" 
              fill="none" 
            />

            {/* Lower Medications Track (Bisoprolol -> Atorvastatin -> Radiography) */}
            <path 
              d="M 280 320 C 340 320, 380 380, 440 380 C 500 380, 540 340, 620 340" 
              stroke="url(#blueRail)" 
              strokeWidth="2.5" 
              fill="none" 
            />

            {/* Grey Auxiliary Connectors */}
            <path 
              d="M 360 60 C 400 60, 420 120, 440 120 C 480 120, 500 80, 540 80" 
              stroke="url(#greyRail)" 
              strokeWidth="1.5" 
              strokeDasharray="4 4"
              fill="none" 
            />
            <path 
              d="M 220 180 C 260 180, 260 320, 300 320" 
              stroke="url(#greyRail)" 
              strokeWidth="1.5" 
              strokeDasharray="3 3"
              fill="none" 
            />
          </svg>

          {/* ================= RIGHT CHRONOLOGICAL TIMELINE AXIS ================= */}
          <div className="absolute right-4 top-8 bottom-8 flex flex-col justify-between text-right pointer-events-none select-none z-10">
            <span className="text-xs font-mono font-bold text-slate-400">2026</span>
            {['January', 'February', 'March', 'April', 'May', 'June'].map((month, idx) => (
              <span key={idx} className="text-[11px] font-mono text-slate-400">
                {month}
              </span>
            ))}
          </div>

          {/* ================= INTERACTIVE NODES & CARDS LAYER ================= */}
          <div className="relative z-20 min-h-[580px] w-full">
            
            {/* 1. Cardiology Inspection Node (Top Left) */}
            <div 
              className={`absolute left-[40px] top-[40px] transition-all duration-200 cursor-pointer ${
                !isCategoryActive('visits') && !isCategoryActive('docs') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
              onMouseEnter={() => setHoveredNodeId('cardio-01')}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-lg hover:border-cyan-400 transition">
                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="pr-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">Cardiology</p>
                    <span className="text-[10px] text-slate-400 font-mono">8.01</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Inspection</p>
                </div>
              </div>
            </div>

            {/* 2. MRI Mitral Valve Node */}
            <div 
              className={`absolute left-[330px] top-[25px] transition-all duration-200 cursor-pointer ${
                !isCategoryActive('imaging') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
              onClick={() => setSelectedScan(sampleScans.mri_mitral)}
            >
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 shadow-md transition group">
                <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">MRI</span>
                    <span className="text-[10px] text-slate-400 font-mono">9.01</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Mitral Valve</p>
                </div>
              </div>
            </div>

            {/* 3. Ultrasound Heart Arteria Node */}
            <div 
              className={`absolute left-[330px] top-[80px] transition-all duration-200 cursor-pointer ${
                !isCategoryActive('imaging') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
              onClick={() => setSelectedScan(sampleScans.ultrasound_diastolic)}
            >
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 shadow-md transition group">
                <div className="w-6 h-6 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">Ultrasound</span>
                    <span className="text-[10px] text-slate-400 font-mono">9.01</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Heart Arteria</p>
                </div>
              </div>
            </div>

            {/* 4. Hemoglobin Waveform Biomarker Card (Center-Left) */}
            <div 
              className={`absolute left-[120px] top-[140px] w-64 p-3.5 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-xl transition-all duration-200 ${
                !isCategoryActive('labs') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Activity className="w-3 h-3" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Hemoglobin</h5>
                    <p className="text-[10px] text-amber-400 font-medium">Low level</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono">10.02</span>
                  <p className="text-xs font-bold font-mono text-cyan-300">6.20 BM</p>
                </div>
              </div>

              {/* Animated Waveform Sparkline Curve */}
              <div className="relative w-full h-8 mt-1 overflow-hidden">
                <svg viewBox="0 0 200 40" className="w-full h-full">
                  <path 
                    d="M 0 25 Q 25 10 50 25 T 100 25 T 150 15 T 200 25" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                  />
                  <path 
                    d="M 0 25 Q 25 10 50 25 T 100 25 T 150 15 T 200 25 L 200 40 L 0 40 Z" 
                    fill="url(#waveFill)" 
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle cx="150" cy="15" r="3" fill="#60a5fa" />
                </svg>
              </div>
            </div>

            {/* 5. Ultrasounds Scan Feature Card Block (Connected to Doppler Scans) */}
            <div 
              className={`absolute left-[390px] top-[140px] flex items-start gap-2.5 transition-all duration-200 ${
                !isCategoryActive('imaging') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
            >
              
              {/* Blue Header Pill Card */}
              <div className="w-32 p-3.5 rounded-2xl bg-blue-600 text-white shadow-xl flex flex-col justify-between h-[154px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-white/20 text-white">
                      2 surveys
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug">Ultrasounds<br />Scan</h4>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/20 text-white/90">
                  <Thermometer className="w-3 h-3" />
                  <FileText className="w-3 h-3" />
                  <Check className="w-3 h-3" />
                </div>
              </div>

              {/* Echo Doppler Scan 1: Final Diastolic Dimension (47 mm) */}
              <div 
                onClick={() => setSelectedScan(sampleScans.ultrasound_diastolic)}
                className="w-36 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-400 shadow-xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono">8.02</span>
                  <div className="w-5 h-5 rounded-full bg-slate-800 group-hover:bg-cyan-500 group-hover:text-black text-slate-300 flex items-center justify-center transition">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Scan Image Thumbnail */}
                <div className="relative w-full h-14 rounded-xl overflow-hidden bg-black mb-2 border border-slate-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950 via-slate-900 to-red-950/40" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500/40 to-blue-500/40 blur-sm" />
                  <span className="absolute bottom-1 left-1 text-[8px] font-mono text-cyan-400 bg-black/60 px-1 rounded">2D ECHO</span>
                </div>

                <p className="text-lg font-extrabold text-white leading-none font-mono">47</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Final Diastolic Dimension</p>
              </div>

              {/* Echo Doppler Scan 2: Myocardial Mass (74 g/m²) */}
              <div 
                onClick={() => setSelectedScan(sampleScans.ultrasound_myocardial)}
                className="w-36 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-400 shadow-xl cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono">8.02</span>
                  <div className="w-5 h-5 rounded-full bg-slate-800 group-hover:bg-cyan-500 group-hover:text-black text-slate-300 flex items-center justify-center transition">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Scan Image Thumbnail */}
                <div className="relative w-full h-14 rounded-xl overflow-hidden bg-black mb-2 border border-slate-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-950 via-slate-900 to-cyan-950/40" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-500 to-rose-400 blur-sm opacity-80" />
                  <span className="absolute bottom-1 left-1 text-[8px] font-mono text-cyan-400 bg-black/60 px-1 rounded">MASS</span>
                </div>

                <p className="text-lg font-extrabold text-white leading-none font-mono">74</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Myocardial Mass</p>
              </div>

            </div>

            {/* 6. Secondary Cardiology Node (Top Right) */}
            <div 
              className={`absolute left-[560px] top-[50px] transition-all duration-200 cursor-pointer ${
                !isCategoryActive('visits') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
            >
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-lg hover:border-cyan-400 transition">
                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="pr-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">Cardiology</p>
                    <span className="text-[10px] text-slate-400 font-mono">7.01</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Inspection</p>
                </div>
              </div>
            </div>

            {/* 7. Medications Rail Line (Connected Bisoprolol & Atorvastatin nodes) */}
            <div 
              className={`absolute left-[240px] top-[320px] flex items-center gap-2.5 transition-all duration-200 ${
                !isCategoryActive('medications') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
            >
              {/* Bisoprolol Node 1 */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/40 shadow-md hover:border-cyan-400 transition cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Pill className="w-2.5 h-2.5" />
                </div>
                <span className="text-[11px] font-bold text-white">Bisoprolol</span>
                <span className="text-[10px] text-slate-400">10 mg Daily</span>
                <span className="text-[9px] text-blue-400 font-mono">9.03</span>
              </div>

              {/* Atorvastatin Node */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/40 shadow-md hover:border-cyan-400 transition cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Pill className="w-2.5 h-2.5" />
                </div>
                <span className="text-[11px] font-bold text-white">Atorvastatin</span>
                <span className="text-[10px] text-slate-400">120 mg Daily</span>
                <span className="text-[9px] text-blue-400 font-mono">8.04</span>
              </div>

              {/* Bisoprolol Refill Node 2 */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/40 shadow-md hover:border-cyan-400 transition cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Pill className="w-2.5 h-2.5" />
                </div>
                <span className="text-[11px] font-bold text-white">Bisoprolol</span>
                <span className="text-[10px] text-slate-400">10 mg Daily</span>
                <span className="text-[9px] text-blue-400 font-mono">8.04</span>
              </div>
            </div>

            {/* 8. Cardiac Radiography Node */}
            <div 
              className={`absolute left-[560px] top-[320px] transition-all duration-200 cursor-pointer ${
                !isCategoryActive('imaging') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
              onClick={() => setSelectedScan(sampleScans.radiography_cardiac)}
            >
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-lg hover:border-cyan-400 transition group">
                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="pr-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">Cardiac</p>
                    <span className="text-[10px] text-slate-400 font-mono">6.04</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Radiography</p>
                </div>
              </div>
            </div>

            {/* 9. MRI Left Valve (Bottom Center) */}
            <div 
              className={`absolute left-[440px] top-[410px] transition-all duration-200 cursor-pointer ${
                !isCategoryActive('imaging') && activeFilter !== 'all' ? 'opacity-30' : ''
              }`}
              onClick={() => setSelectedScan(sampleScans.mri_mitral)}
            >
              <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 shadow-xl transition group">
                <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="pr-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">MRI</p>
                    <span className="text-[10px] text-slate-400 font-mono">7.05</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Left Valve</p>
                </div>

                {/* MRI Thumbnail preview */}
                <div className="w-16 h-9 rounded-lg bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-slate-700/60 blur-xs" />
                </div>
              </div>
            </div>

          </div>

          {/* ================= BOTTOM RADAR MINIMAP & TOOLBAR ================= */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 select-none">
            
            {/* Center Floating Network Minimap (Matching Screenshot) */}
            <div className="px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center gap-3">
              
              {/* Miniature circuit graph representation */}
              <div className="relative w-28 h-8 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-center overflow-hidden">
                <div className="absolute w-24 h-0.5 bg-blue-500/40 rounded-full" />
                <div className="absolute w-20 h-0.5 bg-cyan-400/30 rounded-full rotate-6" />
                <div className="absolute w-2 h-2 rounded-full bg-blue-400 left-3" />
                <div className="absolute w-2 h-2 rounded-full bg-cyan-400 left-12" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 right-4" />
                
                {/* Viewport Highlight Box */}
                <div className="absolute w-12 h-6 border border-cyan-400/70 bg-cyan-500/10 rounded" />
              </div>

              <div className="h-6 w-[1px] bg-slate-800" />

              <span className="text-[10px] font-mono text-slate-300">
                Network Radar
              </span>
            </div>

            {/* Quick action buttons */}
            <button 
              className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition shadow-lg"
              title="Calendar Timeline View"
            >
              <Calendar className="w-4 h-4" />
            </button>

            <button 
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow-lg shadow-blue-600/30"
              title="Compare / Split Tracks"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button 
              className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition shadow-lg"
              title="Filter Track Properties"
            >
              <Filter className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

      {/* ================= MODAL: DETAILED SCAN VIEWER ================= */}
      <ScanViewerModal 
        scan={selectedScan} 
        onClose={() => setSelectedScan(null)} 
      />

    </div>
  );
};
