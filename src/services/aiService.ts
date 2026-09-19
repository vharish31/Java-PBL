import { AIRecommendation, ChatMessage, EmissionRecord } from '../types';
import { INITIAL_RECOMMENDATIONS } from '../data/mockData';

export class AIService {
  // Generate tailored recommendations based on user's data
  public static async getRecommendations(records: EmissionRecord[]): Promise<AIRecommendation[]> {
    // If user has recorded items, dynamically emphasize the largest category
    const transportTotal = records.filter(r => r.category === 'transport').reduce((s, r) => s + r.co2Emission, 0);
    const electricityTotal = records.filter(r => r.category === 'electricity').reduce((s, r) => s + r.co2Emission, 0);

    const recommendations = [...INITIAL_RECOMMENDATIONS];

    if (electricityTotal > transportTotal) {
      // Prioritize electricity
      recommendations.sort((a, b) => (a.category === 'electricity' ? -1 : b.category === 'electricity' ? 1 : 0));
    }

    return recommendations;
  }

  // Generate response for AI Chat Assistant
  public static async chat(query: string, records: EmissionRecord[]): Promise<ChatMessage> {
    // Simulate brief latency for authentic conversational AI feel
    await new Promise(res => setTimeout(res, 450));

    const lower = query.toLowerCase();
    const totalCO2 = records.reduce((s, r) => s + r.co2Emission, 0).toFixed(1);
    
    // Transport query
    if (lower.includes('transport') || lower.includes('car') || lower.includes('commute')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: `Based on your recent activity data, transport accounts for ~45% of your total footprint (approx ${(records.filter(r => r.category === 'transport').reduce((s, r) => s + r.co2Emission, 0)).toFixed(1)} kg CO₂). The fastest way to reduce this without drastic lifestyle shifts is **route batching** and **modal switching**:\n\n• **Switch 2 short weekly trips** (under 5 km) to cycling or walking: Estimated reduction ~18.5 kg CO₂/month.\n• **Carpool or take rapid transit** once a week: Estimated reduction ~12.2 kg CO₂/month.\n• **Tire pressure & gentle acceleration**: Keeping tires at recommended PSI improves fuel economy by 3-4%.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Create a transport reduction goal', 'Compare car vs train emissions', 'Calculate next trip'],
      };
    }

    // Increase query
    if (lower.includes('why') && (lower.includes('increase') || lower.includes('high') || lower.includes('spike'))) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: `Looking at your recorded timeline, your main spikes occurred around:\n\n1. **September 10 & 18**: Long single-occupant car travel entries (18.9 kg and 12.4 kg CO₂).\n2. **September 01**: Base domestic electric billing entry (55.8 kg CO₂).\n\nWhile your overall month-over-month trend remains positive with an **11.4% net reduction**, individual weekend outings and peak AC hours account for 72% of momentary surge events. Setting a sub-category cap on personal car kilometers will smooth out this variance.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['How can I reduce transport emissions?', 'Set 20% reduction goal', 'Show electric breakdown'],
      };
    }

    // Biggest source
    if (lower.includes('biggest') || lower.includes('largest') || lower.includes('highest source')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: `Your largest single emission category is currently **Transport** (~45% of your tracked footprint), followed by **Electricity** (approx 34%) and **Fuel** (15%).\n\nBecause personal vehicle travel has an emission factor of 0.21 kg CO₂/km compared to just 0.04 kg CO₂/km for regional passenger trains, prioritizing travel substitutions gives you the highest return for your effort.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Give me 3 transport action items', 'Show AI recommendations', 'View Eco Score'],
      };
    }

    // 30 day green goal
    if (lower.includes('goal') || lower.includes('30-day') || lower.includes('plan')) {
      return {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: `Here is a custom **30-Day CarbonWise Action Blueprint** tailored to your current monthly run rate of ${totalCO2} kg CO₂:\n\n1. **Week 1 (Quick Wins)**: Adjust home thermostat +2°C and install smart standby power strips. *(Target: -6 kg CO₂)*\n2. **Week 2 (Modal Shift)**: Replace 2 mid-week car errands with public transit or walking. *(Target: -8 kg CO₂)*\n3. **Week 3 (Efficiency)**: Combine weekend shopping into a single circular trip and check tire pressures. *(Target: -5 kg CO₂)*\n4. **Week 4 (Review & Lock-in)**: Check your updated Eco Score and log your meter readings. *(Target: -7 kg CO₂)*\n\nTotal Potential Savings: **~26 kg CO₂** (approx 18-20% reduction!).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Apply this 20% goal', 'Show carbon predictions', 'Export summary report'],
      };
    }

    // General fallback response
    return {
      id: `msg_${Date.now()}`,
      sender: 'ai',
      text: `Hello! I've analyzed your ${records.length} logged sustainability activities totaling ${totalCO2} kg CO₂. You currently maintain a healthy **Eco Score of 78/100 (Good)**.\n\nI can help you analyze specific categories (Transport, Electricity, Fuel), simulate reduction scenarios, calculate your next journey's carbon cost, or construct personalized milestone goals. What specific area would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Why did my emissions increase?',
        'How can I reduce transport emissions?',
        'What is my biggest emission source?',
        'Create a 30-day green goal',
      ],
    };
  }
}
