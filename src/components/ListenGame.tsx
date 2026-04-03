import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Volume2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { wordBank, type LangCode } from '@/data/wordBank';

interface ListenQuestion {
  word: string;
  options: string[];
  correct: number;
}

function generateListenQuestions(nativeLang: string, course: string): ListenQuestion[] {
  const nl = nativeLang as LangCode;
  const cl = course as LangCode;
  const questions: ListenQuestion[] = [];
  const allWords = Object.values(wordBank).flat();
  const usable = allWords.filter(w => w[cl] && w[nl] && w[cl] !== w[nl]);
  const shuffled = [...usable].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(8, shuffled.length); i++) {
    const word = shuffled[i];
    const others = usable.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [word[nl], ...others.map(o => o[nl])];
    const shuffledOpts = opts.sort(() => Math.random() - 0.5);
    questions.push({
      word: word[cl],
      options: shuffledOpts,
      correct: shuffledOpts.indexOf(word[nl]),
    });
  }
  return questions;
}

interface Props {
  onBack: () => void;
}

const ListenGame = ({ onBack }: Props) => {
  const { course, nativeLang, completeExercise } = useApp();
  const tr = useTranslation(nativeLang);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => generateListenQuestions(nativeLang, course), [nativeLang, course]);
  const current = questions[currentIdx];

  const speak = useCallback((text: string) => {
    const langMap: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', ja: 'ja-JP', pt: 'pt-BR', ko: 'ko-KR'
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[course] || 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }, [course]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    const correct = idx === current.correct;
    if (correct) setScore(s => s + 1);
    completeExercise(correct);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelected(null);
        setShowFeedback(false);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (!questions.length || !current) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-6xl mb-4">🔇</span>
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
          <span className="text-7xl block mb-4">🎧</span>
          <h2 className="text-2xl font-black text-foreground mb-2">{tr('congrats')}</h2>
          <p className="text-muted-foreground mb-6">{tr('you_scored')} {score} {tr('of')} {questions.length}!</p>
          <div className="flex gap-3">
            <button onClick={onBack} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
              {tr('back')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-muted-foreground">{currentIdx + 1}/{questions.length}</span>
            <span className="font-bold text-primary">🏆 {score}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="text-5xl block mb-2">👂</span>
        <h3 className="text-lg font-black text-foreground mb-4">{tr('listen_and_choose')}</h3>
      </div>

      <button
        onClick={() => speak(current.word)}
        className="w-full bg-primary/10 rounded-2xl p-6 flex flex-col items-center gap-3 border-2 border-primary/30 hover:bg-primary/20 transition-colors active:scale-95"
      >
        <Volume2 size={48} className="text-primary" />
        <span className="font-bold text-primary text-lg">{tr('tap_to_listen')}</span>
      </button>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {current.options.map((opt, i) => {
            let bg = 'bg-card border-border';
            if (showFeedback) {
              if (i === current.correct) bg = 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600';
              else if (i === selected) bg = 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all active:scale-[0.98] flex items-center justify-between ${bg}`}
              >
                <span className="text-foreground">{opt}</span>
                {showFeedback && i === current.correct && <Check className="text-green-500" size={20} />}
                {showFeedback && i === selected && i !== current.correct && <X className="text-red-500" size={20} />}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ListenGame;
