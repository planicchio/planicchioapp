import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface QuizQ {
  question: string;
  options: string[];
  correct: number;
}

const quizData: Record<string, QuizQ[]> = {
  en: [
    { question: '"Apple" = ?', options: ['🍎', '🍌', '🍇', '🍊'], correct: 0 },
    { question: '"Blue" = ?', options: ['🔵', '🔴', '🟢', '🟡'], correct: 0 },
    { question: '"Three" = ?', options: ['3', '5', '7', '2'], correct: 0 },
    { question: '"Sun" = ?', options: ['☀️', '🌙', '⭐', '🌧️'], correct: 0 },
    { question: '"Fish" = ?', options: ['🐟', '🐶', '🐱', '🐦'], correct: 0 },
    { question: '"Rain" = ?', options: ['🌧️', '☀️', '❄️', '🌈'], correct: 0 },
    { question: '"Heart" = ?', options: ['❤️', '⭐', '🔥', '💎'], correct: 0 },
    { question: '"Car" = ?', options: ['🚗', '🚀', '✈️', '🚂'], correct: 0 },
  ],
  es: [
    { question: '"Manzana" = ?', options: ['🍎', '🍌', '🍇', '🍊'], correct: 0 },
    { question: '"Azul" = ?', options: ['🔵', '🔴', '🟢', '🟡'], correct: 0 },
    { question: '"Tres" = ?', options: ['3', '5', '7', '2'], correct: 0 },
    { question: '"Sol" = ?', options: ['☀️', '🌙', '⭐', '🌧️'], correct: 0 },
    { question: '"Pez" = ?', options: ['🐟', '🐶', '🐱', '🐦'], correct: 0 },
    { question: '"Lluvia" = ?', options: ['🌧️', '☀️', '❄️', '🌈'], correct: 0 },
  ],
  fr: [
    { question: '"Pomme" = ?', options: ['🍎', '🍌', '🍇', '🍊'], correct: 0 },
    { question: '"Bleu" = ?', options: ['🔵', '🔴', '🟢', '🟡'], correct: 0 },
    { question: '"Trois" = ?', options: ['3', '5', '7', '2'], correct: 0 },
    { question: '"Soleil" = ?', options: ['☀️', '🌙', '⭐', '🌧️'], correct: 0 },
    { question: '"Poisson" = ?', options: ['🐟', '🐶', '🐱', '🐦'], correct: 0 },
  ],
  de: [
    { question: '"Apfel" = ?', options: ['🍎', '🍌', '🍇', '🍊'], correct: 0 },
    { question: '"Blau" = ?', options: ['🔵', '🔴', '🟢', '🟡'], correct: 0 },
    { question: '"Drei" = ?', options: ['3', '5', '7', '2'], correct: 0 },
    { question: '"Sonne" = ?', options: ['☀️', '🌙', '⭐', '🌧️'], correct: 0 },
  ],
  it: [
    { question: '"Mela" = ?', options: ['🍎', '🍌', '🍇', '🍊'], correct: 0 },
    { question: '"Blu" = ?', options: ['🔵', '🔴', '🟢', '🟡'], correct: 0 },
    { question: '"Tre" = ?', options: ['3', '5', '7', '2'], correct: 0 },
    { question: '"Sole" = ?', options: ['☀️', '🌙', '⭐', '🌧️'], correct: 0 },
  ],
  ja: [
    { question: '"りんご" = ?', options: ['🍎', '🍌', '🍇', '🍊'], correct: 0 },
    { question: '"青" = ?', options: ['🔵', '🔴', '🟢', '🟡'], correct: 0 },
    { question: '"三" = ?', options: ['3', '5', '7', '2'], correct: 0 },
    { question: '"太陽" = ?', options: ['☀️', '🌙', '⭐', '🌧️'], correct: 0 },
  ],
};

const QuickQuizGame = ({ onBack }: { onBack: () => void }) => {
  const { course, nativeLang, addXp } = useApp();
  const tr = useTranslation(nativeLang);
  const questions = quizData[course] || quizData.en;

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished || selected !== null) return;
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
                className={`p-6 rounded-xl border-2 text-center text-3xl font-bold transition-all active:scale-95 ${bg}`}
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
