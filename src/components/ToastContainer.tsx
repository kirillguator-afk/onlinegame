import React from 'react';
import { Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastType } from '../types';

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'error': return { icon: AlertTriangle, color: 'text-rose-500', border: 'border-rose-500/30' };
    case 'success': return { icon: CheckCircle, color: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'warning': return { icon: Bell, color: 'text-amber-500', border: 'border-amber-500/30' };
    default: return { icon: Info, color: 'text-blue-400', border: 'border-blue-500/30' };
  }
};

export default function ToastContainer() {
  const { toasts } = useAppContext();

  return (
    <div className="absolute top-4 left-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const { icon: Icon, color, border } = getToastStyles(toast.type);
        return (
          <div key={toast.id} className={`w-full flex items-center gap-3 p-4 rounded-2xl shadow-2xl border ${border} bg-slate-950/95 backdrop-blur-xl transition-all duration-300 animate-in fade-in zoom-in slide-in-from-top-2`}>
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-xs font-bold text-white flex-1 leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
