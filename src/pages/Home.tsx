import { useState, useEffect } from "react";
import { MoodInput } from "../components/MoodInput";  // 감정 입력 폼 컴포넌트
import { MoodTable } from "../components/MoodTable";  // 감정 기록 테이블 컴포넌트

import * as S from "../styles/style.ts";              // 스타일 모듈 (styled-components)
import type { MoodEntry, MoodType } from "../types/mood"; // 타입 임포트
import { saveMoodEntry, getMoodEntryByDate } from "../utils/storage"; // 저장, 불러오기 함수
import { MOOD_CONFIG } from "../types/mood";           // 감정별 설정 (색상, 이모지 등)

interface HomeProps {
  entries: MoodEntry[];                             // 전체 감정 기록 배열
  updateEntries: (entries: MoodEntry[]) => void;   // 기록 업데이트 콜백
}

// 오늘 날짜를 YYYY-MM-DD 포맷으로 반환하는 함수
function getLocalDateString() {
  const date = new Date();
  const dateString = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  return dateString;
}

export const Home: React.FC<HomeProps> = ({ entries, updateEntries }) => {
  // 선택된 감정 상태 (MoodType 혹은 null)
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  // 메모 상태
  const [note, setNote] = useState("");
  // 저장 중 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 오늘 날짜의 기존 기록이 있으면 불러와서 상태 세팅
  useEffect(() => {
    const today = getLocalDateString();
    const todayEntry = getMoodEntryByDate(today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note);
    }
  }, []);

  // 감정 기록 저장 함수 (비동기 아니지만 async로 해둠)
  const saveEntry = async () => {
    // 감정 안 골랐으면 경고 띄우고 종료
    if (!selectedMood) {
      alert("감정을 선택해 주세요");
      return;
    }

    setIsLoading(true);  // 저장 시작하니까 로딩 켜줌

    try {
      // 새로운 감정 기록 객체 생성 (오늘 날짜, 선택된 감정, 메모)
      const newEntry: MoodEntry = {
        date: getLocalDateString(), // YYYY-MM-DD (로컬)
        mood: selectedMood,
        note: note.trim(),          // 앞뒤 공백 제거
      };

      // 로컬 저장소에 저장
      saveMoodEntry(newEntry);

      // 기존 entries 배열 복사해서 업데이트 준비
      const updatedEntries = [...entries];
      // 오늘 날짜 기록이 이미 있으면 덮어쓰기, 없으면 새로 추가
      const existingIndex = updatedEntries.findIndex(e => e.date === newEntry.date);
      if (existingIndex !== -1) {
        updatedEntries[existingIndex] = newEntry;
      } else {
        updatedEntries.push(newEntry);
      }

      // 부모 컴포넌트에 업데이트된 기록 배열 전달 (상태 업데이트 유발)
      updateEntries(updatedEntries);

      // 입력 폼 초기화 - 메모랑 감정 선택 초기화
      setNote("");
      setSelectedMood(null);

      alert("감정이 성공적으로 저장되었습니다! 😊");
    } catch (error) {
      // 저장 실패시 에러 콘솔 찍고 경고 띄우기
      alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);  // 저장 끝나면 로딩 끔
    }
  };

  // 오늘 날짜 문자열 (YYYY-MM-DD)
  const today = getLocalDateString();
  // 오늘 날짜에 해당하는 기록 찾기 (있으면 오늘 기분 보여주려고)
  const todayEntry = entries.find(entry => entry.date === today);

  return (
      <>
        <S.HomeWrapper>
          {/* 상단 헤더 */}
          <S.Header>오늘의 무드</S.Header>

          {/* 오늘 날짜 및 오늘 기분 요약 보여주는 영역 */}
          <S.Content>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              {/* 오늘 날짜를 한국어 포맷으로 보기 좋게 표시 */}
              <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'   // 요일도 같이 보여줌
                })}
              </h2>
              {/* 오늘 기록이 있으면 이모지+라벨로 오늘 기분 표시 */}
              {todayEntry && (
                  <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: MOOD_CONFIG[todayEntry.mood].color + '20', // 투명도 20%
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

          {/* 감정 입력 폼 컴포넌트 */}
          <MoodInput
              note={note}
              setNote={setNote}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              saveEntry={saveEntry}
              isLoading={isLoading}
          />

          {/* 감정 기록이 있으면 테이블로 보여줌 */}
          {entries.length > 0 && (
              <>
                <MoodTable entries={entries} isHome />
              </>
          )}

          {/* 페이지 하단 푸터 */}
          <S.Footer>© 2025 Mood Tracker</S.Footer>
        </S.HomeWrapper>
      </>
  );
};