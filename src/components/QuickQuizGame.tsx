import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { wordBank, type LangCode } from '@/data/wordBank';

interface QuizQ {
  question: string;
  options: string[];
  correct: number;
}

function generateQuizQuestions(nativeLang: string, course: string): QuizQ[] {
  const nl = nativeLang as LangCode;
  const cl = course as LangCode;
  const questions: QuizQ[] = [];
  const allWords = Object.values(wordBank).flat();
  const usable = allWords.filter(w => w[cl] && w[nl] && w[cl] !== w[nl]);
  const shuffled = [...usable].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(10, shuffled.length); i++) {
    const word = shuffled[i];
    // If has emoji, use emoji quiz
    if (word.emoji) {
      const others = usable.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [word.emoji, ...others.filter(o => o.emoji).map(o => o.emoji!)].slice(0, 4);
      if (opts.length < 4) continue;
      const shuffledOpts = opts.sort(() => Math.random() - 0.5);
      questions.push({
        question: `"${word[cl]}" = ?`,
        options: shuffledOpts,
        correct: shuffledOpts.indexOf(word.emoji),
      });
    } else {
      // Text translation quiz: course word → native word
      const others = usable.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [word[nl], ...others.map(o => o[nl])];
      const shuffledOpts = opts.sort(() => Math.random() - 0.5);
      questions.push({
        question: `"${word[cl]}" = ?`,
        options: shuffledOpts,
        correct: shuffledOpts.indexOf(word[nl]),
      });
    }
  }
  return questions;
}

const QuickQuizGame = ({ onBack }: { onBack: () => void }) => {
  const { course, nativeLang, addXp } = useApp();
  const tr = useTranslation(nativeLang);
  const questions = useMemo(() => generateQuizQuestions(nativeLang, course), [nativeLang, course]);

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || selected !== null || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleTimeout();
          return 10;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, finished, selected]);

  const handleTimeout = useCallback(() => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setTimeLeft(10);
    } else {
      setFinished(true);
    }
  }, [current, questions.length]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) setScore(s => s + 1);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setTimeLeft(10);
      } else {
        setFinished(true);
        addXp(score * 5);
      }
    }, 600);
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="text-6xl mb-4">⚡</span>
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
          <span className="text-7xl block mb-4">⚡</span>
          <h2 className="text-2xl font-black text-foreground mb-2">{tr('congrats')}</h2>
          <p className="text-muted-foreground mb-2">{score}/{questions.length} {tr('correct_answers')}!</p>
          <p className="text-muted-foreground mb-6">+{score * 5} XP ⭐</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setTimeLeft(10); setFinished(false); }} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
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
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-muted-foreground">{current + 1}/{questions.length}</span>
            <span className="font-bold text-primary flex items-center gap-1"><Timer size={14} /> {timeLeft}s</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${(timeLeft / 10) * 100}%` }} />
          </div>
        </div>
      </div>

      <motion.div key={current} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <h3 className="text-2xl font-black text-foreground mb-6 text-center">{questions[current].question}</h3>
        <div className="grid grid-cols-2 gap-3">
          {questions[current].options.map((opt, i) => {
            let bg = 'bg-card border-border';
            if (selected !== null) {
              if (i === questions[current].correct) bg = 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600';
              else if (i === selected) bg = 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`p-6 rounded-xl border-2 text-center text-xl font-bold transition-all active:scale-95 ${bg}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default QuickQuizGame;
