import React from 'react';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { useHealth } from '../../context/HealthContext';
import { ArrowLeft, Activity, Shield, Sparkles, HeartPulse } from 'lucide-react';

interface AuthFullPageProps {
  initialMode?: 'login' | 'signup';
  onBackToDashboard: () => void;
}

export const AuthFullPage: React.FC<AuthFullPageProps> = ({ 
  initialMode = 'login',
  onBackToDashboard 
}) => {
  const { authMode, setAuthMode, t } = useHealth();
  const currentMode = authMode || initialMode;

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden cyber-grid">
      
      {/* Background Holographic Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold transition group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition" />
          <span>Back to Command Center</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
            <Activity className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">
            {t.brand}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>HIPAA & ABDM Compliant Vault</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 px-2">
        <div className="w-full max-w-md">
          {currentMode === 'login' ? (
            <LoginPage 
              onSwitchToSignup={() => setAuthMode('signup')}
              onClose={onBackToDashboard}
            />
          ) : (
            <SignupPage 
              onSwitchToLogin={() => setAuthMode('login')}
              onClose={onBackToDashboard}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center text-xs text-slate-400 py-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 ALTRIX HEALTH Technologies Inc. All rights reserved.</p>
        <p className="font-mono text-[11px] text-cyan-400/80">
          Synthetic Clinical Security Sandbox v2.0
        </p>
      </footer>

    </div>
  );
};
