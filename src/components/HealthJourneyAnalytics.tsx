import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const HealthJourneyAnalytics: React.FC = () => {
  const { medicalRecords, setSelectedRecord, t } = useHealth();

  // Compute distribution
  const categories = [
    { name: 'Laboratory Reports', count: medicalRecords.filter(r => r.documentType === 'Lab Report').length, color: '#00f2fe' },
    { name: 'Prescriptions', count: medicalRecords.filter(r => r.documentType === 'Prescription').length, color: '#8b5cf6' },
    { name: 'Diagnostic Reports', count: medicalRecords.filter(r => r.documentType === 'Diagnostic Report').length, color: '#00f5d4' },
    { name: 'Imaging & Summaries', count: medicalRecords.filter(r => r.documentType === 'Imaging Report' || r.documentType === 'Discharge Summary' || r.documentType === 'Consultation Note').length, color: '#3b82f6' },
  ];

  const total = medicalRecords.length;

  // Recent 5 documents
  const recentDocs = medicalRecords.slice(0, 5);

  // SVG Donut calculations
  let accumulatedAngle = 0;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  return (
    <section id="analytics-section" className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <PieChart className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.analyticsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            {t.analyticsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/60">
            Real Clinical Index • {total} Stored Records
          </span>
        </div>
      </div>

      {/* Main Grid: Donut Radial Chart + Recent Documents Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Donut Visualization (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
          
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
              {categories.map((cat, idx) => {
                const fraction = total > 0 ? cat.count / total : 0;
                const strokeDasharray = `${fraction * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle;
                accumulatedAngle += fraction * circumference;

                return (
                  <circle
                    key={idx}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={cat.color}
                    strokeWidth="18"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 hover:opacity-80"
                  />
                );
              })}
            </svg>

            {/* Center Total Counter */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {total}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {t.totalRecords}
              </span>
              <span className="mt-1 px-2 py-0.5 rounded text-[9px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                100% OCR Indexed
              </span>
            </div>
          </div>

          {/* Categorical Legend */}
          <div className="w-full grid grid-cols-2 gap-2 mt-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <div className="truncate">
                  <p className="text-slate-300 truncate text-[11px] font-medium">{cat.name}</p>
                  <p className="text-slate-400 font-mono text-[10px]">
                    {cat.count} files ({Math.round((cat.count / (total || 1)) * 100)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Recent Documents Panel (col-span-7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
              {t.recentDocuments}
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              Showing 5 recent reports
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-2">{t.fileName}</th>
                  <th className="py-2.5 px-2">{t.date}</th>
                  <th className="py-2.5 px-2">{t.category}</th>
                  <th className="py-2.5 px-2">{t.status}</th>
                  <th className="py-2.5 px-2 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentDocs.map((doc) => (
                  <tr 
                    key={doc.id}
                    className="hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => setSelectedRecord(doc)}
                  >
                    <td className="py-3 px-2 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                          {doc.fileType}
                        </span>
                        <span className="truncate max-w-[170px] group-hover:text-cyan-300 transition">
                          {doc.fileName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-slate-400 font-mono text-[11px]">
                      {doc.date}
                    </td>

                    <td className="py-3 px-2 text-slate-300">
                      {doc.documentType}
                    </td>

                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                        doc.verificationStatus === 'verified'
                          ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {doc.verificationStatus === 'verified' ? 'Verified' : 'Needs Review'}
                      </span>
                    </td>

                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(doc);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition"
                        title="View Record"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </section>
  );
};
