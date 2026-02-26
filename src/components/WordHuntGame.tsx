import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const wordSets: Record<string, { hint: string; words: string[]; decoys: string[] }[]> = {
  en: [
    { hint: '🍎 Fruits', words: ['Apple', 'Banana', 'Orange'], decoys: ['Chair', 'Dog', 'Run', 'Blue', 'Car', 'Book'] },
    { hint: '🐾 Animals', words: ['Dog', 'Cat', 'Bird'], decoys: ['Table', 'Red', 'Walk', 'Sun', 'Pen', 'Cup'] },
    { hint: '🎨 Colors', words: ['Red', 'Blue', 'Green'], decoys: ['Fish', 'Tree', 'Run', 'Eat', 'Big', 'Hat'] },
  ],
  es: [
    { hint: '🍎 Frutas', words: ['Manzana', 'Plátano', 'Naranja'], decoys: ['Silla', 'Perro', 'Correr', 'Azul', 'Coche', 'Libro'] },
    { hint: '🐾 Animales', words: ['Perro', 'Gato', 'Pájaro'], decoys: ['Mesa', 'Rojo', 'Andar', 'Sol', 'Pluma', 'Taza'] },
  ],
  fr: [
    { hint: '🍎 Fruits', words: ['Pomme', 'Banane', 'Orange'], decoys: ['Chaise', 'Chien', 'Courir', 'Bleu', 'Voiture', 'Livre'] },
    { hint: '🐾 Animaux', words: ['Chien', 'Chat', 'Oiseau'], decoys: ['Table', 'Rouge', 'Marcher', 'Soleil', 'Stylo', 'Tasse'] },
  ],
  de: [
    { hint: '🍎 Obst', words: ['Apfel', 'Banane', 'Orange'], decoys: ['Stuhl', 'Hund', 'Laufen', 'Blau', 'Auto', 'Buch'] },
    { hint: '🐾 Tiere', words: ['Hund', 'Katze', 'Vogel'], decoys: ['Tisch', 'Rot', 'Gehen', 'Sonne', 'Stift', 'Tasse'] },
  ],
  it: [
    { hint: '🍎 Frutta', words: ['Mela', 'Banana', 'Arancia'], decoys: ['Sedia', 'Cane', 'Correre', 'Blu', 'Auto', 'Libro'] },
    { hint: '🐾 Animali', words: ['Cane', 'Gatto', 'Uccello'], decoys: ['Tavolo', 'Rosso', 'Camminare', 'Sole', 'Penna', 'Tazza'] },
  ],
  ja: [
    { hint: '🍎 果物', words: ['りんご', 'バナナ', 'オレンジ'], decoys: ['椅子', '犬', '走る', '青', '車', '本'] },
    { hint: '🐾 動物', words: ['犬', '猫', '鳥'], decoys: ['机', '赤', '歩く', '太陽', 'ペン', 'カップ'] },
  ],
};

const WordHuntGame = ({ onBack }: { onBack: () => void }) => {
  const { course, nativeLang, addXp } = useApp();
  const tr = useTranslation(nativeLang);
  const sets = wordSets[course] || wordSets.en;

  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const currentSet = sets[roundIdx];
  const allWords = [...currentSet.words, ...currentSet.decoys].sort(() => Math.random() - 0.5);

  const toggleWord = (word: string) => {
    if (showResult) return;
    setSelectedWords(prev => prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]);
  };

  const checkAnswers = () => {
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
          <p className="text-xs text-muted-foreground">{roundIdx + 1}/{sets.length} · {currentSet.hint}</p>
        </div>
      </div>

      <p className="text-center font-bold text-foreground text-lg">{currentSet.hint}</p>

      <div className="grid grid-cols-3 gap-2">
        {allWords.map((word, i) => {
          const isSelected = selectedWords.includes(word);
          const isCorrect = currentSet.words.includes(word);
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
          ✓ Check
        </button>
      )}
    </div>
  );
};

export default WordHuntGame;
