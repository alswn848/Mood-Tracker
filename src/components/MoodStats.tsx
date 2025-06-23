import React from 'react';
import type { MoodEntry } from '../types/mood';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartWrapper = styled.div`
    max-width: 400px;
    margin: 2rem auto;
`;

interface Props {
    entries: MoodEntry[];
}

export const MoodStats: React.FC<Props> = ({ entries }) => {
    const moodCounts: Record<string, number> = { happy: 0, neutral: 0, sad: 0 };

    entries.forEach((entry) => {
        if (entry.mood === 'happy') moodCounts.happy++;
        else if (entry.mood === 'sad') moodCounts.sad++;
        else moodCounts.neutral++; // 그 외 감정은 중립으로 처리
    });

    const data = {
        labels: ['😊 행복', '😐 보통', '😞 슬픔'],
        datasets: [
            {
                label: '감정 분포',
                data: [moodCounts.happy, moodCounts.neutral, moodCounts.sad],
                backgroundColor: ['#ffd966', '#e0e0e0', '#cce5ff'],
            },
        ],
    };

    return (
        <ChartWrapper>
            <Doughnut data={data} />
        </ChartWrapper>
    );
};