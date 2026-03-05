import { useState } from 'react';
import { Search, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

// Dictionary: word in target language -> translation in native language
const dictionaryData: Record<string, Record<string, { word: string; translation: string; pronunciation?: string }[]>> = {
  pt: {
    en: [
      { word: 'Hello', translation: 'Olá', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: 'Tchau', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: 'Obrigado', pronunciation: '/θæŋk juː/' },
      { word: 'Please', translation: 'Por favor', pronunciation: '/pliːz/' },
      { word: 'Water', translation: 'Água', pronunciation: '/ˈwɔːtər/' },
      { word: 'Food', translation: 'Comida', pronunciation: '/fuːd/' },
      { word: 'House', translation: 'Casa', pronunciation: '/haʊs/' },
      { word: 'Love', translation: 'Amor', pronunciation: '/lʌv/' },
      { word: 'Friend', translation: 'Amigo', pronunciation: '/frɛnd/' },
      { word: 'Family', translation: 'Família', pronunciation: '/ˈfæmɪli/' },
      { word: 'Work', translation: 'Trabalho', pronunciation: '/wɜːrk/' },
      { word: 'School', translation: 'Escola', pronunciation: '/skuːl/' },
      { word: 'Beautiful', translation: 'Bonito', pronunciation: '/ˈbjuːtɪfəl/' },
      { word: 'Happy', translation: 'Feliz', pronunciation: '/ˈhæpi/' },
      { word: 'Good morning', translation: 'Bom dia', pronunciation: '/ɡʊd ˈmɔːrnɪŋ/' },
    ],
    // ... keep existing code (es, fr, de, it, ja entries for pt)
    es: [
      { word: 'Hola', translation: 'Olá' }, { word: 'Adiós', translation: 'Tchau' },
      { word: 'Gracias', translation: 'Obrigado' }, { word: 'Agua', translation: 'Água' },
      { word: 'Comida', translation: 'Comida' }, { word: 'Casa', translation: 'Casa' },
      { word: 'Amor', translation: 'Amor' }, { word: 'Amigo', translation: 'Amigo' },
      { word: 'Trabajo', translation: 'Trabalho' }, { word: 'Escuela', translation: 'Escola' },
    ],
    fr: [
      { word: 'Bonjour', translation: 'Olá' }, { word: 'Au revoir', translation: 'Tchau' },
      { word: 'Merci', translation: 'Obrigado' }, { word: 'Eau', translation: 'Água' },
      { word: 'Nourriture', translation: 'Comida' }, { word: 'Maison', translation: 'Casa' },
    ],
    de: [
      { word: 'Hallo', translation: 'Olá' }, { word: 'Tschüss', translation: 'Tchau' },
      { word: 'Danke', translation: 'Obrigado' }, { word: 'Wasser', translation: 'Água' },
      { word: 'Essen', translation: 'Comida' }, { word: 'Haus', translation: 'Casa' },
    ],
    it: [
      { word: 'Ciao', translation: 'Olá' }, { word: 'Arrivederci', translation: 'Tchau' },
      { word: 'Grazie', translation: 'Obrigado' }, { word: 'Acqua', translation: 'Água' },
      { word: 'Cibo', translation: 'Comida' }, { word: 'Casa', translation: 'Casa' },
    ],
    ja: [
      { word: 'こんにちは', translation: 'Olá' }, { word: 'さようなら', translation: 'Tchau' },
      { word: 'ありがとう', translation: 'Obrigado' }, { word: '水 (mizu)', translation: 'Água' },
    ],
    ko: [
      { word: '안녕하세요', translation: 'Olá' }, { word: '감사합니다', translation: 'Obrigado' },
      { word: '물 (mul)', translation: 'Água' }, { word: '집 (jip)', translation: 'Casa' },
    ],
    pt: [],
  },
  en: {
    es: [
      { word: 'Hola', translation: 'Hello' }, { word: 'Adiós', translation: 'Goodbye' },
      { word: 'Gracias', translation: 'Thank you' }, { word: 'Agua', translation: 'Water' },
      { word: 'Comida', translation: 'Food' }, { word: 'Casa', translation: 'House' },
      { word: 'Amor', translation: 'Love' }, { word: 'Amigo', translation: 'Friend' },
    ],
    fr: [
      { word: 'Bonjour', translation: 'Hello' }, { word: 'Au revoir', translation: 'Goodbye' },
      { word: 'Merci', translation: 'Thank you' }, { word: 'Eau', translation: 'Water' },
      { word: 'Maison', translation: 'House' }, { word: 'Amour', translation: 'Love' },
    ],
    de: [
      { word: 'Hallo', translation: 'Hello' }, { word: 'Tschüss', translation: 'Goodbye' },
      { word: 'Danke', translation: 'Thank you' }, { word: 'Wasser', translation: 'Water' },
      { word: 'Haus', translation: 'House' }, { word: 'Essen', translation: 'Food' },
    ],
    it: [
      { word: 'Ciao', translation: 'Hello' }, { word: 'Arrivederci', translation: 'Goodbye' },
      { word: 'Grazie', translation: 'Thank you' }, { word: 'Acqua', translation: 'Water' },
    ],
    ja: [
      { word: 'こんにちは', translation: 'Hello' }, { word: 'さようなら', translation: 'Goodbye' },
      { word: 'ありがとう', translation: 'Thank you' }, { word: '水', translation: 'Water' },
    ],
    ko: [
      { word: '안녕하세요', translation: 'Hello' }, { word: '감사합니다', translation: 'Thank you' },
      { word: '물', translation: 'Water' }, { word: '집', translation: 'House' },
    ],
    pt: [
      { word: 'Olá', translation: 'Hello' }, { word: 'Obrigado', translation: 'Thank you' },
      { word: 'Água', translation: 'Water' }, { word: 'Casa', translation: 'House' },
    ],
    en: [],
  },
  it: {
    en: [
      { word: 'Hello', translation: 'Ciao', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: 'Arrivederci', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: 'Grazie', pronunciation: '/θæŋk juː/' },
      { word: 'Water', translation: 'Acqua', pronunciation: '/ˈwɔːtər/' },
      { word: 'Food', translation: 'Cibo', pronunciation: '/fuːd/' },
      { word: 'House', translation: 'Casa', pronunciation: '/haʊs/' },
      { word: 'Love', translation: 'Amore', pronunciation: '/lʌv/' },
      { word: 'Friend', translation: 'Amico', pronunciation: '/frɛnd/' },
      { word: 'Family', translation: 'Famiglia', pronunciation: '/ˈfæmɪli/' },
      { word: 'Work', translation: 'Lavoro', pronunciation: '/wɜːrk/' },
    ],
    es: [
      { word: 'Hola', translation: 'Ciao' }, { word: 'Adiós', translation: 'Arrivederci' },
      { word: 'Gracias', translation: 'Grazie' }, { word: 'Agua', translation: 'Acqua' },
    ],
    fr: [
      { word: 'Bonjour', translation: 'Buongiorno' }, { word: 'Merci', translation: 'Grazie' },
      { word: 'Eau', translation: 'Acqua' }, { word: 'Maison', translation: 'Casa' },
    ],
    de: [
      { word: 'Hallo', translation: 'Ciao' }, { word: 'Danke', translation: 'Grazie' },
      { word: 'Wasser', translation: 'Acqua' }, { word: 'Haus', translation: 'Casa' },
    ],
    it: [],
    ja: [
      { word: 'こんにちは', translation: 'Ciao' }, { word: 'ありがとう', translation: 'Grazie' },
      { word: '水', translation: 'Acqua' },
    ],
    ko: [
      { word: '안녕하세요', translation: 'Ciao' }, { word: '감사합니다', translation: 'Grazie' },
      { word: '물', translation: 'Acqua' },
    ],
    pt: [
      { word: 'Olá', translation: 'Ciao' }, { word: 'Obrigado', translation: 'Grazie' },
      { word: 'Água', translation: 'Acqua' }, { word: 'Casa', translation: 'Casa' },
    ],
  },
  es: {
    en: [
      { word: 'Hello', translation: 'Hola', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: 'Adiós', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: 'Gracias', pronunciation: '/θæŋk juː/' },
      { word: 'Water', translation: 'Agua', pronunciation: '/ˈwɔːtər/' },
      { word: 'Food', translation: 'Comida', pronunciation: '/fuːd/' },
      { word: 'House', translation: 'Casa', pronunciation: '/haʊs/' },
      { word: 'Love', translation: 'Amor', pronunciation: '/lʌv/' },
      { word: 'Friend', translation: 'Amigo', pronunciation: '/frɛnd/' },
    ],
    fr: [{ word: 'Bonjour', translation: 'Hola' }, { word: 'Merci', translation: 'Gracias' }, { word: 'Eau', translation: 'Agua' }, { word: 'Maison', translation: 'Casa' }],
    de: [{ word: 'Hallo', translation: 'Hola' }, { word: 'Danke', translation: 'Gracias' }, { word: 'Wasser', translation: 'Agua' }, { word: 'Haus', translation: 'Casa' }],
    it: [{ word: 'Ciao', translation: 'Hola' }, { word: 'Grazie', translation: 'Gracias' }, { word: 'Acqua', translation: 'Agua' }, { word: 'Casa', translation: 'Casa' }],
    es: [],
    ja: [{ word: 'こんにちは', translation: 'Hola' }, { word: 'ありがとう', translation: 'Gracias' }],
    ko: [{ word: '안녕하세요', translation: 'Hola' }, { word: '감사합니다', translation: 'Gracias' }],
    pt: [{ word: 'Olá', translation: 'Hola' }, { word: 'Obrigado', translation: 'Gracias' }, { word: 'Água', translation: 'Agua' }],
  },
  fr: {
    en: [
      { word: 'Hello', translation: 'Bonjour', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: 'Au revoir', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: 'Merci', pronunciation: '/θæŋk juː/' },
      { word: 'Water', translation: 'Eau', pronunciation: '/ˈwɔːtər/' },
      { word: 'House', translation: 'Maison', pronunciation: '/haʊs/' },
    ],
    es: [{ word: 'Hola', translation: 'Bonjour' }, { word: 'Gracias', translation: 'Merci' }],
    fr: [],
    de: [{ word: 'Hallo', translation: 'Bonjour' }, { word: 'Danke', translation: 'Merci' }],
    it: [{ word: 'Ciao', translation: 'Bonjour' }, { word: 'Grazie', translation: 'Merci' }],
    ja: [{ word: 'こんにちは', translation: 'Bonjour' }],
    ko: [{ word: '안녕하세요', translation: 'Bonjour' }, { word: '감사합니다', translation: 'Merci' }],
    pt: [{ word: 'Olá', translation: 'Bonjour' }, { word: 'Obrigado', translation: 'Merci' }],
  },
  de: {
    en: [
      { word: 'Hello', translation: 'Hallo', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: 'Tschüss', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: 'Danke', pronunciation: '/θæŋk juː/' },
      { word: 'Water', translation: 'Wasser', pronunciation: '/ˈwɔːtər/' },
      { word: 'House', translation: 'Haus', pronunciation: '/haʊs/' },
    ],
    es: [{ word: 'Hola', translation: 'Hallo' }, { word: 'Gracias', translation: 'Danke' }],
    fr: [{ word: 'Bonjour', translation: 'Hallo' }, { word: 'Merci', translation: 'Danke' }],
    de: [],
    it: [{ word: 'Ciao', translation: 'Hallo' }, { word: 'Grazie', translation: 'Danke' }],
    ja: [{ word: 'こんにちは', translation: 'Hallo' }],
    ko: [{ word: '안녕하세요', translation: 'Hallo' }, { word: '감사합니다', translation: 'Danke' }],
    pt: [{ word: 'Olá', translation: 'Hallo' }, { word: 'Obrigado', translation: 'Danke' }],
  },
  ja: {
    en: [
      { word: 'Hello', translation: 'こんにちは', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: 'さようなら', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: 'ありがとう', pronunciation: '/θæŋk juː/' },
      { word: 'Water', translation: '水', pronunciation: '/ˈwɔːtər/' },
    ],
    es: [{ word: 'Hola', translation: 'こんにちは' }, { word: 'Gracias', translation: 'ありがとう' }],
    fr: [{ word: 'Bonjour', translation: 'こんにちは' }, { word: 'Merci', translation: 'ありがとう' }],
    de: [{ word: 'Hallo', translation: 'こんにちは' }, { word: 'Danke', translation: 'ありがとう' }],
    it: [{ word: 'Ciao', translation: 'こんにちは' }, { word: 'Grazie', translation: 'ありがとう' }],
    ja: [],
    ko: [{ word: '안녕하세요', translation: 'こんにちは' }, { word: '감사합니다', translation: 'ありがとう' }],
    pt: [{ word: 'Olá', translation: 'こんにちは' }, { word: 'Obrigado', translation: 'ありがとう' }],
  },
  ko: {
    en: [
      { word: 'Hello', translation: '안녕하세요', pronunciation: '/həˈloʊ/' },
      { word: 'Goodbye', translation: '안녕히 가세요', pronunciation: '/ɡʊdˈbaɪ/' },
      { word: 'Thank you', translation: '감사합니다', pronunciation: '/θæŋk juː/' },
      { word: 'Water', translation: '물', pronunciation: '/ˈwɔːtər/' },
    ],
    es: [{ word: 'Hola', translation: '안녕하세요' }, { word: 'Gracias', translation: '감사합니다' }],
    fr: [{ word: 'Bonjour', translation: '안녕하세요' }, { word: 'Merci', translation: '감사합니다' }],
    de: [{ word: 'Hallo', translation: '안녕하세요' }, { word: 'Danke', translation: '감사합니다' }],
    it: [{ word: 'Ciao', translation: '안녕하세요' }, { word: 'Grazie', translation: '감사합니다' }],
    ja: [{ word: 'こんにちは', translation: '안녕하세요' }, { word: 'ありがとう', translation: '감사합니다' }],
    ko: [],
    pt: [{ word: 'Olá', translation: '안녕하세요' }, { word: 'Obrigado', translation: '감사합니다' }],
  },
};

// Internet slang by target language
const slangData: Record<string, { word: string; translation: string }[]> = {
  en: [
    { word: 'LOL', translation: 'Laughing Out Loud' },
    { word: 'BRB', translation: 'Be Right Back' },
    { word: 'GOAT', translation: 'Greatest Of All Time' },
    { word: 'NGL', translation: 'Not Gonna Lie' },
    { word: 'IYKYK', translation: 'If You Know You Know' },
    { word: 'Slay', translation: 'To do something exceptionally well' },
    { word: 'No cap', translation: 'No lie / For real' },
    { word: 'Vibe check', translation: 'Assessing the mood' },
  ],
  es: [
    { word: 'Jajaja', translation: 'Hahaha (riso)' },
    { word: 'TQM', translation: 'Te Quiero Mucho' },
    { word: 'Mola', translation: 'Cool / Legal' },
    { word: 'Flipar', translation: 'To freak out' },
  ],
  fr: [
    { word: 'MDR', translation: 'Mort De Rire (LOL)' },
    { word: 'OKLM', translation: 'Au calme (chilling)' },
    { word: 'Sah', translation: 'Seriously / For real' },
    { word: 'Bail', translation: 'Thing / Stuff' },
  ],
  de: [
    { word: 'Digga', translation: 'Dude / Bro' },
    { word: 'Krass', translation: 'Crazy / Intense' },
    { word: 'Alter', translation: 'Dude (exclamation)' },
    { word: 'Chillen', translation: 'To chill' },
  ],
  it: [
    { word: 'Boh', translation: 'I don\'t know' },
    { word: 'Figo/a', translation: 'Cool / Hot' },
    { word: 'Che figata', translation: 'How cool!' },
    { word: 'Sgamare', translation: 'To get caught' },
  ],
  ja: [
    { word: 'www', translation: 'LOL (from warau)' },
    { word: 'ヤバい', translation: 'Crazy / Amazing' },
    { word: 'マジ', translation: 'Seriously / For real' },
    { word: 'ウケる', translation: 'Hilarious' },
  ],
  ko: [
    { word: 'ㅋㅋㅋ', translation: 'Hahaha (riso)' },
    { word: '대박', translation: 'Amazing / Jackpot' },
    { word: '헐', translation: 'OMG / No way' },
    { word: '꿀잼', translation: 'Super fun' },
  ],
  pt: [
    { word: 'Kkkk', translation: 'Hahaha' },
    { word: 'TMJ', translation: 'Tamo junto' },
    { word: 'Mds', translation: 'Meu Deus' },
    { word: 'Plmdds', translation: 'Pelo amor de Deus' },
  ],
};

const DictionaryTab = () => {
  const { course, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [search, setSearch] = useState('');
  const [showSlang, setShowSlang] = useState(false);
  const words = dictionaryData[nativeLang]?.[course] || dictionaryData.pt?.[course] || [];
  const slang = slangData[course] || [];

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSlang = slang.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">📖</span>
        <h2 className="text-2xl font-black text-foreground">{tr('dictionary_title')}</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={tr('search_word')}
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Toggle between regular and slang */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowSlang(false)}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${!showSlang ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'}`}
        >
          📖 {tr('dictionary_title')}
        </button>
        <button
          onClick={() => setShowSlang(true)}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${showSlang ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'}`}
        >
          🔥 {tr('cat_slang')}
        </button>
      </div>

      {!showSlang ? (
        <div className="space-y-2">
          {filtered.map((w, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between slide-up" style={{ animationDelay: `${i * 30}ms` }}>
              <div>
                <p className="font-black text-foreground">{w.word}</p>
                <p className="text-sm text-muted-foreground">{w.translation}</p>
              </div>
              {w.pronunciation && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg font-mono">{w.pronunciation}</span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{tr('no_words_found')}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSlang.map((w, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between slide-up" style={{ animationDelay: `${i * 30}ms` }}>
              <div>
                <p className="font-black text-foreground">🔥 {w.word}</p>
                <p className="text-sm text-muted-foreground">{w.translation}</p>
              </div>
            </div>
          ))}
          {filteredSlang.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{tr('no_words_found')}</p>
          )}
        </div>
      )}

      <div className="bg-card rounded-2xl p-5 border-2 border-dashed border-primary/30 text-center">
        <Lock className="mx-auto text-primary/50 mb-2" size={32} />
        <h3 className="font-black text-foreground">{tr('flashcards')}</h3>
        <p className="text-sm text-muted-foreground mb-3">{tr('flashcards_desc')}</p>
        <button className="bg-primary/10 text-primary font-bold px-6 py-2 rounded-full text-sm">
          {tr('unlock_vip')}
        </button>
      </div>
    </div>
  );
};

export default DictionaryTab;
