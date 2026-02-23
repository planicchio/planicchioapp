import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface Exercise {
  question: string;
  options: string[];
  correct: number;
}

const categories = [
  { id: 'greetings', name: 'Cumprimentos', emoji: '👋' },
  { id: 'food', name: 'Comida', emoji: '🍕' },
  { id: 'travel', name: 'Viagem', emoji: '✈️' },
  { id: 'work', name: 'Trabalho', emoji: '💼' },
  { id: 'daily', name: 'Vida Real', emoji: '🏠' },
  { id: 'numbers', name: 'Números', emoji: '🔢' },
];

const exerciseData: Record<string, Record<string, Exercise[]>> = {
  en: {
    greetings: [
      { question: 'Como se diz "Olá" em inglês?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
      { question: 'Complete: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
      { question: '"How are you?" responda:', options: ["I'm fine", "I'm hello", "I'm name", "I'm house"], correct: 0 },
      { question: '"Good evening" significa:', options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Tchau'], correct: 0 },
    ],
    food: [
      { question: '"Água" em inglês:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 },
      { question: '"I would like ___"', options: ['a coffee', 'a table', 'a house', 'a car'], correct: 0 },
      { question: '"Bread" em português:', options: ['Pão', 'Bolo', 'Arroz', 'Feijão'], correct: 0 },
      { question: '"Breakfast" significa:', options: ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'], correct: 0 },
    ],
    travel: [
      { question: '"Aeroporto" em inglês:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 },
      { question: '"Where is the ___?"', options: ['hotel', 'hello', 'food', 'water'], correct: 0 },
      { question: '"Ticket" em português:', options: ['Passagem', 'Mesa', 'Cama', 'Porta'], correct: 0 },
      { question: '"Luggage" significa:', options: ['Bagagem', 'Comida', 'Dinheiro', 'Mapa'], correct: 0 },
    ],
    work: [
      { question: '"Reunião" em inglês:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 },
      { question: '"I need to ___ a report"', options: ['write', 'eat', 'sleep', 'play'], correct: 0 },
      { question: '"Deadline" em português:', options: ['Prazo', 'Festa', 'Almoço', 'Pausa'], correct: 0 },
      { question: '"Colleague" significa:', options: ['Colega', 'Chefe', 'Cliente', 'Amigo'], correct: 0 },
    ],
    daily: [
      { question: '"Casa" em inglês:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 },
      { question: '"I ___ every morning"', options: ['wake up', 'sleep', 'eat', 'run'], correct: 0 },
      { question: '"Family" em português:', options: ['Família', 'Amigo', 'Vizinho', 'Colega'], correct: 0 },
      { question: '"To clean" significa:', options: ['Limpar', 'Cozinhar', 'Dormir', 'Correr'], correct: 0 },
    ],
    numbers: [
      { question: '"Vinte" em inglês:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 },
      { question: '"One hundred" em português:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
      { question: 'Como se fala 15?', options: ['Fifteen', 'Fifty', 'Five', 'Fourteen'], correct: 0 },
      { question: '"Thousand" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
    ],
  },
};

// Generate simple exercises for other languages
['es', 'fr', 'de', 'it', 'ja'].forEach(lang => {
  exerciseData[lang] = {};
  categories.forEach(cat => {
    exerciseData[lang][cat.id] = [
      { question: `Exercício de ${cat.name} - em breve mais conteúdo! Qual é a resposta?`, options: ['Opção A ✅', 'Opção B', 'Opção C', 'Opção D'], correct: 0 },
    ];
  });
});

const ExercisesTab = () => {
  const { course, level, completeExercise } = useApp();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercises = selectedCat ? (exerciseData[course]?.[selectedCat] || exerciseData.en[selectedCat] || []) : [];
  const current = exercises[currentIdx];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    const correct = idx === current.correct;
    if (correct) setScore(s => s + 1);
    completeExercise(correct);

    setTimeout(() => {
      if (currentIdx < exercises.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelected(null);
        setShowFeedback(false);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const handleBack = () => {
    setSelectedCat(null);
    setCurrentIdx(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h2 className="text-2xl font-black text-foreground mb-2">Parabéns!</h2>
          <p className="text-muted-foreground mb-6">Você acertou {score} de {exercises.length}!</p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
            Continuar 🚀
          </button>
        </motion.div>
      </div>
    );
  }

  if (!selectedCat) {
    return (
      <div className="space-y-5 pb-4">
        <div className="text-center mb-2">
          <span className="text-4xl">📝</span>
          <h2 className="text-2xl font-black text-foreground">Exercícios</h2>
          <p className="text-sm text-muted-foreground">Nível {level} · Escolha uma categoria</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedCat(cat.id)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="text-4xl block mb-2">{cat.emoji}</span>
              <p className="font-bold text-foreground">{cat.name}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={handleBack} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-muted-foreground">{currentIdx + 1}/{exercises.length}</span>
            <span className="font-bold text-primary">🏆 {score}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / exercises.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <h3 className="text-xl font-black text-foreground mb-6 text-center">{current.question}</h3>
          <div className="space-y-3">
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExercisesTab;
