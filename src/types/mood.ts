// 감정 종류
export type MoodType = 'happy' | 'playful' | 'affectionate' | 'inLove' | 'sad' | 'annoyed' | 'shocked' | 'neutral';

// 감정 기록 인터페이스
export interface MoodEntry {
  date: string;     // YYYY-MM-DD
  mood: MoodType;   // 감정 종류
  note: string;     // 감정 메모
}

// 감정별 색상 및 이모지 매핑
export const MOOD_CONFIG: Record<MoodType, { emoji: string; color: string; label: string }> = {
  annoyed: {
    emoji: '😾',
    color: '#FF6B6B',  // 밝은 분홍레드 - 가벼운 짜증
    label: '짜증',
  },
  sad: {
    emoji: '😿',
    color: '#6FA8DC',  // 맑은 하늘색 - 부드러운 슬픔
    label: '슬픔',
  },
  shocked: {
    emoji: '🙀',
    color: '#66E0C2',  // 밝은 머스터드 - 놀람
    label: '놀람',
  },
  neutral: {
    emoji: '😐',
    color: '#CFCFCF',  // 중립적인 연회색
    label: '보통',
  },
  happy: {
    emoji: '😺',
    color: '#FFE066',  // 밝고 따뜻한 노랑
    label: '행복',
  },
  playful: {
    emoji: '😸',
    color: '#FFB347',  // 밝은 오렌지 - 장난기
    label: '장난스러운',
  },
  affectionate: {
    emoji: '😽',
    color: '#FF9AA2',  // 파스텔 핑크 - 애정
    label: '애정',
  },
  inLove: {
    emoji: '😻',
    color: '#FF6F91',  // 비비드 핑크 - 강한 사랑
    label: '사랑',
  },
};
