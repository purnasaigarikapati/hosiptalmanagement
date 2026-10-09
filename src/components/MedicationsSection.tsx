import React from 'react';
import { 
  Pill, 
  Clock, 
  Calendar, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const MedicationsSection: React.FC = () => {
  const { medications, sendMessage, scrollToSection } = useHealth();

  const handleAskMedications = () => {
    scrollToSection('copilot-section');
    sendMessage('Can you review all my active prescriptions and explain potential interactions or dietary precautions?');
  };

  return (
    <section id="medications-section" className="glass-panel rounded-3xl p-6 sm:p-8 border border-violet-500/20 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-violet-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-400/30">
              <Pill className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Active Prescriptions & Regimens
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            Pharmacological tracking with automated refill schedules and contraindication screening
          </p>
        </div>

        <button
          onClick={handleAskMedications}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-semibold transition self-start md:self-center"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask Copilot About Prescriptions
        </button>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {medications.map((med) => (
          <div
            key={med.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 hover:bg-slate-900/90 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950/60 text-violet-300 border border-violet-800/60">
                  {med.category}
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  med.flag === 'Verified'
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  {med.flag}
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition">
                {med.name}
              </h4>

              <div className="mt-2 inline-block px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-mono font-bold text-violet-300">
                {med.dosage} • {med.frequency}
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-400" /> Prescribed by: {med.doctor}
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-violet-400" /> Started: {med.startDate}
                </p>
                <p className="flex items-center gap-1.5 text-cyan-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Refill due: {med.refillDate}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">Clinical Instructions:</span>
                {med.instructions}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-teal-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> No Contraindications
              </span>
              <span className="text-[11px] font-mono text-slate-400">Oral Tablet</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
