import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Database, 
  BookOpen, 
  Mail, 
  CheckCircle2, 
  Info,
  Car,
  Zap,
  Flame,
  Package
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { emissionFactors, showToast } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How are carbon emissions calculated in CarbonWise AI?',
      a: 'Emissions are calculated using standard greenhouse gas accounting equations: Activity Quantity × Emission Factor = kg CO₂ equivalent. For instance, traveling 100 km in a gasoline passenger car uses the benchmark factor of 0.21 kg CO₂/km, yielding 21.0 kg CO₂.',
    },
    {
      q: 'What benchmark emission factors are used?',
      a: 'Factors are derived from certified datasets published by the Intergovernmental Panel on Climate Change (IPCC), the UK Department for Environment, Food & Rural Affairs (DEFRA 2024), and the US Environmental Protection Agency (EPA). Regional grid intensities are customized per jurisdiction.',
    },
    {
      q: 'How does the Eco Score work?',
      a: 'The Eco Score (0–100) is an internal behavioral index evaluating five key dimensions: Transport Efficiency, Electricity Conservation, Fuel Usage, Logging Consistency, and Goal Completion. It motivates consistent reduction and is not a regulatory carbon audit certificate.',
    },
    {
      q: 'How accurate are the Machine Learning predictions?',
      a: 'Predictions use ensemble gradient boost models trained on your historical consumption patterns, seasonal trends, and modal preferences. They display a 90% confidence envelope to reflect real-world variability.',
    },
    {
      q: 'Can I export my data for audits or ESG reporting?',
      a: 'Yes. You can export your data at any time as CSV spreadsheets, printable PDF audit sheets, or a complete JSON backup archive via the History, Reports, or Settings pages.',
    },
    {
      q: 'How is my private data handled?',
      a: 'Your activity logs and credentials are encrypted. CarbonWise AI does not sell user data to advertising third parties.',
    },
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Support ticket received! We will respond within 24 hours.', 'success');
    setSupportMessage('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Help Center & Documentation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Methodology transparent guides, standard emission factor references, and support
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full p-3.5 text-left text-xs font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaqIndex === i ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaqIndex === i && (
                <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verified Emission Factor Benchmark Reference */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Emission Factor Benchmark Index</h2>
          </div>
          <span className="text-[10px] text-slate-400">DEFRA / EPA Standard Reference</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Activity / Fuel Source</th>
                <th className="p-3">Emission Factor</th>
                <th className="p-3">Certified Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {emissionFactors.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/60">
                  <td className="p-3 capitalize font-medium">{f.category}</td>
                  <td className="p-3 text-slate-900 font-medium">{f.name}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">
                    {f.factor} <span className="font-normal text-[11px] text-slate-500">kg CO₂/{f.unit}</span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-400">{f.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support & Contact Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">Contact Support & Methodology Team</h2>
        </div>
        <p className="text-xs text-slate-500">
          Have an inquiry regarding custom grid factors, enterprise features, or feedback? Send our climate engineers a note.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your ticket has been logged and our team will get back to you shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs max-w-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Harish Kalyan"
                  value={supportName}
                  onChange={e => setSupportName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="harish@carbonwise.io"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700">Message / Inquiry</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your inquiry or feature suggestion..."
                value={supportMessage}
                onChange={e => setSupportMessage(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
