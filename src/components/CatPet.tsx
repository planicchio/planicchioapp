import { useState, useEffect, useRef } from 'react';
import { useApp, PETS } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const petPhraseKeys: Record<string, string[]> = {
  cat: ['cat_phrase_1', 'cat_phrase_2', 'cat_phrase_3', 'cat_phrase_4', 'cat_phrase_5', 'cat_phrase_6', 'cat_phrase_7', 'cat_phrase_8'],
  dog: ['dog_phrase_1', 'dog_phrase_2', 'dog_phrase_3', 'dog_phrase_4', 'dog_phrase_5', 'dog_phrase_6', 'dog_phrase_7', 'dog_phrase_8'],
  panda: ['panda_phrase_1', 'panda_phrase_2', 'panda_phrase_3', 'panda_phrase_4', 'panda_phrase_5', 'panda_phrase_6', 'panda_phrase_7', 'panda_phrase_8'],
  rabbit: ['rabbit_phrase_1', 'rabbit_phrase_2', 'rabbit_phrase_3', 'rabbit_phrase_4', 'rabbit_phrase_5', 'rabbit_phrase_6', 'rabbit_phrase_7', 'rabbit_phrase_8'],
  fox: ['fox_phrase_1', 'fox_phrase_2', 'fox_phrase_3', 'fox_phrase_4', 'fox_phrase_5', 'fox_phrase_6', 'fox_phrase_7', 'fox_phrase_8'],
};

const POS_KEY = 'planicchio_pet_position';
const SIZE = 60;

const CatPet = () => {
  const { petMood, setPetMood, getPetEmoji, pet, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [showPhrase, setShowPhrase] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [animClass, setAnimClass] = useState('cat-idle');
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
      if (saved && typeof saved.x === 'number') return saved;
    } catch {}
    return { x: window.innerWidth - 80, y: window.innerHeight - 160 };
  });
  const dragState = useRef<{ dragging: boolean; moved: boolean; offX: number; offY: number }>({
    dragging: false, moved: false, offX: 0, offY: 0,
  });

  const phrases = (petPhraseKeys[pet] || petPhraseKeys.cat).map(k => tr(k));

  useEffect(() => {
    switch (petMood) {
      case 'happy': setAnimClass('cat-happy'); break;
      case 'sad': setAnimClass('cat-sad'); break;
      case 'dancing': setAnimClass('cat-dance'); break;
      default: setAnimClass('cat-idle');
    }
  }, [petMood]);

  useEffect(() => {
    const clamp = () => {
      setPos(p => ({
        x: Math.min(Math.max(0, p.x), window.innerWidth - SIZE),
        y: Math.min(Math.max(0, p.y), window.innerHeight - SIZE),
      }));
    };
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    dragState.current = {
      dragging: true, moved: false,
      offX: clientX - pos.x, offY: clientY - pos.y,
    };
  };
  const onMove = (clientX: number, clientY: number) => {
    if (!dragState.current.dragging) return;
    const nx = Math.min(Math.max(0, clientX - dragState.current.offX), window.innerWidth - SIZE);
    const ny = Math.min(Math.max(0, clientY - dragState.current.offY), window.innerHeight - SIZE);
    if (Math.abs(clientX - dragState.current.offX - pos.x) > 3 || Math.abs(clientY - dragState.current.offY - pos.y) > 3) {
      dragState.current.moved = true;
    }
    setPos({ x: nx, y: ny });
  };
  const endDrag = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    localStorage.setItem(POS_KEY, JSON.stringify(pos));
    if (!dragState.current.moved) {
      // treat as click
      setPetMood('dancing');
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setPhrase(randomPhrase);
      setShowPhrase(true);
      setTimeout(() => setShowPhrase(false), 2500);
    }
  };

  useEffect(() => {
    const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const mu = () => endDrag();
    const tm = (e: TouchEvent) => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); };
    const tu = () => endDrag();
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    window.addEventListener('touchmove', tm, { passive: false });
    window.addEventListener('touchend', tu);
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('touchend', tu);
    };
  });

  return (
    <div
      className="fixed z-50 flex flex-col items-end select-none"
      style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
    >
      {showPhrase && (
        <div className="pop-in bg-card text-foreground text-sm font-bold px-3 py-2 rounded-2xl rounded-br-sm shadow-lg mb-2 max-w-[180px] border border-border">
          {phrase}
        </div>
      )}
      <button
        onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
        onTouchStart={(e) => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
        className={`text-5xl select-none cursor-grab active:cursor-grabbing transition-transform ${animClass} drop-shadow-md hover:drop-shadow-xl`}
        aria-label="Pet interativo"
      >
        {getPetEmoji()}
      </button>
    </div>
  );
};

export default CatPet;
