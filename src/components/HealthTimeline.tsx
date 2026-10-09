import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  Pill, 
  Activity, 
  Stethoscope, 
  Layers, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ChevronDown,
  Route,
  Sparkles
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { TimelineEvent } from '../types/health';
import { EHRSubwayMap } from './EHRJourneyMap/EHRSubwayMap';

export const HealthTimeline: React.FC = () => {
  const { 
    timelineEvents, 
    medicalRecords, 
    setSelectedRecord, 
    t 
  } = useHealth();

  const [viewMode, setViewMode] = useState<'subway' | 'stream'>('subway');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);

  const filteredEvents = timelineEvents.filter(evt => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'labs') return evt.type === 'Lab Report';
    if (typeFilter === 'rx') return evt.type === 'Prescription';
    if (typeFilter === 'consult') return evt.type === 'Consultation Note' || evt.type === 'Diagnostic Report';
    if (typeFilter === 'imaging') return evt.type === 'Imaging Report' || evt.type === 'Discharge Summary';
    return true;
  });

  const displayEvents = showAllEvents ? filteredEvents : filteredEvents.slice(0, 5);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'Prescription': return Pill;
      case 'Lab Report': return Activity;
      case 'Diagnostic Report': return Stethoscope;
      case 'Imaging Report': return Layers;
      default: return FileText;
    }
  };

  const handleOpenRecord = (recordId: string) => {
    const record = medicalRecords.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
    }
  };

  return (
    <section id="timeline-section" className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl space-y-6">
      
      {/* Timeline Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <Route className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {t.timelineTitle}
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
                EHR Graph Circuit
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            {t.timelineSubtitle} • Interactive Metro Subway Circuit & Longitudinal Health Journey
          </p>
        </div>

        {/* View Mode Switcher: Subway Canvas vs Chronological List */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-750 text-xs">
          <button
            onClick={() => setViewMode('subway')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition ${
              viewMode === 'subway'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Subway EHR Map</span>
          </button>
          
          <button
            onClick={() => setViewMode('stream')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition ${
              viewMode === 'stream'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chronological List</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: SUBWAY EHR JOURNEY MAP (Default) ================= */}
      {viewMode === 'subway' && (
        <div className="animate-in fade-in duration-300">
          <EHRSubwayMap />
        </div>
      )}

      {/* ================= VIEW 2: CHRONOLOGICAL STREAM LIST ================= */}
      {viewMode === 'stream' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Stream Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  typeFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setTypeFilter('labs')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  typeFilter === 'labs'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.filterLabs}
              </button>
              <button
                onClick={() => setTypeFilter('rx')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  typeFilter === 'rx'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.filterRx}
              </button>
              <button
                onClick={() => setTypeFilter('consult')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  typeFilter === 'consult'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.filterConsult}
              </button>
              <button
                onClick={() => setTypeFilter('imaging')}
                className={`px-3 py-1.5 rounded-lg transition font-medium ${
                  typeFilter === 'imaging'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.filterImaging}
              </button>
            </div>

            <button
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
            >
              {showAllEvents ? 'Show Compact View' : t.viewFullTimeline}
            </button>
          </div>

          {/* Connected Vertical Timeline Spine */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-400 before:via-blue-500 before:to-violet-600 before:opacity-60">
            
            {displayEvents.map((evt) => {
              const Icon = getCategoryIcon(evt.type);

              return (
                <div 
                  key={evt.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleOpenRecord(evt.recordId)}
                >
                  {/* Luminous Timeline Node Marker */}
                  <div className="absolute -left-6 sm:-left-8 top-4 -translate-x-[5px] w-5 h-5 rounded-full bg-[#060a17] border-2 border-cyan-400 flex items-center justify-center shadow-glow-cyan group-hover:scale-125 group-hover:border-white transition duration-200">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-white" />
                  </div>

                  {/* Event Card */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-md group-hover:shadow-[0_0_20px_rgba(0,242,254,0.12)]">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-slate-800 group-hover:bg-cyan-500/20 text-cyan-400 transition">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {evt.doctor} • {evt.facility}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-xs font-mono text-cyan-300/80 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {evt.date}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                          evt.statusColor === 'teal'
                            ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {evt.verificationStatus}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                      {evt.summary}
                    </p>

                    {/* Highlights tags */}
                    {evt.highlights && evt.highlights.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/60">
                        <span className="text-[11px] text-slate-400 font-mono">Key Biomarkers:</span>
                        {evt.highlights.map((h, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-0.5 text-[11px] font-mono rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 text-[11px] text-slate-400">
                      <span className="font-mono">Source: {evt.sourceDocument}</span>
                      <span className="text-cyan-400 group-hover:translate-x-1 transition flex items-center gap-1">
                        Inspect Record <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </section>
  );
};
