import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Save, 
  Check, 
  Lock,
  Eye,
  EyeOff,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { INDIAN_LANGUAGES } from '../../data/translations';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    language, 
    setLanguage, 
    theme,
    setTheme,
    availableThemes,
    currentTheme,
    themeMode,
    setThemeMode,
    addToast,
    t 
  } = useHealth();

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('altrix_gemini_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [modelMode, setModelMode] = useState(() => localStorage.getItem('altrix_model_mode') || 'local');

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    localStorage.setItem('altrix_gemini_key', apiKey);
    localStorage.setItem('altrix_model_mode', modelMode);
    addToast('success', 'Settings Saved', 'AI configuration & preferences have been updated.');
    setIsSettingsOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsSettingsOpen(false)}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t.navSettings}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                AI Health Intelligence, Indian Languages & Theme Palette
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* Day & Night Display Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                {themeMode === 'day' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                Display Mode (డే / నైట్ మోడ్)
              </label>
              <span className="text-[11px] text-cyan-400 font-medium font-mono uppercase">
                {themeMode === 'day' ? '☀️ Day (Light)' : '🌙 Night (Dark)'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('day')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between group ${
                  themeMode === 'day'
                    ? 'bg-amber-500/15 border-amber-400 text-slate-100 shadow-sm ring-1 ring-amber-400/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Day Mode (లైట్ మోడ్)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Crisp, clean clinical contrast</p>
                  </div>
                </div>
                {themeMode === 'day' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('night')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between group ${
                  themeMode === 'night'
                    ? 'bg-cyan-500/15 border-cyan-400 text-slate-100 shadow-sm ring-1 ring-cyan-400/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Night Mode (డార్క్ మోడ్)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Midnight deep medical intelligence</p>
                  </div>
                </div>
                {themeMode === 'night' && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            </div>
          </div>

          {/* Healthcare Theme Palette */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-cyan-400" /> Color Theme (యూజర్-ఫ్రెండ్లీ థీమ్)
              </label>
              <span className="text-[11px] text-cyan-400 font-medium font-mono">
                Active: {currentTheme.name}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {availableThemes.map((th) => {
                const isSelected = theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-slate-800/95 border-cyan-400/70 shadow-glow-cyan ring-1 ring-cyan-400/30'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div 
                        className="w-5 h-5 rounded-full shadow transition duration-300 group-hover:scale-110" 
                        style={{ backgroundColor: th.primaryColor, boxShadow: `0 0 10px ${th.glowColor}` }}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white group-hover:text-cyan-300">
                        {th.name}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {th.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indian Regional Language Selector (12 State Languages) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" /> Interface Language (భారతీయ భాషలు)
              </label>
              <span className="text-[11px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                12 State Languages
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              {INDIAN_LANGUAGES.map((langItem) => {
                const isSelected = language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => setLanguage(langItem.code)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <p className="font-bold text-xs text-white group-hover:text-cyan-300 leading-tight">
                        {langItem.nativeName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {langItem.name} • {langItem.region.split('&')[0]}
                      </p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Intelligence Mode */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Copilot Intelligence Engine
            </label>
            <div className="space-y-2">
              <label 
                className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  modelMode === 'local' 
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-slate-100' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="modelMode"
                  value="local"
                  checked={modelMode === 'local'}
                  onChange={() => setModelMode('local')}
                  className="mt-1 accent-cyan-400"
                />
                <div>
                  <p className="font-semibold text-xs text-white">
                    Altrix Clinical Intelligence Engine (Demo Mode)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pre-trained on clinical record schemas with zero latency, full privacy, and offline capability.
                  </p>
                </div>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                  modelMode === 'gemini' 
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-slate-100' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="modelMode"
                  value="gemini"
                  checked={modelMode === 'gemini'}
                  onChange={() => setModelMode('gemini')}
                  className="mt-1 accent-cyan-400"
                />
                <div>
                  <p className="font-semibold text-xs text-white">
                    Google Gemini 1.5 Pro (Custom API Key)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Connect your own Gemini API key for advanced multimodal reasoning.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* API Key Input (if gemini selected) */}
          {modelMode === 'gemini' && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <label className="block text-[11px] font-mono uppercase text-slate-400">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Stored strictly in your local browser sandbox. Never transmitted to third-party trackers.
              </p>
            </div>
          )}

          {/* Privacy & Encryption Standard */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Lock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-slate-200">Client-Side Vault Protection</p>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                All uploaded PDF/image extractions are processed locally or through encrypted secure tunnel APIs complying with healthcare data protection principles.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-glow-cyan transition"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
