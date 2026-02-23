import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

const WelcomeScreen = () => {
  const { setStage } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6 overflow-hidden relative">
      {/* Floating decorations */}
      <motion.div className="absolute top-10 left-10 text-4xl opacity-30" animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}>✨</motion.div>
      <motion.div className="absolute top-20 right-12 text-3xl opacity-30" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>📚</motion.div>
      <motion.div className="absolute bottom-32 left-8 text-3xl opacity-30" animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>🌍</motion.div>
      <motion.div className="absolute bottom-40 right-10 text-4xl opacity-30" animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.8 }}>🎓</motion.div>

      {/* Cat */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-[120px] mb-4 drop-shadow-lg cursor-pointer select-none"
        whileTap={{ scale: 1.3, rotate: 20 }}
      >
        🐱
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black text-primary-foreground mb-2 tracking-tight"
      >
        LinguaCat
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-primary-foreground/80 text-lg mb-10 text-center"
      >
        Aprenda idiomas de um jeito divertido! 🌍
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setStage('course')}
        className="bg-card text-primary font-extrabold text-xl px-14 py-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow"
      >
        Começar! 🚀
      </motion.button>
    </div>
  );
};

export default WelcomeScreen;
