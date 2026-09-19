import { EmissionRecord, EmissionCategory, EmissionFactorConfig } from '../types';
import { DEFAULT_EMISSION_FACTORS, INITIAL_RECORDS } from '../data/mockData';

const STORAGE_KEY = 'carbonwise_emissions_v1';
const FACTORS_KEY = 'carbonwise_factors_v1';

export class EmissionService {
  // Emission Factors
  public static getEmissionFactors(): EmissionFactorConfig[] {
    try {
      const stored = localStorage.getItem(FACTORS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_EMISSION_FACTORS;
  }

  public static getFactorForCategory(category: EmissionCategory, subType?: string): EmissionFactorConfig {
    const factors = this.getEmissionFactors();
    if (subType) {
      const found = factors.find(f => f.id === subType || f.name.toLowerCase().includes(subType.toLowerCase()));
      if (found) return found;
    }
    const defaultForCategory = factors.find(f => f.category === category);
    return defaultForCategory || factors[0];
  }

  // Calculate CO2 emission: quantity * factor
  public static calculateEmission(quantity: number, factor: number): {
    co2Emission: number;
    formatted: string;
    isEstimate: true;
  } {
    const raw = Math.max(0, quantity) * factor;
    const rounded = Number(raw.toFixed(2));
    return {
      co2Emission: rounded,
      formatted: `${rounded.toLocaleString()} kg CO₂`,
      isEstimate: true,
    };
  }

  // Fetch all records
  public static async getRecords(): Promise<EmissionRecord[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    // Seed initial records
    this.saveToStorage(INITIAL_RECORDS);
    return INITIAL_RECORDS;
  }

  // Add a new emission record
  public static async addRecord(record: Omit<EmissionRecord, 'id' | 'createdAt'>): Promise<EmissionRecord> {
    const records = await this.getRecords();
    const newRecord: EmissionRecord = {
      ...record,
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...records];
    this.saveToStorage(updated);
    return newRecord;
  }

  // Update existing record
  public static async updateRecord(id: string, updates: Partial<EmissionRecord>): Promise<EmissionRecord> {
    const records = await this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Record with id ${id} not found`);
    }
    const updatedRecord = { ...records[index], ...updates };
    records[index] = updatedRecord;
    this.saveToStorage(records);
    return updatedRecord;
  }

  // Delete a record
  public static async deleteRecord(id: string): Promise<boolean> {
    const records = await this.getRecords();
    const filtered = records.filter(r => r.id !== id);
    this.saveToStorage(filtered);
    return true;
  }

  // Reset to initial demo data
  public static async resetToDemo(): Promise<EmissionRecord[]> {
    this.saveToStorage(INITIAL_RECORDS);
    return INITIAL_RECORDS;
  }

  // Clear all data
  public static async clearAll(): Promise<void> {
    this.saveToStorage([]);
  }

  private static saveToStorage(records: EmissionRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }
}
