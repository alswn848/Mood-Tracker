// 감정 종류
export type MoodType = 'happy' | 'playful' | 'affectionate' | 'inLove' | 'sad' | 'annoyed' | 'shocked' | 'neutral';

// 감정 기록 인터페이스
export interface MoodEntry {
  date: string;     // YYYY-MM-DD
  mood: MoodType;   // 감정 종류
  note: string;     // 감정 메모
}
