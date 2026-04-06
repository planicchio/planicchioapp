import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

const makeQuiz = (nativeLang: string, targetLang: string): Question[] => {
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

  // Explanation templates
  const explBasic: Record<string, string> = {
    pt: 'Esta é uma saudação básica.', en: 'This is a basic greeting.',
    es: 'Este es un saludo básico.', fr: "C'est une salutation de base.",
    de: 'Das ist eine einfache Begrüßung.', it: 'Questo è un saluto di base.',
    ja: 'これは基本的な挨拶です。', ko: '이것은 기본 인사입니다.',
  };
  const explGrammar: Record<string, string> = {
    pt: 'Atenção à conjugação verbal!', en: 'Pay attention to verb conjugation!',
    es: '¡Atención a la conjugación!', fr: 'Attention à la conjugaison!',
    de: 'Achte auf die Verbkonjugation!', it: 'Attenzione alla coniugazione!',
    ja: '動詞の活用に注意！', ko: '동사 활용에 주의하세요!',
  };
  const explAdvanced: Record<string, string> = {
    pt: 'Vocabulário avançado.', en: 'Advanced vocabulary.',
    es: 'Vocabulario avanzado.', fr: 'Vocabulaire avancé.',
    de: 'Fortgeschrittener Wortschatz.', it: 'Vocabolario avanzato.',
    ja: '上級語彙。', ko: '고급 어휘.',
  };

  const sig = sigWord[nativeLang] || 'means';
  const comp = completeWord[nativeLang] || 'Complete';
  const nl = nativeLang;
  const hello = helloMap[targetLang] || 'Hello';

  const grammarQuestions: Record<string, Question[]> = {
    en: [
      { question: `${comp}: "I ___ a student"`, options: ['am', 'is', 'are', 'be'], correct: 0, explanation: explGrammar[nl] },
      { question: `"go" → past:`, options: ['goed', 'went', 'gone', 'going'], correct: 1, explanation: explGrammar[nl] },
      { question: `"I would have gone if..." → ?`, options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1, explanation: explAdvanced[nl] },
    ],
    es: [
      { question: `${comp}: "Yo ___ estudiante"`, options: ['soy', 'es', 'son', 'eres'], correct: 0, explanation: explGrammar[nl] },
      { question: `"ir" → pasado:`, options: ['fui', 'iba', 'voy', 'iré'], correct: 0, explanation: explGrammar[nl] },
      { question: `Subjuntivo de "tener":`, options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0, explanation: explAdvanced[nl] },
    ],
    fr: [
      { question: `${comp}: "Je ___ étudiant"`, options: ['suis', 'est', 'es', 'sont'], correct: 0, explanation: explGrammar[nl] },
      { question: `Passé composé de "aller":`, options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0, explanation: explGrammar[nl] },
      { question: `Subjonctif de "avoir":`, options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0, explanation: explAdvanced[nl] },
    ],
    de: [
      { question: `${comp}: "Ich ___ Student"`, options: ['bin', 'ist', 'bist', 'sind'], correct: 0, explanation: explGrammar[nl] },
      { question: `"gehen" → Vergangenheit:`, options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0, explanation: explGrammar[nl] },
      { question: `Konjunktiv II "haben":`, options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0, explanation: explAdvanced[nl] },
    ],
    it: [
      { question: `${comp}: "Io ___ studente"`, options: ['sono', 'è', 'sei', 'siamo'], correct: 0, explanation: explGrammar[nl] },
      { question: `Passato prossimo "andare":`, options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0, explanation: explGrammar[nl] },
      { question: `Congiuntivo "avere":`, options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0, explanation: explAdvanced[nl] },
    ],
    ja: [
      { question: `${comp}: "私は学生___"`, options: ['です', 'だ', 'ます', 'いる'], correct: 0, explanation: explGrammar[nl] },
      { question: `"食べる" → 過去:`, options: ['食べた', '食べます', '食べない', '食べて'], correct: 0, explanation: explGrammar[nl] },
      { question: `"する" → 敬語:`, options: ['なさる', 'します', 'した', 'する'], correct: 0, explanation: explAdvanced[nl] },
    ],
    pt: [
      { question: `${comp}: "Eu ___ estudante"`, options: ['sou', 'é', 'são', 'és'], correct: 0, explanation: explGrammar[nl] },
      { question: `"ir" → passado:`, options: ['fui', 'ia', 'vou', 'irei'], correct: 0, explanation: explGrammar[nl] },
      { question: `Subjuntivo "ter":`, options: ['tenha', 'tem', 'tenho', 'tinha'], correct: 0, explanation: explAdvanced[nl] },
    ],
    ko: [
      { question: `${comp}: "저는 학생___"`, options: ['입니다', '이다', '했다', '있다'], correct: 0, explanation: explGrammar[nl] },
      { question: `"먹다" → 과거:`, options: ['먹었다', '먹는다', '먹을다', '먹다'], correct: 0, explanation: explGrammar[nl] },
      { question: `"감사합니다" ${sig}:`, options: [
        nl === 'pt' ? 'Obrigado' : nl === 'en' ? 'Thank you' : nl === 'es' ? 'Gracias' : nl === 'fr' ? 'Merci' : nl === 'de' ? 'Danke' : nl === 'it' ? 'Grazie' : nl === 'ja' ? 'ありがとう' : '감사합니다',
        helloNative[nl] || 'Hello', catNative[nl] || 'Cat', bookNative[nl] || 'Book',
      ], correct: 0, explanation: explBasic[nl] },
    ],
  };

  const howeverTarget: Record<string, string> = {
    en: 'Nevertheless', es: 'Sin embargo', fr: 'Cependant', de: 'Jedoch',
    it: 'Tuttavia', ja: 'しかし', pt: 'Entretanto', ko: '하지만',
  };

  return [
    {
      question: `"${hello}" ${sig}...`,
      options: [helloNative[nl]!, houseNative[nl]!, catNative[nl]!, bookNative[nl]!],
      correct: 0,
      explanation: explBasic[nl],
    },
    ...(grammarQuestions[targetLang]?.slice(0, 2) || []),
    {
      question: `"${howeverTarget[targetLang] || 'However'}" ${sig}:`,
      options: [howeverNative[nl]!, becauseNative[nl]!, alwaysNative[nl]!, neverNative[nl]!],
      correct: 0,
      explanation: explAdvanced[nl],
    },
    ...(grammarQuestions[targetLang]?.slice(2) || []),
  ];
};

