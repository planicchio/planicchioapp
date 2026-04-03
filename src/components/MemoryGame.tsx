import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { wordBank, type LangCode } from '@/data/wordBank';

function getMemoryPairs(nativeLang: string, course: string): { word: string; translation: string }[] {
  const nl = nativeLang as LangCode;
  const cl = course as LangCode;
  const categories = ['food', 'animals', 'colors', 'greetings', 'daily'];
  const pairs: { word: string; translation: string }[] = [];
  for (const cat of categories) {
    const words = wordBank[cat] || [];
    for (const entry of words) {
      const courseWord = entry[cl];
      const nativeWord = entry[nl];
      if (courseWord && nativeWord && courseWord !== nativeWord) {
        pairs.push({ word: courseWord, translation: nativeWord });
      }
      if (pairs.length >= 8) break;
    }
    if (pairs.length >= 8) break;
  }
  return pairs.slice(0, 6);
}

interface Card {
  id: number;
  text: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const { course, nativeLang, addXp } = useApp();
  const tr = useTranslation(nativeLang);
  const pairs = useMemo(() => getMemoryPairs(nativeLang, course), [nativeLang, course]);

  const createCards = useCallback((): Card[] => {
    const cards: Card[] = [];
    pairs.forEach((pair, i) => {
      cards.push({ id: i * 2, text: pair.word, pairId: i, flipped: false, matched: false });
      cards.push({ id: i * 2 + 1, text: pair.translation, pairId: i, flipped: false, matched: false });
    });
    return cards.sort(() => Math.random() - 0.5);
  }, [pairs]);

  const [cards, setCards] = useState<Card[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (flippedIds.length === 2) {
      const [a, b] = flippedIds;
      const cardA = cards.find(c => c.id === a)!;
      const cardB = cards.find(c => c.id === b)!;

      if (cardA.pairId === cardB.pairId) {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.pairId === cardA.pairId ? { ...c, matched: true } : c));
          setMatchedCount(m => m + 1);
          setFlippedIds([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => flippedIds.includes(c.id) ? { ...c, flipped: false } : c));
          setFlippedIds([]);
        }, 800);
      }
      setMoves(m => m + 1);
    }
  }, [flippedIds, cards]);

  useEffect(() => {
    if (matchedCount === pairs.length && matchedCount > 0) {
      setFinished(true);
      addXp(20);
    }
  }, [matchedCount, pairs.length, addXp]);

  const handleFlip = (id: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlippedIds(prev => [...prev, id]);
  };

  const restart = () => {
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h2 className="text-2xl font-black text-foreground mb-2">{tr('congrats')}</h2>
          <p className="text-muted-foreground mb-2">{moves} {tr('moves')}!</p>
          <p className="text-muted-foreground mb-6">+20 XP ⭐</p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
              {tr('play_again')}
            </button>
            <button onClick={onBack} className="bg-card text-foreground font-bold px-6 py-3 rounded-full shadow-lg border border-border active:scale-95 transition-transform">
              {tr('back')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-foreground">🃏 {tr('memory_game')}</h2>
          <p className="text-xs text-muted-foreground">{tr('find_pairs')} · {moves} {tr('moves')} · {matchedCount}/{pairs.length} {tr('pairs_found')}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map(card => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(card.id)}
            className={`h-20 rounded-xl font-bold text-sm transition-all ${
              card.matched
                ? 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600 border-2'
                : card.flipped
                  ? 'bg-primary text-primary-foreground border-2 border-primary'
                  : 'bg-card border-2 border-border hover:border-primary/50'
            }`}
          >
            {card.flipped || card.matched ? card.text : '❓'}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
