import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    isAuthenticated,
    loginAsDemo
  } = useHealth();

  if (!authModalOpen && isAuthenticated) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => {
        if (isAuthenticated) setAuthModalOpen(false);
      }}
    >
      <div 
        className="relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button if user already has an active session */}
        {isAuthenticated && (
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Render either Login or Signup */}
        {authMode === 'login' ? (
          <LoginPage 
            onSwitchToSignup={() => setAuthMode('signup')}
            onClose={() => setAuthModalOpen(false)}
          />
        ) : (
          <SignupPage 
            onSwitchToLogin={() => setAuthMode('login')}
            onClose={() => setAuthModalOpen(false)}
          />
        )}

        {/* Quick Bypass / Continue as Demo if logged out */}
        {!isAuthenticated && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                loginAsDemo();
                setAuthModalOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center justify-center gap-1.5 mx-auto font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Or continue immediately with Demo Patient Session</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
