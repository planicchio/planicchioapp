import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Gamepad2, Lock, MessageCircle, Gift, Moon, Sun } from 'lucide-react';
import { useApp, PETS } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { getFeedWords, getPlayWords } from '@/data/wordBank';

const petStages = [
  { minLevel: 1, label: 'baby', emoji: '🥚', size: 'text-6xl' },
  { minLevel: 2, label: 'puppy', emoji: '', size: 'text-7xl' },
  { minLevel: 4, label: 'young', emoji: '', size: 'text-8xl' },
  { minLevel: 7, label: 'adult', emoji: '', size: 'text-9xl' },
  { minLevel: 10, label: 'master', emoji: '👑', size: 'text-9xl' },
];

const stageLabels: Record<string, Record<string, string>> = {
  baby: { pt: 'Bebê', en: 'Baby', es: 'Bebé', fr: 'Bébé', de: 'Baby', it: 'Bebè', ja: '赤ちゃん', ko: '아기' },
  puppy: { pt: 'Filhote', en: 'Puppy', es: 'Cachorro', fr: 'Chiot', de: 'Welpe', it: 'Cucciolo', ja: '子犬', ko: '강아지' },
  young: { pt: 'Jovem', en: 'Young', es: 'Joven', fr: 'Jeune', de: 'Jung', it: 'Giovane', ja: '若い', ko: '젊은' },
  adult: { pt: 'Adulto', en: 'Adult', es: 'Adulto', fr: 'Adulte', de: 'Erwachsen', it: 'Adulto', ja: '大人', ko: '성인' },
  master: { pt: 'Mestre', en: 'Master', es: 'Maestro', fr: 'Maître', de: 'Meister', it: 'Maestro', ja: 'マスター', ko: '마스터' },
};

const foodEmojis = ['🍖', '🍕', '🍎', '🥕', '🐟', '🍰', '🥛', '🍗'];

const sleepTexts: Record<string, string> = {
  pt: 'Colocar para dormir 💤', en: 'Put to sleep 💤', es: 'Poner a dormir 💤',
  fr: 'Mettre au lit 💤', de: 'Schlafen legen 💤', it: 'Mettere a dormire 💤',
  ja: '寝かせる 💤', ko: '재우기 💤',
};
const wakeTexts: Record<string, string> = {
  pt: 'Acordar! ☀️', en: 'Wake up! ☀️', es: '¡Despertar! ☀️',
  fr: 'Réveiller ! ☀️', de: 'Aufwachen! ☀️', it: 'Svegliare! ☀️',
  ja: '起こす！☀️', ko: '깨우기! ☀️',
};
const sleepingTexts: Record<string, string> = {
  pt: 'Zzz... dormindo...', en: 'Zzz... sleeping...', es: 'Zzz... durmiendo...',
  fr: 'Zzz... dort...', de: 'Zzz... schläft...', it: 'Zzz... dorme...',
  ja: 'Zzz... 寝ています...', ko: 'Zzz... 자고 있어요...',
};

const VIP_URL = 'https://buy.stripe.com/5kQaEYf7KdSBeHq3DYaMU02';

