import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MoodCalendar } from '../components/MoodCalendar';  // 달력 뷰 컴포넌트
import { MoodTable } from '../components/MoodTable';        // 테이블 뷰 컴포넌트
import type { MoodEntry } from '../types/mood';             // 감정 기록 타입
import { loadMoodEntries } from '../utils/storage';          // 로컬 스토리지에서 데이터 불러오는 함수

// 전체 페이지 컨테이너 스타일, 최대 너비 1200px, 중앙 정렬
const HistoryContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

// 헤더 영역 스타일, 텍스트 중앙 정렬
const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

// 제목 스타일
const Title = styled.h1`
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 2rem;
`;

// 부제목 스타일
const Subtitle = styled.p`
    color: #666;
    font-size: 1.1rem;
`;

// 뷰 모드 토글 버튼 그룹 스타일, 가운데 정렬, 버튼 간격 띄움
const ViewToggle = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    gap: 1rem;
`;

// 뷰 모드 토글 버튼 스타일, active 상태에 따라 색상과 굵기 조절
const ToggleButton = styled.button<{ active: boolean }>`
    padding: 0.8rem 1.5rem;
    background: ${({ active }) => active ? '#ffd966' : '#f8f9fa'};
    border: 2px solid ${({ active }) => active ? '#ffd966' : '#dee2e6'};
    border-radius: 8px;
    cursor: pointer;
    font-weight: ${({ active }) => active ? 'bold' : 'normal'};
    transition: all 0.3s ease;

    &:hover {
        background: ${({ active }) => active ? '#ffcc00' : '#e9ecef'};
        border-color: ${({ active }) => active ? '#ffcc00' : '#adb5bd'};
    }
`;

// 필터 영역 스타일, 흰 배경, 둥근 모서리, 그림자 효과
const FilterSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

// 필터 제목 스타일
const FilterTitle = styled.h3`
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.2rem;
`;

// 필터 입력들을 격자형으로 배치, 반응형 컬럼 조절
const FilterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    align-items: end;
`;

// 필터 그룹 (라벨 + 입력) 세로 정렬 및 간격
const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

// 필터 라벨 스타일
const FilterLabel = styled.label`
    font-weight: 500;
    color: #495057;
    font-size: 0.9rem;
`;

// 필터용 텍스트 입력 스타일 (날짜 선택 등)
const FilterInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
`;

// 필터용 셀렉트 박스 스타일 (감정 선택)
const FilterSelect = styled.select`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
`;

// 필터 초기화 버튼 스타일
const ClearFiltersButton = styled.button`
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

// 기록 없거나 로딩 중 보여줄 빈 상태 메시지 스타일
const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    color: #6c757d;
    font-size: 1.1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

// 뷰 모드 타입 (달력 or 테이블)
type ViewMode = 'calendar' | 'table';

