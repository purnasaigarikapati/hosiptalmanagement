import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Bell, 
  Globe, 
  ShieldCheck, 
  Menu, 
  User, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Palette,
  ChevronDown,
  Check
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { INDIAN_LANGUAGES } from '../data/translations';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    language, 
    setLanguage, 
    theme,
    setTheme,
    availableThemes,
    currentTheme,
    t, 
    setIsSearchOpen, 
    setIsProfileOpen, 
    insights,
    user,
    isAuthenticated,
    setAuthModalOpen,
    setAuthMode 
  } = useHealth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const activeLangMeta = INDIAN_LANGUAGES.find(l => l.code === language) || INDIAN_LANGUAGES[0];

  const unreadAlerts = insights.filter(i => i.reviewStatus === 'needs_attention');

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-[#060a17]/90 backdrop-blur-xl">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800/60 transition"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 border border-cyan-400/40 shadow-glow-cyan">
              <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                  {t.brand}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> 2.0 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                {t.commandCenter}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:border-cyan-500/40 hover:text-slate-300 transition duration-200 group text-sm shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition" />
              <span className="text-xs text-slate-400 group-hover:text-slate-300">
                {t.searchPlaceholder}
              </span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* ABHA Badge (Verified Indian Health Record ID) */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono text-[11px]">ABHA: 91-4820-1928-3410</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          </div>

          {/* Theme Palette Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLangMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 transition text-xs font-medium"
              title="Change Color Theme"
            >
              <div 
                className="w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-white/20 transition duration-300" 
                style={{ backgroundColor: currentTheme.primaryColor, boxShadow: `0 0 8px ${currentTheme.glowColor}` }}
              />
              <Palette className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline text-xs text-slate-300 font-medium">
                {currentTheme.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-panel-glow rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-cyan-500/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-xs text-white">Theme Palette</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    6 Healthcare Themes
                  </span>
                </div>

                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {availableThemes.map((themeItem) => {
                    const isSelected = theme === themeItem.id;
                    return (
                      <button
                        key={themeItem.id}
                        onClick={() => {
                          setTheme(themeItem.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between group ${
                          isSelected
                            ? 'bg-slate-800/90 border border-cyan-400/60 text-white shadow-sm'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <div 
                            className="w-4 h-4 rounded-full shrink-0 shadow transition duration-300 group-hover:scale-110" 
                            style={{ backgroundColor: themeItem.primaryColor, boxShadow: `0 0 10px ${themeItem.glowColor}` }}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                              {themeItem.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {themeItem.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Indian Languages Selector (12 State Languages) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 transition text-xs font-medium"
              title="Select Indian Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white max-w-[75px] truncate">
                {activeLangMeta.nativeName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel-glow rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-cyan-500/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-xs text-white">Indian Regional Languages</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    12 State Languages
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
                  {INDIAN_LANGUAGES.map((langItem) => {
                    const isSelected = language === langItem.code;
                    return (
                      <button
                        key={langItem.code}
                        onClick={() => {
                          setLanguage(langItem.code);
                          setShowLangMenu(false);
                        }}
                        className={`p-2.5 rounded-xl text-left transition flex items-center justify-between group ${
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400/60 text-white shadow-sm'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                              {langItem.nativeName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">({langItem.name})</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{langItem.region}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-slate-700/60 transition"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#060a17]">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Notification Menu Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel-glow rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-sm text-slate-100">Clinical Notifications</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {unreadAlerts.length} action items
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {unreadAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/20 hover:border-rose-500/40 transition flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <div className="flex-1 text-xs">
                        <p className="font-medium text-slate-200">{alert.title}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{alert.value} • {alert.date}</p>
                      </div>
                    </div>
                  ))}

                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-teal-500/20 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-slate-200">System Ready & Synchronized</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">7 verified medical records connected.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 text-center">
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Close panel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Action */}
          {isAuthenticated && user ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 transition text-left group"
              title="View Health Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {user.avatar || user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition leading-tight truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                  Blood Group: {user.bloodGroup}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-glow-cyan transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.signIn}</span>
            </button>
          )}

          {/* Explicit Auth Quick Switch Trigger */}
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition text-[11px] font-mono border border-slate-800"
            title="Switch User / Open Auth"
          >
            Login / Signup
          </button>

        </div>
      </div>
    </header>
  );
};
