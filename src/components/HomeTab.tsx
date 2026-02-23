import { useApp, COURSES } from '@/contexts/AppContext';
import { Flame, Trophy, Star, Zap, Gamepad2, Brain, Ear, Search } from 'lucide-react';

const minigames = [
  { id: 'memory', name: 'Memória', emoji: '🃏', desc: 'Encontre os pares', icon: Brain },
  { id: 'quiz', name: 'Quiz Rápido', emoji: '⚡', desc: 'Teste rápido', icon: Zap },
  { id: 'words', name: 'Caça Palavras', emoji: '🔍', desc: 'Encontre palavras', icon: Search },
  { id: 'listen', name: 'Ouvir', emoji: '👂', desc: 'Treine o ouvido', icon: Ear },
];

const HomeTab = () => {
  const { name, streak, xp, level, course, getTitle, dailyMissions, weeklyMissions, setActiveTab } = useApp();
  const title = getTitle();
  const courseName = COURSES.find(c => c.id === course)?.name || 'Idioma';

  return (
    <div className="space-y-5 pb-4">
      {/* Welcome */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground shadow-lg">
        <p className="text-sm opacity-80">Bem-vindo de volta! 👋</p>
        <h2 className="text-2xl font-black">{name}</h2>
        <p className="text-sm opacity-80 mt-1">{courseName} · Nível {level}</p>
      </div>

      {/* Streak & XP */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <Flame className="mx-auto text-primary mb-1" size={28} />
          <span className="text-3xl font-black text-foreground">{streak}</span>
          <p className="text-xs text-muted-foreground font-bold">dias de streak 🔥</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <Star className="mx-auto text-primary mb-1" size={28} />
          <span className="text-3xl font-black text-foreground">{xp}</span>
          <p className="text-xs text-muted-foreground font-bold">XP total ⭐</p>
        </div>
      </div>

      {/* Level/Title */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{title.emoji}</span>
            <div>
              <p className="font-black text-foreground">{title.title}</p>
              <p className="text-xs text-muted-foreground">{xp}/{title.nextXp} XP para subir</p>
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
        <h3 className="font-black text-foreground mb-2 flex items-center gap-2">📋 Missões Diárias</h3>
        <div className="space-y-2">
          {dailyMissions.map(m => (
            <div key={m.id} className={`bg-card rounded-xl p-3 border border-border flex items-center justify-between ${m.done ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">{m.done ? '✅' : '⬜'} {m.text}</p>
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
        <h3 className="font-black text-foreground mb-2 flex items-center gap-2">🗓️ Missões Semanais</h3>
        <div className="space-y-2">
          {weeklyMissions.map(m => (
            <div key={m.id} className={`bg-card rounded-xl p-3 border border-border flex items-center justify-between ${m.done ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <p className="font-bold text-sm text-foreground">{m.done ? '✅' : '⬜'} {m.text}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min((m.progress / m.target) * 100, 100)}%` }} />
                </div>
              </div>
              <span className="text-xs font-bold text-primary ml-3">+{m.xpReward} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Minigames */}
      <div>
        <h3 className="font-black text-foreground mb-2 flex items-center gap-2"><Gamepad2 size={18} /> Minigames</h3>
        <div className="grid grid-cols-2 gap-3">
          {minigames.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveTab('exercises')}
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
