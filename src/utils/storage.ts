// src/utils/storage.ts
import type { MoodEntry } from '../types/mood';

const STORAGE_KEY = 'moodEntries';

export function saveMoodEntry(entry: MoodEntry) {
    const existing = localStorage.getItem(STORAGE_KEY);
    const entries = existing ? JSON.parse(existing) : [];
    
    // 같은 날짜의 기존 기록이 있으면 업데이트, 없으면 새로 추가
    const existingIndex = entries.findIndex((e: MoodEntry) => e.date === entry.date);
    if (existingIndex !== -1) {
        entries[existingIndex] = entry;
    } else {
        entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function loadMoodEntries(): MoodEntry[] {
    const existing = localStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
}

export function deleteMoodEntry(date: string) {
    const existing = localStorage.getItem(STORAGE_KEY);
    const entries = existing ? JSON.parse(existing) : [];
    const filteredEntries = entries.filter((entry: MoodEntry) => entry.date !== date);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
}

export function getMoodEntryByDate(date: string): MoodEntry | null {
    const entries = loadMoodEntries();
    return entries.find(entry => entry.date === date) || null;
}

export function getMoodEntriesByDateRange(startDate: string, endDate: string): MoodEntry[] {
    const entries = loadMoodEntries();
    return entries.filter(entry => entry.date >= startDate && entry.date <= endDate);
}

export function getMoodEntriesByMood(mood: string): MoodEntry[] {
    const entries = loadMoodEntries();
    return entries.filter(entry => entry.mood === mood);
}