import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHealth();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default: return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3.5 rounded-2xl glass-panel-glow border border-cyan-500/40 shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-2 fade-in duration-200"
        >
          {getToastIcon(toast.type)}
          <div className="flex-1 text-xs">
            <p className="font-bold text-white">{toast.title}</p>
            <p className="text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
