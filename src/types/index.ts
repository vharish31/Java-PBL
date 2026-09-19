export type EmissionCategory = 'transport' | 'electricity' | 'fuel' | 'other';

export interface EmissionRecord {
  id: string;
  userId: string;
  category: EmissionCategory;
  activity: string;
  quantity: number;
  unit: string;
  emissionFactor: number; // kg CO2 per unit
  co2Emission: number; // in kg
  date: string; // ISO date string YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface EmissionFactorConfig {
  id: string;
  category: EmissionCategory;
  name: string;
  factor: number; // kg CO2 per unit
  unit: string;
  source: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: 'co2_total' | 'transport' | 'electricity' | 'fuel';
  targetPercent: number;
  baselineEmission: number;
  targetEmission: number;
  currentValue: number;
  deadline: string;
  status: 'in_progress' | 'completed' | 'missed';
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  category: EmissionCategory;
  title: string;
  reason: string;
  action: string;
  estimatedReduction: number; // kg CO2/month
  impactLevel: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'challenging';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface EcoScoreBreakdown {
  overall: number; // 0-100
  previousMonth: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
  transportScore: number;
  electricityScore: number;
  fuelScore: number;
  consistencyScore: number;
  goalProgressScore: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  country: string;
  userType: 'individual' | 'student' | 'family' | 'small_org';
  unitPreference: 'metric' | 'imperial';
  joinedDate: string;
  notificationsEnabled: boolean;
  weeklyDigest: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  linkPage?: string;
}

export interface PredictionDataPoint {
  date: string;
  actual?: number;
  predicted: number;
  lowerConfidence?: number;
  upperConfidence?: number;
}

export type NavigationPage = 
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'calculator'
  | 'history'
  | 'analytics'
  | 'ai-insights'
  | 'goals'
  | 'eco-score'
  | 'predictions'
  | 'reports'
  | 'settings'
  | 'help';
