import React, { useState, useMemo } from "react";
import type { MoodEntry, MoodType } from "../types/mood";
import { MOOD_CONFIG } from "../types/mood";
import styled from "styled-components";

interface Props {
  entries: MoodEntry[];  // 감정 기록 배열 받아옴
  isHome?: boolean;      // 홈 화면 여부에 따라 스타일 조정용 옵션
}

interface TableContainerProps {
  isHome?: boolean;      // 스타일 적용용 프로퍼티
}

// 감정 테이블 전체 컨테이너 스타일 컴포넌트
const TableContainer = styled.div<TableContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props: TableContainerProps) =>
    !props.isHome ? `width: 100%;` : `width: 70%;`};  // 홈이면 70%, 아니면 100% 폭
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  margin-bottom: 30px;
`;

// 테이블 헤더 스타일 (노란 그라데이션 배경)
const TableHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffd966, #ffcc00);
  color: #333;
  width: 100%;
`;

// 테이블 제목 스타일
const TableTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
`;

// 필터 섹션 스타일 (날짜나 감정 필터 영역)
const FilterSection = styled.div`
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;   // 좁아지면 줄 바꿈
  width: 100%;
`;

// 감정 선택 드롭다운 스타일
const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
`;

// 검색 입력창 스타일 (날짜 or 메모 검색용)
const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  min-width: 200px;
`;

// 필터 초기화 버튼 스타일
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

// 실제 감정 기록 테이블 스타일
const Table = styled.table`
  width: 100%;
  border-collapse: collapse; // 테두리 겹침 제거
`;

// 테이블 헤더 셀 스타일
const Th = styled.th`
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  text-align: left;
  font-weight: bold;
  color: #495057;
`;

// 테이블 데이터 셀 스타일
const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;  // 텍스트 중앙 정렬
`;

// 감정 셀 스타일, 배경색과 테두리를 감정 색상으로
const MoodCell = styled.div<{ moodColor: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${({ moodColor }) => moodColor}20; // 20는 투명도 12.5%
  border: 1px solid ${({ moodColor }) => moodColor};
  border-radius: 8px;
  font-weight: 500;
`;

// 감정 기록이 없을 때 보여주는 빈 상태 메시지 스타일
const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
`;

// 필터링된 통계 정보 표시 영역 스타일
const StatsInfo = styled.div`
  padding: 1rem 1.5rem;
  background: #e9ecef;
  font-size: 0.9rem;
  color: #495057;
  border-top: 1px solid #dee2e6;
  width: 100%;
`;

// 메인 컴포넌트
export const MoodTable: React.FC<Props> = ({ entries, isHome = false }) => {
  // 현재 선택된 감정 필터 상태 (기본 all)
  const [selectedMood, setSelectedMood] = useState<string>("all");
  // 검색어 상태 (날짜 혹은 메모 검색용)
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링된 감정 기록 메모리제이션 - entries, selectedMood, searchTerm 바뀔 때만 재계산
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const moodMatch = selectedMood === "all" || entry.mood === selectedMood;
      // note(메모)와 date(날짜)에 검색어 포함 여부 체크
      const searchMatch =
          entry.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.date.includes(searchTerm);
      return moodMatch && searchMatch;
    });
  }, [entries, selectedMood, searchTerm]);

  // 필터 초기화 함수 (모든 필터값 초기화)
  const clearFilters = () => {
    setSelectedMood("all");
    setSearchTerm("");
  };

  // 날짜 문자열을 한국어 형식으로 보기좋게 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  // 기록 없을 때 빈 상태 메시지 표시
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

  // 기록 있을 때 테이블 렌더링
  return (
      <TableContainer isHome={isHome}>
        <TableHeader>
          <TableTitle>감정 기록</TableTitle>
        </TableHeader>

        <FilterSection>
          {/* 감정 선택 드롭다운 */}
          <FilterSelect
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
          >
            <option value="all">모든 감정</option>
            {/* MOOD_CONFIG를 돌면서 감정 옵션 생성 */}
            {Object.entries(MOOD_CONFIG).map(([mood, config]) => (
                <option key={mood} value={mood}>
                  {config.emoji} {config.label}
                </option>
            ))}
          </FilterSelect>

          {/* 검색 입력창 */}
          <SearchInput
              type="text"
              placeholder="날짜나 메모로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* 필터 사용 중일 때만 초기화 버튼 표시 */}
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
          {/* 필터된 감정 기록들 테이블 행으로 표시 */}
          {filteredEntries.map((entry, index) => (
              <tr key={index}>
                <Td>{formatDate(entry.date)}</Td> {/* 포맷된 날짜 */}
                <Td>
                  <MoodCell moodColor={MOOD_CONFIG[entry.mood].color}>
                  <span style={{ fontSize: "1.2rem" }}>
                    {MOOD_CONFIG[entry.mood].emoji}
                  </span>
                    {MOOD_CONFIG[entry.mood].label}
                  </MoodCell>
                </Td>
                <Td>{entry.note || "-"}</Td> {/* 메모 없으면 '-' 표시 */}
              </tr>
          ))}
          </tbody>
        </Table>

        {/* 필터링 정보 통계 표시 */}
        <StatsInfo>
          총 {entries.length}개의 기록 중 {filteredEntries.length}개 표시
          {selectedMood !== "all" &&
              ` (${MOOD_CONFIG[selectedMood as MoodType]?.label} 필터링)`}
          {searchTerm && ` ("${searchTerm}" 검색)`}
        </StatsInfo>
      </TableContainer>
  );
};