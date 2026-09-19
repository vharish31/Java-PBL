import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Goal } from '../types';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingDown, 
  Edit2, 
  Trash2, 
  Award,
  Zap,
  Car,
  Flame,
  CloudFog
} from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed'>('in_progress');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // New Goal Form State
  const [title, setTitle] = useState('');
  const [goalType, setGoalType] = useState<Goal['type']>('co2_total');
  const [targetPercent, setTargetPercent] = useState<number>(20);
  const [baselineEmission, setBaselineEmission] = useState<number>(145.2);
  const [deadlineDays, setDeadlineDays] = useState<number>(30);

  const filteredGoals = goals.filter(g => g.status === activeTab);

  const calculateTargetEmission = (base: number, pct: number) => {
    return Number((base * (1 - pct / 100)).toFixed(1));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));

    const targetVal = calculateTargetEmission(Number(baselineEmission), Number(targetPercent));

    await addGoal({
      userId: 'usr_harish_01',
      title: title || `Reduce ${goalType.replace('_', ' ')} by ${targetPercent}%`,
      type: goalType,
      targetPercent: Number(targetPercent),
      baselineEmission: Number(baselineEmission),
      targetEmission: targetVal,
      currentValue: Number(baselineEmission), // start at baseline
      deadline: deadlineDate.toISOString().split('T')[0],
      status: 'in_progress',
    });

    setIsCreateOpen(false);
    setTitle('');
  };

  const handleCompleteGoal = async (id: string) => {
    await updateGoal(id, { status: 'completed' });
    showToast('Congratulations! Goal marked as completed', 'success');
  };

  const handleUpdateCurrentValue = async (goal: Goal, newValue: number) => {
    await updateGoal(goal.id, { currentValue: newValue });
    showToast('Goal progress logged', 'info');
    setEditingGoal(null);
  };

  const typeIconMap = {
    co2_total: <CloudFog className="w-4 h-4 text-emerald-600" />,
    transport: <Car className="w-4 h-4 text-emerald-600" />,
    electricity: <Zap className="w-4 h-4 text-sky-600" />,
    fuel: <Flame className="w-4 h-4 text-orange-600" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Sustainability Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set ambitious, trackable reduction targets and celebrate carbon savings milestones
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'in_progress'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Goals ({goals.filter(g => g.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-2.5 px-1 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'completed'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed ({goals.filter(g => g.status === 'completed').length})
        </button>
      </div>

      {/* Goal Cards Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          title={activeTab === 'in_progress' ? 'No active goals' : 'No completed goals yet'}
          description={
            activeTab === 'in_progress'
              ? 'Creating a concrete percentage reduction target is proven to cut monthly emissions by 15-20%.'
              : 'Complete your ongoing goals to see them archived in this milestone showcase.'
          }
          actionText="Create Goal"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map(goal => {
            const totalReductionNeeded = Math.max(0.1, goal.baselineEmission - goal.targetEmission);
            const reductionAchieved = Math.max(0, goal.baselineEmission - goal.currentValue);
            const rawProgress = Math.round((reductionAchieved / totalReductionNeeded) * 100);
            const progressPercent = goal.status === 'completed' ? 100 : Math.min(100, Math.max(0, rawProgress));
            const remainingKg = Math.max(0, goal.currentValue - goal.targetEmission);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        {typeIconMap[goal.type]}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {goal.type.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{goal.title}</h3>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      -{goal.targetPercent}% Target
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Progress</span>
                      <span className="font-bold text-emerald-700">{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Values Breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50 rounded-lg text-center text-xs border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400">Current</p>
                      <p className="font-bold text-slate-900 mt-0.5">{goal.currentValue} <span className="font-normal text-[10px]">kg</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Target</p>
                      <p className="font-bold text-emerald-700 mt-0.5">{goal.targetEmission} <span className="font-normal text-[10px]">kg</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Remaining</p>
                      <p className="font-bold text-slate-900 mt-0.5">{remainingKg.toFixed(1)} <span className="font-normal text-[10px]">kg</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target deadline: {goal.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {goal.status === 'in_progress' ? (
                      <>
                        <button
                          onClick={() => setEditingGoal(goal)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleCompleteGoal(goal.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors"
                        >
                          Complete
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Achieved
                      </span>
                    )}

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE GOAL MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Sustainability Goal"
        subtitle="Establish a measurable milestone to keep emissions in check"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700">Goal Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Cut transport footprint by 20%"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700">Category Scope</label>
              <select
                value={goalType}
                onChange={e => setGoalType(e.target.value as any)}
                className="mt-1 w-full px-2.5 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="co2_total">Total CO₂ Footprint</option>
                <option value="transport">Transport & Commute</option>
                <option value="electricity">Domestic Electricity</option>
                <option value="fuel">Combustion Fuel</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700">Target Reduction (%)</label>
              <input
                type="number"
                min="5"
                max="80"
                step="5"
                value={targetPercent}
                onChange={e => setTargetPercent(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700">Baseline Emission (kg)</label>
              <input
                type="number"
                step="0.5"
                value={baselineEmission}
                onChange={e => setBaselineEmission(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Deadline Horizon (Days)</label>
              <input
                type="number"
                min="7"
                max="365"
                value={deadlineDays}
                onChange={e => setDeadlineDays(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
            <p className="font-semibold">Calculated Goal Objective:</p>
            <p className="mt-0.5 text-emerald-700">
              Lower emissions from <strong>{baselineEmission} kg</strong> down to{' '}
              <strong>{calculateTargetEmission(baselineEmission, targetPercent)} kg CO₂</strong> within {deadlineDays} days.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Create Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* UPDATE CURRENT VALUE MODAL */}
      <Modal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title="Update Goal Current Value"
        subtitle="Log recent measurement to calibrate progress"
        maxWidth="sm"
      >
        {editingGoal && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Update the current measured level for <strong>{editingGoal.title}</strong>:
            </p>
            <div>
              <label className="block font-medium text-slate-700">Current Level (kg CO₂)</label>
              <input
                type="number"
                step="0.5"
                defaultValue={editingGoal.currentValue}
                id="update-current-val-input"
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingGoal(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = Number((document.getElementById('update-current-val-input') as HTMLInputElement).value);
                  handleUpdateCurrentValue(editingGoal, val);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              >
                Save Progress
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
