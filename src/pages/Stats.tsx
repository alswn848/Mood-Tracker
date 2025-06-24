import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MoodStats } from '../components/MoodStats';
import type { MoodEntry } from '../types/mood';
import { loadMoodEntries } from '../utils/storage';

const StatsContainer = styled.div`
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

const PeriodSelector = styled.div`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
`;

const PeriodTitle = styled.h3`
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.2rem;
`;

const PeriodButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
`;

const PeriodButton = styled.button<{ active: boolean }>`
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

const CustomPeriodSection = styled.div`
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
`;

const DateInputs = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
`;

const DateInput = styled.input`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
`;

const ApplyButton = styled.button`
    padding: 0.5rem 1rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;

    &:hover {
        background: #218838;
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

type Period = '7days' | '30days' | '90days' | 'all' | 'custom';

export const Stats: React.FC = () => {
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('30days');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [filteredEntries, setFilteredEntries] = useState<MoodEntry[]>([]);
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

    // 기간별 필터링
    useEffect(() => {
        const filterEntriesByPeriod = () => {
            if (entries.length === 0) {
                setFilteredEntries([]);
                return;
            }

            const now = new Date();
            let startDate: Date;

            switch (selectedPeriod) {
                case '7days':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30days':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case '90days':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                case 'custom':
                    if (customStartDate && customEndDate) {
                        const filtered = entries.filter(entry => 
                            entry.date >= customStartDate && entry.date <= customEndDate
                        );
                        setFilteredEntries(filtered);
                        return;
                    }
                    setFilteredEntries(entries);
                    return;
                case 'all':
                default:
                    setFilteredEntries(entries);
                    return;
            }

            const startDateString = startDate.toISOString().slice(0, 10);
            const filtered = entries.filter(entry => entry.date >= startDateString);
            setFilteredEntries(filtered);
        };

        filterEntriesByPeriod();
    }, [entries, selectedPeriod, customStartDate, customEndDate]);

    // 커스텀 기간 적용
    const applyCustomPeriod = () => {
        if (customStartDate && customEndDate) {
            setSelectedPeriod('custom');
        }
    };

    if (isLoading) {
        return (
            <StatsContainer>
                <EmptyState>데이터를 불러오는 중...</EmptyState>
            </StatsContainer>
        );
    }

    if (entries.length === 0) {
        return (
            <StatsContainer>
                <Header>
                    <Title>감정 통계</Title>
                    <Subtitle>감정 변화와 패턴을 분석해보세요</Subtitle>
                </Header>
                <EmptyState>
                    아직 감정 기록이 없습니다. 감정을 기록하면 통계를 볼 수 있어요! 📊
                </EmptyState>
            </StatsContainer>
        );
    }

    return (
        <StatsContainer>
            <Header>
                <Title>감정 통계</Title>
                <Subtitle>감정 변화와 패턴을 분석해보세요</Subtitle>
            </Header>

            <PeriodSelector>
                <PeriodTitle>분석 기간 선택</PeriodTitle>
                <PeriodButtons>
                    <PeriodButton 
                        active={selectedPeriod === '7days'} 
                        onClick={() => setSelectedPeriod('7days')}
                    >
                        최근 7일
                    </PeriodButton>
                    <PeriodButton 
                        active={selectedPeriod === '30days'} 
                        onClick={() => setSelectedPeriod('30days')}
                    >
                        최근 30일
                    </PeriodButton>
                    <PeriodButton 
                        active={selectedPeriod === '90days'} 
                        onClick={() => setSelectedPeriod('90days')}
                    >
                        최근 90일
                    </PeriodButton>
                    <PeriodButton 
                        active={selectedPeriod === 'all'} 
                        onClick={() => setSelectedPeriod('all')}
                    >
                        전체 기간
                    </PeriodButton>
                </PeriodButtons>

                <CustomPeriodSection>
                    <PeriodTitle>사용자 지정 기간</PeriodTitle>
                    <DateInputs>
                        <DateInput
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            placeholder="시작 날짜"
                        />
                        <span>~</span>
                        <DateInput
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            placeholder="종료 날짜"
                        />
                        <ApplyButton onClick={applyCustomPeriod}>
                            적용
                        </ApplyButton>
                    </DateInputs>
                </CustomPeriodSection>
            </PeriodSelector>

            <MoodStats entries={filteredEntries} />

            {selectedPeriod !== 'all' && (
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '2rem', 
                    color: '#666',
                    fontSize: '0.9rem'
                }}>
                    {selectedPeriod === 'custom' 
                        ? `${customStartDate} ~ ${customEndDate} 기간의 통계`
                        : `최근 ${selectedPeriod === '7days' ? '7일' : selectedPeriod === '30days' ? '30일' : '90일'} 통계`
                    }
                    {` (총 ${entries.length}개 중 ${filteredEntries.length}개)`}
                </div>
            )}
        </StatsContainer>
    );
};
