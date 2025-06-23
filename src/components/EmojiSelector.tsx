import React from 'react';
import styled from 'styled-components';
import type { MoodType } from '../types/mood';

interface Props {
    selected: MoodType | null;
    onSelect: (mood: MoodType) => void;
}

const EmojiRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const EmojiButton = styled.button<{ selected: boolean }>`
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    background-color: ${({ selected }) => (selected ? '#ffd966' : 'transparent')};

    &:hover {
        transform: scale(1.2);
    }
`;

const emojis: Record<MoodType, string> = {
    happy: '😺',
    playful: '😸',
    affectionate: '😽',
    inLove: '😻',
    sad: '😿',
    annoyed: '😾',
    shocked: '🙀',
    neutral: '😐',
};

export const EmojiSelector: React.FC<Props> = ({ selected, onSelect }) => {
    return (
        <EmojiRow>
            {Object.entries(emojis).map(([mood, emoji]) => {
                const moodKey = mood as MoodType;
                return (
                    <EmojiButton
                        key={mood}
                        selected={selected === moodKey}
                        onClick={() => onSelect(moodKey)}
                    >
                        {emoji}
                    </EmojiButton>
                );
            })}
        </EmojiRow>
    );
};