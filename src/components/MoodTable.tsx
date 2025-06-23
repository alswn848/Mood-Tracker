import React from 'react';
import type { MoodEntry } from '../types/mood';
import styled from 'styled-components';

interface Props {
    entries: MoodEntry[];
}

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
`;

const Th = styled.th`
    border: 1px solid #ddd;
    padding: 0.8rem;
    background-color: #f5f5f5;
`;

const Td = styled.td`
    border: 1px solid #ddd;
    padding: 0.8rem;
    text-align: center;
`;

export const MoodTable: React.FC<Props> = ({ entries }) => {
    return (
        <Table>
            <thead>
            <tr>
                <Th>날짜</Th>
                <Th>감정</Th>
                <Th>메모</Th>
            </tr>
            </thead>
            <tbody>
            {entries.map((entry, index) => (
                <tr key={index}>
                    <Td>{entry.date}</Td>
                    <Td>{entry.mood}</Td>
                    <Td>{entry.note}</Td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};