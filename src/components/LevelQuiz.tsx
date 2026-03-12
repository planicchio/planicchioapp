import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

// Helper to generate quiz for any native→target combination
const makeQuiz = (nativeLang: string, targetLang: string): Question[] => {
  // Universal quiz questions by target language, with answers translated to native language
  const helloMap: Record<string, string> = {
    en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao',
    ja: 'こんにちは', pt: 'Olá', ko: '안녕하세요',
  };
  const helloNative: Record<string, string> = {
    pt: 'Olá', en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo',
    it: 'Ciao', ja: 'こんにちは', ko: '안녕하세요',
  };
  const houseNative: Record<string, string> = {
    pt: 'Casa', en: 'House', es: 'Casa', fr: 'Maison', de: 'Haus',
    it: 'Casa', ja: '家', ko: '집',
  };
  const catNative: Record<string, string> = {
    pt: 'Gato', en: 'Cat', es: 'Gato', fr: 'Chat', de: 'Katze',
    it: 'Gatto', ja: '猫', ko: '고양이',
  };
  const bookNative: Record<string, string> = {
    pt: 'Livro', en: 'Book', es: 'Libro', fr: 'Livre', de: 'Buch',
    it: 'Libro', ja: '本', ko: '책',
  };
  const howeverNative: Record<string, string> = {
    pt: 'Entretanto', en: 'However', es: 'Sin embargo', fr: 'Cependant',
    de: 'Jedoch', it: 'Tuttavia', ja: 'それにもかかわらず', ko: '그럼에도 불구하고',
  };
  const becauseNative: Record<string, string> = {
    pt: 'Porque', en: 'Because', es: 'Porque', fr: 'Parce que',
    de: 'Weil', it: 'Perché', ja: 'なぜなら', ko: '왜냐하면',
  };
  const alwaysNative: Record<string, string> = {
    pt: 'Sempre', en: 'Always', es: 'Siempre', fr: 'Toujours',
    de: 'Immer', it: 'Sempre', ja: 'いつも', ko: '항상',
  };
  const neverNative: Record<string, string> = {
    pt: 'Nunca', en: 'Never', es: 'Nunca', fr: 'Jamais',
    de: 'Nie', it: 'Mai', ja: '決して', ko: '절대',
  };

  const sigWord: Record<string, string> = {
    pt: 'significa', en: 'means', es: 'significa', fr: 'signifie',
    de: 'bedeutet', it: 'significa', ja: 'の意味は', ko: '의 뜻은',
  };
  const completeWord: Record<string, string> = {
    pt: 'Complete', en: 'Complete', es: 'Completa', fr: 'Complétez',
    de: 'Ergänze', it: 'Completa', ja: '完成させて', ko: '완성하세요',
  };

  const sig = sigWord[nativeLang] || 'means';
  const comp = completeWord[nativeLang] || 'Complete';
  const nl = nativeLang;

  const hello = helloMap[targetLang] || 'Hello';

  // Target-specific grammar questions
  const grammarQuestions: Record<string, Question[]> = {
    en: [
      { question: `${comp}: "I ___ a student"`, options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: `"go" → past:`, options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: `"I would have gone if..." → ?`, options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: `${comp}: "Yo ___ estudiante"`, options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: `"ir" → pasado:`, options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: `Subjuntivo de "tener":`, options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: `${comp}: "Je ___ étudiant"`, options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: `Passé composé de "aller":`, options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: `Subjonctif de "avoir":`, options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: `${comp}: "Ich ___ Student"`, options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: `"gehen" → Vergangenheit:`, options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: `Konjunktiv II "haben":`, options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: `${comp}: "Io ___ studente"`, options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: `Passato prossimo "andare":`, options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: `Congiuntivo "avere":`, options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [
      { question: `${comp}: "私は学生___"`, options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: `"食べる" → 過去:`, options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: `"する" → 敬語:`, options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
    pt: [
      { question: `${comp}: "Eu ___ estudante"`, options: ['sou', 'é', 'são', 'és'], correct: 0 },
      { question: `"ir" → passado:`, options: ['fui', 'ia', 'vou', 'irei'], correct: 0 },
      { question: `Subjuntivo "ter":`, options: ['tenha', 'tem', 'tenho', 'tinha'], correct: 0 },
    ],
    ko: [
      { question: `${comp}: "저는 학생___"`, options: ['입니다', '이다', '했다', '있다'], correct: 0 },
      { question: `"먹다" → 과거:`, options: ['먹었다', '먹는다', '먹을다', '먹다'], correct: 0 },
      { question: `"감사합니다" ${sig}:`, options: [
        nl === 'pt' ? 'Obrigado' : nl === 'en' ? 'Thank you' : nl === 'es' ? 'Gracias' : nl === 'fr' ? 'Merci' : nl === 'de' ? 'Danke' : nl === 'it' ? 'Grazie' : nl === 'ja' ? 'ありがとう' : '감사합니다',
        helloNative[nl] || 'Hello',
        catNative[nl] || 'Cat',
        bookNative[nl] || 'Book',
      ], correct: 0 },
    ],
  };

  // However word for the target language
  const howeverTarget: Record<string, string> = {
    en: 'Nevertheless', es: 'Sin embargo', fr: 'Cependant', de: 'Jedoch',
    it: 'Tuttavia', ja: 'しかし', pt: 'Entretanto', ko: '하지만',
  };

  return [
    {
      question: `"${hello}" ${sig}...`,
      options: [helloNative[nl]!, houseNative[nl]!, catNative[nl]!, bookNative[nl]!],
      correct: 0,
    },
    ...(grammarQuestions[targetLang]?.slice(0, 2) || []),
    {
      question: `"${howeverTarget[targetLang] || 'However'}" ${sig}:`,
      options: [howeverNative[nl]!, becauseNative[nl]!, alwaysNative[nl]!, neverNative[nl]!],
      correct: 0,
    },
    ...(grammarQuestions[targetLang]?.slice(2) || []),
  ];
};

function shuffleQuestion(question: Question): Question {
  if (question.options.length <= 1) return question;
  const options = [...question.options];
  const correctAnswer = options[question.correct];
  const shuffled = options.map(o => ({ o, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ o }) => o);
  return { question: question.question, options: shuffled, correct: shuffled.indexOf(correctAnswer) };
}

const getLevel = (score: number, total: number): string => {
  const ratio = score / Math.max(total, 1);
  if (ratio <= 0.2) return 'A1';
  if (ratio <= 0.4) return 'A2';
  if (ratio <= 0.6) return 'B1';
  if (ratio <= 0.8) return 'B2';
  return 'C1';
};

const LevelQuiz = () => {
  const { course, nativeLang, setLevel, setStage } = useApp();
  const tr = useTranslation(nativeLang);

  // If trying to learn own language, skip quiz
  const isOwnLang = course === nativeLang;

  const [questions] = useState(() => {
    if (isOwnLang) return [];
    return makeQuiz(nativeLang, course).map(q => shuffleQuestion(q));
  });
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Skip quiz for own language
  if (isOwnLang) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <span className="text-7xl block mb-4">🏠</span>
        <p className="text-lg text-foreground font-bold mb-6 text-center">
          {nativeLang === 'pt' ? 'Este é seu idioma nativo!' :
           nativeLang === 'en' ? 'This is your native language!' :
           nativeLang === 'es' ? '¡Este es tu idioma nativo!' :
           nativeLang === 'fr' ? "C'est votre langue maternelle !" :
           nativeLang === 'de' ? 'Das ist deine Muttersprache!' :
           nativeLang === 'it' ? 'Questa è la tua lingua madre!' :
           nativeLang === 'ja' ? 'これはあなたの母語です！' :
           '이것은 당신의 모국어입니다!'}
        </p>
        <button onClick={() => setStage('course')} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full">
          {tr('back')}
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-foreground font-bold mb-4">Content loading...</p>
        <button onClick={() => setStage('course')} className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-full flex items-center gap-2">
          <ArrowLeft size={16} /> {tr('back')}
        </button>
      </div>
    );
  }

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
    const level = getLevel(score, questions.length);
    setLevel(level);
    setStage('app');
  };

  if (showResult) {
    const level = getLevel(score, questions.length);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h1 className="text-3xl font-black text-foreground mb-2">{tr('your_level')}</h1>
          <div className="bg-primary text-primary-foreground text-5xl font-black rounded-2xl px-8 py-4 mb-4 inline-block">{level}</div>
          <p className="text-muted-foreground mb-8">{tr('you_got')} {score} {tr('of')} {questions.length}!</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleFinish}
            className="bg-primary text-primary-foreground font-bold text-xl px-12 py-4 rounded-full shadow-lg">
            {tr('lets_go')}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <button onClick={() => setStage('course')} className="self-start flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft size={20} />
        <span className="font-bold text-sm">{tr('back')}</span>
      </button>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-muted-foreground">{tr('question')} {current + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-primary">🏆 {score} {tr('correct_answers')}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div className="bg-primary h-full rounded-full" animate={{ width: `${((current + 1) / questions.length) * 100}%` }} />
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
                <motion.button key={i}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 rounded-xl border-2 text-left font-bold text-lg transition-colors ${style}`}>
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
