import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MoodStats } from '../components/MoodStats';  // 감정 통계 차트 컴포넌트
import type { MoodEntry } from '../types/mood';       // 감정 기록 타입
import { loadMoodEntries } from '../utils/storage';   // 저장소에서 감정 기록 불러오는 함수

// 스타일 컴포넌트들 선언 - 최대 너비, 중앙 정렬, 여백 등
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

// 기간 타입 선언 - 존나 직관적임
type Period = '7days' | '30days' | '90days' | 'all' | 'custom';

export const Stats: React.FC = () => {
    // 전체 기록 상태
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    // 선택된 분석 기간 상태 (기본 30일)
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('30days');
    // 커스텀 시작, 종료 날짜 상태
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    // 필터링된 기록 상태 (선택 기간에 따른 필터 결과)
    const [filteredEntries, setFilteredEntries] = useState<MoodEntry[]>([]);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트 마운트 시 로컬 저장소에서 기록 불러오기
    useEffect(() => {
        const loadData = () => {
            try {
                const savedEntries = loadMoodEntries();
                setEntries(savedEntries);  // 불러온 기록 상태에 세팅
            } catch (error) {
                console.error('Failed to load entries:', error);
            } finally {
                setIsLoading(false);       // 불러오기 끝났으면 로딩 끔
            }
        };

        loadData();
    }, []);

    // 선택된 기간 혹은 커스텀 기간이 바뀔 때마다 기록 필터링 처리
    useEffect(() => {
        const filterEntriesByPeriod = () => {
            if (entries.length === 0) {
                setFilteredEntries([]); // 기록 없으면 빈 배열 세팅
                return;
            }

            const now = new Date();
            let startDate: Date;

            // 기간별 필터 기준일 계산
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
                    // 커스텀 기간 지정 시 날짜가 모두 있으면 필터링, 없으면 전체 반환
                    if (customStartDate && customEndDate) {
                        const filtered = entries.filter(entry =>
                            entry.date >= customStartDate && entry.date <= customEndDate
                        );
                        setFilteredEntries(filtered);
                        return; // 커스텀은 여기서 끝내버림
                    }
                    setFilteredEntries(entries);
                    return;
                case 'all':
                default:
                    // 전체 기간 선택 시 전체 기록 반환
                    setFilteredEntries(entries);
                    return;
            }

            // 기간 기준일을 ISO 문자열 YYYY-MM-DD 형식으로 변환
            const startDateString = startDate.toISOString().slice(0, 10);
            // 기준일 이후 기록만 필터링
            const filtered = entries.filter(entry => entry.date >= startDateString);
            setFilteredEntries(filtered);
        };

        filterEntriesByPeriod();
    }, [entries, selectedPeriod, customStartDate, customEndDate]);

    // 커스텀 기간 적용 버튼 눌렀을 때
    const applyCustomPeriod = () => {
        if (customStartDate && customEndDate) {
            setSelectedPeriod('custom'); // 선택 기간을 커스텀으로 변경해 필터링 트리거
        }
    };

    // 로딩 중일 때 보여줄 화면
    if (isLoading) {
        return (
            <StatsContainer>
                <EmptyState>데이터를 불러오는 중...</EmptyState>
            </StatsContainer>
        );
    }

    // 기록이 없으면 빈 상태 메시지 보여주기
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

    // 정상적인 메인 렌더링 부분
    return (
        <StatsContainer>
            <Header>
                <Title>감정 통계</Title>
                <Subtitle>감정 변화와 패턴을 분석해보세요</Subtitle>
            </Header>

            {/* 기간 선택 UI */}
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

                {/* 커스텀 기간 입력 UI */}
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

            {/* 필터링된 기록을 기반으로 통계 컴포넌트 렌더링 */}
            <MoodStats entries={filteredEntries} />

            {/* 선택 기간 및 필터된 데이터 수 표시 */}
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