import React, { useMemo } from "react";
import type { MoodEntry, MoodType } from "../types/mood";
import { MOOD_CONFIG } from "../types/mood";
import { Doughnut, Line } from "react-chartjs-2";
import styled from "styled-components";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// 통계 전체 래퍼: 반응형 2열 그리드 구성
const StatsContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 개별 차트 카드 스타일: 흰 배경 + 그림자 + 패딩
const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

// 차트 제목 스타일
const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
`;

// 감정 분석 카드 (분석 텍스트 들어가는 영역)
const AnalysisCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1; // 2열 전부 차지
`;

// 분석 카드 제목
const AnalysisTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
`;

// 분석 본문 텍스트 스타일
const AnalysisText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0.5rem 0;
  font-size: 1rem;
`;

// 감정별 요약 목록 전체 레이아웃
const MoodSummary = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

// 감정 요약 박스 스타일 (색상은 감정에 따라 다르게 적용)
const MoodItem = styled.div<{ moodColor: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ moodColor }) => moodColor}20;
  border: 1px solid ${({ moodColor }) => moodColor};
  border-radius: 8px;
  font-weight: 500;
`;

// 감정 기록 없을 때 보여주는 안내 화면 스타일
const EmptyState = styled.div`
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

interface Props {
  entries: MoodEntry[];
}