function shuffleQuestion(question: Question): Question {
  if (question.options.length <= 1) return question;
  const options = [...question.options];
  const correctAnswer = options[question.correct];
  const shuffled = options.map(o => ({ o, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ o }) => o);
  return { ...question, options: shuffled, correct: shuffled.indexOf(correctAnswer) };
}

const getLevel = (score: number, total: number): string => {
  const ratio = score / Math.max(total, 1);
  if (ratio <= 0.2) return 'A1';
  if (ratio <= 0.4) return 'A2';
  if (ratio <= 0.6) return 'B1';
  if (ratio <= 0.8) return 'B2';
  return 'C1';
};

const levelDescriptions: Record<string, Record<string, string>> = {
  A1: { pt: 'Iniciante absoluto. Você está começando!', en: 'Absolute beginner. You are just starting!', es: '¡Principiante absoluto!', fr: 'Débutant absolu !', de: 'Absoluter Anfänger!', it: 'Principiante assoluto!', ja: '完全な初心者です！', ko: '완전 초보입니다!' },
  A2: { pt: 'Iniciante. Conhece o básico!', en: 'Elementary. You know the basics!', es: '¡Nivel elemental!', fr: 'Élémentaire !', de: 'Elementarstufe!', it: 'Elementare!', ja: '初級者です！', ko: '초급입니다!' },
  B1: { pt: 'Intermediário. Bom progresso!', en: 'Intermediate. Good progress!', es: '¡Intermedio! ¡Buen progreso!', fr: 'Intermédiaire !', de: 'Mittelstufe!', it: 'Intermedio!', ja: '中級者です！', ko: '중급입니다!' },
  B2: { pt: 'Intermediário superior. Quase fluente!', en: 'Upper intermediate. Almost fluent!', es: '¡Intermedio alto!', fr: 'Intermédiaire supérieur !', de: 'Obere Mittelstufe!', it: 'Intermedio superiore!', ja: '中上級です！', ko: '중상급입니다!' },
  C1: { pt: 'Avançado. Muito bem!', en: 'Advanced. Excellent!', es: '¡Avanzado! ¡Excelente!', fr: 'Avancé ! Excellent !', de: 'Fortgeschritten! Ausgezeichnet!', it: 'Avanzato! Eccellente!', ja: '上級者です！素晴らしい！', ko: '고급입니다! 훌륭합니다!' },
  C2: { pt: 'Quase nativo. Impressionante!', en: 'Near native. Impressive!', es: '¡Casi nativo!', fr: 'Presque natif !', de: 'Fast muttersprachlich!', it: 'Quasi madrelingua!', ja: 'ネイティブ級です！', ko: '원어민 수준입니다!' },
};

