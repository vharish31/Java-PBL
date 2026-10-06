import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { EmissionRecord, EmissionCategory } from '../../types';
import { Car, Zap, Flame, Package } from 'lucide-react';

interface CategoryPieChartProps {
  records: EmissionRecord[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ records }) => {
  const categoryTotals: Record<EmissionCategory, number> = {
    transport: 0,
    electricity: 0,
    fuel: 0,
    other: 0,
  };

  records.forEach(r => {
    if (categoryTotals[r.category] !== undefined) {
      categoryTotals[r.category] += r.co2Emission;
    } else {
      categoryTotals.other += r.co2Emission;
    }
  });

  const grandTotal = Math.max(0.1, Object.values(categoryTotals).reduce((a, b) => a + b, 0));

  const chartData = [
    {
      name: 'Transport',
      category: 'transport',
      value: Number(categoryTotals.transport.toFixed(1)),
      color: '#16A34A', // Emerald 600
      icon: <Car className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      name: 'Electricity',
      category: 'electricity',
      value: Number(categoryTotals.electricity.toFixed(1)),
      color: '#0284C7', // Sky 600
      icon: <Zap className="w-3.5 h-3.5 text-sky-600" />,
    },
    {
      name: 'Fuel',
      category: 'fuel',
      value: Number(categoryTotals.fuel.toFixed(1)),
      color: '#EA580C', // Orange 600
      icon: <Flame className="w-3.5 h-3.5 text-orange-600" />,
    },
    {
      name: 'Other',
      category: 'other',
      value: Number(categoryTotals.other.toFixed(1)),
      color: '#64748B', // Slate 500
      icon: <Package className="w-3.5 h-3.5 text-slate-500" />,
    },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">Emission Breakdown</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Distribution across primary source activities</p>
      </div>

      <div className="relative h-48 sm:h-52 my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const percent = ((Number(item.value) / grandTotal) * 100).toFixed(1);
                  return (
                    <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-md">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-emerald-400 font-bold">{item.value} kg CO₂ ({percent}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              innerRadius={52}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total</span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {grandTotal.toFixed(0)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kg</span>
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {chartData.map(item => {
          const pct = Math.round((item.value / grandTotal) * 100) || 0;
          return (
            <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#162038] transition-colors">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono shrink-0 ml-1">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
