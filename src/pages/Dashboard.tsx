import React from 'react';
import { useApp } from '../store/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { EmissionTrendChart } from '../components/charts/EmissionTrendChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { AnalyticsService } from '../services/analyticsService';
import { 
  CloudFog, 
  TrendingDown, 
  Award, 
  Target, 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  Car, 
  Zap, 
  Flame, 
  Package,
  Calendar,
  ChevronRight,
  Info
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, records, goals, ecoScore, setCurrentPage } = useApp();

  const summary = AnalyticsService.getMonthlySummary(records);
  const activeGoal = goals.find(g => g.status === 'in_progress') || goals[0];

  // Calculate goal completion percent
  let goalPercent = 64;
  if (activeGoal && activeGoal.baselineEmission > activeGoal.targetEmission) {
    const plannedReduction = activeGoal.baselineEmission - activeGoal.targetEmission;
    const currentReduction = activeGoal.baselineEmission - activeGoal.currentValue;
    goalPercent = Math.min(100, Math.max(0, Math.round((currentReduction / plannedReduction) * 100))) || 64;
  }

  const categoryIconMap = {
    transport: <Car className="w-3.5 h-3.5 text-emerald-600" />,
    electricity: <Zap className="w-3.5 h-3.5 text-sky-600" />,
    fuel: <Flame className="w-3.5 h-3.5 text-orange-600" />,
    other: <Package className="w-3.5 h-3.5 text-slate-500" />,
  };

  const recentRecords = records.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Good morning, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here's your sustainability overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage('calculator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Calculate CO₂</span>
          </button>
          <button
            onClick={() => setCurrentPage('reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-total-co2"
          title="Total CO₂"
          value={summary.totalCO2 > 0 ? summary.totalCO2 : 128.6}
          unit="kg"
          subtitle="This month"
          icon={<CloudFog className="w-4 h-4 text-emerald-600" />}
          trend={{
            value: `${summary.reductionPercent}%`,
            isPositive: summary.isReductionPositive,
            label: 'vs baseline',
          }}
          onClick={() => setCurrentPage('analytics')}
        />

        <StatCard
          id="stat-reduction"
          title="Reduction"
          value="12.4%"
          subtitle="Compared with last month"
          icon={<TrendingDown className="w-4 h-4 text-emerald-600" />}
          badge={{
            text: 'On Track',
            variant: 'success',
          }}
          onClick={() => setCurrentPage('analytics')}
        />

        <StatCard
          id="stat-eco-score"
          title="Eco Score"
          value={`${ecoScore.overall}/100`}
          subtitle={`Status: ${ecoScore.status}`}
          icon={<Award className="w-4 h-4 text-emerald-600" />}
          badge={{
            text: ecoScore.status,
            variant: 'success',
          }}
          onClick={() => setCurrentPage('eco-score')}
        />

        <StatCard
          id="stat-goal-progress"
          title="Goal Progress"
          value={`${goalPercent}%`}
          subtitle="Monthly reduction goal"
          icon={<Target className="w-4 h-4 text-emerald-600" />}
          badge={{
            text: `${activeGoal ? activeGoal.targetPercent : 20}% Target`,
            variant: 'info',
          }}
          onClick={() => setCurrentPage('goals')}
        />
      </div>

      {/* Charts Grid: Trend Chart + Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmissionTrendChart records={records} />
        </div>
        <div>
          <CategoryPieChart records={records} />
        </div>
      </div>

      {/* Prominent AI Sustainability Insight Card */}
      <div className="bg-emerald-50/60 rounded-xl border border-emerald-200 p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">AI Sustainability Insight</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Priority Action
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Your transport emissions increased this month. Switching two weekly car trips to public transport could reduce your estimated monthly footprint by up to <strong>18.5 kg CO₂</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={() => setCurrentPage('ai-insights')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
            >
              View Recommendations
            </button>
            <button
              onClick={() => setCurrentPage('goals')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg transition-colors"
            >
              Set Goal
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest recorded emissions and calculated quantities</p>
          </div>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Activity</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Input Quantity</th>
                <th className="px-5 py-3 text-right">CO₂ Emission</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium flex items-center gap-2">
                    {categoryIconMap[rec.category]}
                    <span className="capitalize">{rec.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-900 font-medium">
                    {rec.activity}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {rec.date}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-mono">
                    {rec.quantity} {rec.unit}
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                    {rec.co2Emission} <span className="font-normal text-slate-500 text-[11px]">kg</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setCurrentPage('history')}
                      className="text-[11px] font-medium text-emerald-600 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
