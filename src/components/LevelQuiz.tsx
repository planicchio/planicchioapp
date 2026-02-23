import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const quizData: Record<string, Question[]> = {
  en: [
    { question: '"Hello" significa...', options: ['Olá', 'Tchau', 'Obrigado', 'Por favor'], correct: 0 },
    { question: 'Complete: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
    { question: 'Passado de "go":', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
    { question: '"Nevertheless" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
    { question: '"I would have gone if..." usa qual tempo?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
  ],
  es: [
    { question: '"Hola" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
    { question: 'Complete: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
    { question: 'Passado de "ir":', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
    { question: '"Sin embargo" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
    { question: 'Subjuntivo de "tener":', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
  ],
  fr: [
    { question: '"Bonjour" significa...', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
    { question: 'Complete: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
    { question: 'Passé composé de "aller":', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
    { question: '"Cependant" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
    { question: 'Subjonctif de "avoir":', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
  ],
  de: [
    { question: '"Hallo" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
    { question: 'Complete: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
    { question: 'Passado de "gehen":', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
    { question: '"Jedoch" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
    { question: 'Konjunktiv II de "haben":', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
  ],
  it: [
    { question: '"Ciao" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
    { question: 'Complete: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
    { question: 'Passato prossimo de "andare":', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
    { question: '"Tuttavia" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
    { question: 'Congiuntivo de "avere":', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
  ],
  ja: [
    { question: '"こんにちは" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
    { question: 'Complete: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
    { question: 'Passado de "食べる" (taberu):', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
    { question: '"しかし" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
    { question: 'Keigo (honorífico) de "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
  ],
};

const getLevel = (score: number): string => {
  if (score <= 1) return 'A1';
  if (score === 2) return 'A2';
  if (score === 3) return 'B1';
  if (score === 4) return 'B2';
  return 'C1';
};

const LevelQuiz = () => {
  const { course, setLevel, setStage } = useApp();
  const questions = quizData[course] || quizData.en;
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].correct;
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const handleFinish = () => {
    const level = getLevel(score);
    setLevel(level);
    setStage('app');
  };

  if (showResult) {
    const level = getLevel(score);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h1 className="text-3xl font-black text-foreground mb-2">Seu nível é</h1>
          <div className="bg-primary text-primary-foreground text-5xl font-black rounded-2xl px-8 py-4 mb-4 inline-block">{level}</div>
          <p className="text-muted-foreground mb-8">Você acertou {score} de {questions.length}!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="bg-primary text-primary-foreground font-bold text-xl px-12 py-4 rounded-full shadow-lg"
          >
            Vamos lá! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-muted-foreground">Questão {current + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-primary">🏆 {score} acertos</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-primary h-full rounded-full"
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
          <h2 className="text-2xl font-black text-foreground mb-8 text-center">{questions[current].question}</h2>
          <div className="space-y-3 max-w-md mx-auto w-full">
            {questions[current].options.map((opt, i) => {
              let style = 'bg-card border-border';
              if (selected !== null) {
                if (i === questions[current].correct) style = 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600';
                else if (i === selected) style = 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600';
              }
              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 rounded-xl border-2 text-left font-bold text-lg transition-colors ${style}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LevelQuiz;
