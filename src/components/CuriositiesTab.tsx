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
          { emoji: '📚', text: 'A biblioteca do Congresso é a maior do mundo com 170 milhões de itens!' },
          { emoji: '🎸', text: 'O rock and roll nasceu nos Estados Unidos nos anos 1950!' },
          { emoji: '🌎', text: 'Os EUA têm 63 parques nacionais!' },
        ],
        tips: [
          { emoji: '💡', text: 'Assista séries em inglês com legenda em inglês!' },
          { emoji: '🎵', text: 'Ouça músicas e tente acompanhar a letra' },
          { emoji: '📱', text: 'Mude o idioma do celular para inglês' },
          { emoji: '📖', text: 'Leia livros infantis em inglês para começar' },
          { emoji: '🗣️', text: 'Fale em voz alta, mesmo sozinho!' },
        ],
      },
      es: {
        facts: [
          { emoji: '💃', text: 'O flamenco é Patrimônio da Humanidade pela UNESCO!' },
          { emoji: '🍅', text: 'La Tomatina: festival onde jogam 150 mil tomates!' },
          { emoji: '😴', text: 'A siesta é uma tradição sagrada na Espanha' },
          { emoji: '🏟️', text: 'A Espanha tem 47 patrimônios da UNESCO' },
          { emoji: '🎨', text: 'Picasso, Dalí e Goya são todos espanhóis!' },
          { emoji: '🌍', text: 'O espanhol é a 2ª língua mais falada do mundo!' },
          { emoji: '🏃', text: 'A corrida de touros de Pamplona acontece todo julho!' },
        ],
        tips: [
          { emoji: '💡', text: 'Espanhol e português são 90% parecidos!' },
          { emoji: '🎵', text: 'Ouça reggaeton para aprender gírias' },
          { emoji: '📺', text: 'Assista novelas em espanhol!' },
          { emoji: '🗣️', text: 'Pratique falando devagar primeiro' },
        ],
      },
      fr: {
        facts: [
          { emoji: '🗼', text: 'A Torre Eiffel foi construída em 1889!' },
          { emoji: '🧀', text: 'A França produz mais de 1.200 tipos de queijo!' },
          { emoji: '🎨', text: 'O Louvre é o museu mais visitado do mundo' },
          { emoji: '🥐', text: 'Os croissants na verdade vieram da Áustria!' },
          { emoji: '🍷', text: 'A França é o maior produtor de vinho do mundo!' },
          { emoji: '🚲', text: 'O Tour de France é a corrida de bicicleta mais famosa!' },
          { emoji: '💐', text: 'A lavanda da Provença floresce em junho-agosto' },
        ],
        tips: [
          { emoji: '💡', text: 'Pratique o "R" francês gargarejando!' },
          { emoji: '🎵', text: 'Ouça Édith Piaf para treinar o ouvido' },
          { emoji: '📺', text: 'Assista filmes franceses com legenda' },
          { emoji: '📖', text: 'Le Petit Prince é ótimo para iniciantes!' },
        ],
      },
      de: {
        facts: [
          { emoji: '🏰', text: 'A Alemanha tem mais de 20.000 castelos!' },
          { emoji: '🍺', text: 'Oktoberfest serve 7 milhões de litros de cerveja!' },
          { emoji: '🚗', text: 'Partes da Autobahn não têm limite de velocidade!' },
          { emoji: '🎄', text: 'A tradição da Árvore de Natal veio da Alemanha' },
          { emoji: '🎵', text: 'Beethoven e Bach eram alemães!' },
          { emoji: '🌭', text: 'Existem mais de 1.500 tipos de salsicha na Alemanha!' },
          { emoji: '📚', text: 'A Alemanha publica 80.000 livros por ano!' },
        ],
        tips: [
          { emoji: '💡', text: 'Alemão tem palavras compostas gigantes!' },
          { emoji: '🎵', text: 'Rammstein ajuda a aprender pronúncia 🤘' },
          { emoji: '📺', text: 'Dark na Netflix é ótimo para treinar!' },
          { emoji: '📖', text: 'Comece com os artigos: der, die, das' },
        ],
      },
      it: {
        facts: [
          { emoji: '🍕', text: 'A pizza margherita homenageia a Rainha Margherita!' },
          { emoji: '🏛️', text: 'Roma tem mais de 900 igrejas!' },
          { emoji: '🍝', text: 'Existem mais de 600 formatos de pasta na Itália' },
          { emoji: '🎭', text: 'Veneza tem mais de 400 pontes' },
          { emoji: '🎨', text: 'Leonardo da Vinci, Michelangelo e Rafael eram italianos!' },
          { emoji: '🏎️', text: 'Ferrari, Lamborghini e Maserati são italianas!' },
          { emoji: '🍦', text: 'O gelato italiano tem menos gordura que sorvete!' },
        ],
        tips: [
          { emoji: '💡', text: 'Italiano é super musical, cante ao falar!' },
          { emoji: '🎵', text: 'Ouça ópera italiana para treinar' },
          { emoji: '📺', text: 'Assista filmes do Fellini!' },
          { emoji: '🍕', text: 'Aprenda nomes de comida italiana primeiro!' },
        ],
      },
      ja: {
        facts: [
          { emoji: '🗾', text: 'O Japão tem mais de 6.800 ilhas!' },
          { emoji: '🍣', text: 'O sushi original era peixe fermentado!' },
          { emoji: '🚅', text: 'O Shinkansen nunca atrasa mais que 1 minuto!' },
          { emoji: '🌸', text: 'A temporada de sakura dura apenas 2 semanas' },
          { emoji: '🎮', text: 'Nintendo, Sony e Sega são japonesas!' },
          { emoji: '🏯', text: 'O Japão tem mais de 50.000 templos!' },
          { emoji: '🐈', text: 'No Japão existem cafés de gatos (neko café)!' },
        ],
        tips: [
          { emoji: '💡', text: 'Comece pelo hiragana, são só 46 caracteres!' },
          { emoji: '🎵', text: 'Anime é ótimo para aprender japonês casual' },
          { emoji: '📖', text: 'Mangá ajuda muito com vocabulário!' },
          { emoji: '🗣️', text: 'Pratique com frases do dia a dia!' },
        ],
      },
      pt: {
        facts: [
          { emoji: '🇧🇷', text: 'O Brasil é o maior país lusófono do mundo!' },
          { emoji: '☕', text: 'O Brasil é o maior produtor de café do mundo!' },
          { emoji: '🌳', text: 'A Amazônia produz 20% do oxigênio do mundo' },
          { emoji: '⚽', text: 'O Brasil é o país com mais títulos de Copa do Mundo!' },
          { emoji: '🎭', text: 'O Carnaval do Rio é o maior do mundo!' },
          { emoji: '🐦', text: 'O Brasil tem a maior biodiversidade do planeta!' },
        ],
        tips: [
          { emoji: '💡', text: 'Português brasileiro tem 26 letras no alfabeto!' },
          { emoji: '🎵', text: 'Ouça bossa nova e MPB para treinar!' },
          { emoji: '📺', text: 'Novelas brasileiras são ótimas para aprender!' },
        ],
      },
      ko: {
        facts: [
          { emoji: '🇰🇷', text: 'O hangul foi criado pelo Rei Sejong em 1443!' },
          { emoji: '🎤', text: 'K-pop é um fenômeno cultural mundial!' },
          { emoji: '🍜', text: 'Coreanos comem cerca de 8kg de kimchi por mês!' },
          { emoji: '📱', text: 'A Coreia do Sul tem a internet mais rápida do mundo!' },
          { emoji: '🎮', text: 'E-sports são um esporte nacional na Coreia!' },
          { emoji: '💄', text: 'A K-beauty revolucionou a indústria cosmética mundial!' },
        ],
        tips: [
          { emoji: '💡', text: 'O hangul tem apenas 24 letras, aprenda rápido!' },
          { emoji: '🎵', text: 'Doramas são ótimos para aprender coreano!' },
          { emoji: '📖', text: 'Aprenda hangul em uma semana, é muito lógico!' },
          { emoji: '🗣️', text: 'Pratique com apps de troca de idioma!' },
        ],
      },
    },
    en: {
      es: { facts: [{ emoji: '💃', text: 'Flamenco is a UNESCO World Heritage!' }, { emoji: '🍅', text: 'La Tomatina uses 150,000 tomatoes!' }, { emoji: '🌍', text: 'Spanish is the 2nd most spoken language!' }, { emoji: '🏟️', text: 'Spain has 47 UNESCO World Heritage Sites!' }, { emoji: '🐂', text: 'The Running of the Bulls in Pamplona happens every July!' }, { emoji: '🎨', text: 'Picasso, Dalí and Goya are all Spanish!' }, { emoji: '😴', text: 'The siesta is a sacred Spanish tradition!' }], tips: [{ emoji: '💡', text: 'Spanish and English share many Latin roots!' }, { emoji: '🎵', text: 'Listen to reggaeton to learn slang!' }, { emoji: '📺', text: 'Watch Spanish telenovelas with subtitles!' }, { emoji: '🗣️', text: 'Practice speaking slowly at first!' }] },
      fr: { facts: [{ emoji: '🗼', text: 'The Eiffel Tower was built in 1889!' }, { emoji: '🧀', text: 'France produces over 1,200 types of cheese!' }, { emoji: '🎨', text: 'The Louvre is the most visited museum!' }, { emoji: '🥐', text: 'Croissants actually came from Austria!' }, { emoji: '🍷', text: 'France is the biggest wine producer in the world!' }, { emoji: '🚲', text: 'Tour de France is the most famous bicycle race!' }, { emoji: '💐', text: 'Provence lavender blooms June through August!' }], tips: [{ emoji: '💡', text: 'Practice the French "R" by gargling!' }, { emoji: '📖', text: 'Read Le Petit Prince for beginners!' }, { emoji: '🎵', text: 'Listen to Édith Piaf to train your ear!' }, { emoji: '📺', text: 'Watch French movies with subtitles!' }] },
      de: { facts: [{ emoji: '🏰', text: 'Germany has over 20,000 castles!' }, { emoji: '🍺', text: 'Oktoberfest serves 7 million liters of beer!' }, { emoji: '🎵', text: 'Beethoven and Bach were German!' }, { emoji: '🚗', text: 'Parts of the Autobahn have no speed limit!' }, { emoji: '🎄', text: 'The Christmas tree tradition came from Germany!' }, { emoji: '🌭', text: 'Germany has over 1,500 types of sausage!' }, { emoji: '📚', text: 'Germany publishes 80,000 books per year!' }], tips: [{ emoji: '💡', text: 'German has giant compound words!' }, { emoji: '📺', text: 'Watch Dark on Netflix to practice!' }, { emoji: '📖', text: 'Start with the articles: der, die, das!' }, { emoji: '🎵', text: 'Rammstein helps with pronunciation 🤘' }] },
      it: { facts: [{ emoji: '🍕', text: 'Pizza Margherita was named after Queen Margherita!' }, { emoji: '🏎️', text: 'Ferrari, Lamborghini are Italian!' }, { emoji: '🎨', text: 'Da Vinci, Michelangelo were Italian!' }, { emoji: '🏛️', text: 'Rome has over 900 churches!' }, { emoji: '🍝', text: 'There are over 600 pasta shapes in Italy!' }, { emoji: '🎭', text: 'Venice has over 400 bridges!' }, { emoji: '🍦', text: 'Italian gelato has less fat than ice cream!' }], tips: [{ emoji: '💡', text: 'Italian is super musical, sing as you speak!' }, { emoji: '🎵', text: 'Listen to Italian opera to practice!' }, { emoji: '🍕', text: 'Learn Italian food names first!' }] },
      ja: { facts: [{ emoji: '🗾', text: 'Japan has over 6,800 islands!' }, { emoji: '🎮', text: 'Nintendo, Sony, Sega are Japanese!' }, { emoji: '🚅', text: 'Shinkansen is never more than 1 min late!' }, { emoji: '🌸', text: 'Cherry blossom season lasts only 2 weeks!' }, { emoji: '🍣', text: 'Original sushi was fermented fish!' }, { emoji: '🏯', text: 'Japan has over 50,000 temples!' }, { emoji: '🐈', text: 'Japan has cat cafés (neko café)!' }], tips: [{ emoji: '💡', text: 'Start with hiragana, only 46 characters!' }, { emoji: '🎵', text: 'Anime is great for casual Japanese!' }, { emoji: '📖', text: 'Manga helps a lot with vocabulary!' }, { emoji: '🗣️', text: 'Practice with everyday phrases!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Brazil is the largest Portuguese-speaking country!' }, { emoji: '⚽', text: 'Brazil has the most World Cup titles!' }, { emoji: '☕', text: 'Brazil is the world\'s largest coffee producer!' }, { emoji: '🌳', text: 'The Amazon produces 20% of the world\'s oxygen!' }, { emoji: '🎭', text: 'Rio Carnival is the biggest in the world!' }, { emoji: '🐦', text: 'Brazil has the most biodiversity on Earth!' }], tips: [{ emoji: '💡', text: 'Brazilian Portuguese has a melodic rhythm!' }, { emoji: '🎵', text: 'Listen to bossa nova and MPB!' }, { emoji: '📺', text: 'Brazilian telenovelas are great for learning!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'Hangul was created by King Sejong in 1443!' }, { emoji: '🎤', text: 'K-pop is a global phenomenon!' }, { emoji: '🍜', text: 'Koreans eat about 8kg of kimchi per month!' }, { emoji: '📱', text: 'South Korea has the fastest internet in the world!' }, { emoji: '🎮', text: 'Esports is a national sport in Korea!' }, { emoji: '💄', text: 'K-beauty revolutionized the cosmetics industry!' }], tips: [{ emoji: '💡', text: 'Hangul has only 24 letters - learn it fast!' }, { emoji: '🎵', text: 'K-dramas are great for learning Korean!' }, { emoji: '📖', text: 'Learn hangul in a week, it\'s very logical!' }] },
      en: { facts: [], tips: [] },
    },
    es: {
      en: { facts: [{ emoji: '🗽', text: '¡La Estatua de la Libertad fue un regalo de Francia!' }, { emoji: '🎬', text: '¡Hollywood produce más de 700 películas al año!' }, { emoji: '🌙', text: '¡EE.UU. es el único país que pisó la Luna!' }, { emoji: '🏈', text: '¡El Super Bowl es el evento más visto en EE.UU.!' }, { emoji: '📚', text: '¡La Biblioteca del Congreso es la más grande del mundo!' }, { emoji: '🎸', text: '¡El rock and roll nació en EE.UU. en los años 50!' }], tips: [{ emoji: '💡', text: '¡Mira series en inglés con subtítulos!' }, { emoji: '🎵', text: '¡Escucha música en inglés y sigue la letra!' }, { emoji: '📱', text: '¡Cambia el idioma de tu celular a inglés!' }] },
      fr: { facts: [{ emoji: '🗼', text: '¡La Torre Eiffel se construyó en 1889!' }, { emoji: '🧀', text: '¡Francia produce más de 1.200 tipos de queso!' }, { emoji: '🍷', text: '¡Francia es el mayor productor de vino del mundo!' }, { emoji: '🎨', text: '¡El Louvre es el museo más visitado del mundo!' }, { emoji: '🥐', text: '¡Los croissants en realidad vinieron de Austria!' }], tips: [{ emoji: '💡', text: '¡Practica la "R" francesa gargarizando!' }, { emoji: '📖', text: '¡Le Petit Prince es genial para principiantes!' }] },
      de: { facts: [{ emoji: '🏰', text: '¡Alemania tiene más de 20.000 castillos!' }, { emoji: '🍺', text: '¡Oktoberfest sirve 7 millones de litros de cerveza!' }, { emoji: '🎵', text: '¡Beethoven y Bach eran alemanes!' }, { emoji: '🚗', text: '¡Partes de la Autobahn no tienen límite de velocidad!' }, { emoji: '🌭', text: '¡Hay más de 1.500 tipos de salchichas en Alemania!' }], tips: [{ emoji: '💡', text: '¡El alemán tiene palabras compuestas gigantes!' }, { emoji: '📺', text: '¡Dark en Netflix es genial para practicar!' }] },
      it: { facts: [{ emoji: '🍕', text: '¡La pizza margherita lleva el nombre de la Reina!' }, { emoji: '🏎️', text: '¡Ferrari y Lamborghini son italianas!' }, { emoji: '🎨', text: '¡Da Vinci, Miguel Ángel y Rafael eran italianos!' }, { emoji: '🍝', text: '¡Hay más de 600 tipos de pasta en Italia!' }, { emoji: '🍦', text: '¡El gelato tiene menos grasa que el helado!' }], tips: [{ emoji: '💡', text: '¡El italiano es súper musical, canta al hablar!' }, { emoji: '🎵', text: '¡Escucha ópera italiana para practicar!' }] },
      ja: { facts: [{ emoji: '🗾', text: '¡Japón tiene más de 6.800 islas!' }, { emoji: '🍣', text: '¡El sushi original era pescado fermentado!' }, { emoji: '🚅', text: '¡El Shinkansen nunca se retrasa más de 1 minuto!' }, { emoji: '🌸', text: '¡La temporada de sakura dura solo 2 semanas!' }, { emoji: '🎮', text: '¡Nintendo, Sony y Sega son japonesas!' }], tips: [{ emoji: '💡', text: '¡Empieza por el hiragana, solo son 46 caracteres!' }, { emoji: '🎵', text: '¡El anime es genial para aprender japonés!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: '¡Brasil es el mayor país lusófono!' }, { emoji: '⚽', text: '¡Brasil tiene más títulos mundiales!' }, { emoji: '☕', text: '¡Brasil es el mayor productor de café del mundo!' }, { emoji: '🌳', text: '¡La Amazonia produce el 20% del oxígeno mundial!' }, { emoji: '🎭', text: '¡El Carnaval de Río es el más grande del mundo!' }], tips: [{ emoji: '💡', text: '¡El portugués brasileño tiene un ritmo melódico!' }, { emoji: '🎵', text: '¡Escucha bossa nova y MPB!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: '¡El hangul fue creado por el Rey Sejong en 1443!' }, { emoji: '🎤', text: '¡El K-pop es un fenómeno mundial!' }, { emoji: '🍜', text: '¡Los coreanos comen unos 8kg de kimchi al mes!' }, { emoji: '📱', text: '¡Corea del Sur tiene el internet más rápido del mundo!' }, { emoji: '🎮', text: '¡Los esports son deporte nacional en Corea!' }], tips: [{ emoji: '💡', text: '¡Los doramas son geniales para aprender coreano!' }, { emoji: '📖', text: '¡Aprende hangul en una semana, es muy lógico!' }] },
      es: { facts: [], tips: [] },
    },
    fr: {
      en: { facts: [{ emoji: '🗽', text: 'La Statue de la Liberté était un cadeau de la France !' }, { emoji: '🎬', text: 'Hollywood produit plus de 700 films par an !' }, { emoji: '🌙', text: "Les USA sont le seul pays à avoir marché sur la Lune !" }, { emoji: '🏈', text: "Le Super Bowl est l'événement le plus regardé aux USA !" }, { emoji: '📚', text: 'La Bibliothèque du Congrès est la plus grande au monde !' }], tips: [{ emoji: '💡', text: 'Regardez des séries en anglais avec sous-titres !' }, { emoji: '🎵', text: "Écoutez de la musique anglaise et suivez les paroles !" }, { emoji: '📱', text: 'Changez la langue de votre téléphone en anglais !' }] },
      es: { facts: [{ emoji: '💃', text: 'Le flamenco est Patrimoine UNESCO !' }, { emoji: '🍅', text: 'La Tomatina utilise 150 000 tomates !' }, { emoji: '🌍', text: "L'espagnol est la 2e langue la plus parlée !" }, { emoji: '😴', text: 'La siesta est une tradition sacrée en Espagne !' }, { emoji: '🎨', text: 'Picasso, Dalí et Goya sont tous espagnols !' }], tips: [{ emoji: '💡', text: "L'espagnol et le français partagent des racines latines !" }, { emoji: '🎵', text: 'Écoutez du reggaeton pour apprendre l\'argot !' }] },
      de: { facts: [{ emoji: '🏰', text: "L'Allemagne a plus de 20 000 châteaux !" }, { emoji: '🍺', text: "L'Oktoberfest sert 7 millions de litres de bière !" }, { emoji: '🎵', text: 'Beethoven et Bach étaient allemands !' }, { emoji: '🚗', text: "Des parties de l'Autobahn n'ont pas de limite de vitesse !" }, { emoji: '🌭', text: "Il y a plus de 1 500 types de saucisses en Allemagne !" }], tips: [{ emoji: '💡', text: "L'allemand a des mots composés géants !" }, { emoji: '📺', text: 'Dark sur Netflix est parfait pour pratiquer !' }] },
      it: { facts: [{ emoji: '🍕', text: 'La pizza margherita porte le nom de la Reine !' }, { emoji: '🏎️', text: 'Ferrari et Lamborghini sont italiennes !' }, { emoji: '🎨', text: 'Da Vinci, Michel-Ange et Raphaël étaient italiens !' }, { emoji: '🍝', text: "Il y a plus de 600 formes de pâtes en Italie !" }, { emoji: '🍦', text: 'Le gelato a moins de matières grasses que la glace !' }], tips: [{ emoji: '💡', text: "L'italien est super musical, chantez en parlant !" }, { emoji: '🍕', text: "Apprenez d'abord les noms de plats italiens !" }] },
      ja: { facts: [{ emoji: '🗾', text: 'Le Japon a plus de 6 800 îles !' }, { emoji: '🍣', text: 'Le sushi original était du poisson fermenté !' }, { emoji: '🚅', text: "Le Shinkansen n'est jamais en retard de plus d'1 minute !" }, { emoji: '🌸', text: 'La saison des sakura ne dure que 2 semaines !' }, { emoji: '🎮', text: 'Nintendo, Sony et Sega sont japonais !' }], tips: [{ emoji: '💡', text: 'Commencez par les hiragana, seulement 46 caractères !' }, { emoji: '🎵', text: "L'anime est parfait pour le japonais informel !" }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Le Brésil est le plus grand pays lusophone !' }, { emoji: '⚽', text: 'Le Brésil a le plus de titres de Coupe du Monde !' }, { emoji: '☕', text: 'Le Brésil est le plus grand producteur de café !' }, { emoji: '🌳', text: "L'Amazonie produit 20% de l'oxygène mondial !" }, { emoji: '🎭', text: 'Le Carnaval de Rio est le plus grand au monde !' }], tips: [{ emoji: '💡', text: 'Le portugais brésilien a un rythme mélodique !' }, { emoji: '🎵', text: 'Écoutez de la bossa nova et du MPB !' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'Le hangul a été créé par le Roi Sejong en 1443 !' }, { emoji: '🎤', text: 'Le K-pop est un phénomène mondial !' }, { emoji: '🍜', text: 'Les Coréens mangent environ 8kg de kimchi par mois !' }, { emoji: '📱', text: 'La Corée du Sud a l\'internet le plus rapide au monde !' }, { emoji: '🎮', text: 'Les e-sports sont un sport national en Corée !' }], tips: [{ emoji: '💡', text: 'Les dramas coréens sont parfaits pour apprendre !' }, { emoji: '📖', text: "Apprenez le hangul en une semaine, c'est très logique !" }] },
      fr: { facts: [], tips: [] },
    },
    de: {
      en: { facts: [{ emoji: '🗽', text: 'Die Freiheitsstatue war ein Geschenk Frankreichs!' }, { emoji: '🎬', text: 'Hollywood produziert über 700 Filme pro Jahr!' }, { emoji: '🌙', text: 'Die USA sind das einzige Land, das auf dem Mond war!' }, { emoji: '🏈', text: 'Der Super Bowl ist das meistgesehene Event in den USA!' }, { emoji: '📚', text: 'Die Library of Congress ist die größte der Welt!' }], tips: [{ emoji: '💡', text: 'Schaue Serien auf Englisch mit Untertiteln!' }, { emoji: '🎵', text: 'Höre englische Musik und folge dem Text!' }, { emoji: '📱', text: 'Stelle dein Handy auf Englisch um!' }] },
      es: { facts: [{ emoji: '💃', text: 'Flamenco ist UNESCO-Welterbe!' }, { emoji: '🍅', text: 'La Tomatina verwendet 150.000 Tomaten!' }, { emoji: '🌍', text: 'Spanisch ist die 2. meistgesprochene Sprache!' }, { emoji: '😴', text: 'Die Siesta ist eine heilige Tradition in Spanien!' }, { emoji: '🎨', text: 'Picasso, Dalí und Goya waren alle Spanier!' }], tips: [{ emoji: '💡', text: 'Spanisch und Deutsch teilen einige Wurzeln!' }, { emoji: '🎵', text: 'Höre Reggaeton um Slang zu lernen!' }] },
      fr: { facts: [{ emoji: '🗼', text: 'Der Eiffelturm wurde 1889 erbaut!' }, { emoji: '🧀', text: 'Frankreich produziert über 1.200 Käsesorten!' }, { emoji: '🍷', text: 'Frankreich ist der größte Weinproduzent der Welt!' }, { emoji: '🎨', text: 'Der Louvre ist das meistbesuchte Museum!' }, { emoji: '🥐', text: 'Croissants kamen eigentlich aus Österreich!' }], tips: [{ emoji: '💡', text: 'Übe das französische "R" durch Gurgeln!' }, { emoji: '📖', text: 'Le Petit Prince ist toll für Anfänger!' }] },
      it: { facts: [{ emoji: '🍕', text: 'Pizza Margherita wurde nach Königin Margherita benannt!' }, { emoji: '🏎️', text: 'Ferrari und Lamborghini sind italienisch!' }, { emoji: '🎨', text: 'Da Vinci, Michelangelo und Raffael waren Italiener!' }, { emoji: '🍝', text: 'Es gibt über 600 Pasta-Formen in Italien!' }, { emoji: '🍦', text: 'Italienisches Gelato hat weniger Fett als Eiscreme!' }], tips: [{ emoji: '💡', text: 'Italienisch ist super musikalisch, singe beim Sprechen!' }, { emoji: '🍕', text: 'Lerne zuerst italienische Gerichte-Namen!' }] },
      ja: { facts: [{ emoji: '🗾', text: 'Japan hat über 6.800 Inseln!' }, { emoji: '🍣', text: 'Das ursprüngliche Sushi war fermentierter Fisch!' }, { emoji: '🚅', text: 'Der Shinkansen hat nie mehr als 1 Minute Verspätung!' }, { emoji: '🌸', text: 'Die Sakura-Saison dauert nur 2 Wochen!' }, { emoji: '🎮', text: 'Nintendo, Sony und Sega sind japanisch!' }], tips: [{ emoji: '💡', text: 'Fang mit Hiragana an, nur 46 Zeichen!' }, { emoji: '🎵', text: 'Anime ist toll für lockeres Japanisch!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Brasilien ist das größte lusophone Land!' }, { emoji: '⚽', text: 'Brasilien hat die meisten WM-Titel!' }, { emoji: '☕', text: 'Brasilien ist der größte Kaffeeproduzent der Welt!' }, { emoji: '🌳', text: 'Der Amazonas produziert 20% des weltweiten Sauerstoffs!' }, { emoji: '🎭', text: 'Der Karneval in Rio ist der größte der Welt!' }], tips: [{ emoji: '💡', text: 'Brasilianisches Portugiesisch hat einen melodischen Rhythmus!' }, { emoji: '🎵', text: 'Höre Bossa Nova und MPB!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'Hangul wurde 1443 vom König Sejong erschaffen!' }, { emoji: '🎤', text: 'K-pop ist ein globales Phänomen!' }, { emoji: '🍜', text: 'Koreaner essen etwa 8kg Kimchi pro Monat!' }, { emoji: '📱', text: 'Südkorea hat das schnellste Internet der Welt!' }, { emoji: '🎮', text: 'E-Sports sind ein Nationalsport in Korea!' }], tips: [{ emoji: '💡', text: 'K-Dramas sind toll zum Koreanisch lernen!' }, { emoji: '📖', text: 'Lerne Hangul in einer Woche, es ist sehr logisch!' }] },
      de: { facts: [], tips: [] },
    },
    it: {
      en: { facts: [{ emoji: '🗽', text: 'La Statua della Libertà fu un regalo della Francia!' }, { emoji: '🎬', text: 'Hollywood produce più di 700 film all\'anno!' }, { emoji: '🌙', text: 'Gli USA sono l\'unico paese ad aver camminato sulla Luna!' }, { emoji: '🏈', text: 'Il Super Bowl è l\'evento più visto negli USA!' }, { emoji: '📚', text: 'La Biblioteca del Congresso è la più grande del mondo!' }, { emoji: '🎸', text: 'Il rock and roll è nato negli USA negli anni \'50!' }], tips: [{ emoji: '💡', text: 'Guarda serie in inglese con sottotitoli!' }, { emoji: '🎵', text: 'Ascolta musica in inglese e segui il testo!' }, { emoji: '📱', text: 'Cambia la lingua del telefono in inglese!' }] },
      es: { facts: [{ emoji: '💃', text: 'Il flamenco è Patrimonio UNESCO!' }, { emoji: '🍅', text: 'La Tomatina usa 150.000 pomodori!' }, { emoji: '🌍', text: 'Lo spagnolo è la 2ª lingua più parlata al mondo!' }, { emoji: '😴', text: 'La siesta è una tradizione sacra in Spagna!' }, { emoji: '🎨', text: 'Picasso, Dalí e Goya sono tutti spagnoli!' }], tips: [{ emoji: '💡', text: 'Spagnolo e italiano sono molto simili!' }, { emoji: '🎵', text: 'Ascolta reggaeton per imparare lo slang!' }] },
      fr: { facts: [{ emoji: '🗼', text: 'La Torre Eiffel fu costruita nel 1889!' }, { emoji: '🧀', text: 'La Francia produce più di 1.200 tipi di formaggio!' }, { emoji: '🍷', text: 'La Francia è il più grande produttore di vino!' }, { emoji: '🎨', text: 'Il Louvre è il museo più visitato al mondo!' }, { emoji: '🥐', text: 'I croissant in realtà vengono dall\'Austria!' }], tips: [{ emoji: '💡', text: 'Pratica la "R" francese gargarizzando!' }, { emoji: '📖', text: 'Le Petit Prince è ottimo per principianti!' }] },
      de: { facts: [{ emoji: '🏰', text: 'La Germania ha più di 20.000 castelli!' }, { emoji: '🍺', text: "L'Oktoberfest serve 7 milioni di litri di birra!" }, { emoji: '🎵', text: 'Beethoven e Bach erano tedeschi!' }, { emoji: '🚗', text: "Parti dell'Autobahn non hanno limiti di velocità!" }, { emoji: '🌭', text: 'Ci sono più di 1.500 tipi di salsicce in Germania!' }], tips: [{ emoji: '💡', text: 'Il tedesco ha parole composte giganti!' }, { emoji: '📺', text: 'Dark su Netflix è ottimo per praticare!' }] },
      ja: { facts: [{ emoji: '🗾', text: 'Il Giappone ha più di 6.800 isole!' }, { emoji: '🍣', text: 'Il sushi originale era pesce fermentato!' }, { emoji: '🚅', text: 'Lo Shinkansen non è mai in ritardo di più di 1 minuto!' }, { emoji: '🌸', text: 'La stagione dei sakura dura solo 2 settimane!' }, { emoji: '🎮', text: 'Nintendo, Sony e Sega sono giapponesi!' }, { emoji: '🏯', text: 'Il Giappone ha più di 50.000 templi!' }], tips: [{ emoji: '💡', text: "Inizia con l'hiragana, solo 46 caratteri!" }, { emoji: '🎵', text: "L'anime è perfetto per il giapponese informale!" }, { emoji: '📖', text: 'I manga aiutano molto con il vocabolario!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'Il Brasile è il più grande paese lusofono!' }, { emoji: '⚽', text: 'Il Brasile ha il maggior numero di titoli mondiali!' }, { emoji: '☕', text: 'Il Brasile è il più grande produttore di caffè!' }, { emoji: '🌳', text: "L'Amazzonia produce il 20% dell'ossigeno mondiale!" }, { emoji: '🎭', text: 'Il Carnevale di Rio è il più grande del mondo!' }, { emoji: '🐦', text: 'Il Brasile ha la maggiore biodiversità del pianeta!' }], tips: [{ emoji: '💡', text: 'Il portoghese brasiliano ha un ritmo melodico!' }, { emoji: '🎵', text: 'Ascolta bossa nova e MPB!' }, { emoji: '📺', text: 'Le telenovelas brasiliane sono ottime per imparare!' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: "L'hangul fu creato dal Re Sejong nel 1443!" }, { emoji: '🎤', text: 'Il K-pop è un fenomeno culturale mondiale!' }, { emoji: '🍜', text: 'I coreani mangiano circa 8kg di kimchi al mese!' }, { emoji: '📱', text: 'La Corea del Sud ha l\'internet più veloce al mondo!' }, { emoji: '🎮', text: 'Gli e-sports sono uno sport nazionale in Corea!' }, { emoji: '💄', text: 'La K-beauty ha rivoluzionato l\'industria cosmetica!' }], tips: [{ emoji: '💡', text: 'I drama coreani sono ottimi per imparare!' }, { emoji: '📖', text: "Impara l'hangul in una settimana, è molto logico!" }] },
      it: { facts: [], tips: [] },
    },
    ja: {
      en: { facts: [{ emoji: '🗽', text: '自由の女神は1886年にフランスからの贈り物でした！' }, { emoji: '🎬', text: 'ハリウッドは年間700本以上の映画を制作！' }, { emoji: '🌙', text: 'アメリカは月に着陸した唯一の国！' }, { emoji: '🏈', text: 'スーパーボウルはアメリカで最も視聴されるイベント！' }, { emoji: '📚', text: '議会図書館は世界最大の図書館！' }], tips: [{ emoji: '💡', text: '英語の字幕付きでドラマを見よう！' }, { emoji: '🎵', text: '英語の音楽を聴いて歌詞を追おう！' }, { emoji: '📱', text: 'スマホの言語を英語に変えよう！' }] },
      es: { facts: [{ emoji: '💃', text: 'フラメンコはユネスコ世界遺産です！' }, { emoji: '🍅', text: 'ラ・トマティーナは15万個のトマトを使います！' }, { emoji: '🌍', text: 'スペイン語は世界で2番目に話されている言語！' }, { emoji: '😴', text: 'シエスタはスペインの神聖な伝統！' }, { emoji: '🎨', text: 'ピカソ、ダリ、ゴヤは全員スペイン人！' }], tips: [{ emoji: '💡', text: 'レゲトンでスラングを学ぼう！' }, { emoji: '📺', text: 'スペイン語のテレノベラを見よう！' }] },
      fr: { facts: [{ emoji: '🗼', text: 'エッフェル塔は1889年に建てられました！' }, { emoji: '🧀', text: 'フランスは1,200種類以上のチーズを生産！' }, { emoji: '🍷', text: 'フランスは世界最大のワイン生産国！' }, { emoji: '🎨', text: 'ルーブルは世界で最も訪れられる美術館！' }], tips: [{ emoji: '💡', text: 'うがいでフランス語の「R」を練習！' }, { emoji: '📖', text: '星の王子さまは初心者に最適！' }] },
      de: { facts: [{ emoji: '🏰', text: 'ドイツには20,000以上のお城が！' }, { emoji: '🍺', text: 'オクトーバーフェストは700万リットルのビールを提供！' }, { emoji: '🎵', text: 'ベートーヴェンとバッハはドイツ人！' }, { emoji: '🚗', text: 'アウトバーンの一部には速度制限がない！' }, { emoji: '🌭', text: 'ドイツには1,500種類以上のソーセージが！' }], tips: [{ emoji: '💡', text: 'ドイツ語には巨大な複合語が！' }, { emoji: '📺', text: 'Netflixの「ダーク」で練習しよう！' }] },
      it: { facts: [{ emoji: '🍕', text: 'ピザ・マルゲリータはマルゲリータ女王にちなんで！' }, { emoji: '🏎️', text: 'フェラーリとランボルギーニはイタリア製！' }, { emoji: '🎨', text: 'ダ・ヴィンチ、ミケランジェロ、ラファエロはイタリア人！' }, { emoji: '🍝', text: 'イタリアには600種類以上のパスタの形が！' }], tips: [{ emoji: '💡', text: 'イタリア語は音楽的、歌うように話そう！' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: 'ブラジルは最大のポルトガル語圏の国！' }, { emoji: '⚽', text: 'ブラジルはW杯最多優勝国！' }, { emoji: '☕', text: 'ブラジルは世界最大のコーヒー生産国！' }, { emoji: '🌳', text: 'アマゾンは世界の酸素の20%を生産！' }, { emoji: '🎭', text: 'リオのカーニバルは世界最大！' }], tips: [{ emoji: '💡', text: 'ブラジルのポルトガル語はリズミカル！' }, { emoji: '🎵', text: 'ボサノバやMPBを聴こう！' }] },
      ko: { facts: [{ emoji: '🇰🇷', text: 'ハングルは1443年に世宗大王が作りました！' }, { emoji: '🎤', text: 'K-POPは世界的な文化現象！' }, { emoji: '🍜', text: '韓国人は月に約8kgのキムチを食べます！' }, { emoji: '📱', text: '韓国は世界最速のインターネット！' }, { emoji: '🎮', text: 'eスポーツは韓国の国民的スポーツ！' }], tips: [{ emoji: '💡', text: '韓国ドラマで韓国語を学ぼう！' }, { emoji: '📖', text: 'ハングルは1週間で学べる、とても論理的！' }] },
      ja: { facts: [], tips: [] },
    },
    ko: {
      en: { facts: [{ emoji: '🗽', text: '자유의 여신상은 1886년 프랑스의 선물이었어요!' }, { emoji: '🎬', text: '할리우드는 연간 700편 이상의 영화를 제작해요!' }, { emoji: '🌙', text: '미국은 달에 착륙한 유일한 나라예요!' }, { emoji: '🏈', text: '슈퍼볼은 미국에서 가장 많이 시청되는 이벤트!' }, { emoji: '📚', text: '의회 도서관은 세계 최대의 도서관!' }], tips: [{ emoji: '💡', text: '영어 자막으로 드라마를 보세요!' }, { emoji: '🎵', text: '영어 노래를 듣고 가사를 따라가세요!' }, { emoji: '📱', text: '핸드폰 언어를 영어로 바꿔보세요!' }] },
      es: { facts: [{ emoji: '💃', text: '플라멩코는 유네스코 세계유산이에요!' }, { emoji: '🍅', text: '라 토마티나는 15만 개의 토마토를 사용해요!' }, { emoji: '🌍', text: '스페인어는 세계에서 2번째로 많이 사용되는 언어!' }, { emoji: '😴', text: '시에스타는 스페인의 신성한 전통!' }, { emoji: '🎨', text: '피카소, 달리, 고야 모두 스페인 사람!' }], tips: [{ emoji: '💡', text: '레게톤으로 슬랭을 배워보세요!' }, { emoji: '📺', text: '스페인어 텔레노벨라를 자막과 함께 보세요!' }] },
      fr: { facts: [{ emoji: '🗼', text: '에펠탑은 1889년에 건설되었어요!' }, { emoji: '🧀', text: '프랑스는 1,200종 이상의 치즈를 생산해요!' }, { emoji: '🍷', text: '프랑스는 세계 최대의 와인 생산국!' }, { emoji: '🎨', text: '루브르는 세계에서 가장 많이 방문하는 미술관!' }, { emoji: '🥐', text: '크루아상은 사실 오스트리아에서 왔어요!' }], tips: [{ emoji: '💡', text: '가글로 프랑스어 "R" 연습!' }, { emoji: '📖', text: '어린왕자는 초보자에게 최고!' }] },
      de: { facts: [{ emoji: '🏰', text: '독일에는 20,000개 이상의 성이 있어요!' }, { emoji: '🍺', text: '옥토버페스트는 700만 리터의 맥주를 제공해요!' }, { emoji: '🎵', text: '베토벤과 바흐는 독일인이었어요!' }, { emoji: '🚗', text: '아우토반의 일부는 속도 제한이 없어요!' }, { emoji: '🌭', text: '독일에는 1,500종 이상의 소시지가 있어요!' }], tips: [{ emoji: '💡', text: '독일어에는 거대한 복합어가 있어요!' }, { emoji: '📺', text: '넷플릭스의 "다크"로 연습하세요!' }] },
      it: { facts: [{ emoji: '🍕', text: '피자 마르게리타는 마르게리타 여왕의 이름에서!' }, { emoji: '🏎️', text: '페라리와 람보르기니는 이탈리아산!' }, { emoji: '🎨', text: '다빈치, 미켈란젤로, 라파엘로는 이탈리아인!' }, { emoji: '🍝', text: '이탈리아에는 600가지 이상의 파스타 모양이 있어요!' }, { emoji: '🍦', text: '이탈리아 젤라토는 아이스크림보다 지방이 적어요!' }], tips: [{ emoji: '💡', text: '이탈리아어는 음악적이에요, 노래하듯 말해요!' }, { emoji: '🍕', text: '이탈리아 음식 이름부터 배워보세요!' }] },
      pt: { facts: [{ emoji: '🇧🇷', text: '브라질은 최대 포르투갈어권 국가예요!' }, { emoji: '⚽', text: '브라질은 월드컵 최다 우승국!' }, { emoji: '☕', text: '브라질은 세계 최대 커피 생산국!' }, { emoji: '🌳', text: '아마존은 세계 산소의 20%를 생산해요!' }, { emoji: '🎭', text: '리우 카니발은 세계 최대!' }, { emoji: '🐦', text: '브라질은 지구상에서 가장 많은 생물다양성을 가지고 있어요!' }], tips: [{ emoji: '💡', text: '브라질 포르투갈어는 리드미컬해요!' }, { emoji: '🎵', text: '보사노바와 MPB를 들어보세요!' }, { emoji: '📺', text: '브라질 텔레노벨라는 학습에 좋아요!' }] },
      ja: { facts: [{ emoji: '🗾', text: '일본에는 6,800개 이상의 섬이 있어요!' }, { emoji: '🍣', text: '원래 스시는 발효 생선이었어요!' }, { emoji: '🚅', text: '신칸센은 1분 이상 늦은 적이 없어요!' }, { emoji: '🌸', text: '사쿠라 시즌은 단 2주!' }, { emoji: '🎮', text: '닌텐도, 소니, 세가는 일본 회사!' }, { emoji: '🏯', text: '일본에는 50,000개 이상의 사찰이 있어요!' }], tips: [{ emoji: '💡', text: '히라가나부터 시작하세요, 46자뿐!' }, { emoji: '🎵', text: '애니메이션은 일상 일본어에 좋아요!' }, { emoji: '📖', text: '만화는 어휘 학습에 많이 도움돼요!' }] },
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
