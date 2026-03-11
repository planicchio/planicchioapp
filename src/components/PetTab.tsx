import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils, Gamepad2, Lock, MessageCircle } from 'lucide-react';
import { useApp, PETS } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const petStages = [
  { minLevel: 1, label: 'Bebê', emoji: '🥚', size: 'text-6xl' },
  { minLevel: 2, label: 'Filhote', emoji: '', size: 'text-7xl' },
  { minLevel: 4, label: 'Jovem', emoji: '', size: 'text-8xl' },
  { minLevel: 7, label: 'Adulto', emoji: '', size: 'text-9xl' },
  { minLevel: 10, label: 'Mestre', emoji: '👑', size: 'text-9xl' },
];

const PetTab = () => {
  const {
    pet, getPetEmoji, getPetLevel, petHunger, petEnergy, petHappiness,
    feedPet, playWithPet, nativeLang, xp, petMood
  } = useApp();
  const tr = useTranslation(nativeLang);
  const petLevel = getPetLevel();
  const [showVipChat, setShowVipChat] = useState(false);

  // Get pet stage
  let currentStage = petStages[0];
  for (let i = petStages.length - 1; i >= 0; i--) {
    if (petLevel >= petStages[i].minLevel) {
      currentStage = petStages[i];
      break;
    }
  }

  const petEmoji = getPetEmoji();
  const petName = PETS.find(p => p.id === pet)?.name || 'Pet';

  const moodText = petMood === 'happy' ? '😊' : petMood === 'sad' ? '😢' : petMood === 'dancing' ? '💃' : '😊';

  const canFeed = petHunger < 80;
  const canPlay = petEnergy < 80;

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-foreground">{tr('my_pet') || 'Meu Pet'}</h2>
      </div>

      {/* Pet Display */}
      <div className="bg-card rounded-2xl p-6 border border-border text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative">
          {currentStage.minLevel >= 10 && (
            <motion.span
              className="text-3xl absolute -top-2 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👑
            </motion.span>
          )}
          <motion.div
            className={`${currentStage.size} mb-3 inline-block`}
            animate={{
              y: [0, -10, 0],
              rotate: petMood === 'dancing' ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {petLevel < 2 ? '🥚' : petEmoji}
          </motion.div>
          <h3 className="text-xl font-black text-foreground">{petName}</h3>
          <p className="text-sm text-muted-foreground">
            {tr('level') || 'Nível'} {petLevel} · {currentStage.label} {moodText}
          </p>
          <div className="mt-2 inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {xp} XP {tr('total_xp') || 'total'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <span className="text-2xl">🍖</span>
          <p className="text-xs font-bold text-muted-foreground mt-1">{tr('hunger') || 'Fome'}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${petHunger}%`,
                backgroundColor: petHunger > 60 ? 'hsl(var(--primary))' : petHunger > 30 ? 'orange' : 'red',
              }}
            />
          </div>
          <span className="text-xs font-bold text-foreground">{petHunger}%</span>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <span className="text-2xl">⚡</span>
          <p className="text-xs font-bold text-muted-foreground mt-1">{tr('energy') || 'Energia'}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${petEnergy}%`,
                backgroundColor: petEnergy > 60 ? 'hsl(var(--primary))' : petEnergy > 30 ? 'orange' : 'red',
              }}
            />
          </div>
          <span className="text-xs font-bold text-foreground">{petEnergy}%</span>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <span className="text-2xl">💖</span>
          <p className="text-xs font-bold text-muted-foreground mt-1">{tr('happiness') || 'Felicidade'}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${petHappiness}%`,
                backgroundColor: petHappiness > 60 ? 'hsl(var(--primary))' : petHappiness > 30 ? 'orange' : 'red',
              }}
            />
          </div>
          <span className="text-xs font-bold text-foreground">{petHappiness}%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={feedPet}
          disabled={!canFeed}
          className={`bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 ${
            canFeed ? 'hover:shadow-md hover:border-primary/50' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <Utensils size={24} className="text-primary" />
          <span className="font-bold text-sm text-foreground">{tr('feed') || 'Alimentar'}</span>
          <span className="text-[10px] text-muted-foreground">+30 {tr('hunger') || 'Fome'}</span>
        </button>
        <button
          onClick={playWithPet}
          disabled={!canPlay}
          className={`bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-2 transition-all active:scale-95 ${
            canPlay ? 'hover:shadow-md hover:border-primary/50' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <Gamepad2 size={24} className="text-primary" />
          <span className="font-bold text-sm text-foreground">{tr('play') || 'Brincar'}</span>
          <span className="text-[10px] text-muted-foreground">+25 {tr('energy') || 'Energia'}</span>
        </button>
      </div>

      {/* Growth Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h3 className="font-black text-foreground mb-3 flex items-center gap-2">
          <Heart size={16} className="text-primary" />
          {tr('growth') || 'Crescimento'}
        </h3>
        <div className="space-y-2">
          {petStages.map((stage, i) => {
            const isActive = petLevel >= stage.minLevel;
            const isCurrent = currentStage === stage;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isCurrent ? 'bg-primary/10 border border-primary/30' : isActive ? 'opacity-70' : 'opacity-30'
                }`}
              >
                <span className="text-2xl">{stage.minLevel < 2 ? '🥚' : petEmoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{stage.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {tr('level') || 'Nível'} {stage.minLevel}+ ({stage.minLevel * 200} XP)
                  </p>
                </div>
                {isActive && <span className="text-green-500">✅</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP Chat */}
      <div className="bg-card rounded-2xl p-4 border-2 border-dashed border-primary/30">
        <div className="flex items-center gap-3">
          <Lock className="text-primary/50 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <MessageCircle size={14} />
              {tr('chat_with_pet') || 'Conversar com Pet'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {tr('chat_pet_desc') || 'Converse com seu pet usando IA! Disponível para VIP.'}
            </p>
          </div>
          <a
            href="https://buy.stripe.com/9B614o1gU3dXeHq7UeaMU01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            VIP
          </a>
        </div>
      </div>
    </div>
  );
};

export default PetTab;
