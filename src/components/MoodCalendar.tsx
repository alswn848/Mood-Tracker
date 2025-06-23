import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarWrapper = styled.div`
    max-width: 700px;
    margin: 2rem auto;
    border: 1px solid #ddd;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);

    .react-calendar {
        width: 100%;
        border: none;
        font-family: 'Pretendard', sans-serif;
        border-radius: 12px;
    }

    /* 요일 헤더 스타일 - 간격 크게, 텍스트 크기 키우고 가운데 정렬 */
    .react-calendar__month-view__weekdays__weekday {
        padding: 15px ;
        font-weight: 700;
        font-size: 1.1rem;
        color: #b45309; /* 노란색 계열 */
        text-align: center;
        width: 14.28%; /* 7등분해서 딱 맞게 */
    }

    /* 날짜 타일 넓히고 패딩 늘림 */
    .react-calendar__tile {
        padding: 20px 5px;
        margin: 6px 14px;
        background: none;
        text-align: center;
        line-height: 20px;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* 날짜 타일 호버 & 포커스 */
    .react-calendar__tile:hover,
    .react-calendar__tile:focus {
        background: #fef3c7;
        color: #b45309;
        cursor: pointer;
        outline: none;
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

export const MoodCalendar = () => {
    const [value, setValue] = useState<Value>(new Date());

    const handleChange = (val: Value) => {
        setValue(val);
    };

    return (
        <CalendarWrapper>
            <Calendar
                onChange={handleChange}
                value={value}
                calendarType="iso8601"
                locale="ko-KR"
            />
        </CalendarWrapper>
    );
};