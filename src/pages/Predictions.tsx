import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AnalyticsService } from '../services/analyticsService';
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
import { 
  Cpu, 
  Sliders, 
  Target
} from 'lucide-react';

export const PredictionsPage: React.FC = () => {
  const { setCurrentPage, theme } = useApp();
  const isDark = theme === 'dark';

  const [period, setPeriod] = useState<'7d' | '30d' | '3m'>('30d');
  const [modelType, setModelType] = useState<'xgboost' | 'random_forest' | 'arima'>('xgboost');
  const [carReductionPercent, setCarReductionPercent] = useState<number>(20);
  const [powerOptimizationPercent, setPowerOptimizationPercent] = useState<number>(10);

  const forecastData = AnalyticsService.getEmissionPredictions(period);

  // Baseline projected without intervention
  const baselineProjected = 136.0;
  // Estimated impact of slider intervention
  const carSavings = (57.8 * (carReductionPercent / 100));
  const powerSavings = (43.6 * (powerOptimizationPercent / 100));
  const simulatedProjected = Math.max(70, Number((baselineProjected - carSavings - powerSavings).toFixed(1)));
  const totalSavings = Number((baselineProjected - simulatedProjected).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Emission Forecast & Predictive Analytics
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              ML Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Machine Learning regression & time-series models anticipating emissions and testing intervention scenarios
          </p>
        </div>

        {/* Period Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0b1120] p-1 rounded-xl border border-transparent dark:border-slate-800">
          {(['7d', '30d', '3m'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === p
                  ? 'bg-white dark:bg-[#162038] text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Model Pipeline Indicator */}
      <div className="bg-slate-900 dark:bg-[#0b1120] text-white rounded-2xl p-5 shadow-xs border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">ML Pipeline</span>
              <span className="text-[10px] text-slate-400 font-mono">FastAPI / Scikit-learn Ready</span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              Historical Logs (10 entries) → Feature Engineering → Gradient Boost Ensemble
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          <select
            value={modelType}
            onChange={e => setModelType(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-800 dark:bg-[#11192d] text-slate-200 border border-slate-700 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="xgboost">Model: XGBoost Regressor (Default)</option>
            <option value="random_forest">Model: Random Forest Ensemble</option>
            <option value="arima">Model: Seasonal ARIMA Time-Series</option>
          </select>
          <button
            onClick={() => setCurrentPage('reports')}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <span>Model Benchmark Report →</span>
          </button>
        </div>
      </div>

      {/* Forecast Chart: Actual vs Predicted with Confidence Interval */}
      <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Actual vs. Predicted Emissions ({period === '7d' ? '7-Day Horizon' : period === '30d' ? '30-Day Outlook' : 'Quarterly Trajectory'})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Solid line reflects actual measurements; dashed line indicates ML forecast with 90% confidence envelope
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-slate-200" /> Actual
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500" /> Forecast
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-400 dark:text-slate-500">
              <span className="w-3 h-2 rounded bg-emerald-100 dark:bg-emerald-950/80" /> 90% Confidence
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={isDark ? 0.25 : 0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#F1F5F9'} />
              <XAxis dataKey="date" tickLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const actual = payload.find(p => p.dataKey === 'actual')?.value;
                    const pred = payload.find(p => p.dataKey === 'predicted')?.value;
                    const low = payload.find(p => p.dataKey === 'lowerConfidence')?.value;
                    const high = payload.find(p => p.dataKey === 'upperConfidence')?.value;
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-md border border-slate-800">
                        <p className="font-semibold text-slate-300">{label}</p>
                        {actual !== undefined && (
                          <p className="text-white mt-1">Measured: <strong>{actual} kg CO₂</strong></p>
                        )}
                        {pred !== undefined && (
                          <p className="text-emerald-400 font-bold">Predicted: {pred} kg CO₂</p>
                        )}
                        {low !== undefined && high !== undefined && (
                          <p className="text-[10px] text-slate-400 mt-1">Confidence Range: {low} - {high} kg</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Confidence Band */}
              <Area
                type="monotone"
                dataKey="upperConfidence"
                stroke="transparent"
                fill="url(#confidenceBand)"
              />
              <Area
                type="monotone"
                dataKey="lowerConfidence"
                stroke="transparent"
                fill={isDark ? '#0b1120' : '#ffffff'}
              />
              {/* Actual Line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke={isDark ? '#f8fafc' : '#0F172A'}
                strokeWidth={2.5}
                dot={{ r: 3, fill: isDark ? '#f8fafc' : '#0F172A' }}
              />
              {/* Predicted Line */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#10B981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>Status: Machine learning parameters recalibrated with latest commute patterns.</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Model accuracy score: R² = 0.89</span>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              "What-If" Scenario Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust behavioral controls to simulate their direct impact on upcoming projected monthly footprints
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Car Travel Reduction</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">-{carReductionPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={carReductionPercent}
                onChange={e => setCarReductionPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Estimated impact: saves ~{carSavings.toFixed(1)} kg CO₂ per month.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Domestic Power Efficiency</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">-{powerOptimizationPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={powerOptimizationPercent}
                onChange={e => setPowerOptimizationPercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Estimated impact: saves ~{powerSavings.toFixed(1)} kg CO₂ per month.
              </p>
            </div>
          </div>

          {/* Simulator Outcome Display */}
          <div className="bg-slate-50 dark:bg-[#11192d] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 transition-colors">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Simulated 30-Day Forecast
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {simulatedProjected}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">kg CO₂</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                  (-{totalSavings} kg net savings)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Without intervention, your baseline model projects <strong className="text-slate-800 dark:text-slate-200">{baselineProjected} kg CO₂</strong>.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Ready to commit to this scenario?</span>
              <button
                onClick={() => setCurrentPage('goals')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Turn into Goal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
