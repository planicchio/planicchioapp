import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';

const curiositiesData: Record<string, { facts: { emoji: string; text: string }[]; tips: { emoji: string; text: string }[] }> = {
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
};

const CuriositiesTab = () => {
  const { course } = useApp();
  const data = curiositiesData[course] || curiositiesData.en;

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">🌍✨</span>
        <h2 className="text-2xl font-black text-foreground">Curiosidades & Dicas</h2>
      </div>

      <div>
        <h3 className="font-black text-foreground mb-3">🤯 Fatos Incríveis</h3>
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

      <div>
        <h3 className="font-black text-foreground mb-3">💡 Dicas de Estudo</h3>
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
    </div>
  );
};

export default CuriositiesTab;
