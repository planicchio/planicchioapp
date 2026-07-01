import { useState, useMemo } from 'react';
import { Search, Lock, Volume2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { wordBank, type LangCode } from '@/data/wordBank';
import { extendedWordBank } from '@/data/wordBankExtended';

// Dynamically build dictionary from wordBank for ALL language combos
function buildDictionary(nativeLang: string, course: string): { word: string; translation: string; meaning?: string; pronunciation?: string }[] {
  const nl = nativeLang as LangCode;
  const cl = course as LangCode;
  if (nl === cl) return [];

  const results: { word: string; translation: string; meaning?: string }[] = [];
  const allCategories = Object.keys(wordBank);

  for (const cat of allCategories) {
    const baseWords = wordBank[cat] || [];
    const extWords = extendedWordBank[cat] || [];
    const allWords = [...baseWords, ...extWords];

    for (const entry of allWords) {
      const courseWord = entry[cl];
      const nativeWord = entry[nl];
      if (courseWord && nativeWord && courseWord !== nativeWord) {
        results.push({
          word: courseWord,
          translation: nativeWord,
          meaning: entry.emoji ? `${entry.emoji} ${nativeWord}` : undefined,
        });
      }
    }
  }
  // Remove duplicates
  const seen = new Set<string>();
  return results.filter(r => {
    if (seen.has(r.word)) return false;
    seen.add(r.word);
    return true;
  });
}

// Slang with translations adapted per native language
function getSlangData(course: string, nativeLang: string): { word: string; translation: string; meaning: string }[] {
  const slangByLang: Record<string, { word: string; meanings: Record<string, string> }[]> = {
    en: [
      { word: 'LOL', meanings: { pt: 'Rindo muito alto', en: 'Laughing Out Loud', es: 'Riendo a carcajadas', fr: 'Mourir de rire', de: 'Laut lachen', it: 'Ridere forte', ja: '大爆笑', ko: '크게 웃음' } },
      { word: 'BRB', meanings: { pt: 'Já volto', en: 'Be Right Back', es: 'Ya vuelvo', fr: 'Je reviens', de: 'Bin gleich zurück', it: 'Torno subito', ja: 'すぐ戻る', ko: '금방 올게' } },
      { word: 'GOAT', meanings: { pt: 'O melhor de todos os tempos', en: 'Greatest Of All Time', es: 'El mejor de todos los tiempos', fr: 'Le meilleur de tous les temps', de: 'Der Beste aller Zeiten', it: 'Il migliore di sempre', ja: '史上最高', ko: '역대 최고' } },
      { word: 'NGL', meanings: { pt: 'Sem mentira', en: 'Not Gonna Lie', es: 'Sin mentir', fr: 'Sans mentir', de: 'Nicht gelogen', it: 'Senza mentire', ja: '嘘じゃなく', ko: '솔직히 말하면' } },
      { word: 'Slay', meanings: { pt: 'Arrasar / Fazer muito bem', en: 'To do something exceptionally well', es: 'Hacerlo increíble', fr: 'Tout déchirer', de: 'Etwas großartig machen', it: 'Spaccare', ja: 'めちゃくちゃうまい', ko: '완벽하게 해내다' } },
      { word: 'No cap', meanings: { pt: 'Sem mentira / Verdade', en: 'No lie / For real', es: 'Sin mentira / En serio', fr: 'Sans mentir / Pour de vrai', de: 'Kein Witz / Echt', it: 'Senza bugie / Davvero', ja: 'マジで', ko: '진짜로' } },
      { word: 'Vibe check', meanings: { pt: 'Verificar o clima/energia', en: 'Assessing the mood', es: 'Verificar la vibra', fr: 'Vérifier l\'ambiance', de: 'Stimmung checken', it: 'Controllare l\'atmosfera', ja: '雰囲気チェック', ko: '분위기 파악' } },
      { word: 'IYKYK', meanings: { pt: 'Se você sabe, você sabe', en: 'If You Know You Know', es: 'Si sabes, sabes', fr: 'Si tu sais, tu sais', de: 'Wer weiß, weiß', it: 'Se sai, sai', ja: '分かる人には分かる', ko: '아는 사람은 아는' } },
    ],
    es: [
      { word: 'Jajaja', meanings: { pt: 'Hahaha (risada)', en: 'Hahaha (laughter)', es: 'Hahaha', fr: 'Hahaha (rire)', de: 'Hahaha (Lachen)', it: 'Hahaha (risata)', ja: 'ハハハ（笑い）', ko: 'ㅋㅋㅋ (웃음)' } },
      { word: 'TQM', meanings: { pt: 'Te amo muito', en: 'I love you so much', es: 'Te Quiero Mucho', fr: 'Je t\'aime beaucoup', de: 'Ich hab dich sehr lieb', it: 'Ti voglio bene', ja: '大好き', ko: '너무 사랑해' } },
      { word: 'Mola', meanings: { pt: 'Legal / Maneiro', en: 'Cool / Nice', es: 'Cool / Genial', fr: 'Cool / Chouette', de: 'Cool / Toll', it: 'Figo / Bello', ja: 'かっこいい', ko: '멋져' } },
      { word: 'Flipar', meanings: { pt: 'Ficar surpreso / Pirar', en: 'To freak out / Be amazed', es: 'Quedarse alucinado', fr: 'Halluciner', de: 'Ausflippen', it: 'Impazzire', ja: 'びっくりする', ko: '깜짝 놀라다' } },
    ],
    fr: [
      { word: 'MDR', meanings: { pt: 'Morrendo de rir', en: 'Dying of laughter (LOL)', es: 'Muerto de risa', fr: 'Mort De Rire', de: 'Totgelacht', it: 'Morto dal ridere', ja: '爆笑', ko: '웃겨 죽겠다' } },
      { word: 'OKLM', meanings: { pt: 'De boa / Relaxando', en: 'Chilling / Relaxing', es: 'Relajado', fr: 'Au calme', de: 'Ganz entspannt', it: 'Rilassato', ja: 'のんびり', ko: '편하게' } },
      { word: 'Sah', meanings: { pt: 'Sério / Verdade', en: 'Seriously / For real', es: 'En serio', fr: 'Sérieusement', de: 'Ernsthaft', it: 'Sul serio', ja: 'マジで', ko: '진심으로' } },
      { word: 'Bail', meanings: { pt: 'Coisa / Negócio', en: 'Thing / Stuff', es: 'Cosa / Asunto', fr: 'Truc / Chose', de: 'Ding / Sache', it: 'Cosa / Roba', ja: '物事', ko: '것' } },
    ],
    de: [
      { word: 'Digga', meanings: { pt: 'Mano / Cara', en: 'Dude / Bro', es: 'Tío / Colega', fr: 'Mec / Pote', de: 'Kumpel', it: 'Tipo / Amico', ja: 'おい / やぁ', ko: '야' } },
      { word: 'Krass', meanings: { pt: 'Insano / Demais', en: 'Crazy / Intense', es: 'Loco / Intenso', fr: 'Dingue / Ouf', de: 'Verrückt / Heftig', it: 'Pazzesco', ja: 'ヤバい', ko: '대박' } },
      { word: 'Alter', meanings: { pt: 'Cara! (exclamação)', en: 'Dude! (exclamation)', es: '¡Tío!', fr: 'Mec !', de: 'Alter!', it: 'Cavolo!', ja: 'うわ！', ko: '야!' } },
      { word: 'Chillen', meanings: { pt: 'Relaxar / Curtir', en: 'To chill / Relax', es: 'Relajarse', fr: 'Se détendre', de: 'Entspannen', it: 'Rilassarsi', ja: 'のんびりする', ko: '쉬다' } },
    ],
    it: [
      { word: 'Boh', meanings: { pt: 'Sei lá', en: "I don't know", es: 'No sé', fr: 'Je sais pas', de: 'Keine Ahnung', it: 'Non lo so', ja: 'さあ', ko: '모르겠어' } },
      { word: 'Figo/a', meanings: { pt: 'Legal / Bonito', en: 'Cool / Hot', es: 'Genial / Guapo', fr: 'Cool / Beau', de: 'Cool / Heiß', it: 'Figo', ja: 'かっこいい', ko: '멋진' } },
      { word: 'Che figata', meanings: { pt: 'Que demais!', en: 'How cool!', es: '¡Qué genial!', fr: 'Trop cool !', de: 'Wie geil!', it: 'Che figata!', ja: 'すごい！', ko: '대단해!' } },
      { word: 'Sgamare', meanings: { pt: 'Ser pego / Flagrado', en: 'To get caught', es: 'Ser pillado', fr: 'Se faire choper', de: 'Erwischt werden', it: 'Farsi beccare', ja: '見つかる', ko: '들키다' } },
    ],
    ja: [
      { word: 'www', meanings: { pt: 'Hahaha (de warau=rir)', en: 'LOL (from warau=laugh)', es: 'Jajaja', fr: 'MDR', de: 'Hahaha', it: 'Hahaha', ja: '笑い（わらう）', ko: 'ㅋㅋㅋ' } },
      { word: 'ヤバい', meanings: { pt: 'Incrível / Louco', en: 'Crazy / Amazing', es: 'Loco / Increíble', fr: 'Dingue / Incroyable', de: 'Krass / Wahnsinn', it: 'Pazzesco', ja: 'すごい / 危ない', ko: '대박 / 미쳤다' } },
      { word: 'マジ', meanings: { pt: 'Sério / De verdade', en: 'Seriously / For real', es: 'En serio', fr: 'Sérieusement', de: 'Ernsthaft', it: 'Sul serio', ja: '本当に', ko: '진짜' } },
      { word: 'ウケる', meanings: { pt: 'Muito engraçado', en: 'Hilarious', es: 'Muy gracioso', fr: 'Trop drôle', de: 'Zu lustig', it: 'Troppo divertente', ja: 'めっちゃ面白い', ko: '웃겨' } },
    ],
    ko: [
      { word: 'ㅋㅋㅋ', meanings: { pt: 'Hahaha (risada)', en: 'Hahaha (laughter)', es: 'Jajaja', fr: 'Hahaha', de: 'Hahaha', it: 'Hahaha', ja: 'ハハハ', ko: '웃음' } },
      { word: '대박', meanings: { pt: 'Incrível / Jackpot', en: 'Amazing / Jackpot', es: 'Increíble', fr: 'Incroyable', de: 'Wahnsinn', it: 'Pazzesco', ja: 'すごい', ko: '놀라운' } },
      { word: '헐', meanings: { pt: 'Nossa! / Não acredito!', en: 'OMG / No way', es: '¡Dios mío!', fr: 'Oh là là !', de: 'Oh mein Gott!', it: 'Oh mio Dio!', ja: 'うそ！', ko: '세상에' } },
      { word: '꿀잼', meanings: { pt: 'Muito divertido', en: 'Super fun', es: 'Súper divertido', fr: 'Trop amusant', de: 'Super lustig', it: 'Super divertente', ja: 'めっちゃ面白い', ko: '꿀잼' } },
    ],
    pt: [
      { word: 'Kkkk', meanings: { pt: 'Risada', en: 'Laughter', es: 'Risa', fr: 'Rire', de: 'Lachen', it: 'Risata', ja: '笑い', ko: '웃음' } },
      { word: 'TMJ', meanings: { pt: 'Tamo junto', en: "We're together / Got your back", es: 'Estamos juntos', fr: 'On est ensemble', de: 'Wir halten zusammen', it: 'Siamo insieme', ja: '一緒だよ', ko: '함께야' } },
      { word: 'Mds', meanings: { pt: 'Meu Deus', en: 'Oh my God', es: 'Dios mío', fr: 'Mon Dieu', de: 'Mein Gott', it: 'Mio Dio', ja: 'なんてこと', ko: '세상에' } },
      { word: 'Plmdds', meanings: { pt: 'Pelo amor de Deus', en: 'For the love of God', es: 'Por el amor de Dios', fr: "Pour l'amour de Dieu", de: 'Um Gottes willen', it: "Per l'amor di Dio", ja: '頼むから', ko: '제발' } },
    ],
  };

  const slang = slangByLang[course] || [];
  return slang.map(s => ({
    word: s.word,
    translation: s.meanings[nativeLang] || s.meanings.en || '',
    meaning: s.meanings[course] || s.meanings.en || '',
  }));
}

const DictionaryTab = () => {
  const { course, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [search, setSearch] = useState('');
  const [showSlang, setShowSlang] = useState(false);

  const words = useMemo(() => buildDictionary(nativeLang, course), [nativeLang, course]);
  const slang = useMemo(() => getSlangData(course, nativeLang), [course, nativeLang]);

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSlang = slang.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  );

  const speakWord = (text: string) => {
    const langMap: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', ja: 'ja-JP', pt: 'pt-BR', ko: 'ko-KR'
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[course] || 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">📖</span>
        <h2 className="text-2xl font-black text-foreground">{tr('dictionary_title')}</h2>
        <p className="text-xs text-muted-foreground">{words.length} {tr('words') || 'palavras'}</p>
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
          {filtered.slice(0, 50).map((w, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between slide-up" style={{ animationDelay: `${i * 20}ms` }}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black text-foreground">{w.word}</p>
                  <button onClick={() => speakWord(w.word)} className="text-muted-foreground hover:text-primary">
                    <Volume2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-primary font-bold">{w.translation}</p>
                {w.meaning && <p className="text-xs text-muted-foreground mt-0.5">{w.meaning}</p>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{tr('no_words_found')}</p>
          )}
          {filtered.length > 50 && (
            <p className="text-center text-xs text-muted-foreground">+{filtered.length - 50} {tr('words') || 'palavras'}...</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSlang.map((w, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border slide-up" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-foreground">🔥 {w.word}</p>
                <button onClick={() => speakWord(w.word)} className="text-muted-foreground hover:text-primary">
                  <Volume2 size={14} />
                </button>
              </div>
              <p className="text-sm text-primary font-bold">{w.translation}</p>
              {w.meaning !== w.translation && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">({w.meaning})</p>
              )}
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
        <a
          href="https://buy.stripe.com/7sY3cw4t68yh8j2eiCaMU03"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary/10 text-primary font-bold px-6 py-2 rounded-full text-sm hover:bg-primary/20 transition-colors"
        >
          {tr('unlock_vip')}
        </a>
      </div>
    </div>
  );
};

export default DictionaryTab;
