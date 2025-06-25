import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Stats } from './pages/Stats';
import { Navbar } from './components/Navbar';
import type { MoodEntry } from './types/mood';
import { loadMoodEntries } from './utils/storage';

// 최상위 앱 컴포넌트
const App: React.FC = () => {
    // 감정 기록 상태 관리
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    // 데이터 로딩 상태 관리
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트 마운트 시 로컬 스토리지에서 저장된 감정 기록 불러오기
    useEffect(() => {
        const loadData = () => {
            try {
                const savedEntries = loadMoodEntries();
                setEntries(savedEntries);
            } catch (error) {
                console.error('Failed to load entries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // 감정 기록 업데이트 함수 (자식 컴포넌트에 전달)
    const updateEntries = (newEntries: MoodEntry[]) => {
        setEntries(newEntries);
    };

    // 로딩 중일 때 표시할 화면
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                로딩 중...
            </div>
        );
    }

    // 앱 화면 렌더링
    return (
        <div>
            {/* 상단 네비게이션 바 */}
            <Navbar />
            <div style={{ padding: '2rem' }}>
                {/* 라우팅 설정 */}
                <Routes>
                    <Route
                        path="/"
                        element={<Home entries={entries} updateEntries={updateEntries} />}
                    />
                    <Route
                        path="/history"
                        element={<History />}
                    />
                    <Route
                        path="/stats"
                        element={<Stats />}
                    />
                </Routes>
            </div>
        </div>
    );
};

export default App;