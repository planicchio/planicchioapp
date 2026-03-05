import { useState, useCallback } from 'react';
import { ArrowLeft, Volume2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface ListenQuestion {
  word: string;
  options: string[];
  correct: number;
}

const listenData: Record<string, Record<string, ListenQuestion[]>> = {
  en: [
    { word: 'Hello', options: ['Olá', 'Tchau', 'Obrigado', 'Por favor'], correct: 0 },
    { word: 'Good morning', options: ['Bom dia', 'Boa noite', 'Boa tarde', 'Tchau'], correct: 0 },
    { word: 'Thank you very much', options: ['Muito obrigado', 'De nada', 'Com licença', 'Desculpe'], correct: 0 },
    { word: 'How are you?', options: ['Como você está?', 'Onde você mora?', 'Qual seu nome?', 'Quantos anos tem?'], correct: 0 },
    { word: 'I love you', options: ['Eu te amo', 'Eu te odeio', 'Eu te conheço', 'Eu te ajudo'], correct: 0 },
  ],
  es: [
    { word: 'Hola', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0 },
    { word: 'Buenos días', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
    { word: 'Muchas gracias', options: ['Muito obrigado', 'De nada', 'Com licença', 'Tchau'], correct: 0 },
    { word: '¿Cómo estás?', options: ['Como você está?', 'Onde mora?', 'Qual seu nome?', 'Quantos anos?'], correct: 0 },
  ],
  fr: [
    { word: 'Bonjour', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
    { word: 'Merci beaucoup', options: ['Muito obrigado', 'De nada', 'Com licença', 'Tchau'], correct: 0 },
    { word: 'Comment allez-vous?', options: ['Como vai você?', 'Onde mora?', 'Qual seu nome?', 'Quanto custa?'], correct: 0 },
  ],
  de: [
    { word: 'Guten Morgen', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
    { word: 'Danke schön', options: ['Muito obrigado', 'De nada', 'Com licença', 'Tchau'], correct: 0 },
    { word: 'Wie geht es Ihnen?', options: ['Como vai você?', 'Onde mora?', 'Qual seu nome?', 'Quanto custa?'], correct: 0 },
  ],
  it: [
    { word: 'Buongiorno', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
    { word: 'Grazie mille', options: ['Muito obrigado', 'De nada', 'Com licença', 'Tchau'], correct: 0 },
    { word: 'Come stai?', options: ['Como vai você?', 'Onde mora?', 'Qual seu nome?', 'Quanto custa?'], correct: 0 },
  ],
  ja: [
    { word: 'おはようございます', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
    { word: 'ありがとうございます', options: ['Muito obrigado', 'De nada', 'Com licença', 'Tchau'], correct: 0 },
  ],
  pt: [
    { word: 'Bom dia', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
    { word: 'Obrigado', options: ['Thank you', 'Please', 'Sorry', 'Hello'], correct: 0 },
  ],
  ko: [
    { word: '안녕하세요', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0 },
    { word: '감사합니다', options: ['Obrigado', 'De nada', 'Com licença', 'Tchau'], correct: 0 },
  ],
};

// Adapt options to native language
const listenDataByNative: Record<string, Record<string, ListenQuestion[]>> = {
  pt: listenData,
  en: {
    es: [
      { word: 'Hola', options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'], correct: 0 },
      { word: 'Buenos días', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
      { word: 'Muchas gracias', options: ['Thank you very much', "You're welcome", 'Excuse me', 'Goodbye'], correct: 0 },
    ],
    fr: [
      { word: 'Bonjour', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
      { word: 'Merci beaucoup', options: ['Thank you very much', "You're welcome", 'Excuse me', 'Goodbye'], correct: 0 },
    ],
    de: [
      { word: 'Guten Morgen', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
      { word: 'Danke schön', options: ['Thank you very much', "You're welcome", 'Excuse me', 'Goodbye'], correct: 0 },
    ],
    it: [
      { word: 'Buongiorno', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
      { word: 'Grazie mille', options: ['Thank you very much', "You're welcome", 'Excuse me', 'Goodbye'], correct: 0 },
    ],
    ja: [
      { word: 'おはようございます', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
    ],
    pt: [
      { word: 'Bom dia', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
    ],
    ko: [
      { word: '안녕하세요', options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'], correct: 0 },
    ],
    en: [],
  },
  it: {
    en: [
      { word: 'Hello', options: ['Ciao', 'Arrivederci', 'Grazie', 'Scusa'], correct: 0 },
      { word: 'Good morning', options: ['Buongiorno', 'Buonasera', 'Arrivederci', 'Grazie'], correct: 0 },
      { word: 'Thank you', options: ['Grazie', 'Prego', 'Scusa', 'Ciao'], correct: 0 },
    ],
    es: [
      { word: 'Hola', options: ['Ciao', 'Arrivederci', 'Grazie', 'Scusa'], correct: 0 },
    ],
    fr: [
      { word: 'Bonjour', options: ['Buongiorno', 'Arrivederci', 'Grazie', 'Scusa'], correct: 0 },
    ],
    de: [
      { word: 'Guten Morgen', options: ['Buongiorno', 'Buonasera', 'Arrivederci', 'Grazie'], correct: 0 },
    ],
    it: [],
    ja: [
      { word: 'おはようございます', options: ['Buongiorno', 'Buonasera', 'Arrivederci', 'Grazie'], correct: 0 },
    ],
    pt: [
      { word: 'Bom dia', options: ['Buongiorno', 'Buonasera', 'Arrivederci', 'Grazie'], correct: 0 },
    ],
    ko: [
      { word: '안녕하세요', options: ['Ciao', 'Arrivederci', 'Grazie', 'Scusa'], correct: 0 },
    ],
  },
};

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

  const questions = listenDataByNative[nativeLang]?.[course] || listenData[course] || listenData.en;
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
