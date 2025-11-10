import { Preferences } from '@capacitor/preferences';

export interface Score {
  score: number;
  date: string;
  level: number;
}

export class StorageManager {
  private static readonly SCORES_KEY = 'robotrunner_scores';
  private static readonly MAX_SCORES = 10;

  static async saveScore(score: number, level: number): Promise<void> {
    try {
      const scores = await this.getScores();
      
      const newScore: Score = {
        score,
        date: new Date().toLocaleDateString('es-ES'),
        level
      };
      
      scores.push(newScore);
      scores.sort((a, b) => b.score - a.score);
      
      const topScores = scores.slice(0, this.MAX_SCORES);
      
      await Preferences.set({
        key: this.SCORES_KEY,
        value: JSON.stringify(topScores)
      });
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }

  static async getScores(): Promise<Score[]> {
    try {
      const result = await Preferences.get({ key: this.SCORES_KEY });
      
      if (result.value) {
        return JSON.parse(result.value);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting scores:', error);
      return [];
    }
  }

  static async clearScores(): Promise<void> {
    try {
      await Preferences.remove({ key: this.SCORES_KEY });
    } catch (error) {
      console.error('Error clearing scores:', error);
    }
  }
}