export const MoodStats: React.FC<Props> = ({ entries }) => {
  // entries가 변할 때마다 통계 계산
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    // 감정별 카운트 초기화
    const moodCounts: Record<MoodType, number> = {
      happy: 0,
      playful: 0,
      affectionate: 0,
      inLove: 0,
      sad: 0,
      annoyed: 0,
      shocked: 0,
      neutral: 0,
    };

    // 감정별 횟수 계산
    entries.forEach((entry) => {
      moodCounts[entry.mood]++;
    });

    // 가장 많이 등장한 감정 찾기
    const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) =>
        moodCounts[a[0] as MoodType] > moodCounts[b[0] as MoodType] ? a : b
    )[0] as MoodType;

    // 최근 7일 데이터만 추출 (최신순 정렬 후 slicing)
    const last7Days = entries
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7)
        .reverse();

    // 긍정 / 부정 / 중립 감정 분류
    const positiveMoods: MoodType[] = [
      "happy",
      "playful",
      "affectionate",
      "inLove",
    ];
    const negativeMoods: MoodType[] = ["sad", "annoyed", "shocked"];

    // 각 감정 카운트 계산
    const positiveCount = entries.filter((entry) =>
        positiveMoods.includes(entry.mood)
    ).length;
    const negativeCount = entries.filter((entry) =>
        negativeMoods.includes(entry.mood)
    ).length;
    const neutralCount = entries.filter(
        (entry) => entry.mood === "neutral"
    ).length;

    // 통계 객체 반환
    return {
      moodCounts,
      mostFrequentMood,
      last7Days,
      positiveCount,
      negativeCount,
      neutralCount,
      totalEntries: entries.length,
    };
  }, [entries]);

  // 감정 기록이 없으면 안내 메시지 출력
  if (!stats) {
    return (
        <EmptyState>
          아직 감정 기록이 없습니다. 감정을 기록하면 통계를 볼 수 있어요! 📊
        </EmptyState>
    );
  }

  // 도넛 차트 데이터 구성
  const doughnutData = {
    labels: Object.entries(MOOD_CONFIG).map(([, config]) => config.label),
    datasets: [
      {
        label: "감정 분포",
        data: Object.entries(MOOD_CONFIG).map(
            ([mood, ]) => stats.moodCounts[mood as MoodType]
        ),
        backgroundColor: Object.entries(MOOD_CONFIG).map(
            ([, config]) => config.color
        ),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // 라인 차트 데이터 구성 (최근 7일 감정)
  const lineData = {
    labels: stats.last7Days.map((entry) =>
        new Date(entry.date).toLocaleDateString("ko-KR", {
          month: "short",
          day: "numeric",
        })
    ),
    datasets: [
      {
        label: "감정 변화",
        data: stats.last7Days.map((entry) => {
          const moodIndex = Object.keys(MOOD_CONFIG).indexOf(entry.mood);
          return moodIndex + 1; // y축 값: 감정 인덱스 + 1
        }),
        borderColor: "#ffd966",
        backgroundColor: "rgba(255, 217, 102, 0.1)",
        tension: 0.4, // 부드러운 곡선
        fill: true,
      },
    ],
  };

  // 감정 분석 문장 생성 함수
  const generateAnalysis = () => {
    const { mostFrequentMood, positiveCount, negativeCount, totalEntries } =
        stats;
    const positiveRatio = (positiveCount / totalEntries) * 100;
    const negativeRatio = (negativeCount / totalEntries) * 100;

    let analysis = `총 ${totalEntries}일간의 감정 기록을 분석한 결과입니다.\n\n`;

    analysis += `🎯 가장 많이 느낀 감정: ${MOOD_CONFIG[mostFrequentMood].emoji} ${MOOD_CONFIG[mostFrequentMood].label}\n\n`;

    // 긍정, 부정 감정 비율 분석 문구 추가
    if (positiveRatio > 60) {
      analysis += `✨ 긍정적인 감정이 ${positiveRatio.toFixed(
          1
      )}%로 높게 나타났어요! 이번 기간은 기분이 좋았던 날이 많았네요.\n\n`;
    } else if (negativeRatio > 40) {
      analysis += `😔 부정적인 감정이 ${negativeRatio.toFixed(
          1
      )}%로 나타났어요. 힘든 시간을 보내고 계신 것 같아요.\n\n`;
    } else {
      analysis += `😊 감정이 비교적 균형잡혀 있어요. 긍정적 감정 ${positiveRatio.toFixed(
          1
      )}%, 부정적 감정 ${negativeRatio.toFixed(1)}%\n\n`;
    }

    // 최근 감정 추가
    if (stats.last7Days.length > 0) {
      const recentMood = stats.last7Days[stats.last7Days.length - 1];
      analysis += `📅 최근 감정: ${MOOD_CONFIG[recentMood.mood].emoji} ${
          MOOD_CONFIG[recentMood.mood].label
      }`;
    }

    return analysis;
  };

  return (
      <>
        <StatsContainer>
          {/* 도넛 차트 카드 */}
          <ChartCard>
            <ChartTitle>감정 분포</ChartTitle>
            <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
            />
          </ChartCard>

          {/* 라인 차트 카드 */}
          <ChartCard>
            <ChartTitle>최근 7일 감정 변화</ChartTitle>
            <Line
                data={lineData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 8,
                      ticks: {
                        stepSize: 1,
                        // y축 라벨을 이모지로 변환
                        callback: function (value) {
                          const moods = Object.keys(MOOD_CONFIG);
                          return moods[Number(value) - 1]
                              ? MOOD_CONFIG[moods[Number(value) - 1] as MoodType]
                                  .emoji
                              : "";
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
            />
          </ChartCard>
        </StatsContainer>

        {/* 감정 분석 카드 */}
        <AnalysisCard>
          <AnalysisTitle>감정 분석</AnalysisTitle>

          {/* 감정별 요약 목록 */}
          <MoodSummary>
            {Object.entries(stats.moodCounts)
                .filter(([, count]) => count > 0)
                .map(([mood, count]) => (
                    <MoodItem
                        key={mood}
                        moodColor={MOOD_CONFIG[mood as MoodType].color}
                    >
                      <span>{MOOD_CONFIG[mood as MoodType].emoji}</span>
                      <span>{MOOD_CONFIG[mood as MoodType].label}</span>
                      <span>({count})</span>
                    </MoodItem>
                ))}
          </MoodSummary>

          {/* 분석 텍스트 출력 */}
          <AnalysisText style={{ whiteSpace: "pre-line" }}>
            {generateAnalysis()}
          </AnalysisText>
        </AnalysisCard>
      </>
  );
};