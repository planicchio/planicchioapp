import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

const languages = [
  { id: 'pt', name: 'Português', flag: '🇧🇷', greeting: 'Qual idioma você fala?' },
  { id: 'en', name: 'English', flag: '🇺🇸', greeting: 'What language do you speak?' },
  { id: 'es', name: 'Español', flag: '🇪🇸', greeting: '¿Qué idioma hablas?' },
  { id: 'fr', name: 'Français', flag: '🇫🇷', greeting: 'Quelle langue parlez-vous ?' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪', greeting: 'Welche Sprache sprichst du?' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹', greeting: 'Che lingua parli?' },
  { id: 'ja', name: '日本語', flag: '🇯🇵', greeting: 'あなたの言語は何ですか？' },
  { id: 'ko', name: '한국어', flag: '🇰🇷', greeting: '어떤 언어를 사용하시나요?' },
];

const LanguageSelect = () => {
  const { setNativeLang, setStage } = useApp();

  const handleSelect = (id: string) => {
    setNativeLang(id as any);
    setStage('course');
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
      {/* Animated header with all greetings */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.span
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[80px] block mb-4 drop-shadow-lg"
        >
          🐱
        </motion.span>
        <h1 className="text-4xl font-black text-primary-foreground mb-2">Planicchio</h1>
        <div className="space-y-0.5">
          {languages.map((lang, i) => (
            <motion.p
              key={lang.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.15 }}
              className="text-primary-foreground/70 text-sm"
            >
              {lang.greeting}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Language buttons */}
      <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
        {languages.map((lang, i) => (
          <motion.button
            key={lang.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(lang.id)}
            className="bg-card rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-1 border border-border"
          >
            <span className="text-3xl">{lang.flag}</span>
            <span className="font-bold text-foreground">{lang.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelect;
