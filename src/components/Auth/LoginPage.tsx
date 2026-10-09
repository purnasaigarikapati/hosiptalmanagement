import React, { useState } from 'react';
import { 
  Activity, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Stethoscope,
  Key
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onClose?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onClose }) => {
  const { 
    login, 
    loginAsDemo, 
    loginAsDoctor,
    language, 
    setLanguage, 
    t, 
    addToast 
  } = useHealth();

  const [roleTab, setRoleTab] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage(roleTab === 'doctor' ? 'Please enter doctor email or Staff ID.' : 'Please enter your email or ABHA Health ID.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      if (roleTab === 'doctor') {
        await loginAsDoctor(email, password);
      } else {
        await login(email, password);
      }
      if (onClose) onClose();
    } catch {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    if (onClose) onClose();
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('success', 'Biometric Verified', 'Fingerprint / Windows Hello biometric confirmed.');
      loginAsDemo();
      if (onClose) onClose();
    }, 900);
  };

  const handleAbhaOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('info', 'OTP Dispatched', 'Simulated 6-digit OTP sent to ABHA linked mobile (****3410).');
      loginAsDemo();
      if (onClose) onClose();
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-400/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Brand & Language Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/25 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider text-white">
              {t.brand}
            </span>
            <span className="text-[10px] text-cyan-300 font-mono block -mt-0.5">
              Intelligence 2.0
            </span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
              language === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('te')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
              language === 'te' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Portal Role Switcher: Patient vs Doctor */}
      <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-700/80 mb-5">
        <button
          type="button"
          onClick={() => {
            setRoleTab('patient');
            setEmail('');
            setPassword('');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
            roleTab === 'patient'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Patient Portal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRoleTab('doctor');
            setEmail('dr.arvind@altrixhealth.com');
            setPassword('Doctor@123');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
            roleTab === 'doctor'
              ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Doctor Portal</span>
        </button>
      </div>

      {/* Doctor Credentials Callout */}
      {roleTab === 'doctor' && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Doctor Credentials (Pre-filled):</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
              DOC-CARDIO-001
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-200 flex flex-wrap gap-2">
            <span>Email: <strong className="text-cyan-300">dr.arvind@altrixhealth.com</strong></span>
            <span>•</span>
            <span>Pass: <strong className="text-emerald-300">Doctor@123</strong></span>
          </div>
          <div className="text-[10px] text-slate-400">
            Dr. Arvind Rao, DM • OPD Cabin 304, Apollo Health City
          </div>
        </div>
      )}

      {/* Greeting Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {roleTab === 'doctor' ? 'Doctor Portal Sign In' : t.signIn}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {roleTab === 'doctor' ? 'Access your clinical patient queue & OPD tokens' : t.signInSubtitle}
        </p>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email or ABHA ID */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            {roleTab === 'doctor' ? 'Doctor Email or Staff ID' : t.emailOrAbha}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sai.garikapati@altrixhealth.ai or 91-4820-..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {t.password}
            </label>
            <button
              type="button"
              onClick={() => addToast('info', 'Password Reset', 'Password recovery instructions dispatched to registered email.')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
            >
              {t.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-400 focus:ring-0 accent-cyan-400"
            />
            <span>{t.rememberMe}</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] transition duration-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
        >
          <span>{isLoading ? 'Verifying Credentials...' : t.signIn}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>

      </form>

      {/* 1-Click Instant Demo Login Banner */}
      <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
        
        {roleTab === 'doctor' ? (
          <button
            type="button"
            onClick={async () => {
              await loginAsDoctor('dr.arvind@altrixhealth.com', 'Doctor@123');
              if (onClose) onClose();
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 group shadow-sm"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span>Instant Doctor Login (Dr. Arvind Rao, DM)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition duration-200 flex items-center justify-center gap-2 group shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition" />
            <span>{t.instantDemoLogin}</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleBiometricLogin}
            className="py-2 px-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] transition flex items-center justify-center gap-1.5"
          >
            <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
            <span>Biometric</span>
          </button>

          <button
            type="button"
            onClick={handleAbhaOtp}
            className="py-2 px-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>ABHA OTP</span>
          </button>
        </div>

      </div>

      {/* Switch to Sign Up */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <span>{t.dontHaveAccount} </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition"
        >
          {t.signUp}
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3 h-3 text-cyan-500/70" />
        <span>{t.privacyTerms}</span>
      </div>

    </div>
  );
};
