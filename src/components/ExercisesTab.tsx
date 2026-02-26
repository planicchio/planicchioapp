import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Exercise {
  question: string;
  options: string[];
  correct: number;
}

const categories = [
  { id: 'greetings', nameKey: 'cat_greetings', emoji: '👋' },
  { id: 'food', nameKey: 'cat_food', emoji: '🍕' },
  { id: 'travel', nameKey: 'cat_travel', emoji: '✈️' },
  { id: 'work', nameKey: 'cat_work', emoji: '💼' },
  { id: 'daily', nameKey: 'cat_daily', emoji: '🏠' },
  { id: 'numbers', nameKey: 'cat_numbers', emoji: '🔢' },
];

// Exercises per native language -> course -> category
const exerciseData: Record<string, Record<string, Record<string, Exercise[]>>> = {
  pt: {
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
  },
  it: {
    en: {
      greetings: [
        { question: 'Come si dice "Ciao" in inglese?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: 'Completa: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
        { question: '"How are you?" rispondi:', options: ["I'm fine", "I'm hello", "I'm name", "I'm house"], correct: 0 },
        { question: '"Good evening" significa:', options: ['Buonasera', 'Buongiorno', 'Buon pomeriggio', 'Arrivederci'], correct: 0 },
      ],
      food: [
        { question: '"Acqua" in inglese:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 },
        { question: '"I would like ___"', options: ['a coffee', 'a table', 'a house', 'a car'], correct: 0 },
        { question: '"Bread" in italiano:', options: ['Pane', 'Torta', 'Riso', 'Fagioli'], correct: 0 },
        { question: '"Breakfast" significa:', options: ['Colazione', 'Pranzo', 'Cena', 'Merenda'], correct: 0 },
      ],
      travel: [
        { question: '"Aeroporto" in inglese:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 },
        { question: '"Where is the ___?"', options: ['hotel', 'hello', 'food', 'water'], correct: 0 },
        { question: '"Ticket" in italiano:', options: ['Biglietto', 'Tavolo', 'Letto', 'Porta'], correct: 0 },
        { question: '"Luggage" significa:', options: ['Bagaglio', 'Cibo', 'Denaro', 'Mappa'], correct: 0 },
      ],
      work: [
        { question: '"Riunione" in inglese:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 },
        { question: '"I need to ___ a report"', options: ['write', 'eat', 'sleep', 'play'], correct: 0 },
        { question: '"Deadline" in italiano:', options: ['Scadenza', 'Festa', 'Pranzo', 'Pausa'], correct: 0 },
        { question: '"Colleague" significa:', options: ['Collega', 'Capo', 'Cliente', 'Amico'], correct: 0 },
      ],
      daily: [
        { question: '"Casa" in inglese:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 },
        { question: '"I ___ every morning"', options: ['wake up', 'sleep', 'eat', 'run'], correct: 0 },
        { question: '"Family" in italiano:', options: ['Famiglia', 'Amico', 'Vicino', 'Collega'], correct: 0 },
        { question: '"To clean" significa:', options: ['Pulire', 'Cucinare', 'Dormire', 'Correre'], correct: 0 },
      ],
      numbers: [
        { question: '"Venti" in inglese:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 },
        { question: '"One hundred" in italiano:', options: ['Cento', 'Dieci', 'Mille', 'Uno'], correct: 0 },
        { question: 'Come si dice 15?', options: ['Fifteen', 'Fifty', 'Five', 'Fourteen'], correct: 0 },
        { question: '"Thousand" significa:', options: ['Mille', 'Cento', 'Dieci', 'Milione'], correct: 0 },
      ],
    },
  },
  en: {
    es: {
      greetings: [
        { question: 'How do you say "Hello" in Spanish?', options: ['Hola', 'Adiós', 'Gracias', 'Por favor'], correct: 0 },
        { question: 'Complete: "Mucho ___ en conocerte"', options: ['gusto', 'bien', 'hola', 'casa'], correct: 0 },
        { question: '"¿Cómo estás?" answer:', options: ['Bien', 'Hola', 'Casa', 'Comida'], correct: 0 },
        { question: '"Buenas noches" means:', options: ['Good evening', 'Good morning', 'Good afternoon', 'Goodbye'], correct: 0 },
      ],
      food: [
        { question: '"Water" in Spanish:', options: ['Agua', 'Vino', 'Jugo', 'Leche'], correct: 0 },
        { question: '"Me gustaría ___"', options: ['un café', 'una mesa', 'una casa', 'un coche'], correct: 0 },
        { question: '"Pan" means:', options: ['Bread', 'Cake', 'Rice', 'Beans'], correct: 0 },
        { question: '"Desayuno" means:', options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], correct: 0 },
      ],
      travel: [
        { question: '"Airport" in Spanish:', options: ['Aeropuerto', 'Estación', 'Hotel', 'Playa'], correct: 0 },
        { question: '"¿Dónde está el ___?"', options: ['hotel', 'hola', 'comida', 'agua'], correct: 0 },
      ],
      work: [
        { question: '"Meeting" in Spanish:', options: ['Reunión', 'Fiesta', 'Almuerzo', 'Descanso'], correct: 0 },
        { question: '"Necesito ___ un informe"', options: ['escribir', 'comer', 'dormir', 'jugar'], correct: 0 },
      ],
      daily: [
        { question: '"House" in Spanish:', options: ['Casa', 'Coche', 'Perro', 'Gato'], correct: 0 },
        { question: '"Me ___ cada mañana"', options: ['despierto', 'duermo', 'como', 'corro'], correct: 0 },
      ],
      numbers: [
        { question: '"Twenty" in Spanish:', options: ['Veinte', 'Doce', 'Dos', 'Diez'], correct: 0 },
        { question: '"Cien" means:', options: ['One hundred', 'Ten', 'Thousand', 'One'], correct: 0 },
      ],
    },
    fr: {
      greetings: [
        { question: 'How do you say "Hello" in French?', options: ['Bonjour', 'Au revoir', 'Merci', "S'il vous plaît"], correct: 0 },
        { question: '"Bonsoir" means:', options: ['Good evening', 'Good morning', 'Goodbye', 'Thank you'], correct: 0 },
      ],
      food: [
        { question: '"Water" in French:', options: ['Eau', 'Vin', 'Jus', 'Lait'], correct: 0 },
        { question: '"Pain" means:', options: ['Bread', 'Pain', 'Cake', 'Rice'], correct: 0 },
      ],
      travel: [{ question: '"Aéroport" means:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"Réunion" means:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"Maison" means:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"Vingt" means:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
    de: {
      greetings: [
        { question: 'How do you say "Hello" in German?', options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'], correct: 0 },
        { question: '"Guten Abend" means:', options: ['Good evening', 'Good morning', 'Goodbye', 'Thank you'], correct: 0 },
      ],
      food: [{ question: '"Wasser" means:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 }],
      travel: [{ question: '"Flughafen" means:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"Besprechung" means:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"Haus" means:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"Zwanzig" means:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
    it: {
      greetings: [
        { question: 'How do you say "Hello" in Italian?', options: ['Ciao', 'Arrivederci', 'Grazie', 'Per favore'], correct: 0 },
        { question: '"Buonasera" means:', options: ['Good evening', 'Good morning', 'Goodbye', 'Thank you'], correct: 0 },
      ],
      food: [{ question: '"Acqua" means:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 }],
      travel: [{ question: '"Aeroporto" means:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"Riunione" means:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"Casa" means:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"Venti" means:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
    ja: {
      greetings: [{ question: 'How do you say "Hello" in Japanese?', options: ['こんにちは', 'さようなら', 'ありがとう', 'すみません'], correct: 0 }],
      food: [{ question: '"水 (mizu)" means:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 }],
      travel: [{ question: '"空港 (kūkō)" means:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"会議 (kaigi)" means:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"家 (ie)" means:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"二十 (nijū)" means:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
    en: {
      greetings: [{ question: 'This is your native language!', options: ['OK'], correct: 0 }],
      food: [{ question: 'This is your native language!', options: ['OK'], correct: 0 }],
      travel: [{ question: 'This is your native language!', options: ['OK'], correct: 0 }],
      work: [{ question: 'This is your native language!', options: ['OK'], correct: 0 }],
      daily: [{ question: 'This is your native language!', options: ['OK'], correct: 0 }],
      numbers: [{ question: 'This is your native language!', options: ['OK'], correct: 0 }],
    },
  },
  es: {
    en: {
      greetings: [
        { question: '¿Cómo se dice "Hola" en inglés?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: 'Completa: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
        { question: '"Good evening" significa:', options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Adiós'], correct: 0 },
      ],
      food: [
        { question: '"Agua" en inglés:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 },
        { question: '"Breakfast" significa:', options: ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'], correct: 0 },
      ],
      travel: [{ question: '"Aeropuerto" en inglés:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"Reunión" en inglés:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"Casa" en inglés:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"Veinte" en inglés:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
  },
  fr: {
    en: {
      greetings: [
        { question: 'Comment dit-on "Bonjour" en anglais ?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: 'Complétez: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
      ],
      food: [{ question: '"Eau" en anglais :', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 }],
      travel: [{ question: '"Aéroport" en anglais :', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"Réunion" en anglais :', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"Maison" en anglais :', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"Vingt" en anglais :', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
  },
  de: {
    en: {
      greetings: [
        { question: 'Wie sagt man "Hallo" auf Englisch?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: 'Ergänze: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
      ],
      food: [{ question: '"Wasser" auf Englisch:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 }],
      travel: [{ question: '"Flughafen" auf Englisch:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '"Besprechung" auf Englisch:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '"Haus" auf Englisch:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '"Zwanzig" auf Englisch:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
  },
  ja: {
    en: {
      greetings: [
        { question: '「こんにちは」は英語で？', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: '完成させて: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
      ],
      food: [{ question: '「水」は英語で？', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 }],
      travel: [{ question: '「空港」は英語で？', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 }],
      work: [{ question: '「会議」は英語で？', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 }],
      daily: [{ question: '「家」は英語で？', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 }],
      numbers: [{ question: '「二十」は英語で？', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 }],
    },
  },
};

const ExercisesTab = () => {
  const { course, nativeLang, level, completeExercise } = useApp();
  const tr = useTranslation(nativeLang);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const getExercises = (): Exercise[] => {
    if (!selectedCat) return [];
    return exerciseData[nativeLang]?.[course]?.[selectedCat]
      || exerciseData.pt?.[course]?.[selectedCat]
      || exerciseData.pt?.en?.[selectedCat]
      || [];
  };

  const exercises = getExercises();
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
          <h2 className="text-2xl font-black text-foreground mb-2">{tr('congrats')}</h2>
          <p className="text-muted-foreground mb-6">{tr('you_scored')} {score} {tr('of')} {exercises.length}!</p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
            {tr('continue')}
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
          <h2 className="text-2xl font-black text-foreground">{tr('exercises_title')}</h2>
          <p className="text-sm text-muted-foreground">{tr('level')} {level} · {tr('choose_category')}</p>
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
              <p className="font-bold text-foreground">{tr(cat.nameKey)}</p>
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
