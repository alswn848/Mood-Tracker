import React from 'react';
import styled from 'styled-components';
import { EmojiSelector } from './EmojiSelector';
import type { MoodType } from '../types/mood';
import { MOOD_CONFIG } from '../types/mood';

// 컴포넌트 Props 타입 정의
interface MoodInputProps {
    note: string; // 입력된 메모 문자열
    setNote: React.Dispatch<React.SetStateAction<string>>; // 메모 업데이트 함수
    selectedMood: MoodType | null; // 현재 선택된 감정
    setSelectedMood: (mood: MoodType | null) => void; // 감정 선택 상태 변경 함수
    saveEntry: () => void; // 저장 동작 함수
    isLoading?: boolean; // 저장 중 여부
}

// 전체 컴포넌트를 감싸는 박스 스타일
const Wrapper = styled.div`
    width: 70%;
    margin: 2rem auto;
    padding: 2rem 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

// 타이틀 텍스트 스타일
const Title = styled.h3`
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
`;

// 메모 입력 textarea 스타일
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

    // 포커스 시 테두리 강조
    &:focus {
        outline: none;
        border-color: ${({ value }) => {
            if (!value) return '#ffd966'; // 입력값 여부에 관계없이 노란색
            return '#ffd966';
        }};
        box-shadow: 0 0 0 3px rgba(255, 217, 102, 0.1);
    }

    // placeholder 스타일
    &::placeholder {
        color: #999;
    }
`;

// 저장 버튼 스타일
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

    // hover 효과 - 저장 가능 상태일 때만 적용
    &:hover {
        ${({ isLoading, hasMood }) =>
                !isLoading && hasMood && `
                background-color: #ffcc00;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 217, 102, 0.3);
            `
        }
    }

    // 클릭 시 눌리는 느낌
    &:active {
        transform: translateY(0);
    }
`;

// 저장 중 로딩 스피너 애니메이션 스타일
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

// 선택된 감정을 강조해서 보여주는 박스
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

// 메인 컴포넌트 정의
export const MoodInput: React.FC<MoodInputProps> = ({
                                                        note,
                                                        setNote,
                                                        selectedMood,
                                                        setSelectedMood,
                                                        saveEntry,
                                                        isLoading = false,
                                                    }) => {
    // 저장 버튼 클릭 핸들러
    const handleSave = () => {
        if (!isLoading && selectedMood) {
            saveEntry();
        }
    };

    return (
        <Wrapper>
            {/* 제목 */}
            <Title>오늘의 감정을 기록해보세요</Title>

            {/* 감정 선택 이모지 컴포넌트 */}
            <EmojiSelector selected={selectedMood} onSelect={setSelectedMood} />

            {/* 감정이 선택되었을 경우, 감정 이름과 이모지를 보여줌 */}
            {selectedMood && (
                <SelectedMoodDisplay moodColor={MOOD_CONFIG[selectedMood].color}>
                    <span style={{ marginRight: '0.5rem', fontSize: '1.5rem' }}>
                        {MOOD_CONFIG[selectedMood].emoji}
                    </span>
                    {MOOD_CONFIG[selectedMood].label}을(를) 선택하셨네요!
                </SelectedMoodDisplay>
            )}

            {/* 메모 입력창 */}
            <NoteInput
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="오늘 하루는 어땠나요? 특별한 일이 있었나요? (선택사항)"
                disabled={isLoading}
            />

            {/* 감정 저장 버튼 */}
            <SaveButton
                onClick={handleSave}
                isLoading={isLoading}
                hasMood={!!selectedMood}
                disabled={isLoading || !selectedMood}
            >
                {/* 저장 중이면 로딩 스피너 출력 */}
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