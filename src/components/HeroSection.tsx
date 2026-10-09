import React from 'react';
import { 
  FileUp, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  HeartPulse, 
  Activity, 
  Flame, 
  Wind,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const HeroSection: React.FC = () => {
  const { t, scrollToSection, setActiveTab } = useHealth();

  return (
    <div className="relative pt-2 pb-6">
      
      {/* Top Patient Status & Welcome Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-semibold text-slate-200">{t.greeting}</span>
          <span className="text-slate-400">|</span>
          <span className="text-cyan-300 font-mono text-[11px]">{t.abhaId}</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Clinical Engine Active</span>
          <span className="text-slate-600">•</span>
          <span>Last report: Sep 26, 2026</span>
        </div>
      </div>

      {/* Hero Headline & Editorial Tagline */}
      <div className="max-w-4xl space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
          <span className="text-white block">Your health,</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 text-glow-cyan block">
            beautifully connected.
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed pt-1">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Prominent Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <button
          onClick={() => scrollToSection('upload-section')}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.5)] transition duration-200 group active:scale-95"
        >
          <FileUp className="w-4 h-4 text-slate-950 group-hover:scale-110 transition" />
          <span>{t.analyzeReport}</span>
        </button>

        <button
          onClick={() => scrollToSection('timeline-section')}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400/60 font-semibold text-sm transition duration-200 group active:scale-95 shadow-sm"
        >
          <Clock className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition" />
          <span>{t.exploreTimeline}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('appointments');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-teal-950/40 hover:bg-teal-900/50 text-teal-200 hover:text-white border border-teal-500/40 hover:border-teal-400 font-semibold text-sm transition duration-200 group active:scale-95 shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:shadow-[0_0_25px_rgba(20,184,166,0.3)]"
        >
          <CalendarCheck className="w-4 h-4 text-teal-400 group-hover:scale-110 transition" />
          <span>{t.navAppointments || 'Patient Appointment'}</span>
        </button>
      </div>

      {/* Live Vitals Ticker Strip */}
      <div className="mt-8 pt-4 border-t border-cyan-500/10 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mr-1">
          Vitals Matrix:
        </span>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-300">
          <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-400">BP:</span>
          <span className="font-semibold text-slate-100 font-mono">122/78</span>
          <span className="text-[10px] text-slate-400">mmHg</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Pulse:</span>
          <span className="font-semibold text-slate-100 font-mono">72</span>
          <span className="text-[10px] text-slate-400">bpm</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-300">
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-slate-400">SpO2:</span>
          <span className="font-semibold text-slate-100 font-mono">99%</span>
          <span className="text-[10px] text-teal-400">Room Air</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/70 border border-amber-500/20 text-slate-300">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">HbA1c:</span>
          <span className="font-semibold text-amber-300 font-mono">6.8%</span>
          <span className="text-[10px] text-amber-400">Sep 24</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Renal eGFR:</span>
          <span className="font-semibold text-slate-100 font-mono">98</span>
          <span className="text-[10px] text-emerald-400">Optimal</span>
        </div>
      </div>

    </div>
  );
};
