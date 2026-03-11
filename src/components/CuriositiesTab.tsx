import { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { motion } from 'framer-motion';

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
      pt: {
        facts: [
          { emoji: '🇧🇷', text: 'O Brasil é o maior país lusófono do mundo!' },
          { emoji: '☕', text: 'O Brasil é o maior produtor de café do mundo!' },
          { emoji: '🌳', text: 'A Amazônia produz 20% do oxigênio do mundo' },
        ],
        tips: [
          { emoji: '💡', text: 'Português brasileiro tem 26 letras no alfabeto!' },
          { emoji: '🎵', text: 'Ouça bossa nova e MPB para treinar!' },
        ],
      },
      ko: {
        facts: [
          { emoji: '🇰🇷', text: 'O hangul foi criado pelo Rei Sejong em 1443!' },
          { emoji: '🎤', text: 'K-pop é um fenômeno cultural mundial!' },
          { emoji: '🍜', text: 'Coreanos comem cerca de 8kg de kimchi por mês!' },
        ],
        tips: [
          { emoji: '💡', text: 'O hangul tem apenas 24 letras, aprenda rápido!' },
          { emoji: '🎵', text: 'Doramas são ótimos para aprender coreano!' },
        ],
      },
    },
    en: {
      es: { facts: [{ emoji: '💃', text: 'Flamenco is a UNESCO World Heritage!' }], tips: [{ emoji: '💡', text: 'Spanish and English share many Latin roots!' }] },
      fr: { facts: [{ emoji: '🗼', text: 'The Eiffel Tower was built in 1889!' }], tips: [{ emoji: '💡', text: 'Practice the French "R" by gargling!' }] },
      de: { facts: [{ emoji: '🏰', text: 'Germany has over 20,000 castles!' }], tips: [{ emoji: '💡', text: 'German has giant compound words!' }] },
      it: { facts: [{ emoji: '🍕', text: 'Pizza Margherita was named after Queen Margherita!' }], tips: [{ emoji: '💡', text: 'Italian is super musical, sing as you speak!' }] },
      ja: { facts: [{ emoji: '🗾', text: 'Japan has over 6,800 islands!' }], tips: [{ emoji: '💡', text: 'Start with hiragana, only 46 characters!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Brazil is the largest Portuguese-speaking country!' }], tips: [{ emoji: '💡', text: 'Brazilian Portuguese has a melodic rhythm!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'Hangul was created by King Sejong in 1443!' }], tips: [{ emoji: '💡', text: 'K-dramas are great for learning Korean!' }] },
      en: { facts: [], tips: [] },
    },
    es: {
      en: { facts: [{ emoji: '🗽', text: '¡La Estatua de la Libertad fue un regalo de Francia!' }], tips: [{ emoji: '💡', text: '¡Mira series en inglés!' }] },
      fr: { facts: [{ emoji: '🗼', text: '¡La Torre Eiffel se construyó en 1889!' }], tips: [{ emoji: '💡', text: '¡Practica la "R" francesa!' }] },
      de: { facts: [{ emoji: '🏰', text: '¡Alemania tiene más de 20.000 castillos!' }], tips: [{ emoji: '💡', text: '¡El alemán tiene palabras compuestas gigantes!' }] },
      it: { facts: [{ emoji: '🍕', text: '¡La pizza margherita lleva el nombre de la Reina!' }], tips: [{ emoji: '💡', text: '¡El italiano es súper musical!' }] },
      ja: { facts: [{ emoji: '🗾', text: '¡Japón tiene más de 6.800 islas!' }], tips: [{ emoji: '💡', text: '¡Empieza por el hiragana!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: '¡Brasil es el mayor país lusófono!' }], tips: [{ emoji: '💡', text: '¡El portugués brasileño tiene un ritmo melódico!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: '¡El hangul fue creado por el Rey Sejong en 1443!' }], tips: [{ emoji: '💡', text: '¡Los doramas son geniales para aprender coreano!' }] },
      es: { facts: [], tips: [] },
    },
    fr: {
      en: { facts: [{ emoji: '🗽', text: 'La Statue de la Liberté était un cadeau de la France !' }], tips: [{ emoji: '💡', text: 'Regardez des séries en anglais !' }] },
      es: { facts: [{ emoji: '💃', text: 'Le flamenco est Patrimoine UNESCO !' }], tips: [{ emoji: '💡', text: "L'espagnol et le français partagent des racines latines !" }] },
      de: { facts: [{ emoji: '🏰', text: "L'Allemagne a plus de 20 000 châteaux !" }], tips: [{ emoji: '💡', text: "L'allemand a des mots composés géants !" }] },
      it: { facts: [{ emoji: '🍕', text: 'La pizza margherita porte le nom de la Reine !' }], tips: [{ emoji: '💡', text: "L'italien est super musical !" }] },
      ja: { facts: [{ emoji: '🗾', text: 'Le Japon a plus de 6 800 îles !' }], tips: [{ emoji: '💡', text: 'Commencez par les hiragana !' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Le Brésil est le plus grand pays lusophone !' }], tips: [{ emoji: '💡', text: 'Le portugais brésilien a un rythme mélodique !' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'Le hangul a été créé par le Roi Sejong en 1443 !' }], tips: [{ emoji: '💡', text: 'Les dramas coréens sont parfaits pour apprendre !' }] },
      fr: { facts: [], tips: [] },
    },
    de: {
      en: { facts: [{ emoji: '🗽', text: 'Die Freiheitsstatue war ein Geschenk Frankreichs!' }], tips: [{ emoji: '💡', text: 'Schaue Serien auf Englisch!' }] },
      es: { facts: [{ emoji: '💃', text: 'Flamenco ist UNESCO-Welterbe!' }], tips: [{ emoji: '💡', text: 'Spanisch hat lateinische Wurzeln!' }] },
      fr: { facts: [{ emoji: '🗼', text: 'Der Eiffelturm wurde 1889 erbaut!' }], tips: [{ emoji: '💡', text: 'Übe das französische "R"!' }] },
      it: { facts: [{ emoji: '🍕', text: 'Pizza Margherita nach Königin Margherita!' }], tips: [{ emoji: '💡', text: 'Italienisch ist super musikalisch!' }] },
      ja: { facts: [{ emoji: '🗾', text: 'Japan hat über 6.800 Inseln!' }], tips: [{ emoji: '💡', text: 'Fang mit Hiragana an!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Brasilien ist das größte lusophone Land!' }], tips: [{ emoji: '💡', text: 'Brasilianisches Portugiesisch hat einen melodischen Rhythmus!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'Hangul wurde 1443 vom König Sejong erschaffen!' }], tips: [{ emoji: '💡', text: 'K-Dramas sind toll zum Koreanisch lernen!' }] },
      de: { facts: [], tips: [] },
    },
    it: {
      en: { facts: [{ emoji: '🗽', text: 'La Statua della Libertà fu un regalo della Francia!' }], tips: [{ emoji: '💡', text: 'Guarda serie in inglese!' }] },
      es: { facts: [{ emoji: '💃', text: "Il flamenco è Patrimonio UNESCO!" }], tips: [{ emoji: '💡', text: 'Spagnolo e italiano sono molto simili!' }] },
      fr: { facts: [{ emoji: '🗼', text: 'La Torre Eiffel fu costruita nel 1889!' }], tips: [{ emoji: '💡', text: 'Pratica la "R" francese!' }] },
      de: { facts: [{ emoji: '🏰', text: 'La Germania ha più di 20.000 castelli!' }], tips: [{ emoji: '💡', text: 'Il tedesco ha parole composte giganti!' }] },
      ja: { facts: [{ emoji: '🗾', text: 'Il Giappone ha più di 6.800 isole!' }], tips: [{ emoji: '💡', text: "Inizia con l'hiragana!" }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Il Brasile è il più grande paese lusofono!' }], tips: [{ emoji: '💡', text: 'Il portoghese brasiliano ha un ritmo melodico!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: "L'hangul fu creato dal Re Sejong nel 1443!" }], tips: [{ emoji: '💡', text: 'I drama coreani sono ottimi per imparare!' }] },
      it: { facts: [], tips: [] },
    },
    ja: {
      en: { facts: [{ emoji: '🗽', text: '自由の女神は1886年にフランスからの贈り物でした！' }], tips: [{ emoji: '💡', text: '英語の字幕付きでドラマを見よう！' }] },
      es: { facts: [{ emoji: '💃', text: 'フラメンコはユネスコ世界遺産です！' }], tips: [{ emoji: '💡', text: 'レゲトンでスラングを学ぼう' }] },
      fr: { facts: [{ emoji: '🗼', text: 'エッフェル塔は1889年に建てられました！' }], tips: [{ emoji: '💡', text: 'うがいでフランス語の「R」を練習！' }] },
      de: { facts: [{ emoji: '🏰', text: 'ドイツには20,000以上のお城が！' }], tips: [{ emoji: '💡', text: 'ドイツ語には巨大な複合語が！' }] },
      it: { facts: [{ emoji: '🍕', text: 'ピザ・マルゲリータはマルゲリータ女王にちなんで！' }], tips: [{ emoji: '💡', text: 'イタリア語は音楽的！' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'ブラジルは最大のポルトガル語圏の国！' }], tips: [{ emoji: '💡', text: 'ブラジルのポルトガル語はリズミカル！' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'ハングルは1443年に世宗大王が作りました！' }], tips: [{ emoji: '💡', text: '韓国ドラマで韓国語を学ぼう！' }] },
      ja: { facts: [], tips: [] },
    },
    ko: {
      en: { facts: [{ emoji: '🗽', text: '자유의 여신상은 1886년 프랑스의 선물이었어요!' }], tips: [{ emoji: '💡', text: '영어 자막으로 드라마를 보세요!' }] },
      es: { facts: [{ emoji: '💃', text: '플라멩코는 유네스코 세계유산이에요!' }], tips: [{ emoji: '💡', text: '레게톤으로 슬랭을 배워보세요!' }] },
      fr: { facts: [{ emoji: '🗼', text: '에펠탑은 1889년에 건설되었어요!' }], tips: [{ emoji: '💡', text: '가글로 프랑스어 "R" 연습!' }] },
      de: { facts: [{ emoji: '🏰', text: '독일에는 20,000개 이상의 성이 있어요!' }], tips: [{ emoji: '💡', text: '독일어에는 거대한 복합어가 있어요!' }] },
      it: { facts: [{ emoji: '🍕', text: '피자 마르게리타는 마르게리타 여왕의 이름에서!' }], tips: [{ emoji: '💡', text: '이탈리아어는 음악적이에요!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: '브라질은 최대 포르투갈어권 국가예요!' }], tips: [{ emoji: '💡', text: '브라질 포르투갈어는 리드미컬해요!' }] },
      ja: { facts: [{ emoji: '🗾', text: '일본에는 6,800개 이상의 섬이 있어요!' }], tips: [{ emoji: '💡', text: '히라가나부터 시작하세요!' }] },
      ko: { facts: [], tips: [] },
    },
  };

  return content[nativeLang]?.[course] || content.pt?.[course] || content.pt.en;
};

const CuriositiesTab = () => {
  const { course, nativeLang, completeCuriosity } = useApp();
  const tr = useTranslation(nativeLang);
  const data = getContent(course, nativeLang);
  const hasCalledRef = useRef(false);

  // Complete curiosity mission when tab is viewed
  useEffect(() => {
    if (!hasCalledRef.current) {
      hasCalledRef.current = true;
      completeCuriosity();
    }
  }, [completeCuriosity]);

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
