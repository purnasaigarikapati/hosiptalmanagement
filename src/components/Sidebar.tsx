import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Clock, 
  Pill, 
  BarChart3, 
  UserCircle, 
  Settings, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  LogIn, 
  LogOut, 
  Sun, 
  Moon, 
  CalendarCheck, 
  Stethoscope,
  Activity,
  CheckCircle2,
  Users,
  Building2,
  Key,
  UserCheck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggleCollapse, 
  mobileOpen, 
  onCloseMobile 
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    t, 
    insights, 
    appointments, 
    currentDoctor, 
    isDoctorMode,
    setIsDoctorMode,
    scrollToSection, 
    setIsSettingsOpen, 
    setIsProfileOpen, 
    user, 
    isAuthenticated, 
    setAuthModalOpen, 
    setAuthMode, 
    logout, 
    themeMode, 
    toggleThemeMode 
  } = useHealth();

  // Determine whether current view is Doctor Portal or Patient Portal
  const isDoctorActive = isDoctorMode || activeTab.startsWith('doctor') || window.location.pathname.startsWith('/doctor');

  // Patient metrics
  const unreadCount = insights.filter(i => i.reviewStatus === 'needs_attention').length;

  // Doctor metrics
  const waitingDoctorCount = appointments.filter(a => 
    (a.doctor.id === currentDoctor?.id || a.doctor.name === currentDoctor?.name) && a.status === 'Confirmed'
  ).length;

  const inConsultationDoctorCount = appointments.filter(a => 
    (a.doctor.id === currentDoctor?.id || a.doctor.name === currentDoctor?.name) && a.status === 'In Consultation'
  ).length;

  const completedDoctorCount = appointments.filter(a => 
    (a.doctor.id === currentDoctor?.id || a.doctor.name === currentDoctor?.name) && a.status === 'Completed'
  ).length;

  const totalDoctorCount = appointments.filter(a => 
    a.doctor.id === currentDoctor?.id || a.doctor.name === currentDoctor?.name
  ).length;

  // 1. PATIENT NAVIGATION ITEMS (Strictly for Patient Portal — NO Doctor items)
  const patientNavItems = [
    { id: 'overview', label: t.navOverview, icon: LayoutDashboard },
    { id: 'appointments', label: t.navAppointments || 'Patient Appointment', icon: CalendarCheck, badge: appointments.length > 0 ? `${appointments.length}` : undefined, badgeColor: 'cyan' },
    { id: 'records', label: t.navRecords, icon: FileText, badge: '7' },
    { id: 'insights', label: t.navInsights, icon: Sparkles, badge: unreadCount > 0 ? `${unreadCount}` : undefined, badgeColor: 'rose' },
    { id: 'timeline', label: t.navTimeline, icon: Clock },
    { id: 'medications', label: t.navMedications, icon: Pill, badge: '3' },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'profile', label: t.navProfile, icon: UserCircle, action: () => setIsProfileOpen(true) },
    { id: 'settings', label: t.navSettings, icon: Settings, action: () => setIsSettingsOpen(true) },
  ];

  // 2. DOCTOR NAVIGATION ITEMS (Strictly for Doctor Portal — NO Patient items)
  const doctorNavItems = [
    { 
      id: 'doctor-dashboard', 
      label: 'OPD Queue & Tokens', 
      icon: Stethoscope, 
      badge: waitingDoctorCount > 0 ? `${waitingDoctorCount}` : undefined, 
      badgeColor: 'amber' 
    },
    { 
      id: 'doctor-consultations', 
      label: 'In Consultation', 
      icon: Activity, 
      badge: inConsultationDoctorCount > 0 ? `${inConsultationDoctorCount}` : undefined, 
      badgeColor: 'emerald' 
    },
    { 
      id: 'doctor-completed', 
      label: 'Completed Visits', 
      icon: CheckCircle2, 
      badge: completedDoctorCount > 0 ? `${completedDoctorCount}` : undefined, 
      badgeColor: 'teal' 
    },
    { 
      id: 'doctor-roster', 
      label: 'All Patients Roster', 
      icon: Users, 
      badge: totalDoctorCount > 0 ? `${totalDoctorCount}` : undefined, 
      badgeColor: 'cyan' 
    },
    { 
      id: 'doctor-cabin', 
      label: 'Doctor Profile & Cabin', 
      icon: Building2 
    },
    { 
      id: 'doctor-credentials', 
      label: 'Access Credentials', 
      icon: Key 
    },
    { 
      id: 'settings', 
      label: t.navSettings || 'Settings', 
      icon: Settings, 
      action: () => setIsSettingsOpen(true) 
    },
  ];

  // Pick navigation items based on active portal
  const navItems = isDoctorActive ? doctorNavItems : patientNavItems;

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else {
      setActiveTab(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Patient in-page section scrolling
      if (!isDoctorActive) {
        if (item.id === 'timeline') {
          scrollToSection('timeline-section');
        } else if (item.id === 'insights') {
          scrollToSection('insights-section');
        } else if (item.id === 'records') {
          scrollToSection('records-section');
        } else if (item.id === 'medications') {
          scrollToSection('medications-section');
        } else if (item.id === 'analytics') {
          scrollToSection('analytics-section');
        }
      }
    }
    if (mobileOpen) onCloseMobile();
  };

  const handleSwitchToPatientPortal = () => {
    setIsDoctorMode(false);
    setActiveTab('overview');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mobileOpen) onCloseMobile();
  };

  const handleSwitchToDoctorPortal = () => {
    setIsDoctorMode(true);
    setActiveTab('doctor-dashboard');
    window.history.pushState({}, '', '/doctor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mobileOpen) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-18 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out glass-panel border-r border-cyan-500/20 bg-[#060a17]/95 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        
        {/* Top: Portal Identifier & Navigation List */}
        <div className="py-5 px-3 space-y-2 overflow-y-auto">
          
          {/* Active Mode Identifier Badge */}
          {!collapsed && (
            <div className={`px-3 py-2 rounded-xl mb-3 flex items-center justify-between border ${
              isDoctorActive 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isDoctorActive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
                <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                  {isDoctorActive ? 'Doctor Portal' : 'Patient Portal'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isDoctorActive ? currentDoctor.staffId : 'Patient'}
              </span>
            </div>
          )}

          {/* Navigation Items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? isDoctorActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold'
                        : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.15)] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                      isDoctorActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 shadow-glow-cyan'
                    }`} />
                  )}

                  <Icon 
                    className={`w-5 h-5 shrink-0 transition duration-200 ${
                      isActive 
                        ? isDoctorActive ? 'text-emerald-400 scale-105' : 'text-cyan-400 scale-105'
                        : isDoctorActive ? 'text-slate-400 group-hover:text-emerald-300' : 'text-slate-400 group-hover:text-cyan-300'
                    }`} 
                  />

                  {!collapsed && (
                    <span className="flex-1 text-left truncate tracking-wide text-xs sm:text-sm">
                      {item.label}
                    </span>
                  )}

                  {!collapsed && item.badge && (
                    <span 
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-tight ${
                        item.badgeColor === 'rose'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : item.badgeColor === 'amber'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : item.badgeColor === 'teal'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Bottom Section: Context-Aware Actions & Utilities */}
        <div className="p-3 border-t border-slate-800/80 space-y-3">
          
          {/* A. If in DOCTOR PORTAL: Show Doctor Cabin Card & Switch to Patient Portal */}
          {isDoctorActive ? (
            <div className="space-y-2">
              
              {/* Doctor Cabin Card */}
              {!collapsed && (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ON DUTY OPD
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{currentDoctor.staffId}</span>
                  </div>
                  <p className="font-bold text-white text-xs truncate">{currentDoctor.name}</p>
                  <p className="text-[10px] text-slate-300 truncate">{currentDoctor.roomNumber}</p>
                </div>
              )}

              {/* One-Click Switch to Patient Portal */}
              <button
                onClick={handleSwitchToPatientPortal}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-xs transition group shadow-sm ${
                  collapsed ? 'px-0' : ''
                }`}
                title="Switch to Patient Portal"
              >
                <LayoutDashboard className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                {!collapsed && <span>Switch to Patient Portal</span>}
              </button>

            </div>
          ) : (
            /* B. If in PATIENT PORTAL: Show Upload Report & Switch to Doctor Portal */
            <div className="space-y-2">
              
              {/* Quick upload report button */}
              <button
                onClick={() => {
                  scrollToSection('upload-section');
                  if (mobileOpen) onCloseMobile();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition duration-200 group ${
                  collapsed ? 'px-0' : ''
                }`}
                title="Upload Report"
              >
                <Upload className="w-4 h-4 shrink-0 group-hover:scale-110 transition" />
                {!collapsed && <span className="tracking-wide">Upload Report</span>}
              </button>

              {/* One-Click Switch to Doctor Portal */}
              <button
                onClick={handleSwitchToDoctorPortal}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:text-white font-semibold text-xs transition group shadow-sm ${
                  collapsed ? 'px-0' : ''
                }`}
                title="Switch to Doctor OPD Portal"
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
                {!collapsed && <span>Switch to Doctor Portal</span>}
              </button>

            </div>
          )}

          {/* Sign In / Sign Out quick button */}
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-medium text-xs transition duration-200 group ${
                collapsed ? 'px-0' : ''
              }`}
              title={t.signOut}
            >
              <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:scale-105 transition" />
              {!collapsed && <span className="tracking-wide">{t.signOut}</span>}
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
                if (mobileOpen) onCloseMobile();
              }}
              className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium text-xs transition duration-200 group ${
                collapsed ? 'px-0' : ''
              }`}
              title={t.signIn}
            >
              <LogIn className="w-3.5 h-3.5 shrink-0 group-hover:scale-105 transition" />
              {!collapsed && <span className="tracking-wide">{t.signIn}</span>}
            </button>
          )}

          {/* Day / Night Toggle in Sidebar */}
          <button
            onClick={toggleThemeMode}
            className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 transition text-xs ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={themeMode === 'night' ? 'Switch to Day Mode (లైట్ మోడ్)' : 'Switch to Night Mode (డార్క్ మోడ్)'}
          >
            <div className="flex items-center gap-2">
              {themeMode === 'night' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
              {!collapsed && (
                <span className="text-[11px] font-medium text-slate-300">
                  {themeMode === 'night' ? 'Day Mode' : 'Night Mode'}
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800/60 px-1.5 py-0.5 rounded">
                {themeMode === 'night' ? 'Light' : 'Dark'}
              </span>
            )}
          </button>

          {/* Collapse/Expand Toggle (Desktop only) */}
          <div className="hidden lg:flex items-center justify-between pt-1">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition text-xs"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Collapse Menu</span>
                </>
              )}
            </button>
          </div>

        </div>

      </aside>
    </>
  );
};
