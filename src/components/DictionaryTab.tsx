import { useState } from 'react';
import { Search, Lock } from 'lucide-react';

const dictionaryData: Record<string, { word: string; translation: string; pronunciation?: string }[]> = {
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
    { word: 'Good night', translation: 'Boa noite', pronunciation: '/ɡʊd naɪt/' },
    { word: 'Car', translation: 'Carro', pronunciation: '/kɑːr/' },
    { word: 'Book', translation: 'Livro', pronunciation: '/bʊk/' },
    { word: 'City', translation: 'Cidade', pronunciation: '/ˈsɪti/' },
    { word: 'Country', translation: 'País', pronunciation: '/ˈkʌntri/' },
  ],
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
    { word: 'Amour', translation: 'Amor' }, { word: 'Ami', translation: 'Amigo' },
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
    { word: '食べ物 (tabemono)', translation: 'Comida' }, { word: '家 (ie)', translation: 'Casa' },
  ],
};

const DictionaryTab = () => {
  const [search, setSearch] = useState('');
  const course = (JSON.parse(localStorage.getItem('linguacat_state') || '{}').course) || 'en';
  const words = dictionaryData[course] || dictionaryData.en;

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">📖</span>
        <h2 className="text-2xl font-black text-foreground">Dicionário</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar palavra..."
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Word list */}
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
          <p className="text-center text-muted-foreground py-8">Nenhuma palavra encontrada 😿</p>
        )}
      </div>

      {/* Flashcards VIP */}
      <div className="bg-card rounded-2xl p-5 border-2 border-dashed border-primary/30 text-center">
        <Lock className="mx-auto text-primary/50 mb-2" size={32} />
        <h3 className="font-black text-foreground">Flashcards ✨</h3>
        <p className="text-sm text-muted-foreground mb-3">Desbloqueie com VIP para usar flashcards interativos!</p>
        <button className="bg-primary/10 text-primary font-bold px-6 py-2 rounded-full text-sm">
          🔒 Desbloquear VIP
        </button>
      </div>
    </div>
  );
};

export default DictionaryTab;
