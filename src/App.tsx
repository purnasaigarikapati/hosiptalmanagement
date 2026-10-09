import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { LivingHealthMap } from './components/LivingHealthMap/LivingHealthMap';
import { FloatingCopilot } from './components/FloatingCopilot';
import { MetricCards } from './components/MetricCards';
import { AIInsightStream } from './components/AIInsightStream';
import { HealthTimeline } from './components/HealthTimeline';
import { HealthJourneyAnalytics } from './components/HealthJourneyAnalytics';
import { DocumentUpload } from './components/DocumentUpload';
import { MedicalRecordsSection } from './components/MedicalRecordsSection';
import { MedicationsSection } from './components/MedicationsSection';
import { RecordDetailModal } from './components/Modals/RecordDetailModal';
import { SearchModal } from './components/Modals/SearchModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { AuthFullPage } from './components/Auth/AuthFullPage';
import { PatientAppointmentsPage } from './components/Appointments/PatientAppointmentsPage';
import { ToastContainer } from './components/ToastContainer';
import { useHealth } from './context/HealthContext';
import { Activity, Shield, Sparkles, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const { t, activeTab, setActiveTab } = useHealth();

  React.useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Dedicated Full Page Login
  if (currentPath === '/login') {
    return (
      <>
        <AuthFullPage initialMode="login" onBackToDashboard={() => navigateTo('/')} />
        <ToastContainer />
      </>
    );
  }

  // Dedicated Full Page Signup
  if (currentPath === '/signup') {
    return (
      <>
        <AuthFullPage initialMode="signup" onBackToDashboard={() => navigateTo('/')} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation */}
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />

      {/* Main Container with Collapsible Sidebar */}
      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-10 py-6 max-w-[1720px] mx-auto w-full space-y-10 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          {activeTab === 'appointments' || currentPath === '/appointments' ? (
            <PatientAppointmentsPage 
              onBackToDashboard={() => {
                setActiveTab('overview');
                if (currentPath === '/appointments') {
                  navigateTo('/');
                }
              }} 
            />
          ) : (
            <>
              {/* 1. Hero Section: Greeting, Editorial Headline, CTAs, Vitals */}
              <HeroSection />

              {/* 2. Signature Hero: Living Health Map Centerpiece + Floating AI Health Copilot */}
              <div id="living-health-map-section" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Centerpiece: Living Health Map (7 cols on desktop) */}
                <div className="xl:col-span-7 2xl:col-span-8">
                  <LivingHealthMap />
                </div>

                {/* Floating AI Health Copilot alongside it (5 cols on desktop) */}
                <div className="xl:col-span-5 2xl:col-span-4 sticky top-24">
                  <FloatingCopilot />
                </div>
              </div>

              {/* 3. Smart Health Overview: 4 Distinct Metric Cards */}
              <MetricCards />

              {/* 4. AI Insight Stream: Out-of-range lab markers, verification flags, follow-ups */}
              <AIInsightStream />

              {/* 5. Connected Health Timeline */}
              <HealthTimeline />

              {/* 6. Health Journey Analytics: Radial Donut Chart & Recent Documents */}
              <HealthJourneyAnalytics />

              {/* 7. Beautiful Document Upload Section: Full OCR & Extraction Pipeline */}
              <DocumentUpload />

              {/* 8. Medical Records Repository */}
              <MedicalRecordsSection />

              {/* 9. Active Medications Section */}
              <MedicationsSection />
            </>
          )}

          {/* Footer */}
          <footer className="pt-10 pb-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-200">{t.brand}</span>
              <span>— {t.tagline}</span>
            </div>

            <div className="flex items-center gap-6 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-teal-400">
                <Shield className="w-3 h-3" /> 256-Bit Encrypted Vault
              </span>
              <span>•</span>
              <span>Synthetic Clinical Demo Engine</span>
              <span>•</span>
              <span>v2.0 Command Center</span>
            </div>
          </footer>

        </main>
      </div>

      {/* Global Modals & Toast Alerts */}
      <RecordDetailModal />
      <SearchModal />
      <ProfileModal />
      <SettingsModal />
      <AuthModal />
      <ToastContainer />

    </div>
  );
};
