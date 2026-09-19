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

interface EmissionTrendChartProps {
  records: EmissionRecord[];
}

export const EmissionTrendChart: React.FC<EmissionTrendChartProps> = ({ records }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '3m' | '1y'>('30d');

  const data = AnalyticsService.getTrendData(records, timeframe);

  const timeOptions: { key: '7d' | '30d' | '3m' | '1y'; label: string }[] = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '1y', label: '1 Year' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Carbon Emission Trend</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Measured & aggregated emissions over time (kg CO₂)
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {timeOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setTimeframe(opt.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === opt.key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-md border border-slate-800">
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
              stroke="#16A34A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#co2Gradient)"
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Reduction Target"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Actual Tracked (kg CO₂)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-b border-dashed border-slate-400" />
            <span>Target Benchmark</span>
          </div>
        </div>
        <span className="text-slate-400">Baseline updated weekly</span>
      </div>
    </div>
  );
};
