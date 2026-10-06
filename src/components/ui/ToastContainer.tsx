import React from 'react';
import { useApp } from '../../store/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-[#0b1120] text-slate-800 dark:text-slate-100',
          error: 'border-rose-200 dark:border-rose-800/80 bg-white dark:bg-[#0b1120] text-slate-800 dark:text-slate-100',
          warning: 'border-amber-200 dark:border-amber-800/80 bg-white dark:bg-[#0b1120] text-slate-800 dark:text-slate-100',
          info: 'border-blue-200 dark:border-blue-800/80 bg-white dark:bg-[#0b1120] text-slate-800 dark:text-slate-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 ${borders[toast.type]}`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <p className="text-xs font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
