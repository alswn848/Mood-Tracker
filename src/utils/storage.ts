// import { MoodEntry } from "../types/mood";

// const STORAGE_KEY = 'moodEntries';

// export function saveMoodEntry(entry: MoodEntry): void {
//   const current = getMoodEntries();
//   current.push(entry);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
// }

// export function getMoodEntries(): MoodEntry[] {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// export function getSortedMoodEntries(): MoodEntry[] {
//   return getMoodEntries().sort((a, b) => (a.date < b.date ? 1 : -1));
// }

// export function clearMoodEntries(): void {
//   localStorage.removeItem(STORAGE_KEY);
// }