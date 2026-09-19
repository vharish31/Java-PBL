import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { AIService } from '../services/aiService';
import { AIRecommendation, ChatMessage } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Info, 
  Clock, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Car, 
  Flame 
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const { records, ecoScore, addGoal, setCurrentPage, showToast } = useApp();

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello! I am your **CarbonWise AI Sustainability Advisor**.\n\nI have analyzed your logged activities: this month you have generated **128.6 kg CO₂**, and your current **Eco Score is 78/100 (Good)**.\n\nTransport represents **45%** of your total footprint. How can I assist your sustainability journey today?`,
      timestamp: 'Just now',
      suggestions: [
        'Why did my emissions increase?',
        'How can I reduce transport emissions?',
        'What is my biggest emission source?',
        'Create a 30-day green goal',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AIService.getRecommendations(records).then(recs => setRecommendations(recs));
  }, [records]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const aiReply = await AIService.chat(textToSend, records);
      setMessages(prev => [...prev, aiReply]);
    } catch {
      showToast('AI Advisor encountered a temporary error', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyGoalFromRec = async (rec: AIRecommendation) => {
    await addGoal({
      userId: 'usr_harish_01',
      title: rec.title,
      type: rec.category === 'transport' ? 'transport' : rec.category === 'electricity' ? 'electricity' : 'co2_total',
      targetPercent: 15,
      baselineEmission: 128.6,
      targetEmission: Number((128.6 - rec.estimatedReduction).toFixed(1)),
      currentValue: 128.6,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in_progress',
    });
    showToast(`Created target: Save ${rec.estimatedReduction} kg CO₂/mo!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              AI Sustainability Advisor
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Powered by AI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Personalized reduction recommendations grounded in your tracked activity patterns
          </p>
        </div>
      </div>

      {/* 1. CURRENT STATUS OVERVIEW */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Current Carbon Profile Diagnosis
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-500">Tracked Monthly</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">128.6 kg CO₂</p>
            <span className="text-[10px] text-emerald-600 font-medium">-11.4% vs last month</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-500">Primary Source</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">Transport (45%)</p>
            <span className="text-[10px] text-slate-500">57.8 kg CO₂</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-500">Eco Score</p>
            <p className="text-lg font-bold text-emerald-700 mt-0.5">{ecoScore.overall} / 100</p>
            <span className="text-[10px] text-slate-500">Rating: {ecoScore.status}</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[11px] text-slate-500">Potential Savings</p>
            <p className="text-lg font-bold text-emerald-700 mt-0.5">~42 kg CO₂/mo</p>
            <span className="text-[10px] text-emerald-600">Across 4 action items</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. PERSONALIZED RECOMMENDATIONS (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">High-Impact Recommendations</h3>
            </div>
            <span className="text-[11px] text-slate-400">Ranked by potential savings</span>
          </div>

          <div className="space-y-3.5">
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {rec.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rec.difficulty} difficulty
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">{rec.title}</h4>
                  </div>

                  <div className="text-right shrink-0 bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 font-medium">Potential Impact</p>
                    <p className="text-xs font-bold text-emerald-800">
                      -{rec.estimatedReduction} kg/mo
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-500 leading-relaxed">
                    <strong className="text-slate-700">Reason:</strong> {rec.reason}
                  </p>
                  <p className="text-slate-800 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <strong className="text-emerald-700">Action:</strong> {rec.action}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 italic">
                    * Estimated savings based on entered activity data.
                  </span>
                  <button
                    onClick={() => handleApplyGoalFromRec(rec)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Set as Goal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. INTERACTIVE AI CHAT ASSISTANT (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[640px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">CarbonWise Advisor Chat</h4>
                <p className="text-[10px] text-slate-400">Contextual answers grounded in your logs</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs">{msg.text}</div>
                  <span
                    className={`block text-[9px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1">
                      <p className="text-[10px] font-semibold text-slate-500">Quick prompts:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="text-[10px] text-left px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    U
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>Advisor is reviewing your carbon logs...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-100 bg-white rounded-b-xl">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask CarbonWise AI..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                disabled={isTyping}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isTyping || !inputQuery.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
