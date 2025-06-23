import React from 'react';
import styled from 'styled-components';
import { EmojiSelector } from './EmojiSelector';
import type { MoodType } from '../types/mood';

interface MoodInputProps {
    note: string;
    setNote: React.Dispatch<React.SetStateAction<string>>;
    selectedMood: MoodType | null;
    setSelectedMood: (mood: MoodType | null) => void;
    saveEntry: () => void;
}

const Wrapper = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
`;

const NoteInput = styled.textarea`
    width: 100%;
    height: 100px;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

const SaveButton = styled.button`
    width: 100%;
    padding: 0.8rem;
    background-color: #ffd966;
    border: none;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
`;

export const MoodInput: React.FC<MoodInputProps> = ({
                                                        note,
                                                        setNote,
                                                        selectedMood,
                                                        setSelectedMood,
                                                        saveEntry,
                                                    }) => {
    return (
        <Wrapper>
            <EmojiSelector selected={selectedMood} onSelect={setSelectedMood} />
            <NoteInput
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="오늘의 감정을 기록해보세요"
            />
            <SaveButton onClick={saveEntry}>기록하기</SaveButton>
        </Wrapper>
    );
};