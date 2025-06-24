import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MoodCalendar } from '../components/MoodCalendar';
import { MoodTable } from '../components/MoodTable';
import type { MoodEntry } from '../types/mood';
import { loadMoodEntries } from '../utils/storage';

const HistoryContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 2rem;
`;

const Subtitle = styled.p`
    color: #666;
    font-size: 1.1rem;
`;

const ViewToggle = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    gap: 1rem;
`;

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

const FilterSection = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const FilterTitle = styled.h3`
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.2rem;
`;

const FilterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    align-items: end;
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const FilterLabel = styled.label`
    font-weight: 500;
    color: #495057;
    font-size: 0.9rem;
`;

const FilterInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
`;

const FilterSelect = styled.select`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
`;

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

const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    color: #6c757d;
    font-size: 1.1rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

type ViewMode = 'calendar' | 'table';

export const History: React.FC = () => {
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMood, setSelectedMood] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    // 데이터 로드
    useEffect(() => {
        const loadData = () => {
            try {
                const savedEntries = loadMoodEntries();
                setEntries(savedEntries);
            } catch (error) {
                console.error('Failed to load entries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // 필터링된 엔트리 계산
    const filteredEntries = entries.filter(entry => {
        const dateMatch = (!startDate || entry.date >= startDate) && 
                         (!endDate || entry.date <= endDate);
        const moodMatch = selectedMood === 'all' || entry.mood === selectedMood;
        return dateMatch && moodMatch;
    });

    // 필터 초기화
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedMood('all');
    };

    // 필터가 적용되었는지 확인
    const hasActiveFilters = startDate || endDate || selectedMood !== 'all';

    if (isLoading) {
        return (
            <HistoryContainer>
                <EmptyState>데이터를 불러오는 중...</EmptyState>
            </HistoryContainer>
        );
    }

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

    return (
        <HistoryContainer>
            <Header>
                <Title>감정 기록 히스토리</Title>
                <Subtitle>과거의 감정 기록을 확인해보세요</Subtitle>
            </Header>

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

            <FilterSection>
                <FilterTitle>필터 설정</FilterTitle>
                <FilterGrid>
                    <FilterGroup>
                        <FilterLabel>시작 날짜</FilterLabel>
                        <FilterInput
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </FilterGroup>
                    
                    <FilterGroup>
                        <FilterLabel>종료 날짜</FilterLabel>
                        <FilterInput
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </FilterGroup>
                    
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

            {viewMode === 'calendar' ? (
                <MoodCalendar entries={filteredEntries} />
            ) : (
                <MoodTable entries={filteredEntries} />
            )}

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
