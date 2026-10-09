import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  AlertTriangle, 
  CalendarClock, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Check, 
  Info,
  ChevronRight
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { AIInsight } from '../types/health';

export const AIInsightStream: React.FC = () => {
  const { insights, updateInsightStatus, t, setSelectedRecord, medicalRecords } = useHealth();
  const [filter, setFilter] = useState<'all' | 'red' | 'amber' | 'teal'>('all');
  const [activeInsightModal, setActiveInsightModal] = useState<AIInsight | null>(null);

  const filteredInsights = insights.filter(i => {
    if (filter === 'all') return true;
    return i.severity === filter;
  });

  const getSeverityStyle = (severity: AIInsight['severity']) => {
    switch (severity) {
      case 'red':
        return {
          border: 'border-rose-500/30 hover:border-rose-500/50',
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: AlertCircle,
          iconColor: 'text-rose-400',
          bgAccent: 'bg-rose-950/10'
        };
      case 'amber':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/50',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
          bgAccent: 'bg-amber-950/10'
        };
      case 'teal':
      default:
        return {
          border: 'border-teal-500/30 hover:border-teal-500/50',
          badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
          icon: CalendarClock,
          iconColor: 'text-teal-400',
          bgAccent: 'bg-teal-950/10'
        };
    }
  };

  const handleOpenSourceDocument = (sourceDoc: string) => {
    const record = medicalRecords.find(r => r.fileName === sourceDoc);
    if (record) {
      setSelectedRecord(record);
    }
  };

  return (
    <section id="insights-section" className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t.insightsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            {t.insightsSubtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs self-start md:self-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({insights.length})
          </button>
          <button
            onClick={() => setFilter('red')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              filter === 'red'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Lab Flags
          </button>
          <button
            onClick={() => setFilter('amber')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              filter === 'amber'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Verification
          </button>
          <button
            onClick={() => setFilter('teal')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              filter === 'teal'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Follow-ups
          </button>
        </div>
      </div>

      {/* Insights Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInsights.map((insight) => {
          const style = getSeverityStyle(insight.severity);
          const Icon = style.icon;

          return (
            <div
              key={insight.id}
              className={`p-5 rounded-2xl border ${style.border} ${style.bgAccent} bg-slate-900/60 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1`}
            >
              <div>
                {/* Top Row: Icon + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${style.iconColor}`} />
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${style.badge}`}>
                      {insight.severity === 'red' ? 'Out of Range' : insight.severity === 'amber' ? 'Verify Info' : 'Clinical Follow-up'}
                    </span>
                  </div>

                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    insight.reviewStatus === 'needs_attention'
                      ? 'bg-rose-500/20 text-rose-300'
                      : insight.reviewStatus === 'reviewed'
                      ? 'bg-teal-500/20 text-teal-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {insight.reviewStatus === 'needs_attention' ? t.needsAttention : insight.reviewStatus === 'reviewed' ? t.reviewed : t.scheduled}
                  </span>
                </div>

                {/* Insight Title & Value */}
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition">
                  {insight.title}
                </h4>

                <div className="mt-1.5 inline-block px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 font-mono text-xs text-cyan-300">
                  {insight.value}
                </div>

                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {insight.reference}
                </p>

                {/* Recommendation explanation */}
                <p className="text-xs text-slate-300 mt-3 pt-2.5 border-t border-slate-800/80 leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>

              {/* Bottom metadata & Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleOpenSourceDocument(insight.sourceDocument)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 font-mono truncate max-w-[160px] group/btn transition"
                  title={`Source: ${insight.sourceDocument}`}
                >
                  <FileText className="w-3 h-3 text-slate-500 group-hover/btn:text-cyan-400" />
                  <span className="truncate">{insight.sourceDocument}</span>
                </button>

                <div className="flex items-center gap-2">
                  {insight.reviewStatus !== 'reviewed' ? (
                    <button
                      onClick={() => updateInsightStatus(insight.id, 'reviewed')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition"
                    >
                      <Check className="w-3 h-3" />
                      Mark Reviewed
                    </button>
                  ) : (
                    <span className="text-[11px] text-teal-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>{t.safetyNotice}</span>
      </div>

    </section>
  );
};
