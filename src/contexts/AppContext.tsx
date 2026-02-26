import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { NativeLang } from '@/i18n/translations';

export const PETS = [
  { id: 'cat', emoji: '🐱', name: 'Gato' },
  { id: 'dog', emoji: '🐶', name: 'Cachorro' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'rabbit', emoji: '🐰', name: 'Coelho' },
  { id: 'fox', emoji: '🦊', name: 'Raposa' },
];

export const COURSES = [
  { id: 'en', name: 'Inglês', flag: '🇺🇸', emoji: '🗽' },
  { id: 'es', name: 'Espanhol', flag: '🇪🇸', emoji: '💃' },
  { id: 'fr', name: 'Francês', flag: '🇫🇷', emoji: '🗼' },
  { id: 'de', name: 'Alemão', flag: '🇩🇪', emoji: '🏰' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹', emoji: '🍕' },
  { id: 'ja', name: 'Japonês', flag: '🇯🇵', emoji: '🗾' },
];

export const TITLES = [
  { minXp: 0, titleKey: 'title_beginner', emoji: '🌱' },
  { minXp: 100, titleKey: 'title_traveler', emoji: '✈️' },
  { minXp: 300, titleKey: 'title_explorer', emoji: '🧭' },
  { minXp: 600, titleKey: 'title_adventurer', emoji: '⛰️' },
  { minXp: 1000, titleKey: 'title_master', emoji: '🎓' },
  { minXp: 2000, titleKey: 'title_legend', emoji: '👑' },
];

export type Stage = 'welcome' | 'language' | 'course' | 'quiz' | 'app';
export type TabId = 'home' | 'curiosities' | 'dictionary' | 'community' | 'exercises';

interface Mission {
  id: number;
  textKey: string;
  target: number;
  progress: number;
  xpReward: number;
  done: boolean;
}

interface AppState {
  stage: Stage;
  nativeLang: NativeLang;
  course: string;
  level: string;
  xp: number;
  streak: number;
  pet: string;
  name: string;
  darkMode: boolean;
  activeTab: TabId;
  diary: string;
  petMood: 'idle' | 'happy' | 'sad' | 'dancing';
  exercisesDone: number;
  correctStreak: number;
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
}

interface AppContextType extends AppState {
  setStage: (s: Stage) => void;
  setNativeLang: (l: NativeLang) => void;
  setCourse: (c: string) => void;
  setLevel: (l: string) => void;
  addXp: (n: number) => void;
  setPet: (p: string) => void;
  setName: (n: string) => void;
  setDarkMode: (d: boolean) => void;
  setActiveTab: (t: TabId) => void;
  setDiary: (d: string) => void;
  setPetMood: (m: 'idle' | 'happy' | 'sad' | 'dancing') => void;
  completeExercise: (correct: boolean) => void;
  resetProgress: () => void;
  getTitle: () => { titleKey: string; emoji: string; nextXp: number; progress: number };
  getPetEmoji: () => string;
}

const defaultMissions: { daily: Mission[]; weekly: Mission[] } = {
  daily: [
    { id: 1, textKey: 'mission_3exercises', target: 3, progress: 0, xpReward: 20, done: false },
    { id: 2, textKey: 'mission_5streak', target: 5, progress: 0, xpReward: 30, done: false },
    { id: 3, textKey: 'mission_curiosities', target: 1, progress: 0, xpReward: 10, done: false },
  ],
  weekly: [
    { id: 1, textKey: 'mission_20exercises', target: 20, progress: 0, xpReward: 100, done: false },
    { id: 2, textKey: 'mission_3daystreak', target: 3, progress: 0, xpReward: 150, done: false },
  ],
};

const STORAGE_KEY = 'planicchio_state';

const defaultState: AppState = {
  stage: 'welcome',
  nativeLang: 'pt',
  course: '',
  level: 'A1',
  xp: 0,
  streak: 1,
  pet: 'cat',
  name: 'Estudante',
  darkMode: false,
  activeTab: 'home',
  diary: '',
  petMood: 'idle',
  exercisesDone: 0,
  correctStreak: 0,
  dailyMissions: defaultMissions.daily,
  weeklyMissions: defaultMissions.weekly,
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed, petMood: 'idle' };
      }
    } catch {}
    return defaultState;
  });

  useEffect(() => {
    const { petMood, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const update = useCallback((partial: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const completeExercise = useCallback((correct: boolean) => {
    setState(prev => {
      const newStreak = correct ? prev.correctStreak + 1 : 0;
      const xpGain = correct ? 10 : 0;
      const newDaily = prev.dailyMissions.map(m => {
        if (m.id === 1 && !m.done) {
          const p = m.progress + 1;
          return { ...m, progress: p, done: p >= m.target };
        }
        if (m.id === 2 && !m.done && correct) {
          const p = newStreak;
          return { ...m, progress: Math.min(p, m.target), done: p >= m.target };
        }
        return m;
      });
      const newWeekly = prev.weeklyMissions.map(m => {
        if (m.id === 1 && !m.done) {
          const p = m.progress + 1;
          return { ...m, progress: p, done: p >= m.target };
        }
        return m;
      });
      const missionXp = [...newDaily, ...newWeekly]
        .filter((m, i) => {
          const old = [...prev.dailyMissions, ...prev.weeklyMissions][i];
          return m.done && !old?.done;
        })
        .reduce((sum, m) => sum + m.xpReward, 0);

      return {
        ...prev,
        xp: prev.xp + xpGain + missionXp,
        exercisesDone: prev.exercisesDone + 1,
        correctStreak: newStreak,
        petMood: correct ? 'happy' : 'sad',
        dailyMissions: newDaily,
        weeklyMissions: newWeekly,
      };
    });
    setTimeout(() => setState(prev => ({ ...prev, petMood: 'idle' })), 1200);
  }, []);

  const getTitle = useCallback(() => {
    let current = TITLES[0];
    let next = TITLES[1];
    for (let i = TITLES.length - 1; i >= 0; i--) {
      if (state.xp >= TITLES[i].minXp) {
        current = TITLES[i];
        next = TITLES[i + 1] || TITLES[i];
        break;
      }
    }
    const range = next.minXp - current.minXp || 1;
    const progress = Math.min(((state.xp - current.minXp) / range) * 100, 100);
    return { titleKey: current.titleKey, emoji: current.emoji, nextXp: next.minXp, progress };
  }, [state.xp]);

  const getPetEmoji = useCallback(() => {
    return PETS.find(p => p.id === state.pet)?.emoji || '🐱';
  }, [state.pet]);

  const value: AppContextType = {
    ...state,
    setStage: (s) => update({ stage: s }),
    setNativeLang: (l) => update({ nativeLang: l }),
    setCourse: (c) => update({ course: c }),
    setLevel: (l) => update({ level: l }),
    addXp: (n) => update({ xp: state.xp + n }),
    setPet: (p) => update({ pet: p }),
    setName: (n) => update({ name: n }),
    setDarkMode: (d) => update({ darkMode: d }),
    setActiveTab: (t) => update({ activeTab: t }),
    setDiary: (d) => update({ diary: d }),
    setPetMood: (m) => {
      update({ petMood: m });
      if (m !== 'idle') setTimeout(() => update({ petMood: 'idle' }), 1200);
    },
    completeExercise,
    resetProgress: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(defaultState);
    },
    getTitle,
    getPetEmoji,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
