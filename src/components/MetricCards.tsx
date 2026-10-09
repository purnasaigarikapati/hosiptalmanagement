import React from 'react';
import { 
  FileText, 
  Pill, 
  Activity, 
  CalendarCheck, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const MetricCards: React.FC = () => {
  const { metrics, t, scrollToSection } = useHealth();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      
      {/* 1. Medical Records Card (Luminous Cyan & Deep Navy) */}
      <div 
        onClick={() => scrollToSection('records-section')}
        className="glass-panel glass-card-hover rounded-3xl p-5 border border-cyan-500/25 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition duration-300" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan group-hover:scale-105 transition">
            <FileText className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            {metrics.medicalRecords.badge}
          </span>
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            {t.metricMedicalRecords}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {metrics.medicalRecords.total}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Reports</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed">
            {metrics.medicalRecords.caption}
          </p>
        </div>

        {/* Visual Mini Tracker */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Verification: 100% OCR</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </div>
      </div>

      {/* 2. Medication Records Card (Deep Violet & Indigo Theme) */}
      <div 
        onClick={() => scrollToSection('medications-section')}
        className="glass-panel glass-card-hover rounded-3xl p-5 border border-violet-500/25 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-500/20 transition duration-300" />

        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center text-violet-300 shadow-glow-violet group-hover:scale-105 transition">
            <Pill className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-violet-400" />
            {metrics.medications.badge}
          </span>
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            {t.metricMedications}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {metrics.medications.active}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Active Regimens</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed">
            {metrics.medications.caption}
          </p>
        </div>

        {/* Medication Compliance Track */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> Safety Cleared
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </div>
      </div>

      {/* 3. Laboratory Results Card (Dual Tone Luminous Amber & Electric Blue) */}
      <div 
        onClick={() => scrollToSection('insights-section')}
        className="glass-panel glass-card-hover rounded-3xl p-5 border border-amber-500/25 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition duration-300" />

        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm group-hover:scale-105 transition">
            <Activity className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            {metrics.labResults.badge}
          </span>
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            {t.metricLabResults}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {metrics.labResults.totalParameters}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Biomarkers</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed">
            {metrics.labResults.caption}
          </p>
        </div>

        {/* Biomarker split bar */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="bg-teal-400 h-full" style={{ width: '89%' }} title="In Range (89%)" />
            <div className="bg-rose-400 h-full" style={{ width: '11%' }} title="Flagged (11%)" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>25 In-Range</span>
            <span className="text-rose-300">3 Attention</span>
          </div>
        </div>
      </div>

      {/* 4. Healthcare Visits Card (Electric Emerald & Blue Theme) */}
      <div 
        onClick={() => scrollToSection('timeline-section')}
        className="glass-panel glass-card-hover rounded-3xl p-5 border border-emerald-500/25 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition duration-300" />

        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-sm group-hover:scale-105 transition">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            {metrics.healthcareVisits.badge}
          </span>
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            {t.metricVisits}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {metrics.healthcareVisits.totalEncounters}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Encounters</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 font-normal leading-relaxed">
            {metrics.healthcareVisits.caption}
          </p>
        </div>

        {/* Next encounter note */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Dr. Arvind Rao (Cardiology)</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </div>
      </div>

    </section>
  );
};
