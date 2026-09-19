import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { AnalyticsService } from '../services/analyticsService';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area,
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  TrendingDown, 
  Car, 
  Zap, 
  Flame, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { records, setCurrentPage } = useApp();

  const [comparisonPeriod, setComparisonPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'transport' | 'electricity' | 'fuel'>('overview');

  const summary = AnalyticsService.getMonthlySummary(records);

  // Comparison data sets
  const comparisonData = {
    week: [
      { name: 'Mon', current: 4.8, previous: 5.2 },
      { name: 'Tue', current: 3.9, previous: 4.6 },
      { name: 'Wed', current: 6.1, previous: 5.8 },
      { name: 'Thu', current: 4.2, previous: 4.9 },
      { name: 'Fri', current: 5.5, previous: 6.2 },
      { name: 'Sat', current: 7.2, previous: 8.4 },
      { name: 'Sun', current: 3.8, previous: 4.5 },
    ],
    month: [
      { name: 'Week 1', current: 36.4, previous: 42.1 },
      { name: 'Week 2', current: 32.1, previous: 38.0 },
      { name: 'Week 3', current: 29.8, previous: 35.5 },
      { name: 'Week 4', current: 30.3, previous: 29.6 },
    ],
    year: [
      { name: 'Q1', current: 490, previous: 540 },
      { name: 'Q2', current: 440, previous: 495 },
      { name: 'Q3', current: 395, previous: 460 },
      { name: 'Q4 (Proj)', current: 360, previous: 430 },
    ],
  };

  // Category specific time series
  const categoryDrilldownData = [
    { period: 'Jul', transport: 68, electricity: 48, fuel: 24, other: 14 },
    { period: 'Aug', transport: 62, electricity: 46, fuel: 22, other: 15 },
    { period: 'Sep (Now)', transport: 56, electricity: 41, fuel: 19, other: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Emission Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Detailed time-series comparisons, category breakdowns, and performance patterns
          </p>
        </div>

        {/* Comparison Period Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(['week', 'month', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setComparisonPeriod(period)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                comparisonPeriod === period
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {period === 'week' ? 'Week vs Last Week' : period === 'month' ? 'Month vs Last Month' : 'Year vs Last Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Analytical KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Avg Daily CO₂</p>
          <p className="text-xl font-bold text-slate-900 mt-1">4.29 <span className="text-xs font-normal text-slate-500">kg</span></p>
          <span className="text-[10px] text-emerald-600 font-medium inline-flex items-center mt-1">
            <ArrowDownRight className="w-3 h-3" /> -0.5 kg vs Aug
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Highest Day</p>
          <p className="text-xl font-bold text-slate-900 mt-1">18.9 <span className="text-xs font-normal text-slate-500">kg</span></p>
          <span className="text-[10px] text-slate-400 mt-1 block">Sep 10 (Long drive)</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lowest Day</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">2.0 <span className="text-xs font-normal text-slate-500">kg</span></p>
          <span className="text-[10px] text-slate-400 mt-1 block">Sep 14 (Bus transit)</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Largest Share</p>
          <p className="text-xl font-bold text-slate-900 mt-1 capitalize">{summary.largestCategory}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">45% of total</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs col-span-2 md:col-span-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Est. Annual</p>
          <p className="text-xl font-bold text-slate-900 mt-1">1,540 <span className="text-xs font-normal text-slate-500">kg</span></p>
          <span className="text-[10px] text-emerald-600 font-medium inline-flex items-center mt-1">
            <TrendingDown className="w-3 h-3" /> -14% vs avg per capita
          </span>
        </div>
      </div>

      {/* Main Comparison Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Period Comparison: {comparisonPeriod === 'week' ? 'This Week vs Last Week' : comparisonPeriod === 'month' ? 'Current Month vs Previous Month' : 'Current Year vs Previous Year'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct side-by-side benchmark of carbon outputs (kg CO₂)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-emerald-600" /> Current Period
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-3 h-3 rounded-sm bg-slate-300" /> Prior Period
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData[comparisonPeriod]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
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
                    const curr = Number(payload[0].value);
                    const prev = Number(payload[1].value);
                    const diff = Number((((curr - prev) / prev) * 100).toFixed(1));
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-md border border-slate-800">
                        <p className="font-semibold text-slate-300">{label}</p>
                        <p className="text-emerald-400 font-bold mt-1">Current: {curr} kg CO₂</p>
                        <p className="text-slate-400">Previous: {prev} kg CO₂</p>
                        <p className={`text-[11px] font-semibold mt-1 ${diff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {diff <= 0 ? `${Math.abs(diff)}% reduction` : `+${diff}% increase`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="current" name="Current Period" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="previous" name="Previous Period" fill="#CBD5E1" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Drilldowns & Stacked Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Category Trends */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Category Emission Trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">3-Month shift across all tracked sectors</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryDrilldownData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="transport" name="Transport" stackId="a" fill="#16A34A" />
                <Bar dataKey="electricity" name="Electricity" stackId="a" fill="#0284C7" />
                <Bar dataKey="fuel" name="Fuel" stackId="a" fill="#EA580C" />
                <Bar dataKey="other" name="Other" stackId="a" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Insights Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Sector Performance Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Benchmarked against national household averages</p>

            <div className="mt-4 space-y-3">
              {[
                { name: 'Transport', icon: <Car className="w-4 h-4 text-emerald-600" />, co2: 57.8, share: 45, status: 'Improving (-12%)', color: 'emerald' },
                { name: 'Electricity', icon: <Zap className="w-4 h-4 text-sky-600" />, co2: 43.6, share: 34, status: 'Stable (-3%)', color: 'sky' },
                { name: 'Fuel', icon: <Flame className="w-4 h-4 text-orange-600" />, co2: 19.2, share: 15, status: 'Improving (-8%)', color: 'orange' },
                { name: 'Other / Waste', icon: <Package className="w-4 h-4 text-slate-500" />, co2: 8.0, share: 6, status: 'Low Impact', color: 'slate' },
              ].map(sec => (
                <div key={sec.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                      {sec.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{sec.name}</p>
                      <p className="text-[10px] text-slate-400">{sec.share}% of monthly total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-mono">{sec.co2} kg CO₂</p>
                    <span className="text-[10px] font-medium text-emerald-600">{sec.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need specific reduction tips?</span>
            <button
              onClick={() => setCurrentPage('ai-insights')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Ask AI Advisor →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