const PetTab = () => {
  const {
    pet, getPetEmoji, getPetLevel, petHunger, petEnergy, petHappiness,
    feedPet, playWithPet, nativeLang, xp, petMood, course
  } = useApp();
  const tr = useTranslation(nativeLang);
  const petLevel = getPetLevel();

  const [feedMode, setFeedMode] = useState(false);
  const [feedInput, setFeedInput] = useState('');
  const [feedChallenge, setFeedChallenge] = useState<{ word: string; translation: string } | null>(null);
  const [feedResult, setFeedResult] = useState<'correct' | 'wrong' | null>(null);

  const [playMode, setPlayMode] = useState(false);
  const [playChallenge, setPlayChallenge] = useState<{ word: string; options: string[]; correct: number } | null>(null);
  const [playSelected, setPlaySelected] = useState<number | null>(null);

  const [earnedFood, setEarnedFood] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('planicchio_pet_food') || '[]'); } catch { return []; }
  });
  const [showFeedAnim, setShowFeedAnim] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const petRef = useRef<HTMLDivElement>(null);

  const petEmoji = getPetEmoji();
  const petName = PETS.find(p => p.id === pet)?.name || 'Pet';

  let currentStage = petStages[0];
  for (let i = petStages.length - 1; i >= 0; i--) {
    if (petLevel >= petStages[i].minLevel) { currentStage = petStages[i]; break; }
  }

  const stageLabel = stageLabels[currentStage.label]?.[nativeLang] || stageLabels[currentStage.label]?.en || currentStage.label;
  const moodText = isSleeping ? '😴' : petMood === 'happy' ? '😊' : petMood === 'sad' ? '😢' : petMood === 'dancing' ? '💃' : '😊';

  const feedWordsList = useMemo(() => getFeedWords(nativeLang, course), [nativeLang, course]);
  const playWordsList = useMemo(() => getPlayWords(course), [course]);

  const saveFood = (foods: string[]) => {
    setEarnedFood(foods);
    localStorage.setItem('planicchio_pet_food', JSON.stringify(foods));
  };

  const startFeed = () => {
    if (isSleeping || feedWordsList.length === 0) return;
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
      const newFood = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
      saveFood([...earnedFood, newFood]);
    }
    setTimeout(() => { setFeedMode(false); setFeedResult(null); }, 1500);
  };

  const startPlay = () => {
    if (isSleeping || playWordsList.length === 0) return;
    const w = playWordsList[Math.floor(Math.random() * playWordsList.length)];
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
    if (idx === playChallenge.correct) playWithPet();
    setTimeout(() => { setPlayMode(false); setPlaySelected(null); }, 1500);
  };

  const handleDropOnPet = (foodIdx: number) => {
    if (isSleeping) return;
    feedPet();
    setShowFeedAnim(true);
    const newFoods = [...earnedFood];
    newFoods.splice(foodIdx, 1);
    saveFood(newFoods);
    setTimeout(() => setShowFeedAnim(false), 1000);
  };

  const toggleSleep = () => {
    setIsSleeping(!isSleeping);
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-foreground">{tr('my_pet') || 'My Pet'}</h2>
      </div>

      {/* Pet Display */}
      <div ref={petRef} className={`bg-card rounded-2xl p-6 border border-border text-center relative overflow-hidden ${isSleeping ? 'opacity-80' : ''}`}>
        {isSleeping && <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-indigo-950/30 z-10 rounded-2xl" />}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative z-20">
          {currentStage.minLevel >= 10 && (
            <motion.span className="text-3xl absolute -top-2 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>👑</motion.span>
          )}
          <motion.div className={`${currentStage.size} mb-3 inline-block`}
            animate={isSleeping ? { rotate: [0, -5, 0] } : {
              y: [0, -10, 0],
              rotate: petMood === 'dancing' ? [0, 5, -5, 0] : 0,
              scale: showFeedAnim ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: isSleeping ? 3 : 2, repeat: Infinity }}>
            {petLevel < 2 ? '🥚' : petEmoji}
          </motion.div>
          {showFeedAnim && (
            <motion.span className="absolute text-4xl" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }}
              transition={{ duration: 1 }}>😋</motion.span>
          )}
          {isSleeping && (
            <motion.div className="absolute top-2 right-4 text-3xl"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              💤
            </motion.div>
          )}
          <h3 className="text-xl font-black text-foreground">{petName}</h3>
          <p className="text-sm text-muted-foreground">
            {isSleeping ? (sleepingTexts[nativeLang] || sleepingTexts.en) : `${tr('level') || 'Level'} ${petLevel} · ${stageLabel} ${moodText}`}
          </p>
          <div className="mt-2 inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {xp} XP
          </div>
        </div>
      </div>

      {/* Food Inventory */}
      {earnedFood.length > 0 && !isSleeping && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h3 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2">
            <Gift size={16} className="text-primary" />
            {tr('food_inventory') || 'Comida ganha'} ({earnedFood.length})
          </h3>
          <p className="text-[10px] text-muted-foreground mb-2">{tr('tap_food_to_feed') || 'Toque na comida para alimentar!'}</p>
          <div className="flex flex-wrap gap-2">
            {earnedFood.map((food, i) => (
              <motion.button key={i} whileTap={{ scale: 0.8 }} onClick={() => handleDropOnPet(i)}
                className="text-3xl p-2 bg-muted rounded-xl hover:bg-primary/10 transition-colors cursor-pointer active:scale-90">
                {food}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🍖', label: tr('hunger') || 'Hunger', value: petHunger },
          { emoji: '⚡', label: tr('energy') || 'Energy', value: petEnergy },
          { emoji: '💖', label: tr('happiness') || 'Happiness', value: petHappiness },
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
          <p className="text-sm font-bold text-foreground mb-1">🍖 {tr('feed_challenge') || 'Type the word to feed!'}</p>
          <p className="text-xs text-muted-foreground mb-3">{tr('translate_word') || 'Translate'}: <strong>{feedChallenge.translation}</strong></p>
          <input value={feedInput} onChange={e => setFeedInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitFeed()}
            placeholder={feedChallenge.word.charAt(0) + '...'}
            className={`w-full bg-muted border-2 rounded-xl px-4 py-3 text-foreground font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary ${
              feedResult === 'correct' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
              feedResult === 'wrong' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-border'
            }`}
            disabled={feedResult !== null} autoFocus />
          {feedResult === 'wrong' && <p className="text-xs text-red-500 font-bold mt-2">✗ {feedChallenge.word}</p>}
          {feedResult === 'correct' && <p className="text-xs text-green-500 font-bold mt-2">✓ +🍖 {tr('food_earned') || 'Comida ganha!'}</p>}
          {feedResult === null && (
            <button onClick={submitFeed} className="w-full mt-3 bg-primary text-primary-foreground font-bold py-2 rounded-xl active:scale-95 transition-transform">
              {tr('confirm') || 'Confirm'}
            </button>
          )}
        </motion.div>
      )}

      {/* Play Mini-Game */}
      {playMode && playChallenge && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border-2 border-primary/30">
          <p className="text-sm font-bold text-foreground mb-1">🎮 {tr('play_challenge') || 'Get it right to play!'}</p>
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

      {/* Action Buttons */}
      {!feedMode && !playMode && (
        <div className="grid grid-cols-3 gap-3">
          <button onClick={startFeed} disabled={isSleeping}
            className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 hover:shadow-md hover:border-primary/50 disabled:opacity-40">
            <Utensils size={24} className="text-primary" />
            <span className="font-bold text-sm text-foreground">{tr('feed') || 'Feed'}</span>
          </button>
          <button onClick={startPlay} disabled={isSleeping}
            className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 hover:shadow-md hover:border-primary/50 disabled:opacity-40">
            <Gamepad2 size={24} className="text-primary" />
            <span className="font-bold text-sm text-foreground">{tr('play') || 'Play'}</span>
          </button>
          <button onClick={toggleSleep}
            className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 hover:shadow-md hover:border-primary/50">
            {isSleeping ? <Sun size={24} className="text-amber-500" /> : <Moon size={24} className="text-indigo-500" />}
            <span className="font-bold text-xs text-foreground">{isSleeping ? (wakeTexts[nativeLang] || wakeTexts.en) : (sleepTexts[nativeLang] || sleepTexts.en)}</span>
          </button>
        </div>
      )}

      {/* Growth Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h3 className="font-black text-foreground mb-3 flex items-center gap-2">
          <Heart size={16} className="text-primary" /> {tr('growth') || 'Growth'}
        </h3>
        <div className="space-y-2">
          {petStages.map((stage, i) => {
            const isActive = petLevel >= stage.minLevel;
            const isCurrent = currentStage === stage;
            const label = stageLabels[stage.label]?.[nativeLang] || stageLabels[stage.label]?.en || stage.label;
            return (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-primary/10 border border-primary/30' : isActive ? 'opacity-70' : 'opacity-30'}`}>
                <span className="text-2xl">{stage.minLevel < 2 ? '🥚' : petEmoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{tr('level') || 'Level'} {stage.minLevel}+ ({stage.minLevel * 200} XP)</p>
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
              <MessageCircle size={14} /> {tr('chat_with_pet') || 'Chat with Pet'}
            </h4>
            <p className="text-xs text-muted-foreground">{tr('chat_pet_desc') || 'Chat with your pet using AI! Available for VIP.'}</p>
          </div>
          <a href={VIP_URL} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">VIP</a>
        </div>
      </div>
    </div>
  );
};

export default PetTab;
