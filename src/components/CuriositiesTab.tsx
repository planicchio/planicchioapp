import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { motion } from 'framer-motion';

const curiositiesData: Record<string, Record<string, { facts: { emoji: string; textKey: string }[]; tips: { emoji: string; textKey: string }[] }>> = {
  // We'll use direct text per native language instead of keys for content
};

// Content organized by course, translated per native language
const getContent = (course: string, nativeLang: string) => {
  const content: Record<string, Record<string, { facts: { emoji: string; text: string }[]; tips: { emoji: string; text: string }[] }>> = {
    pt: {
      en: {
        facts: [
          { emoji: '🗽', text: 'A Estátua da Liberdade foi um presente da França em 1886!' },
          { emoji: '🍔', text: 'Os americanos comem cerca de 50 bilhões de hambúrgueres por ano!' },
          { emoji: '🏈', text: 'O Super Bowl é o evento mais assistido dos EUA' },
          { emoji: '🎬', text: 'Hollywood produz mais de 700 filmes por ano' },
          { emoji: '🌙', text: 'Os EUA são o único país que pisou na Lua!' },
        ],
        tips: [
          { emoji: '💡', text: 'Assista séries em inglês com legenda em inglês!' },
          { emoji: '🎵', text: 'Ouça músicas e tente acompanhar a letra' },
          { emoji: '📱', text: 'Mude o idioma do celular para inglês' },
        ],
      },
      es: {
        facts: [
          { emoji: '💃', text: 'O flamenco é Patrimônio da Humanidade pela UNESCO!' },
          { emoji: '🍅', text: 'La Tomatina: festival onde jogam 150 mil tomates!' },
          { emoji: '😴', text: 'A siesta é uma tradição sagrada na Espanha' },
          { emoji: '🏟️', text: 'A Espanha tem 47 patrimônios da UNESCO' },
        ],
        tips: [
          { emoji: '💡', text: 'Espanhol e português são 90% parecidos!' },
          { emoji: '🎵', text: 'Ouça reggaeton para aprender gírias' },
        ],
      },
      fr: {
        facts: [
          { emoji: '🗼', text: 'A Torre Eiffel foi construída em 1889!' },
          { emoji: '🧀', text: 'A França produz mais de 1.200 tipos de queijo!' },
          { emoji: '🎨', text: 'O Louvre é o museu mais visitado do mundo' },
          { emoji: '🥐', text: 'Os croissants na verdade vieram da Áustria!' },
        ],
        tips: [
          { emoji: '💡', text: 'Pratique o "R" francês gargarejando!' },
          { emoji: '🎵', text: 'Ouça Édith Piaf para treinar o ouvido' },
        ],
      },
      de: {
        facts: [
          { emoji: '🏰', text: 'A Alemanha tem mais de 20.000 castelos!' },
          { emoji: '🍺', text: 'Oktoberfest serve 7 milhões de litros de cerveja!' },
          { emoji: '🚗', text: 'Partes da Autobahn não têm limite de velocidade!' },
          { emoji: '🎄', text: 'A tradição da Árvore de Natal veio da Alemanha' },
        ],
        tips: [
          { emoji: '💡', text: 'Alemão tem palavras compostas gigantes!' },
          { emoji: '🎵', text: 'Rammstein ajuda a aprender pronúncia 🤘' },
        ],
      },
      it: {
        facts: [
          { emoji: '🍕', text: 'A pizza margherita homenageia a Rainha Margherita!' },
          { emoji: '🏛️', text: 'Roma tem mais de 900 igrejas!' },
          { emoji: '🍝', text: 'Existem mais de 600 formatos de pasta na Itália' },
          { emoji: '🎭', text: 'Veneza tem mais de 400 pontes' },
        ],
        tips: [
          { emoji: '💡', text: 'Italiano é super musical, cante ao falar!' },
          { emoji: '🎵', text: 'Ouça ópera italiana para treinar' },
        ],
      },
      ja: {
        facts: [
          { emoji: '🗾', text: 'O Japão tem mais de 6.800 ilhas!' },
          { emoji: '🍣', text: 'O sushi original era peixe fermentado!' },
          { emoji: '🚅', text: 'O Shinkansen nunca atrasa mais que 1 minuto!' },
          { emoji: '🌸', text: 'A temporada de sakura dura apenas 2 semanas' },
        ],
        tips: [
          { emoji: '💡', text: 'Comece pelo hiragana, são só 46 caracteres!' },
          { emoji: '🎵', text: 'Anime é ótimo para aprender japonês casual' },
        ],
      },
    },
    en: {
      es: {
        facts: [
          { emoji: '💃', text: 'Flamenco is a UNESCO World Heritage!' },
          { emoji: '🍅', text: 'La Tomatina: festival where 150k tomatoes are thrown!' },
          { emoji: '😴', text: 'Siesta is a sacred tradition in Spain' },
        ],
        tips: [{ emoji: '💡', text: 'Spanish and English share many Latin roots!' }, { emoji: '🎵', text: 'Listen to reggaeton to learn slang' }],
      },
      fr: {
        facts: [
          { emoji: '🗼', text: 'The Eiffel Tower was built in 1889!' },
          { emoji: '🧀', text: 'France produces over 1,200 types of cheese!' },
          { emoji: '🎨', text: 'The Louvre is the most visited museum in the world' },
        ],
        tips: [{ emoji: '💡', text: 'Practice the French "R" by gargling!' }, { emoji: '🎵', text: 'Listen to Édith Piaf to train your ear' }],
      },
      de: {
        facts: [
          { emoji: '🏰', text: 'Germany has over 20,000 castles!' },
          { emoji: '🍺', text: 'Oktoberfest serves 7 million liters of beer!' },
          { emoji: '🚗', text: 'Parts of the Autobahn have no speed limit!' },
        ],
        tips: [{ emoji: '💡', text: 'German has giant compound words!' }, { emoji: '🎵', text: 'Rammstein helps with pronunciation 🤘' }],
      },
      it: {
        facts: [
          { emoji: '🍕', text: 'Pizza Margherita was named after Queen Margherita!' },
          { emoji: '🏛️', text: 'Rome has over 900 churches!' },
          { emoji: '🍝', text: 'There are over 600 pasta shapes in Italy' },
        ],
        tips: [{ emoji: '💡', text: 'Italian is super musical, sing as you speak!' }, { emoji: '🎵', text: 'Listen to Italian opera to train' }],
      },
      ja: {
        facts: [
          { emoji: '🗾', text: 'Japan has over 6,800 islands!' },
          { emoji: '🍣', text: 'Original sushi was fermented fish!' },
          { emoji: '🚅', text: 'Shinkansen is never more than 1 minute late!' },
        ],
        tips: [{ emoji: '💡', text: 'Start with hiragana, only 46 characters!' }, { emoji: '🎵', text: 'Anime is great for learning casual Japanese' }],
      },
      en: { facts: [], tips: [] },
    },
    it: {
      en: {
        facts: [
          { emoji: '🗽', text: 'La Statua della Libertà fu un regalo della Francia nel 1886!' },
          { emoji: '🍔', text: 'Gli americani mangiano circa 50 miliardi di hamburger all\'anno!' },
          { emoji: '🏈', text: 'Il Super Bowl è l\'evento più visto degli USA' },
        ],
        tips: [{ emoji: '💡', text: 'Guarda serie in inglese con sottotitoli in inglese!' }, { emoji: '🎵', text: 'Ascolta canzoni e prova a seguire il testo' }],
      },
      es: {
        facts: [
          { emoji: '💃', text: 'Il flamenco è Patrimonio dell\'Umanità UNESCO!' },
          { emoji: '🍅', text: 'La Tomatina: festival dove lanciano 150mila pomodori!' },
        ],
        tips: [{ emoji: '💡', text: 'Spagnolo e italiano sono molto simili!' }],
      },
      fr: {
        facts: [
          { emoji: '🗼', text: 'La Torre Eiffel fu costruita nel 1889!' },
          { emoji: '🧀', text: 'La Francia produce più di 1.200 tipi di formaggio!' },
        ],
        tips: [{ emoji: '💡', text: 'Pratica la "R" francese facendo gargarismi!' }],
      },
      de: {
        facts: [
          { emoji: '🏰', text: 'La Germania ha più di 20.000 castelli!' },
          { emoji: '🍺', text: 'L\'Oktoberfest serve 7 milioni di litri di birra!' },
        ],
        tips: [{ emoji: '💡', text: 'Il tedesco ha parole composte giganti!' }],
      },
      it: { facts: [], tips: [] },
      ja: {
        facts: [
          { emoji: '🗾', text: 'Il Giappone ha più di 6.800 isole!' },
          { emoji: '🍣', text: 'Il sushi originale era pesce fermentato!' },
        ],
        tips: [{ emoji: '💡', text: 'Inizia con l\'hiragana, sono solo 46 caratteri!' }],
      },
    },
    es: {
      en: {
        facts: [
          { emoji: '🗽', text: '¡La Estatua de la Libertad fue un regalo de Francia en 1886!' },
          { emoji: '🍔', text: '¡Los americanos comen unos 50 mil millones de hamburguesas al año!' },
        ],
        tips: [{ emoji: '💡', text: '¡Mira series en inglés con subtítulos en inglés!' }],
      },
      fr: {
        facts: [
          { emoji: '🗼', text: '¡La Torre Eiffel se construyó en 1889!' },
          { emoji: '🧀', text: '¡Francia produce más de 1.200 tipos de queso!' },
        ],
        tips: [{ emoji: '💡', text: '¡Practica la "R" francesa haciendo gárgaras!' }],
      },
      de: {
        facts: [
          { emoji: '🏰', text: '¡Alemania tiene más de 20.000 castillos!' },
          { emoji: '🍺', text: '¡El Oktoberfest sirve 7 millones de litros de cerveza!' },
        ],
        tips: [{ emoji: '💡', text: '¡El alemán tiene palabras compuestas gigantes!' }],
      },
      it: {
        facts: [
          { emoji: '🍕', text: '¡La pizza margherita lleva el nombre de la Reina Margherita!' },
          { emoji: '🏛️', text: '¡Roma tiene más de 900 iglesias!' },
        ],
        tips: [{ emoji: '💡', text: '¡El italiano es súper musical, canta al hablar!' }],
      },
      es: { facts: [], tips: [] },
      ja: {
        facts: [
          { emoji: '🗾', text: '¡Japón tiene más de 6.800 islas!' },
          { emoji: '🍣', text: '¡El sushi original era pescado fermentado!' },
        ],
        tips: [{ emoji: '💡', text: '¡Empieza por el hiragana, son solo 46 caracteres!' }],
      },
    },
    fr: {
      en: {
        facts: [
          { emoji: '🗽', text: 'La Statue de la Liberté était un cadeau de la France en 1886 !' },
          { emoji: '🍔', text: 'Les Américains mangent environ 50 milliards de hamburgers par an !' },
        ],
        tips: [{ emoji: '💡', text: 'Regardez des séries en anglais avec des sous-titres en anglais !' }],
      },
      es: {
        facts: [{ emoji: '💃', text: 'Le flamenco est Patrimoine de l\'Humanité UNESCO !' }],
        tips: [{ emoji: '💡', text: 'L\'espagnol et le français partagent des racines latines !' }],
      },
      fr: { facts: [], tips: [] },
      de: {
        facts: [{ emoji: '🏰', text: 'L\'Allemagne a plus de 20 000 châteaux !' }],
        tips: [{ emoji: '💡', text: 'L\'allemand a des mots composés géants !' }],
      },
      it: {
        facts: [{ emoji: '🍕', text: 'La pizza margherita porte le nom de la Reine Margherita !' }],
        tips: [{ emoji: '💡', text: 'L\'italien est super musical, chantez en parlant !' }],
      },
      ja: {
        facts: [{ emoji: '🗾', text: 'Le Japon a plus de 6 800 îles !' }],
        tips: [{ emoji: '💡', text: 'Commencez par les hiragana, seulement 46 caractères !' }],
      },
    },
    de: {
      en: {
        facts: [
          { emoji: '🗽', text: 'Die Freiheitsstatue war ein Geschenk Frankreichs von 1886!' },
          { emoji: '🍔', text: 'Amerikaner essen rund 50 Milliarden Hamburger pro Jahr!' },
        ],
        tips: [{ emoji: '💡', text: 'Schaue Serien auf Englisch mit englischen Untertiteln!' }],
      },
      es: {
        facts: [{ emoji: '💃', text: 'Flamenco ist UNESCO-Welterbe!' }],
        tips: [{ emoji: '💡', text: 'Spanisch und Deutsch teilen einige lateinische Wurzeln!' }],
      },
      fr: {
        facts: [{ emoji: '🗼', text: 'Der Eiffelturm wurde 1889 erbaut!' }],
        tips: [{ emoji: '💡', text: 'Übe das französische "R" durch Gurgeln!' }],
      },
      de: { facts: [], tips: [] },
      it: {
        facts: [{ emoji: '🍕', text: 'Pizza Margherita wurde nach Königin Margherita benannt!' }],
        tips: [{ emoji: '💡', text: 'Italienisch ist super musikalisch, singe beim Sprechen!' }],
      },
      ja: {
        facts: [{ emoji: '🗾', text: 'Japan hat über 6.800 Inseln!' }],
        tips: [{ emoji: '💡', text: 'Fang mit Hiragana an, nur 46 Zeichen!' }],
      },
    },
    ja: {
      en: {
        facts: [
          { emoji: '🗽', text: '自由の女神は1886年にフランスからの贈り物でした！' },
          { emoji: '🍔', text: 'アメリカ人は年間約500億個のハンバーガーを食べます！' },
        ],
        tips: [{ emoji: '💡', text: '英語の字幕付きで英語のドラマを見よう！' }],
      },
      es: {
        facts: [{ emoji: '💃', text: 'フラメンコはユネスコ世界遺産です！' }],
        tips: [{ emoji: '💡', text: 'レゲトンを聴いてスラングを学ぼう' }],
      },
      fr: {
        facts: [{ emoji: '🗼', text: 'エッフェル塔は1889年に建てられました！' }],
        tips: [{ emoji: '💡', text: 'うがいでフランス語の「R」を練習しよう！' }],
      },
      de: {
        facts: [{ emoji: '🏰', text: 'ドイツには20,000以上のお城があります！' }],
        tips: [{ emoji: '💡', text: 'ドイツ語には巨大な複合語があります！' }],
      },
      it: {
        facts: [{ emoji: '🍕', text: 'ピザ・マルゲリータはマルゲリータ女王にちなんで名付けられました！' }],
        tips: [{ emoji: '💡', text: 'イタリア語はとても音楽的、歌うように話そう！' }],
      },
      ja: { facts: [], tips: [] },
    },
  };

  return content[nativeLang]?.[course] || content.pt?.[course] || content.pt.en;
};

const CuriositiesTab = () => {
  const { course, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const data = getContent(course, nativeLang);

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">🌍✨</span>
        <h2 className="text-2xl font-black text-foreground">{tr('curiosities_title')}</h2>
      </div>

      {data.facts.length > 0 && (
        <div>
          <h3 className="font-black text-foreground mb-3">{tr('amazing_facts')}</h3>
          <div className="space-y-3">
            {data.facts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-start gap-3"
              >
                <span className="text-3xl flex-shrink-0">{fact.emoji}</span>
                <p className="font-semibold text-foreground text-sm">{fact.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {data.tips.length > 0 && (
        <div>
          <h3 className="font-black text-foreground mb-3">{tr('study_tips')}</h3>
          <div className="space-y-3">
            {data.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="bg-secondary rounded-2xl p-4 border border-border flex items-start gap-3"
              >
                <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                <p className="font-semibold text-secondary-foreground text-sm">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CuriositiesTab;
