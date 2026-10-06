import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { EmissionCategory } from '../types';
import { 
  Car, 
  Zap, 
  Flame, 
  Package, 
  Calculator as CalcIcon, 
  Save, 
  Sparkles, 
  Info
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { addEmissionRecord, setCurrentPage, emissionFactors } = useApp();

  const [activeCategory, setActiveCategory] = useState<EmissionCategory>('transport');

  // Transport State
  const [vehicleType, setVehicleType] = useState('car_petrol');
  const [distance, setDistance] = useState<number>(35);
  const [frequency, setFrequency] = useState<'one-time' | 'daily' | 'weekly' | 'monthly'>('one-time');

  // Electricity State
  const [electricityType, setElectricityType] = useState('electricity_grid');
  const [kwhAmount, setKwhAmount] = useState<number>(25);
  const [electricityPeriod, setElectricityPeriod] = useState<'daily' | 'monthly'>('daily');

  // Fuel State
  const [fuelType, setFuelType] = useState('fuel_petrol');
  const [fuelLitres, setFuelLitres] = useState<number>(10);

  // Other State
  const [otherType, setOtherType] = useState('other_waste');
  const [otherQuantity, setOtherQuantity] = useState<number>(5);

  // Calculation Result state
  const [result, setResult] = useState<{
    category: EmissionCategory;
    activityName: string;
    factor: number;
    factorUnit: string;
    source: string;
    inputQuantity: number;
    totalCO2: number;
  } | null>(null);

  const [saving, setSaving] = useState(false);

  // Multiplier for frequencies
  const getFrequencyMultiplier = (freq: 'one-time' | 'daily' | 'weekly' | 'monthly') => {
    switch (freq) {
      case 'daily': return 30; // monthly normalized
      case 'weekly': return 4;
      case 'monthly': return 1;
      case 'one-time': default: return 1;
    }
  };

  const handleCalculate = () => {
    if (activeCategory === 'transport') {
      const factorObj = emissionFactors.find(f => f.id === vehicleType) || emissionFactors[0];
      const mult = getFrequencyMultiplier(frequency);
      const totalKm = distance * mult;
      const co2 = Number((totalKm * factorObj.factor).toFixed(2));
      setResult({
        category: 'transport',
        activityName: `${factorObj.name} (${distance} km${frequency !== 'one-time' ? `, ${frequency}` : ''})`,
        factor: factorObj.factor,
        factorUnit: factorObj.unit,
        source: factorObj.source,
        inputQuantity: totalKm,
        totalCO2: co2,
      });
    } else if (activeCategory === 'electricity') {
      const factorObj = emissionFactors.find(f => f.id === electricityType) || emissionFactors[6];
      const mult = electricityPeriod === 'daily' ? 30 : 1;
      const totalKwh = kwhAmount * mult;
      const co2 = Number((totalKwh * factorObj.factor).toFixed(2));
      setResult({
        category: 'electricity',
        activityName: `${factorObj.name} (${kwhAmount} kWh, ${electricityPeriod})`,
        factor: factorObj.factor,
        factorUnit: factorObj.unit,
        source: factorObj.source,
        inputQuantity: totalKwh,
        totalCO2: co2,
      });
    } else if (activeCategory === 'fuel') {
      const factorObj = emissionFactors.find(f => f.id === fuelType) || emissionFactors[9];
      const co2 = Number((Number(fuelLitres) * factorObj.factor).toFixed(2));
      setResult({
        category: 'fuel',
        activityName: `${factorObj.name} (${fuelLitres} ${factorObj.unit})`,
        factor: factorObj.factor,
        factorUnit: factorObj.unit,
        source: factorObj.source,
        inputQuantity: Number(fuelLitres),
        totalCO2: co2,
      });
    } else if (activeCategory === 'other') {
      const factorObj = emissionFactors.find(f => f.id === otherType) || emissionFactors[13];
      const co2 = Number((Number(otherQuantity) * factorObj.factor).toFixed(2));
      setResult({
        category: 'other',
        activityName: `${factorObj.name} (${otherQuantity} ${factorObj.unit})`,
        factor: factorObj.factor,
        factorUnit: factorObj.unit,
        source: factorObj.source,
        inputQuantity: Number(otherQuantity),
        totalCO2: co2,
      });
    }
  };

  const handleSaveRecord = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await addEmissionRecord({
        userId: 'usr_harish_01',
        category: result.category,
        activity: result.activityName,
        quantity: result.inputQuantity,
        unit: result.factorUnit,
        emissionFactor: result.factor,
        co2Emission: result.totalCO2,
        date: new Date().toISOString().split('T')[0],
        notes: `Estimated using factor: ${result.factor} kg CO₂/${result.factorUnit} (${result.source})`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Calculate Your Carbon Footprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your activity details to estimate your emissions using certified international emission factors.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#0b1120] rounded-xl max-w-lg border border-transparent dark:border-slate-800">
        {[
          { key: 'transport', label: 'Transport', icon: <Car className="w-4 h-4" /> },
          { key: 'electricity', label: 'Electricity', icon: <Zap className="w-4 h-4" /> },
          { key: 'fuel', label: 'Fuel', icon: <Flame className="w-4 h-4" /> },
          { key: 'other', label: 'Other', icon: <Package className="w-4 h-4" /> },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key as EmissionCategory);
              setResult(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat.key
                ? 'bg-white dark:bg-[#162038] text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input Parameters (Left Column) */}
        <div className="md:col-span-7 bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs space-y-5 transition-colors">
          {/* TRANSPORT FORM */}
          {activeCategory === 'transport' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Transport & Commute Activity</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Mode of Transportation
                </label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="car_petrol">Car (Petrol/Gasoline - 0.21 kg/km)</option>
                  <option value="car_diesel">Car (Diesel - 0.19 kg/km)</option>
                  <option value="car_electric">Electric Vehicle (Grid Average - 0.05 kg/km)</option>
                  <option value="motorcycle">Motorcycle / Scooter (0.11 kg/km)</option>
                  <option value="bus_transit">Public Transit Bus (0.08 kg/km)</option>
                  <option value="train_commuter">Passenger Train / Metro (0.04 kg/km)</option>
                  <option value="bike_ebike">E-Bike (0.015 kg/km)</option>
                  <option value="bike_manual">Manual Bicycle / Walking (0.00 kg/km)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Distance Traveled (km)
                </label>
                <div className="mt-1 relative rounded-lg">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={distance}
                    onChange={e => setDistance(Math.max(1, Number(e.target.value)))}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                    km
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Trip Frequency</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(['one-time', 'daily', 'weekly', 'monthly'] as const).map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border capitalize transition-colors ${
                        frequency === freq
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192d] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#162038]'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ELECTRICITY FORM */}
          {activeCategory === 'electricity' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Domestic Electricity Consumption</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Grid Tariff Source</label>
                <select
                  value={electricityType}
                  onChange={e => setElectricityType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="electricity_grid">Standard Residential Grid (0.82 kg CO₂/kWh)</option>
                  <option value="electricity_green">Certified Renewable / Solar Tariff (0.02 kg CO₂/kWh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Power Consumption (kWh)
                </label>
                <div className="mt-1 relative rounded-lg">
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={kwhAmount}
                    onChange={e => setKwhAmount(Math.max(0.5, Number(e.target.value)))}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                    kWh
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Billing Period</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['daily', 'monthly'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setElectricityPeriod(p)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                        electricityPeriod === p
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192d] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#162038]'
                      }`}
                    >
                      {p} Meter Reading
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FUEL FORM */}
          {activeCategory === 'fuel' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Combustion Fuel Details</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={e => setFuelType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="fuel_petrol">Petrol / Motor Gasoline (2.31 kg CO₂/litre)</option>
                  <option value="fuel_diesel">Diesel (2.68 kg CO₂/litre)</option>
                  <option value="fuel_lpg">LPG / Cooking Gas (1.51 kg CO₂/litre)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Fuel Quantity
                </label>
                <div className="mt-1 relative rounded-lg">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={fuelLitres}
                    onChange={e => setFuelLitres(Math.max(0.5, Number(e.target.value)))}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                    litres
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* OTHER FORM */}
          {activeCategory === 'other' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Waste & Secondary Emissions</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Activity Type</label>
                <select
                  value={otherType}
                  onChange={e => setOtherType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="other_waste">Solid Landfill Waste (0.58 kg CO₂/kg)</option>
                  <option value="other_flights">Domestic Flight Passenger (0.15 kg CO₂/km)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Quantity</label>
                <div className="mt-1 relative rounded-lg">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={otherQuantity}
                    onChange={e => setOtherQuantity(Math.max(1, Number(e.target.value)))}
                    className="block w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-white dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {otherType === 'other_flights' ? 'km' : 'kg'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <div className="pt-2">
            <button
              onClick={handleCalculate}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <CalcIcon className="w-4 h-4" />
              <span>Calculate CO₂ Footprint</span>
            </button>
          </div>
        </div>

        {/* Calculation Result (Right Column) */}
        <div className="md:col-span-5 flex flex-col justify-between bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs transition-colors">
          {result ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Calculation Result
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Calculated Estimate
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Carbon Emission</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {result.totalCO2}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">kg CO₂</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                  {result.inputQuantity} {result.factorUnit} × {result.factor} kg CO₂/{result.factorUnit}
                </p>
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-[#11192d] rounded-lg p-3 text-xs border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Emission Factor:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{result.factor} kg CO₂/{result.factorUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Benchmark Source:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[160px]">{result.source}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span>
                  Results are calculated estimates based on verified emission factors, not scientifically exact physical measurements.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSaveRecord}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save to Emission History'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleReset}
                    className="py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    Calculate Again
                  </button>
                  <button
                    onClick={() => setCurrentPage('ai-insights')}
                    className="py-1.5 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Insights</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
              <div className="p-3 bg-slate-50 dark:bg-[#11192d] text-slate-400 dark:text-slate-500 rounded-full border border-slate-100 dark:border-slate-800 mb-3">
                <CalcIcon className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ready to Calculate</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1 leading-relaxed">
                Fill in your transport distance, electric kilowatt-hours, or fuel litres on the left and click "Calculate CO₂ Footprint".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
