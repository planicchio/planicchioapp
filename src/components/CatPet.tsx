import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const CatPet = () => {
  const { petMood, setPetMood, getPetEmoji, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [showPhrase, setShowPhrase] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [animClass, setAnimClass] = useState('cat-idle');

  const phrases = [
    tr('cat_phrase_1'), tr('cat_phrase_2'), tr('cat_phrase_3'), tr('cat_phrase_4'),
    tr('cat_phrase_5'), tr('cat_phrase_6'), tr('cat_phrase_7'), tr('cat_phrase_8'),
  ];

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
