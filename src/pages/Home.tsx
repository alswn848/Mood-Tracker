import { useState } from "react";
import { EmojiSelector } from "../components/EmojiSelector";
import { MoodInput } from "../components/MoodInput";
import { MoodTable } from "../components/MoodTable";
import { MoodCalendar } from "../components/MoodCalendar";
import { MoodStats } from "../components/MoodStats";
import * as S from "../styles/style.ts";
import type { MoodEntry, MoodType } from "../types/mood";

export const Home = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  // 감정 저장 함수 예시
  const saveEntry = () => {
    if (!selectedMood) return alert("무드를 선택해 주세요");
    const newEntry: MoodEntry = {
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      mood: selectedMood,
      note,
    };
    setEntries((prev) => [...prev, newEntry]);
    setNote("");
    setSelectedMood(null);
  };

  return (
      <>
        <S.HomeWrapper>
          <S.Header>오늘의 무드</S.Header>

          <S.Content>
            <EmojiSelector selected={selectedMood} onSelect={setSelectedMood} />
            <MoodInput
                note={note}
                setNote={setNote}
                selectedMood={selectedMood}
                setSelectedMood={setSelectedMood}
                saveEntry={saveEntry}
            />
            <MoodCalendar entries={entries} />
            <MoodTable entries={entries} />
            <MoodStats entries={entries} />
          </S.Content>

          <S.Footer>© 2025 Mood Tracker</S.Footer>
        </S.HomeWrapper>
      </>
  );
};