import { useState, useEffect } from 'react';
import { useApp, PETS } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const petPhraseKeys: Record<string, string[]> = {
  cat: ['cat_phrase_1', 'cat_phrase_2', 'cat_phrase_3', 'cat_phrase_4', 'cat_phrase_5', 'cat_phrase_6', 'cat_phrase_7', 'cat_phrase_8'],
  dog: ['dog_phrase_1', 'dog_phrase_2', 'dog_phrase_3', 'dog_phrase_4', 'dog_phrase_5', 'dog_phrase_6', 'dog_phrase_7', 'dog_phrase_8'],
  panda: ['panda_phrase_1', 'panda_phrase_2', 'panda_phrase_3', 'panda_phrase_4', 'panda_phrase_5', 'panda_phrase_6', 'panda_phrase_7', 'panda_phrase_8'],
  rabbit: ['rabbit_phrase_1', 'rabbit_phrase_2', 'rabbit_phrase_3', 'rabbit_phrase_4', 'rabbit_phrase_5', 'rabbit_phrase_6', 'rabbit_phrase_7', 'rabbit_phrase_8'],
  fox: ['fox_phrase_1', 'fox_phrase_2', 'fox_phrase_3', 'fox_phrase_4', 'fox_phrase_5', 'fox_phrase_6', 'fox_phrase_7', 'fox_phrase_8'],
};

const CatPet = () => {
  const { petMood, setPetMood, getPetEmoji, pet, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [showPhrase, setShowPhrase] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [animClass, setAnimClass] = useState('cat-idle');

  const phrases = (petPhraseKeys[pet] || petPhraseKeys.cat).map(k => tr(k));

  useEffect(() => {
    switch (petMood) {
      case 'happy': setAnimClass('cat-happy'); break;
      case 'sad': setAnimClass('cat-sad'); break;
      case 'dancing': setAnimClass('cat-dance'); break;
      default: setAnimClass('cat-idle');
    }
  }, [petMood]);

  const handleClick = () => {
    setPetMood('dancing');
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPhrase(randomPhrase);
    setShowPhrase(true);
    setTimeout(() => setShowPhrase(false), 2500);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
      {showPhrase && (
        <div className="pop-in bg-card text-foreground text-sm font-bold px-3 py-2 rounded-2xl rounded-br-sm shadow-lg mb-2 max-w-[180px] border border-border">
          {phrase}
        </div>
      )}
      <button
        onClick={handleClick}
        className={`text-5xl select-none cursor-pointer transition-transform ${animClass} drop-shadow-md hover:drop-shadow-xl`}
        aria-label="Pet interativo"
      >
        {getPetEmoji()}
      </button>
    </div>
  );
};

export default CatPet;
