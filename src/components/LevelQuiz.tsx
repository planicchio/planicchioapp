import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

// Quiz questions per native language learning each target language
const quizData: Record<string, Record<string, Question[]>> = {
  // Native Portuguese speakers
  pt: {
    en: [
      { question: '"Hello" significa...', options: ['Olá', 'Tchau', 'Obrigado', 'Por favor'], correct: 0 },
      { question: 'Complete: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: 'Passado de "go":', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
      { question: '"I would have gone if..." usa qual tempo?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: '"Hola" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
      { question: 'Complete: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: 'Passado de "ir":', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
      { question: 'Subjuntivo de "tener":', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: '"Bonjour" significa...', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
      { question: 'Complete: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: 'Passé composé de "aller":', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
      { question: 'Subjonctif de "avoir":', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: '"Hallo" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
      { question: 'Complete: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: 'Passado de "gehen":', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
      { question: 'Konjunktiv II de "haben":', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: '"Ciao" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
      { question: 'Complete: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: 'Passato prossimo de "andare":', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
      { question: 'Congiuntivo de "avere":', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは" significa...', options: ['Olá', 'Casa', 'Gato', 'Livro'], correct: 0 },
      { question: 'Complete: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: 'Passado de "食べる":', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし" significa:', options: ['Entretanto', 'Porque', 'Sempre', 'Nunca'], correct: 0 },
      { question: 'Keigo de "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
  },
  // Native English speakers
  en: {
    es: [
      { question: '"Hola" means...', options: ['Hello', 'House', 'Cat', 'Book'], correct: 0 },
      { question: 'Complete: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: 'Past tense of "ir":', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo" means:', options: ['However', 'Because', 'Always', 'Never'], correct: 0 },
      { question: 'Subjunctive of "tener":', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: '"Bonjour" means...', options: ['Good morning', 'Good night', 'Goodbye', 'Thanks'], correct: 0 },
      { question: 'Complete: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: 'Passé composé of "aller":', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant" means:', options: ['However', 'Because', 'Always', 'Never'], correct: 0 },
      { question: 'Subjonctif of "avoir":', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: '"Hallo" means...', options: ['Hello', 'House', 'Cat', 'Book'], correct: 0 },
      { question: 'Complete: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: 'Past tense of "gehen":', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch" means:', options: ['However', 'Because', 'Always', 'Never'], correct: 0 },
      { question: 'Konjunktiv II of "haben":', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: '"Ciao" means...', options: ['Hello', 'House', 'Cat', 'Book'], correct: 0 },
      { question: 'Complete: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: 'Passato prossimo of "andare":', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia" means:', options: ['However', 'Because', 'Always', 'Never'], correct: 0 },
      { question: 'Congiuntivo of "avere":', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは" means...', options: ['Hello', 'House', 'Cat', 'Book'], correct: 0 },
      { question: 'Complete: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: 'Past of "食べる":', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし" means:', options: ['However', 'Because', 'Always', 'Never'], correct: 0 },
      { question: 'Keigo of "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
    en: [
      { question: 'This is your native language!', options: ['OK'], correct: 0 },
    ],
  },
  // Native Italian speakers
  it: {
    en: [
      { question: '"Hello" significa...', options: ['Ciao', 'Casa', 'Gatto', 'Libro'], correct: 0 },
      { question: 'Completa: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: 'Passato di "go":', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless" significa:', options: ['Tuttavia', 'Perché', 'Sempre', 'Mai'], correct: 0 },
      { question: '"I would have gone if..." usa quale tempo?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: '"Hola" significa...', options: ['Ciao', 'Casa', 'Gatto', 'Libro'], correct: 0 },
      { question: 'Completa: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: 'Passato di "ir":', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo" significa:', options: ['Tuttavia', 'Perché', 'Sempre', 'Mai'], correct: 0 },
      { question: 'Congiuntivo di "tener":', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: '"Bonjour" significa...', options: ['Buongiorno', 'Buonanotte', 'Arrivederci', 'Grazie'], correct: 0 },
      { question: 'Completa: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: 'Passé composé di "aller":', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant" significa:', options: ['Tuttavia', 'Perché', 'Sempre', 'Mai'], correct: 0 },
      { question: 'Subjonctif di "avoir":', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: '"Hallo" significa...', options: ['Ciao', 'Casa', 'Gatto', 'Libro'], correct: 0 },
      { question: 'Completa: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: 'Passato di "gehen":', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch" significa:', options: ['Tuttavia', 'Perché', 'Sempre', 'Mai'], correct: 0 },
      { question: 'Konjunktiv II di "haben":', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: 'Questa è la tua lingua madre!', options: ['OK'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは" significa...', options: ['Ciao', 'Casa', 'Gatto', 'Libro'], correct: 0 },
      { question: 'Completa: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: 'Passato di "食べる":', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし" significa:', options: ['Tuttavia', 'Perché', 'Sempre', 'Mai'], correct: 0 },
      { question: 'Keigo di "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
  },
  // Native Spanish speakers
  es: {
    en: [
      { question: '"Hello" significa...', options: ['Hola', 'Casa', 'Gato', 'Libro'], correct: 0 },
      { question: 'Completa: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: 'Pasado de "go":', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless" significa:', options: ['Sin embargo', 'Porque', 'Siempre', 'Nunca'], correct: 0 },
      { question: '"I would have gone if..." usa qué tiempo?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    fr: [
      { question: '"Bonjour" significa...', options: ['Buenos días', 'Buenas noches', 'Adiós', 'Gracias'], correct: 0 },
      { question: 'Completa: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: 'Passé composé de "aller":', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant" significa:', options: ['Sin embargo', 'Porque', 'Siempre', 'Nunca'], correct: 0 },
      { question: 'Subjonctif de "avoir":', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: '"Hallo" significa...', options: ['Hola', 'Casa', 'Gato', 'Libro'], correct: 0 },
      { question: 'Completa: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: 'Pasado de "gehen":', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch" significa:', options: ['Sin embargo', 'Porque', 'Siempre', 'Nunca'], correct: 0 },
      { question: 'Konjunktiv II de "haben":', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: '"Ciao" significa...', options: ['Hola', 'Casa', 'Gato', 'Libro'], correct: 0 },
      { question: 'Completa: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: 'Passato prossimo de "andare":', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia" significa:', options: ['Sin embargo', 'Porque', 'Siempre', 'Nunca'], correct: 0 },
      { question: 'Congiuntivo de "avere":', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    es: [
      { question: '¡Este es tu idioma nativo!', options: ['OK'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは" significa...', options: ['Hola', 'Casa', 'Gato', 'Libro'], correct: 0 },
      { question: 'Completa: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: 'Pasado de "食べる":', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし" significa:', options: ['Sin embargo', 'Porque', 'Siempre', 'Nunca'], correct: 0 },
      { question: 'Keigo de "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
  },
  // For fr, de, ja - fallback to English-style
  fr: {
    en: [
      { question: '"Hello" signifie...', options: ['Bonjour', 'Maison', 'Chat', 'Livre'], correct: 0 },
      { question: 'Complétez: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: 'Passé de "go":', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless" signifie:', options: ['Cependant', 'Parce que', 'Toujours', 'Jamais'], correct: 0 },
      { question: '"I would have gone if..." quel temps?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: '"Hola" signifie...', options: ['Bonjour', 'Maison', 'Chat', 'Livre'], correct: 0 },
      { question: 'Complétez: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: 'Passé de "ir":', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo" signifie:', options: ['Cependant', 'Parce que', 'Toujours', 'Jamais'], correct: 0 },
      { question: 'Subjonctif de "tener":', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [{ question: "C'est votre langue maternelle !", options: ['OK'], correct: 0 }],
    de: [
      { question: '"Hallo" signifie...', options: ['Bonjour', 'Maison', 'Chat', 'Livre'], correct: 0 },
      { question: 'Complétez: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: 'Passé de "gehen":', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch" signifie:', options: ['Cependant', 'Parce que', 'Toujours', 'Jamais'], correct: 0 },
      { question: 'Konjunktiv II de "haben":', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: '"Ciao" signifie...', options: ['Bonjour', 'Maison', 'Chat', 'Livre'], correct: 0 },
      { question: 'Complétez: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: 'Passato prossimo de "andare":', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia" signifie:', options: ['Cependant', 'Parce que', 'Toujours', 'Jamais'], correct: 0 },
      { question: 'Congiuntivo de "avere":', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは" signifie...', options: ['Bonjour', 'Maison', 'Chat', 'Livre'], correct: 0 },
      { question: 'Complétez: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: 'Passé de "食べる":', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし" signifie:', options: ['Cependant', 'Parce que', 'Toujours', 'Jamais'], correct: 0 },
      { question: 'Keigo de "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
  },
  de: {
    en: [
      { question: '"Hello" bedeutet...', options: ['Hallo', 'Haus', 'Katze', 'Buch'], correct: 0 },
      { question: 'Ergänze: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: 'Vergangenheit von "go":', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless" bedeutet:', options: ['Jedoch', 'Weil', 'Immer', 'Nie'], correct: 0 },
      { question: '"I would have gone if..." welche Zeit?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: '"Hola" bedeutet...', options: ['Hallo', 'Haus', 'Katze', 'Buch'], correct: 0 },
      { question: 'Ergänze: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: 'Vergangenheit von "ir":', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo" bedeutet:', options: ['Jedoch', 'Weil', 'Immer', 'Nie'], correct: 0 },
      { question: 'Subjunktiv von "tener":', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: '"Bonjour" bedeutet...', options: ['Guten Morgen', 'Gute Nacht', 'Tschüss', 'Danke'], correct: 0 },
      { question: 'Ergänze: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: 'Passé composé von "aller":', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant" bedeutet:', options: ['Jedoch', 'Weil', 'Immer', 'Nie'], correct: 0 },
      { question: 'Subjonctif von "avoir":', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [{ question: 'Das ist deine Muttersprache!', options: ['OK'], correct: 0 }],
    it: [
      { question: '"Ciao" bedeutet...', options: ['Hallo', 'Haus', 'Katze', 'Buch'], correct: 0 },
      { question: 'Ergänze: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: 'Passato prossimo von "andare":', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia" bedeutet:', options: ['Jedoch', 'Weil', 'Immer', 'Nie'], correct: 0 },
      { question: 'Congiuntivo von "avere":', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは" bedeutet...', options: ['Hallo', 'Haus', 'Katze', 'Buch'], correct: 0 },
      { question: 'Ergänze: "私は学生___"', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: 'Vergangenheit von "食べる":', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし" bedeutet:', options: ['Jedoch', 'Weil', 'Immer', 'Nie'], correct: 0 },
      { question: 'Keigo von "する":', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
  },
  ja: {
    en: [
      { question: '"Hello"の意味は...', options: ['こんにちは', '家', '猫', '本'], correct: 0 },
      { question: '完成させて: "I ___ a student"', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: '"go"の過去形:', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless"の意味は:', options: ['それにもかかわらず', 'なぜなら', 'いつも', '決して'], correct: 0 },
      { question: '"I would have gone if..."はどの時制?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: '"Hola"の意味は...', options: ['こんにちは', '家', '猫', '本'], correct: 0 },
      { question: '完成させて: "Yo ___ estudiante"', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: '"ir"の過去形:', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo"の意味は:', options: ['それにもかかわらず', 'なぜなら', 'いつも', '決して'], correct: 0 },
      { question: '"tener"の接続法:', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: '"Bonjour"の意味は...', options: ['おはよう', 'おやすみ', 'さようなら', 'ありがとう'], correct: 0 },
      { question: '完成させて: "Je ___ étudiant"', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: '"aller"の複合過去:', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant"の意味は:', options: ['それにもかかわらず', 'なぜなら', 'いつも', '決して'], correct: 0 },
      { question: '"avoir"の接続法:', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: '"Hallo"の意味は...', options: ['こんにちは', '家', '猫', '本'], correct: 0 },
      { question: '完成させて: "Ich ___ Student"', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: '"gehen"の過去形:', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch"の意味は:', options: ['それにもかかわらず', 'なぜなら', 'いつも', '決して'], correct: 0 },
      { question: '"haben"の接続法II:', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: '"Ciao"の意味は...', options: ['こんにちは', '家', '猫', '本'], correct: 0 },
      { question: '完成させて: "Io ___ studente"', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: '"andare"の近過去:', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia"の意味は:', options: ['それにもかかわらず', 'なぜなら', 'いつも', '決して'], correct: 0 },
      { question: '"avere"の接続法:', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [{ question: 'これはあなたの母語です！', options: ['OK'], correct: 0 }],
  },
  ko: {
    en: [
      { question: '"Hello"는 무슨 뜻인가요?', options: ['안녕하세요', '집', '고양이', '책'], correct: 0 },
      { question: '"I ___ a student" 완성:', options: ['am', 'is', 'are', 'be'], correct: 0 },
      { question: '"go"의 과거형:', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question: '"Nevertheless"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"I would have gone if..." 시제는?', options: ['Second Conditional', 'Third Conditional', 'First Conditional', 'Zero Conditional'], correct: 1 },
    ],
    es: [
      { question: '"Hola"는 무슨 뜻인가요?', options: ['안녕하세요', '집', '고양이', '책'], correct: 0 },
      { question: '"Yo ___ estudiante" 완성:', options: ['soy', 'es', 'son', 'eres'], correct: 0 },
      { question: '"ir"의 과거형:', options: ['fui', 'iba', 'voy', 'iré'], correct: 0 },
      { question: '"Sin embargo"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"tener"의 접속법:', options: ['tenga', 'tiene', 'tengo', 'tenía'], correct: 0 },
    ],
    fr: [
      { question: '"Bonjour"는 무슨 뜻인가요?', options: ['안녕하세요', '잘자요', '안녕히 가세요', '감사합니다'], correct: 0 },
      { question: '"Je ___ étudiant" 완성:', options: ['suis', 'est', 'es', 'sont'], correct: 0 },
      { question: '"aller"의 복합과거:', options: ['je suis allé', "j'ai allé", 'je vais', "j'allais"], correct: 0 },
      { question: '"Cependant"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"avoir"의 접속법:', options: ["que j'aie", "que j'ai", "que j'avais", "que j'aurai"], correct: 0 },
    ],
    de: [
      { question: '"Hallo"는 무슨 뜻인가요?', options: ['안녕하세요', '집', '고양이', '책'], correct: 0 },
      { question: '"Ich ___ Student" 완성:', options: ['bin', 'ist', 'bist', 'sind'], correct: 0 },
      { question: '"gehen"의 과거형:', options: ['ging', 'geht', 'gehe', 'gingen'], correct: 0 },
      { question: '"Jedoch"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"haben"의 접속법 II:', options: ['hätte', 'habe', 'hat', 'hatte'], correct: 0 },
    ],
    it: [
      { question: '"Ciao"는 무슨 뜻인가요?', options: ['안녕하세요', '집', '고양이', '책'], correct: 0 },
      { question: '"Io ___ studente" 완성:', options: ['sono', 'è', 'sei', 'siamo'], correct: 0 },
      { question: '"andare"의 근과거:', options: ['sono andato', 'ho andato', 'vado', 'andavo'], correct: 0 },
      { question: '"Tuttavia"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"avere"의 접속법:', options: ['che io abbia', 'che io ho', 'che io avevo', 'che io avrò'], correct: 0 },
    ],
    ja: [
      { question: '"こんにちは"는 무슨 뜻인가요?', options: ['안녕하세요', '집', '고양이', '책'], correct: 0 },
      { question: '"私は学生___" 완성:', options: ['です', 'だ', 'ます', 'いる'], correct: 0 },
      { question: '"食べる"의 과거형:', options: ['食べた', '食べます', '食べない', '食べて'], correct: 0 },
      { question: '"しかし"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"する"의 경어:', options: ['なさる', 'します', 'した', 'する'], correct: 0 },
    ],
    pt: [
      { question: '"Olá"는 무슨 뜻인가요?', options: ['안녕하세요', '집', '고양이', '책'], correct: 0 },
      { question: '"Eu ___ estudante" 완성:', options: ['sou', 'é', 'são', 'és'], correct: 0 },
      { question: '"ir"의 과거형:', options: ['fui', 'ia', 'vou', 'irei'], correct: 0 },
      { question: '"Entretanto"의 뜻:', options: ['그럼에도 불구하고', '왜냐하면', '항상', '절대'], correct: 0 },
      { question: '"ter"의 접속법:', options: ['tenha', 'tem', 'tenho', 'tinha'], correct: 0 },
    ],
    ko: [{ question: '이것은 당신의 모국어입니다!', options: ['OK'], correct: 0 }],
  },
};

function shuffleQuestion(question: Question): Question {
  const options = [...question.options];
  const correctAnswer = options[question.correct];

  const shuffled = options
    .map(o => ({ o, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ o }) => o);

  const newCorrectIndex = shuffled.indexOf(correctAnswer);

  return {
    question: question.question,
    options: shuffled,
    correct: newCorrectIndex
  };
}
const getLevel = (score: number): string => {
  if (score <= 1) return 'A1';
  if (score === 2) return 'A2';
  if (score === 3) return 'B1';
  if (score === 4) return 'B2';
  return 'C1';
};

const LevelQuiz = () => {
  const { course, nativeLang, setLevel, setStage } = useApp();
  const tr = useTranslation(nativeLang);
  
 const rawQuestions = quizData[nativeLang]?.[course] ?? [];

const [questions] = useState(() =>
  rawQuestions.map(q => shuffleQuestion(q))
);
  if (!questions.length) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Content not available yet for this language pair.</p>
    </div>
  );
}
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].correct;
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const handleFinish = () => {
    const level = getLevel(score);
    setLevel(level);
    setStage('app');
  };

  if (showResult) {
    const level = getLevel(score);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h1 className="text-3xl font-black text-foreground mb-2">{tr('your_level')}</h1>
          <div className="bg-primary text-primary-foreground text-5xl font-black rounded-2xl px-8 py-4 mb-4 inline-block">{level}</div>
          <p className="text-muted-foreground mb-8">{tr('you_got')} {score} {tr('of')} {questions.length}!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="bg-primary text-primary-foreground font-bold text-xl px-12 py-4 rounded-full shadow-lg"
          >
            {tr('lets_go')}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-muted-foreground">{tr('question')} {current + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-primary">🏆 {score} {tr('correct_answers')}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-primary h-full rounded-full"
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
          <h2 className="text-2xl font-black text-foreground mb-8 text-center">{questions[current].question}</h2>
          <div className="space-y-3 max-w-md mx-auto w-full">
            {questions[current].options.map((opt, i) => {
              let style = 'bg-card border-border';
              if (selected !== null) {
                if (i === questions[current].correct) style = 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600';
                else if (i === selected) style = 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600';
              }
              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-4 rounded-xl border-2 text-left font-bold text-lg transition-colors ${style}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LevelQuiz;
