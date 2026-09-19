import { Goal } from '../types';
import { INITIAL_GOALS } from '../data/mockData';

const GOALS_STORAGE_KEY = 'carbonwise_goals_v1';

export class GoalService {
  public static async getGoals(): Promise<Goal[]> {
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    this.saveGoals(INITIAL_GOALS);
    return INITIAL_GOALS;
  }

  public static async createGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> {
    const goals = await this.getGoals();
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newGoal, ...goals];
    this.saveGoals(updated);
    return newGoal;
  }

  public static async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const goals = await this.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error(`Goal ${id} not found`);
    }
    const updated = { ...goals[index], ...updates };
    goals[index] = updated;
    this.saveGoals(goals);
    return updated;
  }

  public static async deleteGoal(id: string): Promise<boolean> {
    const goals = await this.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    this.saveGoals(filtered);
    return true;
  }

  public static async resetToDemo(): Promise<Goal[]> {
    this.saveGoals(INITIAL_GOALS);
    return INITIAL_GOALS;
  }

  private static saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }
}
