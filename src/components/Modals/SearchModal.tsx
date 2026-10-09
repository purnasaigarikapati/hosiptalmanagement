import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Pill, Activity, ExternalLink, ArrowRight } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    medicalRecords, 
    medications, 
    setSelectedRecord,
    t 
  } = useHealth();

  const [term, setTerm] = useState('');

  // Keyboard shortcut Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = term.toLowerCase().trim();

  const matchingRecords = q ? medicalRecords.filter(r => 
    r.title.toLowerCase().includes(q) ||
    r.doctor.toLowerCase().includes(q) ||
    r.facility.toLowerCase().includes(q) ||
    r.summary.toLowerCase().includes(q) ||
    (r.tests && r.tests.some(t => t.name.toLowerCase().includes(q)))
  ) : medicalRecords.slice(0, 4);

  const matchingMeds = q ? medications.filter(m => 
    m.name.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q) ||
    m.doctor.toLowerCase().includes(q)
  ) : medications.slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="w-full max-w-2xl glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-cyan-500/20 bg-slate-900/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search lab tests, doctors, medications, vitals (e.g. HbA1c, Rosuvastatin)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          
          {/* Medical Records section */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Medical Reports ({matchingRecords.length})
            </div>
            <div className="space-y-1.5">
              {matchingRecords.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setSelectedRecord(rec);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                        {rec.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {rec.doctor} • {rec.date}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Medications section */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Medications & Care Plans ({matchingMeds.length})
            </div>
            <div className="space-y-1.5">
              {matchingMeds.map(med => (
                <div
                  key={med.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Pill className="w-4 h-4 text-violet-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {med.name} ({med.dosage})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {med.frequency} • {med.doctor}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/40 text-violet-300 border border-violet-800/40">
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>Altrix Intelligent Search Index</span>
        </div>

      </div>
    </div>
  );
};
