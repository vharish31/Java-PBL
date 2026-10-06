import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean; // positive in sustainability means emission reduction (good)
    label: string;
  };
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'neutral';
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  unit,
  subtitle,
  trend,
  icon,
  badge,
  onClick,
}) => {
  const badgeColors = {
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#11192d] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && (
          <span className="text-slate-500 dark:text-slate-400 font-normal">{subtitle}</span>
        )}
        {badge && (
          <span
            className={`px-2 py-0.5 rounded-full font-medium border text-[11px] ${
              badgeColors[badge.variant]
            }`}
          >
            {badge.text}
          </span>
        )}
        {trend && (
          <div
            className={`flex items-center gap-1 font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
            <span>{trend.value}</span>
            <span className="text-slate-400 font-normal ml-0.5">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};
