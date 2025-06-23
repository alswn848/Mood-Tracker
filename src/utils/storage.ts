// src/utils/storage.ts
import type { MoodEntry } from '../types/mood';

export function saveMoodEntry(entry: MoodEntry) {
    const existing = localStorage.getItem('moodEntries');
    const entries = existing ? JSON.parse(existing) : [];
    entries.push(entry);
    localStorage.setItem('moodEntries', JSON.stringify(entries));
}