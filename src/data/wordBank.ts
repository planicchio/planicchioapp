export type LangCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'pt' | 'ko';

interface WordEntry {
  en: string; es: string; fr: string; de: string; it: string; ja: string; pt: string; ko: string;
  emoji?: string;
}

export const langNames: Record<string, Record<string, string>> = {
  pt: { en: 'inglês', es: 'espanhol', fr: 'francês', de: 'alemão', it: 'italiano', ja: 'japonês', pt: 'português', ko: 'coreano' },
  en: { en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', ja: 'Japanese', pt: 'Portuguese', ko: 'Korean' },
  es: { en: 'inglés', es: 'español', fr: 'francés', de: 'alemán', it: 'italiano', ja: 'japonés', pt: 'portugués', ko: 'coreano' },
  fr: { en: 'anglais', es: 'espagnol', fr: 'français', de: 'allemand', it: 'italien', ja: 'japonais', pt: 'portugais', ko: 'coréen' },
  de: { en: 'Englisch', es: 'Spanisch', fr: 'Französisch', de: 'Deutsch', it: 'Italienisch', ja: 'Japanisch', pt: 'Portugiesisch', ko: 'Koreanisch' },
  it: { en: 'inglese', es: 'spagnolo', fr: 'francese', de: 'tedesco', it: 'italiano', ja: 'giapponese', pt: 'portoghese', ko: 'coreano' },
  ja: { en: '英語', es: 'スペイン語', fr: 'フランス語', de: 'ドイツ語', it: 'イタリア語', ja: '日本語', pt: 'ポルトガル語', ko: '韓国語' },
  ko: { en: '영어', es: '스페인어', fr: '프랑스어', de: '독일어', it: '이탈리아어', ja: '일본어', pt: '포르투갈어', ko: '한국어' },
};

const questionTemplates = {
  howToSay: {
    pt: 'Como se diz "{word}" em {lang}?',
    en: 'How do you say "{word}" in {lang}?',
    es: '¿Cómo se dice "{word}" en {lang}?',
    fr: 'Comment dit-on "{word}" en {lang} ?',
    de: 'Wie sagt man "{word}" auf {lang}?',
    it: 'Come si dice "{word}" in {lang}?',
    ja: '「{word}」は{lang}で何と言いますか？',
    ko: '"{word}"을(를) {lang}(으)로 어떻게 말합니까?',
  } as Record<string, string>,
  whatMeans: {
    pt: '"{word}" significa:',
    en: '"{word}" means:',
    es: '"{word}" significa:',
    fr: '"{word}" signifie :',
    de: '"{word}" bedeutet:',
    it: '"{word}" significa:',
    ja: '「{word}」の意味は：',
    ko: '"{word}"의 뜻은:',
  } as Record<string, string>,
  whatIsThis: {
    pt: 'O que é isso?',
    en: 'What is this?',
    es: '¿Qué es esto?',
    fr: "Qu'est-ce que c'est ?",
    de: 'Was ist das?',
    it: "Cos'è questo?",
    ja: 'これは何ですか？',
    ko: '이것은 무엇입니까?',
  } as Record<string, string>,
};

export const wordBank: Record<string, WordEntry[]> = {
  greetings: [
    { en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao', ja: 'こんにちは', pt: 'Olá', ko: '안녕하세요' },
    { en: 'Goodbye', es: 'Adiós', fr: 'Au revoir', de: 'Tschüss', it: 'Arrivederci', ja: 'さようなら', pt: 'Tchau', ko: '안녕히 가세요' },
    { en: 'Good morning', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen', it: 'Buongiorno', ja: 'おはようございます', pt: 'Bom dia', ko: '좋은 아침' },
    { en: 'Good night', es: 'Buenas noches', fr: 'Bonne nuit', de: 'Gute Nacht', it: 'Buonanotte', ja: 'おやすみなさい', pt: 'Boa noite', ko: '잘 자요' },
    { en: 'Thank you', es: 'Gracias', fr: 'Merci', de: 'Danke', it: 'Grazie', ja: 'ありがとう', pt: 'Obrigado', ko: '감사합니다' },
    { en: 'Please', es: 'Por favor', fr: "S'il vous plaît", de: 'Bitte', it: 'Per favore', ja: 'お願いします', pt: 'Por favor', ko: '제발' },
    { en: 'Sorry', es: 'Perdón', fr: 'Pardon', de: 'Entschuldigung', it: 'Scusa', ja: 'すみません', pt: 'Desculpe', ko: '죄송합니다' },
    { en: 'Yes', es: 'Sí', fr: 'Oui', de: 'Ja', it: 'Sì', ja: 'はい', pt: 'Sim', ko: '네' },
    { en: 'No', es: 'No', fr: 'Non', de: 'Nein', it: 'No', ja: 'いいえ', pt: 'Não', ko: '아니요' },
    { en: 'How are you?', es: '¿Cómo estás?', fr: 'Comment allez-vous ?', de: 'Wie geht es Ihnen?', it: 'Come stai?', ja: 'お元気ですか？', pt: 'Como vai?', ko: '어떻게 지내세요?' },
    { en: 'Nice to meet you', es: 'Mucho gusto', fr: 'Enchanté', de: 'Freut mich', it: 'Piacere', ja: 'はじめまして', pt: 'Prazer em conhecer', ko: '만나서 반갑습니다' },
    { en: "You're welcome", es: 'De nada', fr: 'De rien', de: 'Bitte schön', it: 'Prego', ja: 'どういたしまして', pt: 'De nada', ko: '천만에요' },
  ],
  food: [
    { en: 'Water', es: 'Agua', fr: 'Eau', de: 'Wasser', it: 'Acqua', ja: '水', pt: 'Água', ko: '물', emoji: '💧' },
    { en: 'Bread', es: 'Pan', fr: 'Pain', de: 'Brot', it: 'Pane', ja: 'パン', pt: 'Pão', ko: '빵', emoji: '🍞' },
    { en: 'Apple', es: 'Manzana', fr: 'Pomme', de: 'Apfel', it: 'Mela', ja: 'りんご', pt: 'Maçã', ko: '사과', emoji: '🍎' },
    { en: 'Milk', es: 'Leche', fr: 'Lait', de: 'Milch', it: 'Latte', ja: '牛乳', pt: 'Leite', ko: '우유', emoji: '🥛' },
    { en: 'Cheese', es: 'Queso', fr: 'Fromage', de: 'Käse', it: 'Formaggio', ja: 'チーズ', pt: 'Queijo', ko: '치즈', emoji: '🧀' },
    { en: 'Chicken', es: 'Pollo', fr: 'Poulet', de: 'Hähnchen', it: 'Pollo', ja: '鶏肉', pt: 'Frango', ko: '닭고기', emoji: '🍗' },
    { en: 'Rice', es: 'Arroz', fr: 'Riz', de: 'Reis', it: 'Riso', ja: 'ご飯', pt: 'Arroz', ko: '쌀', emoji: '🍚' },
    { en: 'Fish', es: 'Pescado', fr: 'Poisson', de: 'Fisch', it: 'Pesce', ja: '魚', pt: 'Peixe', ko: '생선', emoji: '🐟' },
    { en: 'Coffee', es: 'Café', fr: 'Café', de: 'Kaffee', it: 'Caffè', ja: 'コーヒー', pt: 'Café', ko: '커피', emoji: '☕' },
    { en: 'Cake', es: 'Pastel', fr: 'Gâteau', de: 'Kuchen', it: 'Torta', ja: 'ケーキ', pt: 'Bolo', ko: '케이크', emoji: '🎂' },
    { en: 'Egg', es: 'Huevo', fr: 'Œuf', de: 'Ei', it: 'Uovo', ja: '卵', pt: 'Ovo', ko: '달걀', emoji: '🥚' },
    { en: 'Juice', es: 'Jugo', fr: 'Jus', de: 'Saft', it: 'Succo', ja: 'ジュース', pt: 'Suco', ko: '주스', emoji: '🧃' },
  ],
  travel: [
    { en: 'Airport', es: 'Aeropuerto', fr: 'Aéroport', de: 'Flughafen', it: 'Aeroporto', ja: '空港', pt: 'Aeroporto', ko: '공항', emoji: '✈️' },
    { en: 'Hotel', es: 'Hotel', fr: 'Hôtel', de: 'Hotel', it: 'Hotel', ja: 'ホテル', pt: 'Hotel', ko: '호텔', emoji: '🏨' },
    { en: 'Train', es: 'Tren', fr: 'Train', de: 'Zug', it: 'Treno', ja: '電車', pt: 'Trem', ko: '기차', emoji: '🚂' },
    { en: 'Ticket', es: 'Billete', fr: 'Billet', de: 'Fahrkarte', it: 'Biglietto', ja: '切符', pt: 'Passagem', ko: '표', emoji: '🎫' },
    { en: 'Map', es: 'Mapa', fr: 'Carte', de: 'Karte', it: 'Mappa', ja: '地図', pt: 'Mapa', ko: '지도', emoji: '🗺️' },
    { en: 'Beach', es: 'Playa', fr: 'Plage', de: 'Strand', it: 'Spiaggia', ja: 'ビーチ', pt: 'Praia', ko: '해변', emoji: '🏖️' },
    { en: 'Passport', es: 'Pasaporte', fr: 'Passeport', de: 'Reisepass', it: 'Passaporto', ja: 'パスポート', pt: 'Passaporte', ko: '여권', emoji: '🛂' },
    { en: 'Luggage', es: 'Equipaje', fr: 'Bagage', de: 'Gepäck', it: 'Bagaglio', ja: '荷物', pt: 'Bagagem', ko: '짐', emoji: '🧳' },
    { en: 'Bus', es: 'Autobús', fr: 'Bus', de: 'Bus', it: 'Autobus', ja: 'バス', pt: 'Ônibus', ko: '버스', emoji: '🚌' },
    { en: 'Taxi', es: 'Taxi', fr: 'Taxi', de: 'Taxi', it: 'Taxi', ja: 'タクシー', pt: 'Táxi', ko: '택시', emoji: '🚕' },
  ],
  work: [
    { en: 'Meeting', es: 'Reunión', fr: 'Réunion', de: 'Besprechung', it: 'Riunione', ja: '会議', pt: 'Reunião', ko: '회의', emoji: '📋' },
    { en: 'Office', es: 'Oficina', fr: 'Bureau', de: 'Büro', it: 'Ufficio', ja: '事務所', pt: 'Escritório', ko: '사무실', emoji: '🏢' },
    { en: 'Boss', es: 'Jefe', fr: 'Patron', de: 'Chef', it: 'Capo', ja: '上司', pt: 'Chefe', ko: '상사' },
    { en: 'Colleague', es: 'Compañero', fr: 'Collègue', de: 'Kollege', it: 'Collega', ja: '同僚', pt: 'Colega', ko: '동료' },
    { en: 'Salary', es: 'Sueldo', fr: 'Salaire', de: 'Gehalt', it: 'Stipendio', ja: '給料', pt: 'Salário', ko: '월급' },
    { en: 'Job', es: 'Trabajo', fr: 'Travail', de: 'Arbeit', it: 'Lavoro', ja: '仕事', pt: 'Trabalho', ko: '일' },
    { en: 'Company', es: 'Empresa', fr: 'Entreprise', de: 'Firma', it: 'Azienda', ja: '会社', pt: 'Empresa', ko: '회사' },
    { en: 'Computer', es: 'Computadora', fr: 'Ordinateur', de: 'Computer', it: 'Computer', ja: 'コンピュータ', pt: 'Computador', ko: '컴퓨터', emoji: '💻' },
    { en: 'Email', es: 'Correo', fr: 'Courriel', de: 'E-Mail', it: 'Email', ja: 'メール', pt: 'E-mail', ko: '이메일', emoji: '📧' },
    { en: 'Deadline', es: 'Plazo', fr: 'Date limite', de: 'Frist', it: 'Scadenza', ja: '締め切り', pt: 'Prazo', ko: '마감' },
  ],
  daily: [
    { en: 'House', es: 'Casa', fr: 'Maison', de: 'Haus', it: 'Casa', ja: '家', pt: 'Casa', ko: '집', emoji: '🏠' },
    { en: 'Family', es: 'Familia', fr: 'Famille', de: 'Familie', it: 'Famiglia', ja: '家族', pt: 'Família', ko: '가족', emoji: '👨‍👩‍👧‍👦' },
    { en: 'Kitchen', es: 'Cocina', fr: 'Cuisine', de: 'Küche', it: 'Cucina', ja: '台所', pt: 'Cozinha', ko: '부엌' },
    { en: 'Bathroom', es: 'Baño', fr: 'Salle de bain', de: 'Badezimmer', it: 'Bagno', ja: 'お風呂', pt: 'Banheiro', ko: '욕실' },
    { en: 'Bedroom', es: 'Dormitorio', fr: 'Chambre', de: 'Schlafzimmer', it: 'Camera', ja: '寝室', pt: 'Quarto', ko: '침실', emoji: '🛏️' },
    { en: 'Neighbor', es: 'Vecino', fr: 'Voisin', de: 'Nachbar', it: 'Vicino', ja: '隣人', pt: 'Vizinho', ko: '이웃' },
    { en: 'To sleep', es: 'Dormir', fr: 'Dormir', de: 'Schlafen', it: 'Dormire', ja: '寝る', pt: 'Dormir', ko: '자다' },
    { en: 'To eat', es: 'Comer', fr: 'Manger', de: 'Essen', it: 'Mangiare', ja: '食べる', pt: 'Comer', ko: '먹다' },
    { en: 'Key', es: 'Llave', fr: 'Clé', de: 'Schlüssel', it: 'Chiave', ja: '鍵', pt: 'Chave', ko: '열쇠', emoji: '🔑' },
    { en: 'Garden', es: 'Jardín', fr: 'Jardin', de: 'Garten', it: 'Giardino', ja: '庭', pt: 'Jardim', ko: '정원', emoji: '🌳' },
    { en: 'To clean', es: 'Limpiar', fr: 'Nettoyer', de: 'Putzen', it: 'Pulire', ja: '掃除する', pt: 'Limpar', ko: '청소하다' },
    { en: 'To wake up', es: 'Despertarse', fr: 'Se réveiller', de: 'Aufwachen', it: 'Svegliarsi', ja: '起きる', pt: 'Acordar', ko: '일어나다' },
  ],
  numbers: [
    { en: 'One', es: 'Uno', fr: 'Un', de: 'Eins', it: 'Uno', ja: '一', pt: 'Um', ko: '하나' },
    { en: 'Two', es: 'Dos', fr: 'Deux', de: 'Zwei', it: 'Due', ja: '二', pt: 'Dois', ko: '둘' },
    { en: 'Three', es: 'Tres', fr: 'Trois', de: 'Drei', it: 'Tre', ja: '三', pt: 'Três', ko: '셋' },
    { en: 'Ten', es: 'Diez', fr: 'Dix', de: 'Zehn', it: 'Dieci', ja: '十', pt: 'Dez', ko: '열' },
    { en: 'Twenty', es: 'Veinte', fr: 'Vingt', de: 'Zwanzig', it: 'Venti', ja: '二十', pt: 'Vinte', ko: '스물' },
    { en: 'Hundred', es: 'Cien', fr: 'Cent', de: 'Hundert', it: 'Cento', ja: '百', pt: 'Cem', ko: '백' },
    { en: 'Thousand', es: 'Mil', fr: 'Mille', de: 'Tausend', it: 'Mille', ja: '千', pt: 'Mil', ko: '천' },
    { en: 'First', es: 'Primero', fr: 'Premier', de: 'Erster', it: 'Primo', ja: '最初', pt: 'Primeiro', ko: '첫 번째' },
    { en: 'Half', es: 'Mitad', fr: 'Moitié', de: 'Hälfte', it: 'Metà', ja: '半分', pt: 'Metade', ko: '반' },
    { en: 'Fifty', es: 'Cincuenta', fr: 'Cinquante', de: 'Fünfzig', it: 'Cinquanta', ja: '五十', pt: 'Cinquenta', ko: '오십' },
    { en: 'Five', es: 'Cinco', fr: 'Cinq', de: 'Fünf', it: 'Cinque', ja: '五', pt: 'Cinco', ko: '다섯' },
    { en: 'Zero', es: 'Cero', fr: 'Zéro', de: 'Null', it: 'Zero', ja: 'ゼロ', pt: 'Zero', ko: '영' },
  ],
  animals: [
    { en: 'Dog', es: 'Perro', fr: 'Chien', de: 'Hund', it: 'Cane', ja: '犬', pt: 'Cachorro', ko: '개', emoji: '🐕' },
    { en: 'Cat', es: 'Gato', fr: 'Chat', de: 'Katze', it: 'Gatto', ja: '猫', pt: 'Gato', ko: '고양이', emoji: '🐱' },
    { en: 'Bird', es: 'Pájaro', fr: 'Oiseau', de: 'Vogel', it: 'Uccello', ja: '鳥', pt: 'Pássaro', ko: '새', emoji: '🐦' },
    { en: 'Fish', es: 'Pez', fr: 'Poisson', de: 'Fisch', it: 'Pesce', ja: '魚', pt: 'Peixe', ko: '물고기', emoji: '🐟' },
    { en: 'Butterfly', es: 'Mariposa', fr: 'Papillon', de: 'Schmetterling', it: 'Farfalla', ja: '蝶', pt: 'Borboleta', ko: '나비', emoji: '🦋' },
    { en: 'Horse', es: 'Caballo', fr: 'Cheval', de: 'Pferd', it: 'Cavallo', ja: '馬', pt: 'Cavalo', ko: '말', emoji: '🐴' },
    { en: 'Rabbit', es: 'Conejo', fr: 'Lapin', de: 'Kaninchen', it: 'Coniglio', ja: 'うさぎ', pt: 'Coelho', ko: '토끼', emoji: '🐰' },
    { en: 'Turtle', es: 'Tortuga', fr: 'Tortue', de: 'Schildkröte', it: 'Tartaruga', ja: '亀', pt: 'Tartaruga', ko: '거북이', emoji: '🐢' },
    { en: 'Elephant', es: 'Elefante', fr: 'Éléphant', de: 'Elefant', it: 'Elefante', ja: '象', pt: 'Elefante', ko: '코끼리', emoji: '🐘' },
    { en: 'Bear', es: 'Oso', fr: 'Ours', de: 'Bär', it: 'Orso', ja: '熊', pt: 'Urso', ko: '곰', emoji: '🐻' },
    { en: 'Lion', es: 'León', fr: 'Lion', de: 'Löwe', it: 'Leone', ja: 'ライオン', pt: 'Leão', ko: '사자', emoji: '🦁' },
    { en: 'Monkey', es: 'Mono', fr: 'Singe', de: 'Affe', it: 'Scimmia', ja: '猿', pt: 'Macaco', ko: '원숭이', emoji: '🐒' },
  ],
  colors: [
    { en: 'Red', es: 'Rojo', fr: 'Rouge', de: 'Rot', it: 'Rosso', ja: '赤', pt: 'Vermelho', ko: '빨간색', emoji: '🔴' },
    { en: 'Blue', es: 'Azul', fr: 'Bleu', de: 'Blau', it: 'Blu', ja: '青', pt: 'Azul', ko: '파란색', emoji: '🔵' },
    { en: 'Green', es: 'Verde', fr: 'Vert', de: 'Grün', it: 'Verde', ja: '緑', pt: 'Verde', ko: '초록색', emoji: '🟢' },
    { en: 'Yellow', es: 'Amarillo', fr: 'Jaune', de: 'Gelb', it: 'Giallo', ja: '黄色', pt: 'Amarelo', ko: '노란색', emoji: '🟡' },
    { en: 'Black', es: 'Negro', fr: 'Noir', de: 'Schwarz', it: 'Nero', ja: '黒', pt: 'Preto', ko: '검은색', emoji: '⚫' },
    { en: 'White', es: 'Blanco', fr: 'Blanc', de: 'Weiß', it: 'Bianco', ja: '白', pt: 'Branco', ko: '흰색', emoji: '⚪' },
    { en: 'Purple', es: 'Morado', fr: 'Violet', de: 'Lila', it: 'Viola', ja: '紫', pt: 'Roxo', ko: '보라색', emoji: '🟣' },
    { en: 'Orange', es: 'Naranja', fr: 'Orange', de: 'Orange', it: 'Arancione', ja: 'オレンジ', pt: 'Laranja', ko: '주황색', emoji: '🟠' },
    { en: 'Pink', es: 'Rosa', fr: 'Rose', de: 'Rosa', it: 'Rosa', ja: 'ピンク', pt: 'Rosa', ko: '분홍색' },
    { en: 'Brown', es: 'Marrón', fr: 'Marron', de: 'Braun', it: 'Marrone', ja: '茶色', pt: 'Marrom', ko: '갈색', emoji: '🟤' },
  ],
};

export interface GeneratedExercise {
  question: string;
  options: string[];
  correct: number;
  type?: 'choice' | 'listen' | 'whatis' | 'write' | 'speak';
  emoji?: string;
  listenWord?: string;
  answer?: string;
}

/**
 * Generates exercises dynamically for ANY native→course language combination.
 * This serves as a universal fallback when static exercises don't exist.
 */
export function generateExercises(nativeLang: string, courseLang: string, category: string): GeneratedExercise[] {
  const nl = nativeLang as LangCode;
  const cl = courseLang as LangCode;
  
  // Merge base + extended word banks
  let baseWords = wordBank[category] || [];
  try {
    // Dynamic import of extended words - merged at runtime
    const ext = (window as any).__extendedWordBank?.[category];
    if (ext) baseWords = [...baseWords, ...ext];
  } catch {}
  
  const words = baseWords;
  if (!words || words.length === 0 || nl === cl) return [];

  const courseLangName = langNames[nl]?.[cl] || courseLang;
  const howToSayTemplate = questionTemplates.howToSay[nl] || questionTemplates.howToSay.en;
  const whatMeansTemplate = questionTemplates.whatMeans[nl] || questionTemplates.whatMeans.en;
  const whatIsThisText = questionTemplates.whatIsThis[nl] || questionTemplates.whatIsThis.en;

  const exercises: GeneratedExercise[] = [];

  words.forEach((entry, i) => {
    const nativeWord = entry[nl];
    const courseWord = entry[cl];
    if (!nativeWord || !courseWord) return;

    // Get 3 wrong answers from same category
    const otherWords = words.filter((_, j) => j !== i);
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);

    // Type 1: "How do you say X in Y?" (native → course)
    const q1 = howToSayTemplate.replace('{word}', nativeWord).replace('{lang}', courseLangName);
    exercises.push({
      question: q1,
      options: [courseWord, ...shuffledOthers.map(o => o[cl])],
      correct: 0,
    });

    // Type 2: "X means:" (course → native)
    const q2 = whatMeansTemplate.replace('{word}', courseWord);
    exercises.push({
      question: q2,
      options: [nativeWord, ...shuffledOthers.map(o => o[nl])],
      correct: 0,
    });

    // Type 3: "What is this?" with emoji (if available)
    if (entry.emoji) {
      exercises.push({
        question: whatIsThisText,
        options: [
          `${courseWord} (${nativeWord})`,
          ...shuffledOthers.filter(o => o.emoji).slice(0, 3).map(o => `${o[cl]} (${o[nl]})`),
        ],
        correct: 0,
        type: 'whatis',
        emoji: entry.emoji,
      });
    }

    // Type 4: Listen exercise (every 3rd word)
    if (i % 3 === 0) {
      exercises.push({
        question: '🔊',
        options: [nativeWord, ...shuffledOthers.map(o => o[nl]).slice(0, 3)],
        correct: 0,
        type: 'listen',
        listenWord: courseWord,
      });
    }
  });

  // Type 5: Writing exercises (every 4th word)
  words.forEach((entry, i) => {
    if (i % 4 !== 0) return;
    const nativeWord = entry[nl];
    const courseWord = entry[cl];
    if (!nativeWord || !courseWord || !entry.emoji) return;

    exercises.push({
      question: '',
      options: [],
      correct: 0,
      type: 'write',
      emoji: entry.emoji,
      answer: courseWord,
    });
  });

  return exercises;
}

/**
 * Get food words for pet feeding mini-game, adapted to any native lang
 */
export function getFeedWords(nativeLang: string, courseLang: string): { word: string; translation: string }[] {
  const nl = nativeLang as LangCode;
  const cl = courseLang as LangCode;
  const foods = wordBank.food;
  return foods.map(f => ({
    word: f[cl] || f.en,
    translation: f[nl] || f.pt,
  })).filter(f => f.word && f.translation && f.word !== f.translation);
}

/**
 * Get play words for pet play mini-game, adapted to any native lang
 */
export function getPlayWords(courseLang: string): { word: string; options: string[]; correct: number }[] {
  const cl = courseLang as LangCode;
  const animals = wordBank.animals.filter(a => a.emoji);
  return animals.slice(0, 8).map((animal, i) => {
    const others = animals.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      word: animal.emoji!,
      options: [animal[cl], ...others.map(o => o[cl])],
      correct: 0,
    };
  });
}
