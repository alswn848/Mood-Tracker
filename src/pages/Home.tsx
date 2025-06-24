import { useState, useEffect } from "react";
import { MoodInput } from "../components/MoodInput";
import { MoodTable } from "../components/MoodTable";

import * as S from "../styles/style.ts";
import type { MoodEntry, MoodType } from "../types/mood";
import { saveMoodEntry, getMoodEntryByDate } from "../utils/storage";
import { MOOD_CONFIG } from "../types/mood";

interface HomeProps {
  entries: MoodEntry[];
  updateEntries: (entries: MoodEntry[]) => void;
}

function getLocalDateString() {
  const date = new Date();
  const dateString = date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
  return dateString;
}

export const Home: React.FC<HomeProps> = ({ entries, updateEntries }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 오늘 날짜의 기존 기록이 있으면 불러오기
  useEffect(() => {
    const today = getLocalDateString();
    const todayEntry = getMoodEntryByDate(today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note);
    }
  }, []);

  // 감정 저장 함수
  const saveEntry = async () => {
    if (!selectedMood) {
      alert("감정을 선택해 주세요");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newEntry: MoodEntry = {
        date: getLocalDateString(), // YYYY-MM-DD (로컬)
        mood: selectedMood,
        note: note.trim(),
      };
      
      saveMoodEntry(newEntry);
      
      // 상태 업데이트
      const updatedEntries = [...entries];
      const existingIndex = updatedEntries.findIndex(e => e.date === newEntry.date);
      if (existingIndex !== -1) {
        updatedEntries[existingIndex] = newEntry;
      } else {
        updatedEntries.push(newEntry);
      }
      
      updateEntries(updatedEntries);
      
      // 입력 필드 초기화
      setNote("");
      setSelectedMood(null);
      
      alert("감정이 성공적으로 저장되었습니다! 😊");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 오늘 날짜의 감정 정보 표시
  const today = getLocalDateString();
  const todayEntry = entries.find(entry => entry.date === today);

  return (
    <>
      <S.HomeWrapper>
        <S.Header>오늘의 무드</S.Header>

        <S.Content>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
              {new Date().toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </h2>
            {todayEntry && (
              <div style={{ 
                display: 'inline-block', 
                padding: '0.5rem 1rem', 
                backgroundColor: MOOD_CONFIG[todayEntry.mood].color + '20',
                borderRadius: '20px',
                border: `2px solid ${MOOD_CONFIG[todayEntry.mood].color}`,
                marginTop: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                  {MOOD_CONFIG[todayEntry.mood].emoji}
                </span>
                <span style={{ fontWeight: 'bold', color: '#333' }}>
                  {MOOD_CONFIG[todayEntry.mood].label}
                </span>
              </div>
            )}
          </div>
        </S.Content>
        <MoodInput
            note={note}
            setNote={setNote}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            saveEntry={saveEntry}
            isLoading={isLoading}
          />
        {entries.length > 0 && (
            <>
              <MoodTable entries={entries} isHome />
            </>
          )}
        <S.Footer>© 2025 Mood Tracker</S.Footer>
      </S.HomeWrapper>
    </>
  );
};