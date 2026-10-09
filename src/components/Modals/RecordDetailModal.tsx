import React from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  FileCode, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const RecordDetailModal: React.FC = () => {
  const { selectedRecord, setSelectedRecord, sendMessage, scrollToSection } = useHealth();

  if (!selectedRecord) return null;

  const handleAskCopilot = () => {
    const title = selectedRecord.title;
    setSelectedRecord(null);
    scrollToSection('copilot-section');
    sendMessage(`Can you summarize and explain the clinical significance of "${title}"?`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">{selectedRecord.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  selectedRecord.verificationStatus === 'verified'
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  {selectedRecord.verificationStatus === 'verified' ? 'Clinically Verified' : 'Needs Review'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {selectedRecord.documentType} • {selectedRecord.fileName} ({selectedRecord.fileSize})
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedRecord(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Metadata pill strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">Date Logged</p>
                <p className="font-semibold text-slate-200">{selectedRecord.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">Practitioner</p>
                <p className="font-semibold text-slate-200 truncate">{selectedRecord.doctor}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-slate-400">Clinical Facility</p>
                <p className="font-semibold text-slate-200 truncate">{selectedRecord.facility}</p>
              </div>
            </div>
          </div>

          {/* AI Clinical Summary */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Clinical Narrative & Interpretation
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 text-slate-200 leading-relaxed text-xs sm:text-sm">
              {selectedRecord.summary}
            </div>
          </div>

          {/* Extracted Biomarkers / Parameters */}
          {selectedRecord.tests && selectedRecord.tests.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Recorded Clinical Parameters ({selectedRecord.tests.length})
              </h4>
              
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-[11px] font-mono uppercase text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Parameter Name</th>
                      <th className="py-2.5 px-3">Recorded Value</th>
                      <th className="py-2.5 px-3">Reference Standard</th>
                      <th className="py-2.5 px-3">Clinical Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedRecord.tests.map((test, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-medium text-slate-200">
                          {test.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">
                          {test.value} <span className="font-normal text-slate-400">{test.unit}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">
                          {test.refRange}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            test.status === 'high' || test.status === 'low'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : test.status === 'needs_review'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                          }`}>
                            {test.status === 'high' ? 'High' : test.status === 'low' ? 'Low' : test.status === 'needs_review' ? 'Needs Review' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleAskCopilot}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Discuss this Report with Copilot
          </button>

          <button
            onClick={() => setSelectedRecord(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
