import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MoodCalendar } from './components/MoodCalendar';
import { MoodStats } from './components/MoodStats';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/calendar" element={<MoodCalendar entries={[]} />} />
                    <Route path="/stats" element={<MoodStats entries={[]} />} /> {/* entries는 추후 props 연결 */}
                </Routes>
            </div>
        </div>
    );
};

export default App;