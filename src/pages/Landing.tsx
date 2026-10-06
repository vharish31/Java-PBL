import React from 'react';
import { useApp } from '../store/AppContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Calculator, 
  TrendingDown, 
  Target, 
  Award, 
  Cpu, 
  FileText 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, setIsAuthenticated } = useApp();

  const handleStartTracking = () => {
    setIsAuthenticated(true);
    setCurrentPage('calculator');
  };

  const handleExploreDashboard = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const features = [
    {
      icon: <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Activity Carbon Calculator',
      description: 'Accurately convert transport kilometers, electric kWh, and fuel usage into validated CO₂ emissions using DEFRA and EPA factors.',
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Interactive Analytics & Trends',
      description: 'Review timeline shifts, breakdown charts, and week-over-week comparisons to spot carbon spikes early.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'AI Sustainability Advisor',
      description: 'Context-aware suggestions and interactive chat powered by intelligent agents analyzing your real activity logs.',
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Measurable Reduction Goals',
      description: 'Set custom targets, track progress deadlines, and celebrate emissions reduction milestones as habits change.',
    },
    {
      icon: <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Dynamic Eco Score',
      description: 'A 0–100 engagement metric assessing emission efficiency, goal progress momentum, and reporting consistency.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Predictive ML Scenarios',
      description: 'Simulate the impact of behavioral shifts with machine learning forecasts and 90% confidence bands.',
    },
    {
      icon: <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Audit-Ready Reports',
      description: 'Generate monthly and annual carbon footprint summaries ready for PDF viewing or CSV spreadsheet export.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Leaf className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">CarbonWise</span>
              <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">AI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Key Features</a>
            <a href="#insights" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">AI Insights</a>
            <a href="#methodology" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Methodology</a>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            
            <button
              onClick={handleExploreDashboard}
              className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleExploreDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Intelligent Carbon Footprint Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
            Understand Your Carbon Footprint.{' '}
            <span className="text-emerald-600 dark:text-emerald-400">Make Every Action Count.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            CarbonWise AI helps you measure, understand, and reduce your carbon emissions with intelligent insights and personalized sustainability recommendations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleStartTracking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleExploreDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#11192d] hover:bg-slate-50 dark:hover:bg-[#162038] text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs transition-all"
            >
              <span>Explore Dashboard</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Instant demo data loaded
            </span>
          </div>
        </div>

        {/* Dashboard Preview UI Showcase */}
        <div className="mt-14 relative rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1120] p-4 sm:p-6 shadow-xl max-w-5xl mx-auto overflow-hidden transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">CarbonWise AI Dashboard Preview</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800">
              Live Demo View
            </span>
          </div>

          {/* Mini Dashboard Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-50 dark:bg-[#11192d] rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Total CO₂</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">128.6 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kg</span></p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">This month</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#11192d] rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Reduction</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">12.4%</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">vs. last month</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#11192d] rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Eco Score</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">78 <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">/ 100</span></p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Rating: Good</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#11192d] rounded-xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Goal Progress</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">64%</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Monthly target</p>
            </div>
          </div>

          {/* AI Banner inside Preview */}
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-emerald-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">AI Sustainability Insight</p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Transport is your largest emission source this month. Switching two short weekly trips can save ~18.5 kg CO₂.
                </p>
              </div>
            </div>
            <button
              onClick={handleExploreDashboard}
              className="px-3 py-1 bg-white dark:bg-[#11192d] text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] hover:bg-emerald-50 dark:hover:bg-[#162038] transition-colors shrink-0"
            >
              View in App →
            </button>
          </div>
        </div>
      </section>

      {/* The Core Loop: Measure -> Understand -> Recommend -> Act -> Track -> Improve */}
      <section id="how-it-works" className="py-16 bg-white dark:bg-[#070b14] border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">The Continuous Improvement Loop</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              A Complete System for Meaningful Carbon Reduction
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              CarbonWise AI is not just a one-time calculator. It guides you from measurement through continuous progress.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 mt-10">
            {[
              { step: '01', title: 'MEASURE', desc: 'Calculate emissions from travel, power, and fuel' },
              { step: '02', title: 'UNDERSTAND', desc: 'Break down footprints by source and time periods' },
              { step: '03', title: 'RECOMMEND', desc: 'Receive AI insights targeted at high-impact habits' },
              { step: '04', title: 'ACT', desc: 'Adopt realistic behavioral and efficiency adjustments' },
              { step: '05', title: 'TRACK', desc: 'Monitor daily and monthly metrics in real time' },
              { step: '06', title: 'IMPROVE', desc: 'Raise your Eco Score and hit reduction targets' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-[#0b1120] rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 text-center relative group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                  {item.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">{item.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Feature Cards */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Comprehensive Capabilities</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            Engineered for Real Sustainability Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Every module works together seamlessly to provide clear data and practical actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0b1120] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#11192d] w-fit border border-slate-100 dark:border-slate-800 mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-slate-900 dark:bg-[#0b1120] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to track and shrink your carbon footprint?
          </h2>
          <p className="mt-3 text-sm text-slate-300 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join conscious individuals and organizations making measurable progress toward net-zero living.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={handleExploreDashboard}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
            >
              <span>Launch CarbonWise AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-[#070b14] border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">CarbonWise AI</span>
            <span>— Intelligent Carbon Footprint Management Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPage('help')} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Methodology</button>
            <button onClick={() => setCurrentPage('settings')} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Settings</button>
            <button onClick={() => setCurrentPage('help')} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Documentation</button>
            <span>Tagline: Measure. Understand. Reduce.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
