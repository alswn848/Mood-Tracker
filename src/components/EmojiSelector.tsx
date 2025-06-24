import React from 'react';
import styled from 'styled-components';
import type { MoodType } from '../types/mood';
import { MOOD_CONFIG } from '../types/mood';

interface Props {
    selected: MoodType | null;
    onSelect: (mood: MoodType) => void;
}

const EmojiRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    width: 85%;
    margin-left: auto;
    margin-right: auto;
`;

const EmojiButton = styled.button<{ selected: boolean; moodColor: string }>`
    font-size: 2.5rem;
    background: ${({ selected, moodColor }) => (selected ? moodColor : 'transparent')};
    border: 3px solid ${({ selected, moodColor }) => (selected ? moodColor : '#e0e0e0')};
    cursor: pointer;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: scale(1.1);
        background: ${({ moodColor }) => moodColor}20;
        border-color: ${({ moodColor }) => moodColor};
        box-shadow: 0 4px 12px ${({ moodColor }) => moodColor}40;
    }

    &:active {
        transform: scale(0.95);
    }

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

const MoodLabel = styled.div`
    font-size: 0.8rem;
    margin-top: 0.5rem;
    text-align: center;
    color: #666;
    font-weight: 500;
`;

const EmojiContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const EmojiSelector: React.FC<Props> = ({ selected, onSelect }) => {
    return (
        <EmojiRow>
            {Object.entries(MOOD_CONFIG).map(([mood, config]) => {
                const moodKey = mood as MoodType;
                return (
                    <EmojiContainer key={mood}>
                        <EmojiButton
                            selected={selected === moodKey}
                            moodColor={config.color}
                            onClick={() => onSelect(moodKey)}
                        >
                            {config.emoji}
                        </EmojiButton>
                        <MoodLabel>{config.label}</MoodLabel>
                    </EmojiContainer>
                );
            })}
        </EmojiRow>
    );
};