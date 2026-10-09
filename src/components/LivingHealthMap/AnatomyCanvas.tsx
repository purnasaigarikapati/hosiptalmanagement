import React from 'react';
import { OrganSystem } from '../../types/health';

interface AnatomyCanvasProps {
  activeOrgan: OrganSystem | null;
  onSelectOrgan: (organ: OrganSystem) => void;
  hoveredOrgan: OrganSystem | null;
  setHoveredOrgan: (organ: OrganSystem | null) => void;
}

export const AnatomyCanvas: React.FC<AnatomyCanvasProps> = ({
  activeOrgan,
  onSelectOrgan,
  hoveredOrgan,
  setHoveredOrgan
}) => {
  const isOrganActive = (organ: OrganSystem) => {
    return activeOrgan === organ || hoveredOrgan === organ;
  };

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center select-none overflow-hidden">
      {/* Background Holographic Ring Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full border border-cyan-500/10 animate-[spin_60s_linear_infinite]" />
        <div className="w-[340px] h-[340px] rounded-full border border-dashed border-cyan-400/15 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="w-[260px] h-[260px] rounded-full border border-cyan-500/10" />
      </div>

      <svg 
        viewBox="0 0 400 500" 
        className="w-full h-full max-w-[420px] drop-shadow-[0_0_20px_rgba(0,242,254,0.15)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyGradient" x1="200" y1="20" x2="200" y2="480" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop stopColor="#0284c7" stopOpacity="0.12" />
            <stop stopColor="#0369a1" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="bodyStroke" x1="200" y1="20" x2="200" y2="480" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" stopOpacity="0.7" />
            <stop stopColor="#0284c7" stopOpacity="0.4" />
            <stop stopColor="#0369a1" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="glowGlow" cx="50%" cy="50%" r="50%">
            <stop stopColor="#00f2fe" stopOpacity="0.9" />
            <stop stopColor="#00f2fe" stopOpacity="0" />
          </radialGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= BACKGROUND ANATOMICAL GRID & MEASUREMENT SCALES ================= */}
        <g stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.8">
          <line x1="200" y1="20" x2="200" y2="480" strokeDasharray="3 3" />
          <line x1="120" y1="160" x2="280" y2="160" strokeDasharray="2 4" />
          <line x1="130" y1="240" x2="270" y2="240" strokeDasharray="2 4" />
          <line x1="140" y1="320" x2="260" y2="320" strokeDasharray="2 4" />
        </g>

        {/* ================= FUTURISTIC ANATOMICAL SILHOUETTE ================= */}
        {/* Head & Neck */}
        <path
          d="M200 36 C182 36 172 50 172 70 C172 90 182 104 190 109 L190 125 C176 130 152 142 140 160 L132 176 C124 195 116 230 110 270 C107 290 102 315 97 325 C92 335 84 340 85 348 C86 354 94 353 99 346 C105 338 114 300 120 275 L126 230 C130 236 135 240 142 240 C146 240 148 245 148 260 L146 340 C144 375 142 410 140 440 L138 468 C138 474 148 476 156 476 C164 476 166 470 166 462 L172 400 C176 360 184 315 190 290 L200 286 L210 290 C216 315 224 360 228 400 L234 462 C234 470 236 476 244 476 C252 476 262 474 262 468 L260 440 C258 410 256 375 254 340 L252 260 C252 245 254 240 258 240 C265 240 270 236 274 230 L280 275 C286 300 295 338 301 346 C306 353 314 354 315 348 C316 340 308 335 303 325 C298 315 293 290 290 270 C284 230 276 195 268 176 L260 160 C248 142 224 130 210 125 L210 109 C218 104 228 90 228 70 C228 50 218 36 200 36 Z"
          fill="url(#bodyGradient)"
          stroke="url(#bodyStroke)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Anatomical Wireframe Ribs & Torso Vectors */}
        <g stroke="rgba(56, 189, 248, 0.22)" strokeWidth="1" fill="none">
          {/* Clavicle */}
          <path d="M165 135 Q200 144 235 135" />
          {/* Sternum line */}
          <line x1="200" y1="140" x2="200" y2="230" stroke="rgba(0, 242, 254, 0.35)" />
          {/* Rib arches */}
          <path d="M174 158 Q200 170 226 158" />
          <path d="M168 176 Q200 190 232 176" />
          <path d="M164 195 Q200 210 236 195" />
          <path d="M162 215 Q200 228 238 215" />
          {/* Pelvic arch */}
          <path d="M165 255 Q200 275 235 255" />
          {/* Spine dots */}
          <circle cx="200" cy="148" r="1.5" fill="#38bdf8" opacity="0.6" />
          <circle cx="200" cy="168" r="1.5" fill="#38bdf8" opacity="0.6" />
          <circle cx="200" cy="188" r="1.5" fill="#38bdf8" opacity="0.6" />
          <circle cx="200" cy="208" r="1.5" fill="#38bdf8" opacity="0.6" />
          <circle cx="200" cy="228" r="1.5" fill="#38bdf8" opacity="0.6" />
          <circle cx="200" cy="248" r="1.5" fill="#38bdf8" opacity="0.6" />
        </g>

        {/* ================= ORGAN HOTSPOTS & CONNECTIONS ================= */}

        {/* 1. BRAIN / NEUROLOGICAL (Head, y: 70) */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectOrgan('neurological')}
          onMouseEnter={() => setHoveredOrgan('neurological')}
          onMouseLeave={() => setHoveredOrgan(null)}
        >
          {/* Brain Neural Net Schematic */}
          <path 
            d="M185 65 Q195 52 205 60 T215 72" 
            stroke={isOrganActive('neurological') ? '#00f2fe' : 'rgba(56, 189, 248, 0.4)'} 
            strokeWidth="1.2" 
            fill="none" 
          />
          <path 
            d="M188 78 Q200 70 212 80" 
            stroke={isOrganActive('neurological') ? '#00f2fe' : 'rgba(56, 189, 248, 0.4)'} 
            strokeWidth="1.2" 
            fill="none" 
          />
          {/* Hotspot Ring */}
          <circle 
            cx="200" 
            cy="70" 
            r={isOrganActive('neurological') ? "14" : "9"} 
            fill="rgba(0, 242, 254, 0.15)"
            stroke={isOrganActive('neurological') ? "#00f2fe" : "rgba(0, 242, 254, 0.6)"}
            strokeWidth={isOrganActive('neurological') ? "2" : "1.2"}
            className="transition-all duration-300"
            filter="url(#neonGlow)"
          />
          <circle cx="200" cy="70" r="3.5" fill="#00f2fe" />
        </g>

        {/* 2. LUNGS / RESPIRATORY (Chest Bilateral, y: 165) */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectOrgan('respiratory')}
          onMouseEnter={() => setHoveredOrgan('respiratory')}
          onMouseLeave={() => setHoveredOrgan(null)}
        >
          {/* Left Lung Silhouette */}
          <path 
            d="M174 150 C168 150 162 165 165 185 C167 195 174 200 182 195 C186 185 186 160 174 150 Z" 
            fill={isOrganActive('respiratory') ? 'rgba(0, 245, 212, 0.25)' : 'rgba(0, 245, 212, 0.08)'}
            stroke={isOrganActive('respiratory') ? '#00f5d4' : 'rgba(0, 245, 212, 0.4)'}
            strokeWidth="1.2"
          />
          {/* Right Lung Silhouette */}
          <path 
            d="M226 150 C232 150 238 165 235 185 C233 195 226 200 218 195 C214 185 214 160 226 150 Z" 
            fill={isOrganActive('respiratory') ? 'rgba(0, 245, 212, 0.25)' : 'rgba(0, 245, 212, 0.08)'}
            stroke={isOrganActive('respiratory') ? '#00f5d4' : 'rgba(0, 245, 212, 0.4)'}
            strokeWidth="1.2"
          />
          <circle cx="225" cy="172" r={isOrganActive('respiratory') ? "12" : "8"} fill="rgba(0, 245, 212, 0.2)" stroke="#00f5d4" strokeWidth="1.5" />
          <circle cx="225" cy="172" r="3" fill="#00f5d4" />
        </g>

        {/* 3. HEART / CARDIOVASCULAR (Slight left of sternum, cx: 188, cy: 178) */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectOrgan('cardiovascular')}
          onMouseEnter={() => setHoveredOrgan('cardiovascular')}
          onMouseLeave={() => setHoveredOrgan(null)}
        >
          {/* Heart Pulsing Wave */}
          <path 
            d="M188 172 C184 168 178 170 178 176 C178 184 188 191 188 191 C188 191 198 184 198 176 C198 170 192 168 188 172 Z"
            fill={isOrganActive('cardiovascular') ? 'rgba(244, 63, 94, 0.3)' : 'rgba(244, 63, 94, 0.15)'}
            stroke={isOrganActive('cardiovascular') ? '#f43f5e' : 'rgba(244, 63, 94, 0.7)'}
            strokeWidth="1.5"
            className="transition-all duration-300"
          />
          <circle 
            cx="188" 
            cy="180" 
            r={isOrganActive('cardiovascular') ? "15" : "10"} 
            fill="rgba(244, 63, 94, 0.15)"
            stroke={isOrganActive('cardiovascular') ? "#f43f5e" : "rgba(244, 63, 94, 0.6)"}
            strokeWidth="1.5"
            className={isOrganActive('cardiovascular') ? 'animate-ping' : ''}
          />
          <circle cx="188" cy="180" r="3.5" fill="#f43f5e" />
        </g>

        {/* 4. LABORATORY & METABOLIC (Abdomen / Liver, cx: 195, cy: 235) */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectOrgan('metabolic')}
          onMouseEnter={() => setHoveredOrgan('metabolic')}
          onMouseLeave={() => setHoveredOrgan(null)}
        >
          {/* Liver / Pancreas area */}
          <path 
            d="M180 224 Q205 220 216 230 Q212 245 190 244 Z" 
            fill={isOrganActive('metabolic') ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.12)'}
            stroke={isOrganActive('metabolic') ? '#f59e0b' : 'rgba(245, 158, 11, 0.6)'}
            strokeWidth="1.2"
          />
          <circle 
            cx="195" 
            cy="235" 
            r={isOrganActive('metabolic') ? "13" : "9"} 
            fill="rgba(245, 158, 11, 0.2)"
            stroke={isOrganActive('metabolic') ? "#f59e0b" : "rgba(245, 158, 11, 0.6)"}
            strokeWidth={isOrganActive('metabolic') ? "2" : "1.2"}
          />
          <circle cx="195" cy="235" r="3.5" fill="#f59e0b" />
        </g>

        {/* 5. BONES & MUSCULOSKELETAL (Spine & Lumbar, cx: 200, cy: 305) */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectOrgan('musculoskeletal')}
          onMouseEnter={() => setHoveredOrgan('musculoskeletal')}
          onMouseLeave={() => setHoveredOrgan(null)}
        >
          {/* Pelvis & Lumbar Joint Schematic */}
          <path 
            d="M175 295 L190 315 L210 315 L225 295" 
            stroke={isOrganActive('musculoskeletal') ? '#8b5cf6' : 'rgba(139, 92, 246, 0.5)'} 
            strokeWidth="1.5" 
            fill="none" 
          />
          <circle 
            cx="200" 
            cy="305" 
            r={isOrganActive('musculoskeletal') ? "13" : "9"} 
            fill="rgba(139, 92, 246, 0.2)"
            stroke={isOrganActive('musculoskeletal') ? "#8b5cf6" : "rgba(139, 92, 246, 0.6)"}
            strokeWidth="1.5"
          />
          <circle cx="200" cy="305" r="3.5" fill="#8b5cf6" />
        </g>

        {/* 6. GENERAL MEDICAL (Systemic / Lower Core, cx: 200, cy: 380) */}
        <g 
          className="cursor-pointer group"
          onClick={() => onSelectOrgan('general')}
          onMouseEnter={() => setHoveredOrgan('general')}
          onMouseLeave={() => setHoveredOrgan(null)}
        >
          <circle 
            cx="200" 
            cy="380" 
            r={isOrganActive('general') ? "13" : "9"} 
            fill="rgba(56, 189, 248, 0.2)"
            stroke={isOrganActive('general') ? "#38bdf8" : "rgba(56, 189, 248, 0.6)"}
            strokeWidth="1.5"
          />
          <circle cx="200" cy="380" r="3.5" fill="#38bdf8" />
        </g>

      </svg>
    </div>
  );
};
