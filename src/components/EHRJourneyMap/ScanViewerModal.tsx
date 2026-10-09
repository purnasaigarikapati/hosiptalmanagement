import React from 'react';
import { X, ZoomIn, Download, Share2, Layers, CheckCircle2, Calendar, User, FileText, ChevronRight } from 'lucide-react';

export interface ScanDetail {
  id: string;
  title: string;
  type: 'Ultrasound' | 'MRI' | 'Radiography' | 'LabWaveform';
  date: string;
  facility: string;
  doctor: string;
  parameters: { label: string; value: string; unit: string; status: 'normal' | 'flagged' }[];
  summary: string;
  imageUrl?: string;
}

interface ScanViewerModalProps {
  scan: ScanDetail | null;
  onClose: () => void;
}

export const ScanViewerModal: React.FC<ScanViewerModalProps> = ({ scan, onClose }) => {
  if (!scan) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] glass-panel-glow rounded-3xl border border-cyan-500/40 overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{scan.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {scan.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {scan.facility} • {scan.date}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual Display & Measurements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Medical Scan Viewport (Left 7 cols) */}
            <div className="md:col-span-7 rounded-2xl overflow-hidden bg-black border border-cyan-500/30 shadow-inner relative flex flex-col items-center justify-center min-h-[300px] p-4 group">
              {/* Scan simulation graphic */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Ultrasound / Echocardiogram Graphic */}
                {scan.type === 'Ultrasound' && (
                  <div className="relative w-full max-w-[340px] aspect-[4/3] bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-xl overflow-hidden border border-cyan-500/20 flex items-center justify-center">
                    {/* Sector probe cone */}
                    <svg viewBox="0 0 300 240" className="w-full h-full opacity-90">
                      <path 
                        d="M 150 10 L 280 230 A 180 180 0 0 1 20 230 Z" 
                        fill="url(#ultrasoundGlow)" 
                        opacity="0.25"
                      />
                      <defs>
                        <radialGradient id="ultrasoundGlow" cx="50%" cy="10%" r="90%">
                          <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
                          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      {/* Doppler color flow jet */}
                      <path d="M 130 90 Q 150 140 170 120 Q 180 160 140 170 Z" fill="#ef4444" opacity="0.75" />
                      <path d="M 140 100 Q 160 130 150 150 Z" fill="#3b82f6" opacity="0.8" />
                      {/* Measurement caliper line */}
                      <line x1="100" y1="130" x2="200" y2="130" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="100" cy="130" r="3" fill="#facc15" />
                      <circle cx="200" cy="130" r="3" fill="#facc15" />
                      <text x="125" y="125" fill="#facc15" fontSize="10" fontFamily="monospace">47 mm</text>
                    </svg>

                    <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded">
                      2D ECHO • 4-CHAMBER
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded">
                      HR: 72 BPM • MI: 1.1
                    </div>
                  </div>
                )}

                {/* MRI Cross-Section Graphic */}
                {scan.type === 'MRI' && (
                  <div className="relative w-full max-w-[340px] aspect-[4/3] bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-xl overflow-hidden border border-cyan-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 300 240" className="w-full h-full opacity-85">
                      <rect width="300" height="240" fill="#030712" />
                      <ellipse cx="150" cy="120" rx="95" ry="85" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                      <ellipse cx="140" cy="115" rx="55" ry="45" fill="#1e293b" />
                      <circle cx="130" cy="110" r="22" fill="#334155" opacity="0.9" />
                      <circle cx="160" cy="125" r="18" fill="#475569" opacity="0.9" />
                      {/* Fine scan tissue contours */}
                      <path d="M 90 120 Q 150 70 210 120" stroke="#00f2fe" strokeWidth="1" strokeOpacity="0.6" fill="none" />
                      <path d="M 100 140 Q 150 170 200 140" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                    </svg>

                    <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded">
                      CINE MRI • AXIAL T1/T2
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded">
                      FOV: 240mm • SLICE: 3.0mm
                    </div>
                  </div>
                )}

                {/* Radiography X-Ray Graphic */}
                {(scan.type === 'Radiography' || scan.type === 'LabWaveform') && (
                  <div className="relative w-full max-w-[340px] aspect-[4/3] bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-xl overflow-hidden border border-cyan-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 300 240" className="w-full h-full opacity-85">
                      <rect width="300" height="240" fill="#020617" />
                      <path d="M 80 50 Q 150 40 220 50 L 240 210 Q 150 230 60 210 Z" fill="#0f172a" />
                      <path d="M 100 80 Q 120 160 110 190 Q 75 160 85 100 Z" fill="#1e293b" />
                      <path d="M 200 80 Q 180 160 190 190 Q 225 160 215 100 Z" fill="#1e293b" />
                      {/* Cardiac silhouette */}
                      <path d="M 140 110 Q 180 150 150 190 Q 120 180 135 130 Z" fill="#334155" opacity="0.85" />
                    </svg>

                    <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded">
                      CARDIAC RADIOGRAPHY • PA
                    </div>
                  </div>
                )}
              </div>

              {/* Viewport Action Pill */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-slate-900/90 text-cyan-300 text-[11px] font-mono border border-cyan-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-400" /> DICOM Calibrated
                </span>
              </div>
            </div>

            {/* Extracted Clinical Metrics (Right 5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                  Extracted Biomarkers & Metrics
                </h4>
                <div className="space-y-2">
                  {scan.parameters.map((param, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs text-slate-300 font-medium">{param.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Reference Standard</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold font-mono ${
                          param.status === 'flagged' ? 'text-amber-400' : 'text-cyan-300'
                        }`}>
                          {param.value} <span className="text-[10px] font-normal text-slate-400">{param.unit}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attending Physician */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  DR
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{scan.doctor}</p>
                  <p className="text-[10px] text-slate-400">Attending Specialist</p>
                </div>
              </div>
            </div>

          </div>

          {/* Diagnostic Synthesis */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
            <h5 className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Clinical Synthesis & Findings
            </h5>
            <p className="text-slate-300 leading-relaxed text-xs">
              {scan.summary}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Altrix Health Longitudinal EHR Circuit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-medium text-xs transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
