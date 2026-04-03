import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { wordBank, type LangCode } from '@/data/wordBank';

interface WordSet {
  hint: string;
  words: string[];
  decoys: string[];
}

function generateWordSets(nativeLang: string, course: string): WordSet[] {
  const cl = course as LangCode;
  const nl = nativeLang as LangCode;
  const sets: WordSet[] = [];

  const categoryMap: Record<string, { emoji: string; nameNative: Record<string, string> }> = {
    food: { emoji: '🍕', nameNative: { pt: 'Comida', en: 'Food', es: 'Comida', fr: 'Nourriture', de: 'Essen', it: 'Cibo', ja: '食べ物', ko: '음식' } },
    animals: { emoji: '🐾', nameNative: { pt: 'Animais', en: 'Animals', es: 'Animales', fr: 'Animaux', de: 'Tiere', it: 'Animali', ja: '動物', ko: '동물' } },
    colors: { emoji: '🎨', nameNative: { pt: 'Cores', en: 'Colors', es: 'Colores', fr: 'Couleurs', de: 'Farben', it: 'Colori', ja: '色', ko: '색상' } },
    daily: { emoji: '🏠', nameNative: { pt: 'Cotidiano', en: 'Daily', es: 'Diario', fr: 'Quotidien', de: 'Alltag', it: 'Quotidiano', ja: '日常', ko: '일상' } },
  };

  for (const [cat, info] of Object.entries(categoryMap)) {
    const words = wordBank[cat] || [];
    const courseWords = words.filter(w => w[cl]).map(w => w[cl]).slice(0, 3);
    if (courseWords.length < 3) continue;
    // Decoys from other categories
    const otherCats = Object.keys(categoryMap).filter(c => c !== cat);
    const decoys: string[] = [];
    for (const oc of otherCats) {
      const ow = wordBank[oc] || [];
      decoys.push(...ow.filter(w => w[cl]).map(w => w[cl]).slice(0, 3));
    }
    const uniqueDecoys = [...new Set(decoys.filter(d => !courseWords.includes(d)))].slice(0, 6);
    const hint = `${info.emoji} ${info.nameNative[nl] || info.nameNative.en}`;
    sets.push({ hint, words: courseWords, decoys: uniqueDecoys });
  }
  return sets;
}

const WordHuntGame = ({ onBack }: { onBack: () => void }) => {
  const { course, nativeLang, addXp } = useApp();
  const tr = useTranslation(nativeLang);
  const sets = useMemo(() => generateWordSets(nativeLang, course), [nativeLang, course]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const currentSet = sets[roundIdx];
  const allWords = useMemo(() => {
    if (!currentSet) return [];
    return [...currentSet.words, ...currentSet.decoys].sort(() => Math.random() - 0.5);
  }, [currentSet, roundIdx]);

  const toggleWord = (word: string) => {
    if (showResult) return;
    setSelectedWords(prev => prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]);
  };

  const checkAnswers = () => {
    if (!currentSet) return;
    setShowResult(true);
    const correct = selectedWords.filter(w => currentSet.words.includes(w)).length;
    const wrong = selectedWords.filter(w => !currentSet.words.includes(w)).length;
    const score = Math.max(0, correct - wrong);
    setTotalScore(s => s + score);

    setTimeout(() => {
      if (roundIdx < sets.length - 1) {
        setRoundIdx(r => r + 1);
        setSelectedWords([]);
        setShowResult(false);
      } else {
        setFinished(true);
        addXp((totalScore + score) * 5);
      }
    }, 1500);
  };

  if (sets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-6xl mb-4">🔍</span>
        <p className="text-muted-foreground font-bold">{tr('coming_soon')}</p>
        <button onClick={onBack} className="mt-4 bg-primary text-primary-foreground font-bold px-6 py-2 rounded-full">
          {tr('back')}
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🔍</span>
          <h2 className="text-2xl font-black text-foreground mb-2">{tr('congrats')}</h2>
          <p className="text-muted-foreground mb-6">+{totalScore * 5} XP ⭐</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setRoundIdx(0); setSelectedWords([]); setShowResult(false); setFinished(false); setTotalScore(0); }} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
              {tr('play_again')}
            </button>
            <button onClick={onBack} className="bg-card text-foreground font-bold px-6 py-3 rounded-full shadow-lg border border-border active:scale-95 transition-transform">
              {tr('back')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-foreground">🔍 {tr('word_hunt')}</h2>
          <p className="text-xs text-muted-foreground">{roundIdx + 1}/{sets.length} · {currentSet?.hint}</p>
        </div>
      </div>

      <p className="text-center font-bold text-foreground text-lg">{currentSet?.hint}</p>

      <div className="grid grid-cols-3 gap-2">
        {allWords.map((word, i) => {
          const isSelected = selectedWords.includes(word);
          const isCorrect = currentSet?.words.includes(word);
          let bg = isSelected ? 'bg-primary/20 border-primary' : 'bg-card border-border';
          if (showResult) {
            if (isCorrect) bg = 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600';
            else if (isSelected) bg = 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600';
          }
          return (
            <motion.button
              key={`${roundIdx}-${word}-${i}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleWord(word)}
              className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${bg}`}
            >
              {word}
              {showResult && isCorrect && isSelected && <Check size={14} className="inline ml-1 text-green-500" />}
            </motion.button>
          );
        })}
      </div>

      {!showResult && (
        <button onClick={checkAnswers} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform">
          ✓ {tr('confirm')}
        </button>
      )}
    </div>
  );
};

export default WordHuntGame;
