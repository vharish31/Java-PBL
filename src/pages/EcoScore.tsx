import React from 'react';
import { useApp } from '../store/AppContext';
import { 
  TrendingUp, 
  Info, 
  Car, 
  Zap, 
  Flame, 
  Target, 
  RotateCw,
  ArrowRight
} from 'lucide-react';

export const EcoScorePage: React.FC = () => {
  const { ecoScore, setCurrentPage } = useApp();

  const scorePillClass = {
    Excellent: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    Good: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Fair: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'Needs Attention': 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  }[ecoScore.status];

  const breakdownMetrics = [
    {
      name: 'Transport Efficiency',
      score: ecoScore.transportScore,
      icon: <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Based on vehicle emission factors and transit modal share',
      status: 'Strong (+4 pts)',
    },
    {
      name: 'Electricity Management',
      score: ecoScore.electricityScore,
      icon: <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      desc: 'Based on baseline kWh usage and day/night peak distribution',
      status: 'Optimal (+6 pts)',
    },
    {
      name: 'Combustion Fuel Conservation',
      score: ecoScore.fuelScore,
      icon: <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
      desc: 'Based on volume of gasoline, diesel, and cooking fuels logged',
      status: 'Moderate (+1 pt)',
    },
    {
      name: 'Tracking Consistency',
      score: ecoScore.consistencyScore,
      icon: <RotateCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      desc: 'Frequency of weekly meter entries and commute activity logging',
      status: 'Excellent (Weekly logs)',
    },
    {
      name: 'Goal Completion Momentum',
      score: ecoScore.goalProgressScore,
      icon: <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      desc: 'Percentage of milestones achieved against set deadlines',
      status: 'On Track (64% achieved)',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          CarbonWise Eco Score
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Holistic engagement index evaluating reduction rate, energy mix, and tracking discipline
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 sm:p-8 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-8 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-inner">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                  {ecoScore.overall}
                </span>
                <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${scorePillClass}`}>
                  {ecoScore.status}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +7 pts vs. last month
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                Your Sustainable Living Index
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
                You are outperforming 78% of typical urban residents with similar commute distances and domestic power connections.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0 bg-slate-50 dark:bg-[#11192d] p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs transition-colors">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Last Month Score:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{ecoScore.previousMonth} / 100</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Current Month Score:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{ecoScore.overall} / 100</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Net Improvement:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+{(ecoScore.overall - ecoScore.previousMonth)} Points</span>
            </div>
          </div>
        </div>

        {/* Official Transparency Disclaimer */}
        <div className="mt-6 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed transition-colors">
          <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Methodology Note:</strong> This score is an internal behavioral and engagement metric based on your tracked activity, reduction pace, and goal fidelity. It is designed to motivate progress and does not represent a certified carbon audit or regulatory environmental guarantee.
          </span>
        </div>
      </div>

      {/* Breakdown Dimensions */}
      <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Score Dimension Breakdown</h3>
        <div className="space-y-4">
          {breakdownMetrics.map(item => (
            <div key={item.name} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-[#11192d]">{item.icon}</div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{item.status}</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{item.score} / 100</span>
                </div>
              </div>

              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Improvement Actions */}
      <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">How to Reach 85+ (Excellent)</h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+7 points needed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#11192d] flex flex-col justify-between space-y-2 transition-colors">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Modal Switch</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Swap 2 weekly car trips to rail or metro.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md w-fit">
              +4 Eco Points
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#11192d] flex flex-col justify-between space-y-2 transition-colors">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Thermostat Adjustment</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Keep AC at 24°C to save ~8 kWh weekly.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md w-fit">
              +2 Eco Points
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#11192d] flex flex-col justify-between space-y-2 transition-colors">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Log Twice Weekly</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Maintain 100% data consistency bonus.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md w-fit">
              +1 Eco Point
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setCurrentPage('ai-insights')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
          >
            <span>Review Full AI Action Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
