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
  CalendarCheck
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

  const unreadCount = insights.filter(i => i.reviewStatus === 'needs_attention').length;

  const navItems = [
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

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else {
      setActiveTab(item.id);
      if (item.id === 'appointments' || item.id === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (item.id === 'timeline') {
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
        {/* Navigation List */}
        <div className="py-6 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-glow-cyan" />
                )}

                <Icon 
                  className={`w-5 h-5 shrink-0 transition duration-200 ${
                    isActive ? 'text-cyan-400 scale-105' : 'text-slate-400 group-hover:text-cyan-300'
                  }`} 
                />

                {!collapsed && (
                  <span className="flex-1 text-left truncate tracking-wide">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span 
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-tight ${
                      item.badgeColor === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
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

        {/* Quick Upload Action & Collapse Button at bottom */}
        <div className="p-3 border-t border-slate-800/80 space-y-3">
          
          {/* Quick upload report button */}
          <button
            onClick={() => {
              scrollToSection('upload-section');
              if (mobileOpen) onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-glow-cyan transition duration-200 group ${
              collapsed ? 'px-0' : ''
            }`}
            title="Upload Report"
          >
            <Upload className="w-4 h-4 shrink-0 group-hover:scale-110 transition" />
            {!collapsed && <span className="font-semibold tracking-wide">Upload Report</span>}
          </button>

          {/* Sign In / Sign Out quick button */}
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-medium text-xs transition duration-200 group ${
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
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium text-xs transition duration-200 group ${
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
            className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 transition text-xs ${
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
