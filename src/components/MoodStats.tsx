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

const ChartCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
`;

const AnalysisCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;
`;

const AnalysisTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
`;

const AnalysisText = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0.5rem 0;
  font-size: 1rem;
`;

const MoodSummary = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

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
  const stats = useMemo(() => {
    if (entries.length === 0) return null;

    // 감정별 카운트
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

    entries.forEach((entry) => {
      moodCounts[entry.mood]++;
    });

    // 가장 많이 나타난 감정
    const mostFrequentMood = Object.entries(moodCounts).reduce((a, b) =>
      moodCounts[a[0] as MoodType] > moodCounts[b[0] as MoodType] ? a : b
    )[0] as MoodType;

    // 최근 7일간의 감정 변화
    const last7Days = entries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .reverse();

    // 긍정적 감정과 부정적 감정 분류
    const positiveMoods: MoodType[] = [
      "happy",
      "playful",
      "affectionate",
      "inLove",
    ];
    const negativeMoods: MoodType[] = ["sad", "annoyed", "shocked"];

    const positiveCount = entries.filter((entry) =>
      positiveMoods.includes(entry.mood)
    ).length;
    const negativeCount = entries.filter((entry) =>
      negativeMoods.includes(entry.mood)
    ).length;
    const neutralCount = entries.filter(
      (entry) => entry.mood === "neutral"
    ).length;

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

  if (!stats) {
    return (
      <EmptyState>
        아직 감정 기록이 없습니다. 감정을 기록하면 통계를 볼 수 있어요! 📊
      </EmptyState>
    );
  }

  // 도넛 차트 데이터
  const doughnutData = {
    labels: Object.entries(MOOD_CONFIG).map(([_, config]) => config.label),
    datasets: [
      {
        label: "감정 분포",
        data: Object.entries(MOOD_CONFIG).map(
          ([mood, _]) => stats.moodCounts[mood as MoodType]
        ),
        backgroundColor: Object.entries(MOOD_CONFIG).map(
          ([_, config]) => config.color
        ),
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // 라인 차트 데이터 (최근 7일)
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
          return moodIndex + 1; // 1-8 스케일로 변환
        }),
        borderColor: "#ffd966",
        backgroundColor: "rgba(255, 217, 102, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 감정 분석 텍스트 생성
  const generateAnalysis = () => {
    const { mostFrequentMood, positiveCount, negativeCount, totalEntries } =
      stats;
    const positiveRatio = (positiveCount / totalEntries) * 100;
    const negativeRatio = (negativeCount / totalEntries) * 100;

    let analysis = `총 ${totalEntries}일간의 감정 기록을 분석한 결과입니다.\n\n`;

    analysis += `🎯 가장 많이 느낀 감정: ${MOOD_CONFIG[mostFrequentMood].emoji} ${MOOD_CONFIG[mostFrequentMood].label}\n\n`;

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

      <AnalysisCard>
        <AnalysisTitle>감정 분석</AnalysisTitle>
        <MoodSummary>
          {Object.entries(stats.moodCounts)
            .filter(([_, count]) => count > 0)
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
        <AnalysisText style={{ whiteSpace: "pre-line" }}>
          {generateAnalysis()}
        </AnalysisText>
      </AnalysisCard>
    </>
  );
};
