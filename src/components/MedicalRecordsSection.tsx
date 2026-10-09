import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  ExternalLink, 
  Download, 
  Calendar, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Layers
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { OrganSystem } from '../types/health';

export const MedicalRecordsSection: React.FC = () => {
  const { medicalRecords, setSelectedRecord, t } = useHealth();
  const [filterSystem, setFilterSystem] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filtered = medicalRecords.filter(r => {
    if (filterSystem !== 'all' && r.organSystem !== filterSystem) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.facility.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section id="records-section" className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Indexed Medical Records
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            Structured repository of lab reports, imaging studies, and physician orders
          </p>
        </div>

        {/* Search & System Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="bg-slate-900/90 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          <select
            value={filterSystem}
            onChange={(e) => setFilterSystem(e.target.value)}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Systems</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="metabolic">Metabolic / Lab</option>
            <option value="neurological">Neurological</option>
            <option value="respiratory">Respiratory</option>
            <option value="musculoskeletal">Musculoskeletal</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Records Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(rec => (
          <div
            key={rec.id}
            onClick={() => setSelectedRecord(rec)}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/90 cursor-pointer transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                  {rec.documentType}
                </span>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  rec.verificationStatus === 'verified'
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  {rec.verificationStatus === 'verified' ? 'Verified' : 'Needs Review'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                {rec.title}
              </h4>

              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-cyan-400/80" /> {rec.date}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <User className="w-3 h-3 text-cyan-400/80" /> {rec.doctor}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <Building2 className="w-3 h-3 text-cyan-400/80" /> {rec.facility}
                </p>
              </div>

              <p className="text-xs text-slate-300 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed line-clamp-2">
                {rec.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">{rec.fileSize}</span>
              <span className="text-cyan-400 flex items-center gap-1 group-hover:underline">
                View Full Details <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
