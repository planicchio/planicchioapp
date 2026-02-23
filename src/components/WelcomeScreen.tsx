import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

const WelcomeScreen = () => {
  const { setStage } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-6 overflow-hidden relative">

      {/* Floating decorations */}
      <motion.div className="absolute top-10 left-10 text-4xl opacity-30" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>✨</motion.div>
      <motion.div className="absolute top-20 right-12 text-3xl opacity-30" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>📚</motion.div>
      <motion.div className="absolute bottom-32 left-8 text-3xl opacity-30" animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>🌍</motion.div>

      {/* Mascote */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-[120px] mb-4 drop-shadow-lg cursor-pointer select-none"
        whileTap={{ scale: 1.2 }}
      >
        🐱
      </motion.div>

      {/* Nome do App */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black text-primary-foreground mb-2 tracking-tight"
      >
        Planicchio
      </motion.h1>

      {/* Descrição */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-primary-foreground/80 text-lg mb-8 text-center"
      >
        Aprenda idiomas de forma divertida e inteligente! 🌍
      </motion.p>

      {/* Botão principal */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setStage('course')}
        className="bg-card text-primary font-extrabold text-xl px-14 py-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow mb-4"
      >
        Começar 🚀
      </motion.button>

      {/* Botão VIP (preparação monetização) */}
      <button
        onClick={() => alert("Em breve: Plano VIP com conteúdos exclusivos! 💎")}
        className="text-sm text-primary-foreground/80 underline"
      >
        Seja VIP 💎
      </button>

    </div>
  );
};

export default WelcomeScreen;
