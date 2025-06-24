import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import type { MoodEntry } from '../types/mood';
import { MOOD_CONFIG } from '../types/mood';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarWrapper = styled.div`
    max-width: 100%;
    width: 100%;
    margin: 0;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 10px;

    .react-calendar {
        width: 100%;
        border: none;
        font-family: 'Pretendard', sans-serif;
        border-radius: 12px;
    }

    /* 요일 헤더 스타일 - 간격 크게, 텍스트 크기 키우고 가운데 정렬 */
    .react-calendar__month-view__weekdays__weekday {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 0;
        font-weight: 700;
        font-size: 1.1rem;
        
        text-align: center;
        width: 14.28%;
        background: none;
        border: none;
        margin-bottom: 10px;
    }

    .react-calendar__month-view__weekdays__weekday abbr {
        text-decoration: none !important;
        font-size: 1.1rem;
        color: #b45309;
        margin: 0;
        padding: 0;
        line-height: 1;
        font-weight: 700;
        display: inline-block;
    }

    /* 날짜 타일 넓히고 패딩 늘림 */
    .react-calendar__tile {
        padding: 16px 0;
        margin: 2px 0;
        background: none;
        text-align: center;
        line-height: 20px;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        transition: all 0.3s ease;
        position: relative;
        min-height: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* 날짜 타일 호버 & 포커스 */
    .react-calendar__tile:hover,
    .react-calendar__tile:focus {
        background: #fef3c7;
        color: #b45309;
        cursor: pointer;
        outline: none;
        transform: scale(1.05);
    }

    /* 선택된 날짜 */
    .react-calendar__tile--active {
        background: #facc15 !important;
        color: white !important;
        border-radius: 12px !important;
    }

    /* 오늘 날짜 강조 */
    .react-calendar__tile--now {
        background: #fef3c7 !important;
        color: #92400e !important;
        font-weight: 700;
        border-radius: 12px !important;
    }
`;

const MoodIndicator = styled.div<{ moodColor: string }>`
    position: absolute;
    top: 5px;
    right: 5px;
    width: 12px;
    height: 12px;
    background-color: ${({ moodColor }) => moodColor};
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

const MoodTooltip = styled.div<{ moodColor: string }>`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${({ moodColor }) => moodColor};
    color: white;
    padding: 0.5rem;
    border-radius: 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;

    &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: ${({ moodColor }) => moodColor};
    }
`;

const CalendarTile = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover ${MoodTooltip} {
        opacity: 1;
        visibility: visible;
    }
`;

interface Props {
    entries: MoodEntry[];
}

// 오늘 날짜를 YYYY-MM-DD (로컬)로 반환하는 함수 추가
function getLocalDateString(date: Date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}

export const MoodCalendar: React.FC<Props> = ({ entries }) => {
    const [value, setValue] = useState<Value>(new Date());

    const handleChange = (val: Value) => {
        setValue(val);
    };

    // 특정 날짜의 감정 기록 찾기
    const getMoodForDate = (date: Date): MoodEntry | null => {
        const dateString = getLocalDateString(date);
        return entries.find(entry => entry.date === dateString) || null;
    };

    // 커스텀 타일 렌더링
    const tileContent = ({ date }: { date: Date }) => {
        const moodEntry = getMoodForDate(date);
        
        return (
            <CalendarTile>
                {moodEntry && (
                    <>
                        <MoodIndicator moodColor={MOOD_CONFIG[moodEntry.mood].color} />
                        <MoodTooltip moodColor={MOOD_CONFIG[moodEntry.mood].color}>
                            {MOOD_CONFIG[moodEntry.mood].emoji} {MOOD_CONFIG[moodEntry.mood].label}
                            {moodEntry.note && ` - ${moodEntry.note}`}
                        </MoodTooltip>
                    </>
                )}
            </CalendarTile>
        );
    };

    // 날짜 클릭 핸들러
    const handleDateClick = (date: Date) => {
        const moodEntry = getMoodForDate(date);
        if (moodEntry) {
            alert(`${date.toLocaleDateString('ko-KR')}\n감정: ${MOOD_CONFIG[moodEntry.mood].emoji} ${MOOD_CONFIG[moodEntry.mood].label}\n메모: ${moodEntry.note || '메모 없음'}`);
        } else {
            alert(`${date.toLocaleDateString('ko-KR')}\n이 날짜에는 감정 기록이 없습니다.`);
        }
    };

    return (
        <CalendarWrapper>
            <Calendar
                onChange={handleChange}
                value={value}
                calendarType="iso8601"
                locale="ko-KR"
                tileContent={tileContent}
                onClickDay={handleDateClick}
                formatShortWeekday={(_, date) => ['월', '화', '수', '목', '금', '토', '일'][date.getDay() === 0 ? 6 : date.getDay() - 1]}
            />
        </CalendarWrapper>
    );
};