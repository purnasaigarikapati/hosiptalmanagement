import React, { useState } from 'react';
import { 
  Activity, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onClose?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin, onClose }) => {
  const { 
    signup, 
    loginAsDemo, 
    language, 
    setLanguage, 
    t, 
    addToast 
  } = useHealth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [abhaId, setAbhaId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password Strength Calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score === 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Moderate', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Strong', color: 'bg-teal-400' };
    return { score: 100, label: 'Quantum-Grade', color: 'bg-cyan-400 shadow-glow-cyan' };
  };

  const strength = calculatePasswordStrength(password);

  const handleGenerateAbha = () => {
    const randomSuffix = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setAbhaId(`91-${randomSuffix}`);
    addToast('info', 'Sandbox ABHA Generated', 'Generated synthetic 14-digit ABHA test number.');
  };

  const handlePrefillDemo = () => {
    setName('Dr. Sai Purna Garikapati');
    setEmail('purnasai.garikapati@altrixhealth.ai');
    setAbhaId('91-4820-1928-3410');
    setPassword('AltrixHealth@2026');
    setConfirmPassword('AltrixHealth@2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('You must acknowledge clinical privacy consent.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password, abhaId);
      if (onClose) onClose();
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-400/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

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
              Profile Onboarding
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

      {/* Greeting Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {t.signUp}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {t.signUpSubtitle}
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
      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            {t.fullName}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sai Garikapati"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
          </div>
        </div>

        {/* ABHA Health ID (Optional with generator) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
              ABHA ID (Optional / Sandbox)
            </label>
            <button
              type="button"
              onClick={handleGenerateAbha}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3" /> Auto-Generate Sandbox ID
            </button>
          </div>
          <div className="relative">
            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="91-4820-1928-3410"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            {t.password}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Bar */}
          {password && (
            <div className="mt-1.5 space-y-1">
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${strength.color}`} 
                  style={{ width: `${strength.score}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Security: {strength.label}</span>
                <span>{strength.score}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            {t.confirmPassword}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type password"
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition"
            />
          </div>
        </div>

        {/* Consent check */}
        <div className="pt-1">
          <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded bg-slate-800 border-slate-700 text-cyan-400 focus:ring-0 accent-cyan-400"
            />
            <span className="leading-tight text-[11px]">
              I consent to encrypted local storage under the Altrix Clinical Privacy Standard.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] transition duration-200 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 mt-2"
        >
          <span>{isLoading ? 'Creating Health Graph...' : 'Initialize My Health Graph'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>

      </form>

      {/* Quick Prefill Helper */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-center">
        <button
          type="button"
          onClick={handlePrefillDemo}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition"
        >
          <Sparkles className="w-3 h-3" /> Quick Prefill Demo Information
        </button>
      </div>

      {/* Switch to Sign In */}
      <div className="mt-4 text-center text-xs text-slate-400">
        <span>{t.alreadyHaveAccount} </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition"
        >
          {t.signIn}
        </button>
      </div>

    </div>
  );
};
