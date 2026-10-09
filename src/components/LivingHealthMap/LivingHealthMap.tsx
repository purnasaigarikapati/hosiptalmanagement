import React, { useState } from 'react';
import { 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  Shield, 
  FileText, 
  Info, 
  ChevronRight, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { AnatomyCanvas } from './AnatomyCanvas';
import { OrganDetailModal } from './OrganDetailModal';
import { OrganSystem, OrganNode } from '../../types/health';
import { useHealth } from '../../context/HealthContext';

export const LivingHealthMap: React.FC = () => {
  const { 
    organNodes, 
    activeOrgan, 
    setActiveOrgan, 
    t 
  } = useHealth();

  const [hoveredOrgan, setHoveredOrgan] = useState<OrganSystem | null>(null);
  const [modalNode, setModalNode] = useState<OrganNode | null>(null);

  // Selected or hovered organ node
  const currentOrganId = hoveredOrgan || activeOrgan || 'metabolic';
  const selectedNode = organNodes.find(n => n.id === currentOrganId) || organNodes[0];

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

  // Group nodes for left and right columns
  const leftNodes = organNodes.filter(n => ['neurological', 'cardiovascular', 'metabolic'].includes(n.id));
  const rightNodes = organNodes.filter(n => ['respiratory', 'musculoskeletal', 'general'].includes(n.id));

  return (
    <section className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl overflow-hidden cyber-grid">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-cyan-500/15 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {t.livingHealthMap}
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Connected
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
            {t.livingMapSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex text-[11px] text-cyan-300 font-mono bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/60">
            {t.clickToInspect}
          </span>
        </div>
      </div>

      {/* Main Living Canvas Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-6">
        
        {/* Left Column: 3 Organ Nodes */}
        <div className="lg:col-span-3 space-y-3.5 order-2 lg:order-1">
          {leftNodes.map((node) => {
            const Icon = getOrganIcon(node.id);
            const isSelected = (activeOrgan || 'metabolic') === node.id;
            const isHovered = hoveredOrgan === node.id;
            const active = isSelected || isHovered;

            return (
              <div
                key={node.id}
                onClick={() => {
                  setActiveOrgan(node.id);
                  setModalNode(node);
                }}
                onMouseEnter={() => setHoveredOrgan(node.id)}
                onMouseLeave={() => setHoveredOrgan(null)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border relative ${
                  active
                    ? 'glass-panel-glow border-cyan-400/60 shadow-glow-cyan translate-x-1'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90'
                }`}
              >
                {active && (
                  <div className="absolute -left-1 top-3 bottom-3 w-1 bg-cyan-400 rounded-full" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition ${
                      active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300">
                        {node.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {node.recordsCount} {t.recordsLabel}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    node.statusColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="truncate max-w-[190px] font-mono text-cyan-200/90">{node.vitals}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Centerpiece: Anatomy Silhouette Canvas */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2">
          <AnatomyCanvas
            activeOrgan={activeOrgan}
            onSelectOrgan={(organ) => {
              setActiveOrgan(organ);
              const found = organNodes.find(n => n.id === organ);
              if (found) setModalNode(found);
            }}
            hoveredOrgan={hoveredOrgan}
            setHoveredOrgan={setHoveredOrgan}
          />
          
          <div className="text-center mt-[-20px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Hover or click anatomical landmarks
            </span>
          </div>
        </div>

        {/* Right Column: 3 Organ Nodes */}
        <div className="lg:col-span-3 space-y-3.5 order-3">
          {rightNodes.map((node) => {
            const Icon = getOrganIcon(node.id);
            const isSelected = activeOrgan === node.id;
            const isHovered = hoveredOrgan === node.id;
            const active = isSelected || isHovered;

            return (
              <div
                key={node.id}
                onClick={() => {
                  setActiveOrgan(node.id);
                  setModalNode(node);
                }}
                onMouseEnter={() => setHoveredOrgan(node.id)}
                onMouseLeave={() => setHoveredOrgan(null)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border relative ${
                  active
                    ? 'glass-panel-glow border-cyan-400/60 shadow-glow-cyan -translate-x-1'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90'
                }`}
              >
                {active && (
                  <div className="absolute -right-1 top-3 bottom-3 w-1 bg-cyan-400 rounded-full" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition ${
                      active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-100">
                        {node.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {node.recordsCount} {t.recordsLabel}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    node.statusColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="truncate max-w-[190px] font-mono text-cyan-200/90">{node.vitals}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Contextual Live Information Panel (Updates on selection/hover) */}
      <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-cyan-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-glow-cyan shrink-0">
            {React.createElement(getOrganIcon(selectedNode.id), { className: 'w-5 h-5' })}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Contextual Focus:</span>
              <h4 className="text-base font-bold text-white">{selectedNode.title}</h4>
              <span className="text-xs text-slate-400">({selectedNode.recordsCount} Records Indexed)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
              {selectedNode.keyFindings} • <span className="text-cyan-300 font-mono">{selectedNode.vitals}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalNode(selectedNode)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-glow-cyan transition duration-200 shrink-0"
        >
          <span>Inspect {selectedNode.title} Records</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory Medical Disclaimer */}
      <div className="relative z-10 mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
        <Info className="w-3.5 h-3.5 text-cyan-400/70 shrink-0" />
        <span>{t.mapDisclaimer}</span>
      </div>

      {/* Detail Modal */}
      {modalNode && (
        <OrganDetailModal
          organNode={modalNode}
          onClose={() => setModalNode(null)}
        />
      )}

    </section>
  );
};
