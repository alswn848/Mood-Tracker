// React 및 styled-components 관련 모듈 import
import React from 'react';
import styled from 'styled-components';

// 감정 타입 정의 및 감정 구성 객체 import
import type { MoodType } from '../types/mood';
import { MOOD_CONFIG } from '../types/mood';

// Props 타입 정의
// selected: 현재 선택된 감정 (없을 수도 있으므로 null 허용)
// onSelect: 감정을 클릭했을 때 실행되는 콜백 함수
interface Props {
    selected: MoodType | null;
    onSelect: (mood: MoodType) => void;
}

// 전체 이모지 버튼들을 감싸는 가로 행 컨테이너
const EmojiRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;  // 이모지 버튼 간 간격
    margin-bottom: 1rem;
    width: 85%;
    margin-left: auto;
    margin-right: auto;  // 가운데 정렬
`;

// 감정 이모지 버튼 스타일 정의
const EmojiButton = styled.button<{ selected: boolean; moodColor: string }>`
    font-size: 2.5rem;  // 이모지 크기
    background: ${({ selected, moodColor }) => (selected ? moodColor : 'transparent')}; // 선택 시 배경색 적용
    border: 3px solid ${({ selected, moodColor }) => (selected ? moodColor : '#e0e0e0')}; // 선택 시 테두리 강조
    cursor: pointer;
    border-radius: 50%;  // 원형 버튼
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    // hover 시 확대 효과 + 부드러운 색상 변화
    &:hover {
        transform: scale(1.1);
        background: ${({ moodColor }) => moodColor}20; // 투명도 적용된 배경
        border-color: ${({ moodColor }) => moodColor};
        box-shadow: 0 4px 12px ${({ moodColor }) => moodColor}40; // 그림자 효과
    }

    // 클릭(눌림) 시 약간 축소 효과
    &:active {
        transform: scale(0.95);
    }

    // hover 시 배경에 흐르는 gradient 라인 효과 (애니메이션)
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, ${({ moodColor }) => moodColor}20, transparent);
        transition: left 0.5s ease;
    }

    &:hover::before {
        left: 100%;
    }
`;

// 이모지 아래에 감정 이름(예: 행복, 슬픔 등)을 표시하는 텍스트
const MoodLabel = styled.div`
    font-size: 0.8rem;
    margin-top: 0.5rem;
    text-align: center;
    color: #666;
    font-weight: 500;
`;

// 이모지 + 라벨을 감싸는 세로 방향 컨테이너
const EmojiContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// 이모지 선택 컴포넌트
// 감정 리스트를 순회하며 각각의 이모지 버튼 + 라벨을 렌더링
export const EmojiSelector: React.FC<Props> = ({ selected, onSelect }) => {
    return (
        <EmojiRow>
            {/* MOOD_CONFIG의 각 감정 항목을 순회 */}
            {Object.entries(MOOD_CONFIG).map(([mood, config]) => {
                const moodKey = mood as MoodType;
                return (
                    <EmojiContainer key={mood}>
                        {/* 이모지 버튼 */}
                        <EmojiButton
                            selected={selected === moodKey}  // 현재 선택 상태 여부
                            moodColor={config.color}  // 감정별 지정된 색상
                            onClick={() => onSelect(moodKey)}  // 감정 선택 시 부모에 전달
                        >
                            {config.emoji}
                        </EmojiButton>
                        {/* 감정 라벨 (예: 행복, 우울 등) */}
                        <MoodLabel>{config.label}</MoodLabel>
                    </EmojiContainer>
                );
            })}
        </EmojiRow>
    );
};