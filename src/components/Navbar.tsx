import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  Sun,
  Moon,
  Stethoscope,
  LogOut,
  UserCheck,
  Key,
  CalendarCheck,
  LayoutDashboard
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
    themeMode,
    toggleThemeMode,
    activeTab,
    setActiveTab,
    currentDoctor,
    t, 
    setIsSearchOpen, 
    setIsProfileOpen, 
    insights,
    appointments,
    user,
    isAuthenticated,
    setAuthModalOpen,
    setAuthMode,
    logout
  } = useHealth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setShowLangMenu(false);
        setShowThemeMenu(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangMeta = INDIAN_LANGUAGES.find(l => l.code === language) || INDIAN_LANGUAGES[0];
  const unreadAlerts = insights.filter(i => i.reviewStatus === 'needs_attention');
  const isDoctorActive = activeTab === 'doctor-dashboard';

  const handleLogoClick = () => {
    setActiveTab('overview');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header ref={navRef} className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-[#060a17]/95 backdrop-blur-xl shadow-lg">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* ========================================================= */}
        {/* ZONE 1: BRAND IDENTITY & LOGO (LEFT)                      */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {onToggleSidebar && (
            <button 
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-slate-800/60 transition focus:outline-none"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="Altrix Health — Return to Command Center"
          >
            {/* Animated Logo Shield */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/25 via-blue-500/15 to-teal-500/25 border border-cyan-400/40 shadow-glow-cyan group-hover:border-cyan-300 transition duration-300">
              <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>

            {/* Brand Titles */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                  {t.brand}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> 2.0 AI
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden md:block tracking-wide">
                {isDoctorActive ? 'Doctor Clinical OPD Intelligence' : t.commandCenter}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ZONE 2: PORTAL SWITCHER & GLOBAL SEARCH (CENTER)          */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 flex-1 max-w-xl mx-2 sm:mx-6 justify-center">
          
          {/* Dual Portal Segment Control: Patient vs Doctor */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            
            {/* Patient Portal Option */}
            <button
              onClick={() => {
                setActiveTab('overview');
                window.history.pushState({}, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                !isDoctorActive
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Patient Health Command Center"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Patient Portal</span>
              <span className="sm:hidden">Patient</span>
            </button>

            {/* Doctor Portal Option */}
            <button
              onClick={() => {
                setActiveTab('doctor-dashboard');
                window.history.pushState({}, '', '/doctor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                isDoctorActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Doctor OPD Queue & Consultation Roster"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Doctor Portal</span>
              <span className="sm:hidden">Doctor</span>
              {appointments.filter(a => a.status === 'Confirmed').length > 0 && !isDoctorActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
              )}
            </button>

          </div>

          {/* Quick Search Bar (Trigger) */}
          <div className="hidden lg:flex flex-1 max-w-xs">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:border-cyan-500/40 hover:text-slate-300 transition duration-200 group text-xs shadow-inner"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition shrink-0" />
                <span className="text-xs text-slate-400 group-hover:text-slate-300 truncate">
                  {t.searchPlaceholder}
                </span>
              </div>
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded shrink-0">
                Ctrl+K
              </kbd>
            </button>
          </div>

        </div>

        {/* ========================================================= */}
        {/* ZONE 3: ACTIONS, CUSTOMIZATION & PROFILE (RIGHT)          */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Clinical / ABHA ID Badge */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-mono text-[11px] text-slate-300">
              {isDoctorActive ? `STAFF: ${currentDoctor.staffId}` : t.abhaId}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          </div>

          {/* Search Trigger for Tablets/Mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition"
            title="Search records and tests"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Grouped Display Controls: Day/Night, Theme, Language */}
          <div className="flex items-center gap-1 p-0.5 rounded-2xl bg-slate-900/80 border border-slate-800/90">
            
            {/* Day / Night Mode Switcher */}
            <button
              onClick={toggleThemeMode}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              title={themeMode === 'night' ? 'Switch to Day Mode (లైట్ మోడ్)' : 'Switch to Night Mode (డార్క్ మోడ్)'}
              aria-label="Toggle Day / Night Mode"
            >
              {themeMode === 'night' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400 hover:text-cyan-300 transition" />
              )}
            </button>

            {/* Theme Palette Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowLangMenu(false);
                  setShowNotifications(false);
                  setShowUserDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition text-xs font-medium"
                title="Change Color Theme"
              >
                <div 
                  className="w-3 h-3 rounded-full ring-1 ring-white/20 transition duration-300" 
                  style={{ backgroundColor: currentTheme.primaryColor, boxShadow: `0 0 6px ${currentTheme.glowColor}` }}
                />
                <Palette className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Theme Menu Dropdown */}
              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 glass-panel-glow rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-xs text-white">Theme Palette</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      6 Medical Themes
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
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
                  setShowUserDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition text-xs font-medium"
                title="Select Indian Language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white max-w-[60px] truncate hidden sm:inline">
                  {activeLangMeta.nativeName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Language Menu Dropdown */}
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel-glow rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-cyan-500/30">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-xs text-white">Indian Regional Languages</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      12 State Languages
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
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

          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLangMenu(false);
                setShowThemeMenu(false);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-slate-700/60 transition"
              aria-label="View notifications"
              title="Clinical Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#060a17]">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Menu Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel-glow rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-cyan-500/30">
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
                    Close notification panel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile Menu */}
          <div className="relative">
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotifications(false);
                  setShowLangMenu(false);
                  setShowThemeMenu(false);
                }}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 transition group"
                title="Account Menu"
              >
                {/* Avatar with Role Ring */}
                <div className="relative">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-950 ${
                    isDoctorActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-cyan-400 shadow-[0_0_6px_#00f2fe]'
                  }`} />
                </div>

                {/* Name & Role */}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition leading-tight truncate max-w-[110px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                    {isDoctorActive ? 'Doctor' : 'Patient'}
                  </p>
                </div>

                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-200 transition" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.signIn}</span>
              </button>
            )}

            {/* User Account Popover Dropdown */}
            {showUserDropdown && isAuthenticated && user && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#080d1e] border border-cyan-500/30 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* User Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-cyan-300 truncate font-mono">{user.abhaId || user.email}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.role}</p>
                  </div>
                </div>

                {/* Dropdown Action Links */}
                <div className="py-2 space-y-1">
                  
                  {/* View Profile */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Health Profile</span>
                  </button>

                  {/* Switch to Patient View */}
                  <button
                    onClick={() => {
                      setActiveTab('overview');
                      setShowUserDropdown(false);
                      window.history.pushState({}, '', '/');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Patient Command Center</span>
                  </button>

                  {/* Switch to Doctor Dashboard */}
                  <button
                    onClick={() => {
                      setActiveTab('doctor-dashboard');
                      setShowUserDropdown(false);
                      window.history.pushState({}, '', '/doctor');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Doctor OPD Portal</span>
                  </button>

                  {/* Patient Appointments */}
                  <button
                    onClick={() => {
                      setActiveTab('appointments');
                      setShowUserDropdown(false);
                      window.history.pushState({}, '', '/appointments');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Patient Appointments</span>
                  </button>
                </div>

                {/* Sign Out Action */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.signOut}</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