const skipText: Record<string, string> = {
  pt: 'Pular e escolher nível', en: 'Skip and choose level', es: 'Saltar y elegir nivel',
  fr: 'Passer et choisir le niveau', de: 'Überspringen und Level wählen', it: 'Salta e scegli il livello',
  ja: 'スキップしてレベルを選ぶ', ko: '건너뛰고 레벨 선택',
};

const chooseManually: Record<string, string> = {
  pt: 'Escolha seu nível:', en: 'Choose your level:', es: 'Elige tu nivel:',
  fr: 'Choisissez votre niveau:', de: 'Wähle dein Level:', it: 'Scegli il tuo livello:',
  ja: 'レベルを選んでください:', ko: '레벨을 선택하세요:',
};

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LevelQuiz = () => {
  const { course, nativeLang, setLevel, setStage } = useApp();
  const tr = useTranslation(nativeLang);
  const isOwnLang = course === nativeLang;

  const [questions] = useState(() => {
    if (isOwnLang) return [];
    return makeQuiz(nativeLang, course).map(q => shuffleQuestion(q));
  });
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showManualPick, setShowManualPick] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);

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

  // Manual level picker
  if (showManualPick) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <button onClick={() => setShowManualPick(false)} className="self-start flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">{tr('back')}</span>
        </button>
        <span className="text-5xl block mb-4">🎯</span>
        <h2 className="text-xl font-black text-foreground mb-6">{chooseManually[nativeLang] || chooseManually.en}</h2>
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {levels.map(l => (
            <motion.button key={l} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setLevel(l); setStage('app'); }}
              className="bg-card border-2 border-border rounded-2xl p-4 text-center hover:border-primary transition-colors">
              <span className="text-2xl font-black text-primary block">{l}</span>
              <p className="text-[10px] text-muted-foreground mt-1">{levelDescriptions[l]?.[nativeLang]?.split('.')[0] || l}</p>
            </motion.button>
          ))}
        </div>
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
    setAnsweredCorrectly(prev => [...prev, correct]);
    setShowExplanation(true);

    setTimeout(() => {
      setShowExplanation(false);
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 2500);
  };

  const handleFinish = () => {
    const level = getLevel(score, questions.length);
    setLevel(level);
    setStage('app');
  };

  if (showResult) {
    const level = getLevel(score, questions.length);
    const desc = levelDescriptions[level]?.[nativeLang] || levelDescriptions[level]?.en || '';
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h1 className="text-3xl font-black text-foreground mb-2">{tr('your_level')}</h1>
          <div className="bg-primary text-primary-foreground text-5xl font-black rounded-2xl px-8 py-4 mb-3 inline-block">{level}</div>
          <p className="text-muted-foreground mb-2">{tr('you_got')} {score} {tr('of')} {questions.length}!</p>
          <p className="text-sm text-foreground font-semibold mb-2">{desc}</p>

          {/* Question review */}
          <div className="bg-card rounded-xl p-3 border border-border text-left mb-4 max-w-sm mx-auto">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2 py-1 text-xs">
                <span>{answeredCorrectly[i] ? '✅' : '❌'}</span>
                <span className="text-foreground truncate flex-1">{q.question}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleFinish}
              className="bg-primary text-primary-foreground font-bold text-xl px-12 py-4 rounded-full shadow-lg">
              {tr('lets_go')}
            </motion.button>
            <button onClick={() => setShowManualPick(true)}
              className="text-sm text-primary font-bold hover:underline">
              {skipText[nativeLang] || skipText.en}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setStage('course')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">{tr('back')}</span>
        </button>
        <button onClick={() => setShowManualPick(true)}
          className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
          {skipText[nativeLang] || skipText.en}
        </button>
      </div>

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

          {/* Explanation */}
          {showExplanation && selected !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl border-2 max-w-md mx-auto w-full ${
                selected === questions[current].correct
                  ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600'
                  : 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-600'
              }`}>
              <p className="font-bold text-sm mb-1">
                {selected === questions[current].correct ? '✅' : '❌'} {questions[current].options[questions[current].correct]}
              </p>
              {questions[current].explanation && (
                <p className="text-xs text-muted-foreground">{questions[current].explanation}</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LevelQuiz;
