import React from 'react';
import { 
  X, 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  Shield, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode,
  Calendar,
  User,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { OrganNode, MedicalRecord } from '../../types/health';
import { useHealth } from '../../context/HealthContext';

interface OrganDetailModalProps {
  organNode: OrganNode | null;
  onClose: () => void;
}

export const OrganDetailModal: React.FC<OrganDetailModalProps> = ({ organNode, onClose }) => {
  const { medicalRecords, setSelectedRecord, sendMessage, scrollToSection, t } = useHealth();

  if (!organNode) return null;

  const records = medicalRecords.filter(r => r.organSystem === organNode.id);

  const getOrganIcon = (id: string) => {
    switch (id) {
      case 'cardiovascular': return Heart;
      case 'neurological': return Brain;
      case 'respiratory': return Wind;
      case 'metabolic': return Activity;
      case 'musculoskeletal': return Shield;
      default: return FileText;
    }
  };

  const Icon = getOrganIcon(organNode.id);

  const handleAskCopilot = () => {
    onClose();
    scrollToSection('copilot-section');
    sendMessage(`Can you explain my recorded clinical findings and tests for ${organNode.title}?`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white tracking-wide">{organNode.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  organNode.statusColor === 'amber'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                }`}>
                  {organNode.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {organNode.organ} • {records.length} {t.recordsLabel} Indexed
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Recorded Vitals / Index</span>
              <p className="text-base font-semibold text-cyan-300 mt-1">{organNode.vitals}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Clinical Status Summary</span>
              <p className="text-sm text-slate-200 mt-1">{organNode.keyFindings}</p>
            </div>
          </div>

          {/* Associated Medical Records */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Indexed Medical Reports ({records.length})
              </h4>
              <span className="text-xs text-slate-400">Sorted by most recent</span>
            </div>

            <div className="space-y-3">
              {records.map((rec) => (
                <div 
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition group cursor-pointer"
                  onClick={() => {
                    setSelectedRecord(rec);
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 mt-0.5 group-hover:scale-105 transition">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                            {rec.title}
                          </h5>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {rec.documentType}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {rec.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" /> {rec.doctor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {rec.facility}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <span className="text-xs text-cyan-400 flex items-center gap-1 group-hover:underline">
                        View Details <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Summary note */}
                  <p className="text-xs text-slate-300 mt-3 pt-2.5 border-t border-slate-800/80 leading-relaxed">
                    {rec.summary}
                  </p>

                  {/* Test badges */}
                  {rec.tests && rec.tests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {rec.tests.slice(0, 4).map((test, idx) => (
                        <span 
                          key={idx}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                            test.status === 'high' || test.status === 'low'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : test.status === 'needs_review'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                          }`}
                        >
                          {test.name}: <strong>{test.value} {test.unit}</strong>
                        </span>
                      ))}
                      {rec.tests.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                          +{rec.tests.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Clinical Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-cyan-300">Intelligent Record Correlation</p>
              <p className="text-slate-300 leading-relaxed">
                This organ panel correlates records indexed in your profile. Abnormal lab markers or follow-up notes should be reviewed in person with your doctor.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleAskCopilot}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask Copilot About {organNode.title}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
