import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Stats } from './pages/Stats';
import { Navbar } from './components/Navbar';
import type { MoodEntry } from './types/mood';
import { loadMoodEntries } from './utils/storage';

const App: React.FC = () => {
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 앱 시작 시 로컬 스토리지에서 데이터 로드
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

    // 전역 상태 업데이트 함수
    const updateEntries = (newEntries: MoodEntry[]) => {
        setEntries(newEntries);
    };

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

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem' }}>
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