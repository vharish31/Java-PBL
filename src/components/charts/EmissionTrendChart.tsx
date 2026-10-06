import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Line 
} from 'recharts';
import { AnalyticsService } from '../../services/analyticsService';
import { EmissionRecord } from '../../types';
import { useApp } from '../../store/AppContext';

interface EmissionTrendChartProps {
  records: EmissionRecord[];
}

export const EmissionTrendChart: React.FC<EmissionTrendChartProps> = ({ records }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '3m' | '1y'>('30d');
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const data = AnalyticsService.getTrendData(records, timeframe);

  const timeOptions: { key: '7d' | '30d' | '3m' | '1y'; label: string }[] = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '1y', label: '1 Year' },
  ];

  return (
    <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
            Carbon Emission Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Measured & aggregated emissions over time (kg CO₂)
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#11192d] p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 self-start sm:self-auto">
          {timeOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setTimeframe(opt.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                timeframe === opt.key
                  ? 'bg-white dark:bg-[#162038] text-slate-900 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 4 }}>
            <defs>
              <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={isDark ? 0.28 : 0.22} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDark ? '#1e293b' : '#F1F5F9'} 
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#1e293b' : '#E2E8F0' }}
              tick={{ fill: isDark ? '#94a3b8' : '#64748B', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isDark ? '#94a3b8' : '#64748B', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 dark:bg-slate-950 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-700/80 dark:border-slate-800">
                      <p className="font-semibold text-slate-300">{label}</p>
                      <p className="text-emerald-400 font-bold mt-1">
                        {payload[0].value} kg CO₂
                      </p>
                      {payload[1] && (
                        <p className="text-slate-400 text-[10px]">
                          Target: {payload[1].value} kg CO₂
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="co2"
              name="CO₂ Emission"
              stroke="#10B981"
              strokeWidth={2.2}
              fillOpacity={1}
              fill="url(#co2Gradient)"
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Reduction Target"
              stroke={isDark ? '#64748b' : '#94A3B8'}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Actual Tracked (kg CO₂)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-b border-dashed border-slate-400 dark:border-slate-500" />
            <span>Target Benchmark</span>
          </div>
        </div>
        <span className="text-slate-400 dark:text-slate-500">Baseline updated weekly</span>
      </div>
    </div>
  );
};
