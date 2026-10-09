import React from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Droplet, 
  AlertCircle,
  FileText,
  Building2,
  Lock,
  LogOut,
  ArrowRightLeft
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const ProfileModal: React.FC = () => {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    user, 
    logout, 
    setAuthModalOpen, 
    setAuthMode, 
    t 
  } = useHealth();

  if (!isProfileOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsProfileOpen(false)}
    >
      <div 
        className="w-full max-w-2xl glass-panel-glow rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-glow-cyan">
              {user?.avatar || (user?.name || 'SG').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{user?.name || 'Sai Garikapati'}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {user?.role || 'Primary Profile'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {user?.email || 'sai.garikapati@altrixhealth.ai'} • ID: ALT-89210
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          
          {/* ABHA Synthetic Demo Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/50 border border-cyan-500/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                ABHA Health ID (Synthetic Demo Sandbox)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Encrypted Vault
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-widest">
                  91-4820-1928-3410
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PHR Address: <span className="text-cyan-200">saiga@abdm</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> ABHA Sandbox Active
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Demographics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Blood Group</span>
              <p className="text-base font-bold text-rose-400 mt-1 flex items-center gap-1">
                <Droplet className="w-4 h-4" /> O Positive
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Age / Gender</span>
              <p className="text-base font-bold text-slate-200 mt-1">28 Y • Male</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Height / Weight</span>
              <p className="text-base font-bold text-slate-200 mt-1">176 cm • 71.5 kg</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Body Mass Index</span>
              <p className="text-base font-bold text-teal-400 mt-1">24.2 (Normal)</p>
            </div>
          </div>

          {/* Allergies & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Allergies & Intolerances
              </h4>
              <p className="text-xs text-slate-300">
                • <strong className="text-white">No known drug allergies (NKDA)</strong>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                • Mild seasonal pollen sensitivity (Spring)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Emergency Contact
              </h4>
              <p className="text-xs text-slate-200 font-medium">
                Purna Garikapati (Brother)
              </p>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                +91 98480 22334
              </p>
            </div>
          </div>

          {/* Connected Providers */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-400" /> Connected Healthcare Facilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <p>• Apollo Health City (Hyderabad)</p>
              <p>• Care Heart Institute (Banjara Hills)</p>
              <p>• Yashoda Super Specialty Hospital</p>
              <p>• KIMS Neuroscience Centre</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsProfileOpen(false);
                logout();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.signOut}</span>
            </button>

            <button
              onClick={() => {
                setIsProfileOpen(false);
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>

          <button
            onClick={() => setIsProfileOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