// 메인 컴포넌트
export const History: React.FC = () => {
    const [entries, setEntries] = useState<MoodEntry[]>([]); // 감정 기록 배열 상태
    const [viewMode, setViewMode] = useState<ViewMode>('calendar'); // 현재 뷰 모드 상태
    const [startDate, setStartDate] = useState('');   // 필터 시작 날짜 상태
    const [endDate, setEndDate] = useState('');       // 필터 종료 날짜 상태
    const [selectedMood, setSelectedMood] = useState<string>('all'); // 필터 감정 선택 상태
    const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태

    // 컴포넌트 마운트 시 로컬 저장소에서 데이터 불러오기
    useEffect(() => {
        const loadData = () => {
            try {
                const savedEntries = loadMoodEntries(); // 저장된 기록 불러오기
                setEntries(savedEntries);
            } catch (error) {
                console.error('Failed to load entries:', error);
            } finally {
                setIsLoading(false);  // 로딩 끝
            }
        };

        loadData();
    }, []);

    // 필터 조건에 맞는 감정 기록 필터링
    const filteredEntries = entries.filter(entry => {
        // 날짜 필터: 시작일, 종료일이 없으면 모두 통과
        const dateMatch = (!startDate || entry.date >= startDate) &&
            (!endDate || entry.date <= endDate);
        // 감정 필터: 'all'이면 모두 통과, 아니면 선택된 감정과 일치해야 함
        const moodMatch = selectedMood === 'all' || entry.mood === selectedMood;
        return dateMatch && moodMatch;
    });

    // 필터 초기화 함수 (모든 필터값 초기화)
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedMood('all');
    };

    // 필터가 하나라도 적용됐는지 확인하는 변수
    const hasActiveFilters = startDate || endDate || selectedMood !== 'all';

    // 데이터 로딩 중일 때 보여주는 화면
    if (isLoading) {
        return (
            <HistoryContainer>
                <EmptyState>데이터를 불러오는 중...</EmptyState>
            </HistoryContainer>
        );
    }

    // 기록이 하나도 없을 때 보여주는 화면
    if (entries.length === 0) {
        return (
            <HistoryContainer>
                <Header>
                    <Title>감정 기록 히스토리</Title>
                    <Subtitle>과거의 감정 기록을 확인해보세요</Subtitle>
                </Header>
                <EmptyState>
                    아직 감정 기록이 없습니다. 첫 번째 감정을 기록해보세요! 😊
                </EmptyState>
            </HistoryContainer>
        );
    }

    // 기록 있을 때 정상 화면 렌더링
    return (
        <HistoryContainer>
            {/* 헤더 */}
            <Header>
                <Title>감정 기록 히스토리</Title>
                <Subtitle>과거의 감정 기록을 확인해보세요</Subtitle>
            </Header>

            {/* 뷰 모드 토글 버튼 */}
            <ViewToggle>
                <ToggleButton
                    active={viewMode === 'calendar'}
                    onClick={() => setViewMode('calendar')}
                >
                    📅 달력 보기
                </ToggleButton>
                <ToggleButton
                    active={viewMode === 'table'}
                    onClick={() => setViewMode('table')}
                >
                    📋 테이블 보기
                </ToggleButton>
            </ViewToggle>

            {/* 필터 설정 영역 */}
            <FilterSection>
                <FilterTitle>필터 설정</FilterTitle>
                <FilterGrid>
                    {/* 시작 날짜 필터 */}
                    <FilterGroup>
                        <FilterLabel>시작 날짜</FilterLabel>
                        <FilterInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </FilterGroup>

                    {/* 종료 날짜 필터 */}
                    <FilterGroup>
                        <FilterLabel>종료 날짜</FilterLabel>
                        <FilterInput
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </FilterGroup>

                    {/* 감정 선택 필터 */}
                    <FilterGroup>
                        <FilterLabel>감정 선택</FilterLabel>
                        <FilterSelect
                            value={selectedMood}
                            onChange={(e) => setSelectedMood(e.target.value)}
                        >
                            <option value="all">모든 감정</option>
                            <option value="happy">😺 행복</option>
                            <option value="playful">😸 장난스러운</option>
                            <option value="affectionate">😽 애정</option>
                            <option value="inLove">😻 사랑</option>
                            <option value="sad">😿 슬픔</option>
                            <option value="annoyed">😾 짜증</option>
                            <option value="shocked">🙀 놀람</option>
                            <option value="neutral">😐 보통</option>
                        </FilterSelect>
                    </FilterGroup>

                    {/* 필터 초기화 버튼 - 필터 적용됐을 때만 보여줌 */}
                    <FilterGroup>
                        <FilterLabel>&nbsp;</FilterLabel>
                        {hasActiveFilters && (
                            <ClearFiltersButton onClick={clearFilters}>
                                필터 초기화
                            </ClearFiltersButton>
                        )}
                    </FilterGroup>
                </FilterGrid>
            </FilterSection>

            {/* 뷰 모드에 따라 달력 또는 테이블 컴포넌트 렌더링 */}
            {viewMode === 'calendar' ? (
                <MoodCalendar entries={filteredEntries} />
            ) : (
                <MoodTable entries={filteredEntries} />
            )}

            {/* 필터가 적용됐을 때 전체 기록 대비 필터링된 기록 개수 표시 */}
            {hasActiveFilters && (
                <div style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    color: '#666',
                    fontSize: '0.9rem'
                }}>
                    총 {entries.length}개의 기록 중 {filteredEntries.length}개 표시
                </div>
            )}
        </HistoryContainer>
    );
};