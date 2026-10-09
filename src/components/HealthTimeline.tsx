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
  ChevronDown
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { TimelineEvent } from '../types/health';

export const HealthTimeline: React.FC = () => {
  const { 
    timelineEvents, 
    medicalRecords, 
    setSelectedRecord, 
    t 
  } = useHealth();

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
      
      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.timelineTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            {t.timelineSubtitle}
          </p>
        </div>

        {/* Filter Controls & Toggle Full View */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category filter pills */}
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

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold font-mono ${
                      evt.statusColor === 'amber'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    }`}>
                      {evt.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* Key Extracted Highlights */}
                {evt.highlights && evt.highlights.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Extracted:</span>
                    {evt.highlights.map((h, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                      >
                        {h}
                      </span>
                    ))}

                    <span className="ml-auto text-xs text-cyan-400 flex items-center gap-1 group-hover:underline">
                      Inspect Record <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>

    </section>
  );
};
