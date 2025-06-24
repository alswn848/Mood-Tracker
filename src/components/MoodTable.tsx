import React, { useState, useMemo } from "react";
import type { MoodEntry, MoodType } from "../types/mood";
import { MOOD_CONFIG } from "../types/mood";
import styled from "styled-components";

interface Props {
  entries: MoodEntry[];
  isHome?: boolean;
}

interface TableContainerProps {
  isHome?: boolean;
}

const TableContainer = styled.div<TableContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props: TableContainerProps) =>
    !props.isHome ? `width: 100%;` : `width: 70%;`};
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  margin-bottom: 30px;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffd966, #ffcc00);
  color: #333;
  width: 100%;
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
`;

const FilterSection = styled.div`
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  min-width: 200px;
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  text-align: left;
  font-weight: bold;
  color: #495057;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const MoodCell = styled.div<{ moodColor: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${({ moodColor }) => moodColor}20;
  border: 1px solid ${({ moodColor }) => moodColor};
  border-radius: 8px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
`;

const StatsInfo = styled.div`
  padding: 1rem 1.5rem;
  background: #e9ecef;
  font-size: 0.9rem;
  color: #495057;
  border-top: 1px solid #dee2e6;
  width: 100%;
`;

export const MoodTable: React.FC<Props> = ({ entries, isHome = false }) => {
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링된 엔트리 계산
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const moodMatch = selectedMood === "all" || entry.mood === selectedMood;
      const searchMatch =
        entry.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.date.includes(searchTerm);
      return moodMatch && searchMatch;
    });
  }, [entries, selectedMood, searchTerm]);

  // 필터 초기화
  const clearFilters = () => {
    setSelectedMood("all");
    setSearchTerm("");
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  if (entries.length === 0) {
    return (
      <TableContainer isHome={isHome}>
        <TableHeader>
          <TableTitle>감정 기록</TableTitle>
        </TableHeader>
        <EmptyState>
          아직 감정 기록이 없습니다. 첫 번째 감정을 기록해보세요! 😊
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer isHome={isHome}>
      <TableHeader>
        <TableTitle>감정 기록</TableTitle>
      </TableHeader>

      <FilterSection>
        <FilterSelect
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
        >
          <option value="all">모든 감정</option>
          {Object.entries(MOOD_CONFIG).map(([mood, config]) => (
            <option key={mood} value={mood}>
              {config.emoji} {config.label}
            </option>
          ))}
        </FilterSelect>

        <SearchInput
          type="text"
          placeholder="날짜나 메모로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {(selectedMood !== "all" || searchTerm) && (
          <ClearButton onClick={clearFilters}>필터 초기화</ClearButton>
        )}
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <Th>날짜</Th>
            <Th>감정</Th>
            <Th>메모</Th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry, index) => (
            <tr key={index}>
              <Td>{formatDate(entry.date)}</Td>
              <Td>
                <MoodCell moodColor={MOOD_CONFIG[entry.mood].color}>
                  <span style={{ fontSize: "1.2rem" }}>
                    {MOOD_CONFIG[entry.mood].emoji}
                  </span>
                  {MOOD_CONFIG[entry.mood].label}
                </MoodCell>
              </Td>
              <Td>{entry.note || "-"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <StatsInfo>
        총 {entries.length}개의 기록 중 {filteredEntries.length}개 표시
        {selectedMood !== "all" &&
          ` (${MOOD_CONFIG[selectedMood as MoodType]?.label} 필터링)`}
        {searchTerm && ` ("${searchTerm}" 검색)`}
      </StatsInfo>
    </TableContainer>
  );
};
