import React from 'react';
import styled from 'styled-components';
import { EmojiSelector } from './EmojiSelector';
import type { MoodType } from '../types/mood';
import { MOOD_CONFIG } from '../types/mood';

interface MoodInputProps {
    note: string;
    setNote: React.Dispatch<React.SetStateAction<string>>;
    selectedMood: MoodType | null;
    setSelectedMood: (mood: MoodType | null) => void;
    saveEntry: () => void;
    isLoading?: boolean;
}

const Wrapper = styled.div`
    width: 70%;
    margin: 2rem auto;
    padding: 2rem 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h3`
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
`;

const NoteInput = styled.textarea`
    width: 100%;
    height: 120px;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({ value }) => {
            if (!value) return '#ffd966';
            return '#ffd966';
        }};
        box-shadow: 0 0 0 3px rgba(255, 217, 102, 0.1);
    }

    &::placeholder {
        color: #999;
    }
`;

const SaveButton = styled.button<{ isLoading: boolean; hasMood: boolean }>`
    width: 100%;
    padding: 1rem;
    background-color: ${({ hasMood, isLoading }) => 
        isLoading ? '#ccc' : hasMood ? '#ffd966' : '#e0e0e0'};
    border: none;
    font-weight: bold;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: ${({ isLoading, hasMood }) => 
        isLoading ? 'not-allowed' : hasMood ? 'pointer' : 'not-allowed'};
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        ${({ isLoading, hasMood }) => 
            !isLoading && hasMood && `
                background-color: #ffcc00;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 217, 102, 0.3);
            `
        }
    }

    &:active {
        transform: translateY(0);
    }
`;

const LoadingSpinner = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const SelectedMoodDisplay = styled.div<{ moodColor: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    margin-bottom: 1rem;
    background: ${({ moodColor }) => moodColor}20;
    border: 2px solid ${({ moodColor }) => moodColor};
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
`;

export const MoodInput: React.FC<MoodInputProps> = ({
    note,
    setNote,
    selectedMood,
    setSelectedMood,
    saveEntry,
    isLoading = false,
}) => {
    const handleSave = () => {
        if (!isLoading && selectedMood) {
            saveEntry();
        }
    };

    return (
        <Wrapper>
            <Title>오늘의 감정을 기록해보세요</Title>
            
            <EmojiSelector selected={selectedMood} onSelect={setSelectedMood} />
            
            {selectedMood && (
                <SelectedMoodDisplay moodColor={MOOD_CONFIG[selectedMood].color}>
                    <span style={{ marginRight: '0.5rem', fontSize: '1.5rem' }}>
                        {MOOD_CONFIG[selectedMood].emoji}
                    </span>
                    {MOOD_CONFIG[selectedMood].label}을(를) 선택하셨네요!
                </SelectedMoodDisplay>
            )}
            
            <NoteInput
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="오늘 하루는 어땠나요? 특별한 일이 있었나요? (선택사항)"
                disabled={isLoading}
            />
            
            <SaveButton 
                onClick={handleSave}
                isLoading={isLoading}
                hasMood={!!selectedMood}
                disabled={isLoading || !selectedMood}
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        저장 중...
                    </>
                ) : (
                    '감정 기록하기'
                )}
            </SaveButton>
        </Wrapper>
    );
};