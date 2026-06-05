import { useState, useMemo } from 'react';
import { useApp, COURSES } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { Flame, Trophy, Star, Gamepad2, Brain, Zap, Search, Ear, CalendarDays } from 'lucide-react';
import MemoryGame from './MemoryGame';
import QuickQuizGame from './QuickQuizGame';
import WordHuntGame from './WordHuntGame';
import ListenGame from './ListenGame';
import { generateExercises } from '@/data/wordBank';
import { weekSeed } from '@/lib/weekly';
import WeeklyCountdown from './WeeklyCountdown';

const HomeTab = () => {
  const { name, streak, xp, level, course, nativeLang, getTitle, dailyMissions, weeklyMissions, setActiveTab } = useApp();
  const tr = useTranslation(nativeLang);
  const title = getTitle();
  const courseName = COURSES.find(c => c.id === course)?.name || 'Idioma';
  const [activeMinigame, setActiveMinigame] = useState<string | null>(null);

  // Weekly challenge: pick a random category based on week number
  const weeklyChallenge = useMemo(() => {
    const cats = ['greetings', 'food', 'travel', 'work', 'daily', 'numbers', 'animals', 'colors'];
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const cat = cats[weekNum % cats.length];
    const catEmojis: Record<string, string> = { greetings: '👋', food: '🍕', travel: '✈️', work: '💼', daily: '🏠', numbers: '🔢', animals: '🐾', colors: '🎨' };
    const catKeys: Record<string, string> = { greetings: 'cat_greetings', food: 'cat_food', travel: 'cat_travel', work: 'cat_work', daily: 'cat_daily', numbers: 'cat_numbers', animals: 'cat_animals', colors: 'cat_colors' };
    return { category: cat, emoji: catEmojis[cat] || '📚', nameKey: catKeys[cat] || cat };
  }, []);

  const minigames = [
    { id: 'memory', name: tr('memory_game'), emoji: '🃏', desc: tr('memory_desc'), icon: Brain },
    { id: 'quiz', name: tr('quick_quiz'), emoji: '⚡', desc: tr('quick_quiz_desc'), icon: Zap },
    { id: 'words', name: tr('word_hunt'), emoji: '🔍', desc: tr('word_hunt_desc'), icon: Search },
    { id: 'listen', name: tr('listen'), emoji: '👂', desc: tr('listen_desc'), icon: Ear },
  ];

  if (activeMinigame === 'memory') return <MemoryGame onBack={() => setActiveMinigame(null)} />;
  if (activeMinigame === 'quiz') return <QuickQuizGame onBack={() => setActiveMinigame(null)} />;
  if (activeMinigame === 'words') return <WordHuntGame onBack={() => setActiveMinigame(null)} />;
  if (activeMinigame === 'listen') return <ListenGame onBack={() => setActiveMinigame(null)} />;

  return (
    <div className="space-y-5 pb-4">
      {/* Welcome */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground shadow-lg">
        <p className="text-sm opacity-80">{tr('welcome_back')}</p>
        <h2 className="text-2xl font-black">{name}</h2>
        <p className="text-sm opacity-80 mt-1">{courseName} · {tr('level')} {level}</p>
      </div>

      {/* Streak & XP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <Flame className="mx-auto text-primary mb-1" size={28} />
          <span className="text-3xl font-black text-foreground">{streak}</span>
          <p className="text-xs text-muted-foreground font-bold">{tr('streak_days')}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <Star className="mx-auto text-primary mb-1" size={28} />
          <span className="text-3xl font-black text-foreground">{xp}</span>
          <p className="text-xs text-muted-foreground font-bold">{tr('total_xp')}</p>
        </div>
      </div>

      {/* Level/Title */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{title.emoji}</span>
            <div>
              <p className="font-black text-foreground">{tr(title.titleKey)}</p>
              <p className="text-xs text-muted-foreground">{xp}/{title.nextXp} {tr('xp_to_level')}</p>
            </div>
          </div>
          <Trophy className="text-primary" size={24} />
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${title.progress}%` }} />
        </div>
      </div>

      {/* Daily Missions */}
      <div>
        <h3 className="font-black text-foreground mb-2 flex items-center gap-2">{tr('daily_missions')}</h3>
        <div className="space-y-2">
          {dailyMissions.map(m => (
            <div key={m.id} className={`bg-card rounded-xl p-3 border border-border flex items-center justify-between ${m.done ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">{m.done ? '✅' : '⬜'} {tr(m.textKey)}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min((m.progress / m.target) * 100, 100)}%` }} />
                </div>
              </div>
              <span className="text-xs font-bold text-primary ml-3">+{m.xpReward} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Missions */}
      <div>
        <h3 className="font-black text-foreground mb-2 flex items-center gap-2">{tr('weekly_missions')}</h3>
        <div className="space-y-2">
          {weeklyMissions.map(m => (
            <div key={m.id} className={`bg-card rounded-xl p-3 border border-border flex items-center justify-between ${m.done ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">{m.done ? '✅' : '⬜'} {tr(m.textKey)}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min((m.progress / m.target) * 100, 100)}%` }} />
                </div>
              </div>
              <span className="text-xs font-bold text-primary ml-3">+{m.xpReward} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenge */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border-2 border-primary/30">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays size={18} className="text-primary" />
          <h3 className="font-black text-foreground">{tr('weekly_challenge') || 'Desafio Semanal'}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{weeklyChallenge.emoji}</span>
          <div className="flex-1">
            <p className="font-bold text-sm text-foreground">{tr(weeklyChallenge.nameKey)}</p>
            <p className="text-xs text-muted-foreground">{tr('weekly_challenge_desc') || 'Pratique a categoria da semana!'}</p>
          </div>
          <button onClick={() => setActiveTab('exercises')}
            className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform">
            {tr('start') || 'Ir'} →
          </button>
        </div>
      </div>

      {/* Minigames */}
      <div>
        <h3 className="font-black text-foreground mb-2 flex items-center gap-2"><Gamepad2 size={18} /> {tr('minigames')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {minigames.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveMinigame(g.id)}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="text-3xl block mb-1">{g.emoji}</span>
              <p className="font-bold text-sm text-foreground">{g.name}</p>
              <p className="text-[10px] text-muted-foreground">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
