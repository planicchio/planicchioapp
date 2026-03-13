import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Gamepad2, Lock, MessageCircle } from 'lucide-react';
import { useApp, PETS } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { getFeedWords, getPlayWords } from '@/data/wordBank';

const petStages = [
  { minLevel: 1, label: 'Bebê', emoji: '🥚', size: 'text-6xl' },
  { minLevel: 2, label: 'Filhote', emoji: '', size: 'text-7xl' },
  { minLevel: 4, label: 'Jovem', emoji: '', size: 'text-8xl' },
  { minLevel: 7, label: 'Adulto', emoji: '', size: 'text-9xl' },
  { minLevel: 10, label: 'Mestre', emoji: '👑', size: 'text-9xl' },
];

const VIP_URL = 'https://buy.stripe.com/9B614o1gU3dXeHq7UeaMU01';

const PetTab = () => {
  const {
    pet, getPetEmoji, getPetLevel, petHunger, petEnergy, petHappiness,
    feedPet, playWithPet, nativeLang, xp, petMood, course
  } = useApp();
  const tr = useTranslation(nativeLang);
  const petLevel = getPetLevel();

  // Feed mini-game state
  const [feedMode, setFeedMode] = useState(false);
  const [feedInput, setFeedInput] = useState('');
  const [feedChallenge, setFeedChallenge] = useState<{ word: string; translation: string } | null>(null);
  const [feedResult, setFeedResult] = useState<'correct' | 'wrong' | null>(null);

  // Play mini-game state
  const [playMode, setPlayMode] = useState(false);
  const [playChallenge, setPlayChallenge] = useState<{ word: string; options: string[]; correct: number } | null>(null);
  const [playSelected, setPlaySelected] = useState<number | null>(null);

  const petEmoji = getPetEmoji();
  const petName = PETS.find(p => p.id === pet)?.name || 'Pet';

  let currentStage = petStages[0];
  for (let i = petStages.length - 1; i >= 0; i--) {
    if (petLevel >= petStages[i].minLevel) { currentStage = petStages[i]; break; }
  }

  const moodText = petMood === 'happy' ? '😊' : petMood === 'sad' ? '😢' : petMood === 'dancing' ? '💃' : '😊';

  // Use wordBank for feed/play challenges - works for ALL language combinations
  const feedWordsList = useMemo(() => getFeedWords(nativeLang, course), [nativeLang, course]);
  const playWordsList = useMemo(() => getPlayWords(course), [course]);

  const startFeed = () => {
    if (feedWordsList.length === 0) return;
    const w = feedWordsList[Math.floor(Math.random() * feedWordsList.length)];
    setFeedChallenge(w);
    setFeedInput('');
    setFeedResult(null);
    setFeedMode(true);
  };

  const submitFeed = () => {
    if (!feedChallenge || !feedInput.trim()) return;
    const correct = feedInput.trim().toLowerCase() === feedChallenge.word.toLowerCase();
    setFeedResult(correct ? 'correct' : 'wrong');
    if (correct) {
      feedPet();
    }
    setTimeout(() => { setFeedMode(false); setFeedResult(null); }, 1500);
  };

  const startPlay = () => {
    if (playWordsList.length === 0) return;
    const w = playWordsList[Math.floor(Math.random() * playWordsList.length)];
    // Shuffle options
    const opts = [...w.options];
    const correctAns = opts[w.correct];
    const shuffled = opts.sort(() => Math.random() - 0.5);
    setPlayChallenge({ word: w.word, options: shuffled, correct: shuffled.indexOf(correctAns) });
    setPlaySelected(null);
    setPlayMode(true);
  };

  const submitPlay = (idx: number) => {
    if (playSelected !== null || !playChallenge) return;
    setPlaySelected(idx);
    if (idx === playChallenge.correct) {
      playWithPet();
    }
    setTimeout(() => { setPlayMode(false); setPlaySelected(null); }, 1500);
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-foreground">{tr('my_pet') || 'Meu Pet'}</h2>
      </div>

      {/* Pet Display */}
      <div className="bg-card rounded-2xl p-6 border border-border text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative">
          {currentStage.minLevel >= 10 && (
            <motion.span className="text-3xl absolute -top-2 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>👑</motion.span>
          )}
          <motion.div className={`${currentStage.size} mb-3 inline-block`}
            animate={{ y: [0, -10, 0], rotate: petMood === 'dancing' ? [0, 5, -5, 0] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}>
            {petLevel < 2 ? '🥚' : petEmoji}
          </motion.div>
          <h3 className="text-xl font-black text-foreground">{petName}</h3>
          <p className="text-sm text-muted-foreground">
            {tr('level') || 'Nível'} {petLevel} · {currentStage.label} {moodText}
          </p>
          <div className="mt-2 inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {xp} XP {tr('total_xp') || 'total'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🍖', label: tr('hunger') || 'Fome', value: petHunger },
          { emoji: '⚡', label: tr('energy') || 'Energia', value: petEnergy },
          { emoji: '💖', label: tr('happiness') || 'Felicidade', value: petHappiness },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-3 border border-border text-center">
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-xs font-bold text-muted-foreground mt-1">{stat.label}</p>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div className="h-full rounded-full transition-all" style={{
                width: `${stat.value}%`,
                backgroundColor: stat.value > 60 ? 'hsl(var(--primary))' : stat.value > 30 ? 'orange' : 'red',
              }} />
            </div>
            <span className="text-xs font-bold text-foreground">{stat.value}%</span>
          </div>
        ))}
      </div>

      {/* Feed Mini-Game */}
      {feedMode && feedChallenge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border-2 border-primary/30">
          <p className="text-sm font-bold text-foreground mb-1">🍖 {tr('feed_challenge') || 'Escreva a palavra para alimentar!'}</p>
          <p className="text-xs text-muted-foreground mb-3">{tr('translate_word') || 'Traduza'}: <strong>{feedChallenge.translation}</strong></p>
          <input value={feedInput} onChange={e => setFeedInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitFeed()}
            placeholder={feedChallenge.word.charAt(0) + '...'}
            className={`w-full bg-muted border-2 rounded-xl px-4 py-3 text-foreground font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary ${
              feedResult === 'correct' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
              feedResult === 'wrong' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-border'
            }`}
            disabled={feedResult !== null} autoFocus />
          {feedResult === 'wrong' && (
            <p className="text-xs text-red-500 font-bold mt-2">✗ {feedChallenge.word}</p>
          )}
          {feedResult === 'correct' && (
            <p className="text-xs text-green-500 font-bold mt-2">✓ +30 {tr('hunger') || 'Fome'}!</p>
          )}
          {feedResult === null && (
            <button onClick={submitFeed} className="w-full mt-3 bg-primary text-primary-foreground font-bold py-2 rounded-xl active:scale-95 transition-transform">
              {tr('confirm') || 'Confirmar'}
            </button>
          )}
        </motion.div>
      )}

      {/* Play Mini-Game */}
      {playMode && playChallenge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border-2 border-primary/30">
          <p className="text-sm font-bold text-foreground mb-1">🎮 {tr('play_challenge') || 'Acerte para brincar!'}</p>
          <div className="text-6xl text-center my-3">{playChallenge.word}</div>
          <div className="grid grid-cols-2 gap-2">
            {playChallenge.options.map((opt, i) => {
              let bg = 'bg-muted';
              if (playSelected !== null) {
                if (i === playChallenge.correct) bg = 'bg-green-100 dark:bg-green-900/30';
                else if (i === playSelected) bg = 'bg-red-100 dark:bg-red-900/30';
              }
              return (
                <button key={i} onClick={() => submitPlay(i)}
                  className={`${bg} rounded-xl py-3 font-bold text-sm text-foreground transition-colors active:scale-95`}>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Action Buttons - ALWAYS available (no threshold blocking) */}
      {!feedMode && !playMode && (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={startFeed}
            className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 hover:shadow-md hover:border-primary/50">
            <Utensils size={24} className="text-primary" />
            <span className="font-bold text-sm text-foreground">{tr('feed') || 'Alimentar'}</span>
            <span className="text-[10px] text-muted-foreground">+30 {tr('hunger') || 'Fome'}</span>
          </button>
          <button onClick={startPlay}
            className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 hover:shadow-md hover:border-primary/50">
            <Gamepad2 size={24} className="text-primary" />
            <span className="font-bold text-sm text-foreground">{tr('play') || 'Brincar'}</span>
            <span className="text-[10px] text-muted-foreground">+25 {tr('energy') || 'Energia'}</span>
          </button>
        </div>
      )}

      {/* Growth Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h3 className="font-black text-foreground mb-3 flex items-center gap-2">
          <Heart size={16} className="text-primary" /> {tr('growth') || 'Crescimento'}
        </h3>
        <div className="space-y-2">
          {petStages.map((stage, i) => {
            const isActive = petLevel >= stage.minLevel;
            const isCurrent = currentStage === stage;
            return (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-primary/10 border border-primary/30' : isActive ? 'opacity-70' : 'opacity-30'}`}>
                <span className="text-2xl">{stage.minLevel < 2 ? '🥚' : petEmoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{stage.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {tr('level') || 'Nível'} {stage.minLevel}+ ({stage.minLevel * 200} XP)
                  </p>
                </div>
                {isActive && <span className="text-green-500">✅</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP Chat */}
      <div className="bg-card rounded-2xl p-4 border-2 border-dashed border-primary/30">
        <div className="flex items-center gap-3">
          <Lock className="text-primary/50 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <MessageCircle size={14} /> {tr('chat_with_pet') || 'Conversar com Pet'}
            </h4>
            <p className="text-xs text-muted-foreground">{tr('chat_pet_desc') || 'Converse com seu pet usando IA! Disponível para VIP.'}</p>
          </div>
          <a href={VIP_URL} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">VIP</a>
        </div>
      </div>
    </div>
  );
};

export default PetTab;
