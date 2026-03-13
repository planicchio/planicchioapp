import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Volume2, Eye, Mic, PenLine } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Exercise {
  question: string;
  options: string[];
  correct: number;
  type?: 'choice' | 'listen' | 'whatis' | 'write' | 'speak';
  emoji?: string;
  listenWord?: string;
  answer?: string; // for write/speak type
}

function shuffleExercise(ex: Exercise): Exercise {
  if (ex.type === 'write' || ex.type === 'speak') return ex;
  const options = [...ex.options];
  const correctAnswer = options[ex.correct];
  const shuffled = options.map(o => ({ o, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ o }) => o);
  return { ...ex, options: shuffled, correct: shuffled.indexOf(correctAnswer) };
}

const categories = [
  { id: 'greetings', nameKey: 'cat_greetings', emoji: '👋' },
  { id: 'food', nameKey: 'cat_food', emoji: '🍕' },
  { id: 'travel', nameKey: 'cat_travel', emoji: '✈️' },
  { id: 'work', nameKey: 'cat_work', emoji: '💼' },
  { id: 'daily', nameKey: 'cat_daily', emoji: '🏠' },
  { id: 'numbers', nameKey: 'cat_numbers', emoji: '🔢' },
  { id: 'animals', nameKey: 'cat_animals', emoji: '🐾' },
  { id: 'colors', nameKey: 'cat_colors', emoji: '🎨' },
  { id: 'writing', nameKey: 'cat_writing', emoji: '✍️' },
];

import { generateExercises as generateFromWordBank } from '@/data/wordBank';

// Generate exercises based on native lang, course, category AND level
const getExercisesForLevel = (nativeLang: string, course: string, category: string, level: string): Exercise[] => {
  const data = getFallbackExercises(nativeLang, course, category);
  // Filter by level ranges
  const levelIdx = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(level);
  const startIdx = Math.min(levelIdx * 3, data.length);
  const endIdx = Math.min(startIdx + 9, data.length);
  // Always return at least some exercises
  if (startIdx >= data.length) return data.slice(0, 9);
  return data.slice(startIdx, endIdx).length > 0 ? data.slice(startIdx, endIdx) : data.slice(0, 9);
};

// Massive exercise bank
const allExercises: Record<string, Record<string, Record<string, Exercise[]>>> = {
  pt: {
    en: {
      greetings: [
        // A1
        { question: 'Como se diz "Olá" em inglês?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: '"Tchau" em inglês:', options: ['Goodbye', 'Hello', 'Sorry', 'Help'], correct: 0 },
        { question: 'O que significa "Good morning"?', options: ['Bom dia', 'Boa noite', 'Boa tarde', 'Obrigado'], correct: 0 },
        // A2
        { question: 'Complete: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
        { question: '"How are you?" responda:', options: ["I'm fine", "I'm hello", "I'm name", "I'm house"], correct: 0 },
        { question: '"Good evening" significa:', options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Tchau'], correct: 0 },
        // B1
        { question: '"Would you mind if I sit here?"', options: ['Você se importaria se eu sentasse aqui?', 'Você quer sentar?', 'Onde é a cadeira?', 'Eu vou sentar'], correct: 0 },
        { question: '"It\'s a pleasure to meet you" significa:', options: ['É um prazer conhecê-lo', 'É uma festa', 'É meu nome', 'Prazer em comer'], correct: 0 },
        { question: '"Long time no see!" significa:', options: ['Há quanto tempo!', 'Muito tempo de ver', 'Longa vez', 'Não vejo mais'], correct: 0 },
        // B2
        { question: '"I couldn\'t agree more" significa:', options: ['Concordo plenamente', 'Discordo totalmente', 'Não sei', 'Talvez'], correct: 0 },
        { question: '"Pleased to make your acquaintance":', options: ['Prazer em conhecê-lo', 'Feliz aniversário', 'Boa sorte', 'Tenha um bom dia'], correct: 0 },
        { question: '"Take care of yourself" significa:', options: ['Cuide-se', 'Leve cuidado', 'Tome cuidado', 'Se cuide'], correct: 0 },
        // Listen
        { question: '🔊 Ouça e escolha a tradução:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: 'Hello' },
        { question: '🔊 Ouça e escolha:', options: ['Como vai você?', 'Onde você mora?', 'Qual seu nome?', 'Quantos anos?'], correct: 0, type: 'listen', listenWord: 'How are you?' },
        // What is this
        { question: 'O que é isso?', options: ['Handshake (Aperto de mão)', 'Hug (Abraço)', 'Wave (Acenar)', 'Bow (Curvar)'], correct: 0, type: 'whatis', emoji: '🤝' },
        { question: 'O que este emoji representa?', options: ['Waving (Acenando)', 'Clapping (Aplaudindo)', 'Pointing (Apontando)', 'Praying (Rezando)'], correct: 0, type: 'whatis', emoji: '👋' },
      ],
      food: [
        // A1
        { question: '"Água" em inglês:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 },
        { question: '"Pão" em inglês:', options: ['Bread', 'Cake', 'Rice', 'Meat'], correct: 0 },
        { question: 'O que significa "Apple"?', options: ['Maçã', 'Banana', 'Laranja', 'Uva'], correct: 0 },
        // A2
        { question: '"I would like ___"', options: ['a coffee', 'a table', 'a house', 'a car'], correct: 0 },
        { question: '"Breakfast" significa:', options: ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'], correct: 0 },
        { question: '"Chicken" em português:', options: ['Frango', 'Peixe', 'Carne', 'Porco'], correct: 0 },
        // B1
        { question: '"Could I have the bill, please?"', options: ['Posso ter a conta, por favor?', 'Posso ter o cardápio?', 'Onde é o banheiro?', 'Quanto custa?'], correct: 0 },
        { question: '"I\'m allergic to peanuts":', options: ['Sou alérgico a amendoim', 'Gosto de amendoim', 'Quero amendoim', 'Não tenho amendoim'], correct: 0 },
        { question: '"The steak is well done":', options: ['O bife está bem passado', 'O bife está cru', 'O bife está mal', 'O bife está pronto'], correct: 0 },
        // B2+
        { question: '"This dish has a hint of garlic":', options: ['Este prato tem um toque de alho', 'Este prato é de alho', 'Alho no prato', 'Prato com muito alho'], correct: 0 },
        { question: '"The recipe calls for three cups of flour":', options: ['A receita pede três xícaras de farinha', 'A receita tem copos', 'Três copos de flor', 'Receita de três'], correct: 0 },
        // Listen
        { question: '🔊 Ouça e escolha:', options: ['Água', 'Leite', 'Suco', 'Vinho'], correct: 0, type: 'listen', listenWord: 'Water' },
        { question: '🔊 Ouça e escolha:', options: ['Pão', 'Arroz', 'Bolo', 'Macarrão'], correct: 0, type: 'listen', listenWord: 'Bread' },
        // What is this
        { question: 'O que é isso?', options: ['Pizza', 'Hambúrguer', 'Salada', 'Sopa'], correct: 0, type: 'whatis', emoji: '🍕' },
        { question: 'O que é isso?', options: ['Apple (Maçã)', 'Orange (Laranja)', 'Banana', 'Grape (Uva)'], correct: 0, type: 'whatis', emoji: '🍎' },
        { question: 'O que é isso?', options: ['Coffee (Café)', 'Tea (Chá)', 'Juice (Suco)', 'Milk (Leite)'], correct: 0, type: 'whatis', emoji: '☕' },
      ],
      travel: [
        { question: '"Aeroporto" em inglês:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 },
        { question: '"Where is the ___?"', options: ['hotel', 'hello', 'food', 'water'], correct: 0 },
        { question: '"Ticket" em português:', options: ['Passagem', 'Mesa', 'Cama', 'Porta'], correct: 0 },
        { question: '"Luggage" significa:', options: ['Bagagem', 'Comida', 'Dinheiro', 'Mapa'], correct: 0 },
        { question: '"How much does it cost?":', options: ['Quanto custa?', 'Onde fica?', 'Quando chega?', 'Como vai?'], correct: 0 },
        { question: '"Passport" em português:', options: ['Passaporte', 'Passagem', 'Pasta', 'Pacote'], correct: 0 },
        { question: '"I need a taxi to the airport":', options: ['Preciso de um táxi para o aeroporto', 'Quero um hotel', 'Onde é a praia', 'Taxi para casa'], correct: 0 },
        { question: '"Flight" significa:', options: ['Voo', 'Vôlei', 'Festa', 'Filme'], correct: 0 },
        { question: '"The train leaves at 3 PM":', options: ['O trem parte às 15h', 'O trem está atrasado', 'O trem é azul', 'Três trens'], correct: 0 },
        // Listen
        { question: '🔊 Ouça e escolha:', options: ['Aeroporto', 'Estação', 'Hotel', 'Praia'], correct: 0, type: 'listen', listenWord: 'Airport' },
        // What is this
        { question: 'O que é isso?', options: ['Airplane (Avião)', 'Car (Carro)', 'Bus (Ônibus)', 'Boat (Barco)'], correct: 0, type: 'whatis', emoji: '✈️' },
        { question: 'O que é isso?', options: ['Suitcase (Mala)', 'Bag (Bolsa)', 'Box (Caixa)', 'Basket (Cesta)'], correct: 0, type: 'whatis', emoji: '🧳' },
      ],
      work: [
        { question: '"Reunião" em inglês:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 },
        { question: '"I need to ___ a report"', options: ['write', 'eat', 'sleep', 'play'], correct: 0 },
        { question: '"Deadline" em português:', options: ['Prazo', 'Festa', 'Almoço', 'Pausa'], correct: 0 },
        { question: '"Colleague" significa:', options: ['Colega', 'Chefe', 'Cliente', 'Amigo'], correct: 0 },
        { question: '"Salary" em português:', options: ['Salário', 'Escola', 'Sala', 'Sábado'], correct: 0 },
        { question: '"I have a job interview":', options: ['Tenho uma entrevista de emprego', 'Tenho um trabalho', 'Vou trabalhar', 'Meu chefe ligou'], correct: 0 },
        { question: '"Office" significa:', options: ['Escritório', 'Oficial', 'Oferta', 'Ofício'], correct: 0 },
        { question: '"To resign" significa:', options: ['Demitir-se', 'Assinar', 'Redesenhar', 'Resignar'], correct: 0 },
        { question: '"The project is due next week":', options: ['O projeto é para a próxima semana', 'O projeto acabou', 'O projeto é novo', 'Próximo projeto'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Reunião', 'Festa', 'Almoço', 'Pausa'], correct: 0, type: 'listen', listenWord: 'Meeting' },
        { question: 'O que é isso?', options: ['Computer (Computador)', 'Phone (Telefone)', 'Book (Livro)', 'Pen (Caneta)'], correct: 0, type: 'whatis', emoji: '💻' },
      ],
      daily: [
        { question: '"Casa" em inglês:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 },
        { question: '"I ___ every morning"', options: ['wake up', 'sleep', 'eat', 'run'], correct: 0 },
        { question: '"Family" em português:', options: ['Família', 'Amigo', 'Vizinho', 'Colega'], correct: 0 },
        { question: '"To clean" significa:', options: ['Limpar', 'Cozinhar', 'Dormir', 'Correr'], correct: 0 },
        { question: '"Bathroom" em português:', options: ['Banheiro', 'Quarto', 'Cozinha', 'Sala'], correct: 0 },
        { question: '"I take a shower every day":', options: ['Eu tomo banho todo dia', 'Eu como todo dia', 'Eu durmo todo dia', 'Eu corro todo dia'], correct: 0 },
        { question: '"Kitchen" significa:', options: ['Cozinha', 'Quarto', 'Banheiro', 'Quintal'], correct: 0 },
        { question: '"To do the laundry":', options: ['Lavar roupa', 'Fazer comida', 'Limpar casa', 'Ir ao mercado'], correct: 0 },
        { question: '"Neighbors" significa:', options: ['Vizinhos', 'Amigos', 'Parentes', 'Colegas'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Casa', 'Carro', 'Gato', 'Cachorro'], correct: 0, type: 'listen', listenWord: 'House' },
        { question: 'O que é isso?', options: ['Bed (Cama)', 'Chair (Cadeira)', 'Table (Mesa)', 'Sofa (Sofá)'], correct: 0, type: 'whatis', emoji: '🛏️' },
        { question: 'O que é isso?', options: ['Key (Chave)', 'Lock (Fechadura)', 'Door (Porta)', 'Window (Janela)'], correct: 0, type: 'whatis', emoji: '🔑' },
      ],
      numbers: [
        { question: '"Vinte" em inglês:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 },
        { question: '"One hundred" em português:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
        { question: 'Como se fala 15?', options: ['Fifteen', 'Fifty', 'Five', 'Fourteen'], correct: 0 },
        { question: '"Thousand" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"Thirteen" em português:', options: ['Treze', 'Três', 'Trinta', 'Trezentos'], correct: 0 },
        { question: '"Forty" em português:', options: ['Quarenta', 'Quatro', 'Quatorze', 'Quatrocentos'], correct: 0 },
        { question: '"Ninety-nine":', options: ['Noventa e nove', 'Novecentos', 'Nove', 'Dezenove'], correct: 0 },
        { question: '"First" em português:', options: ['Primeiro', 'Festa', 'Frio', 'Fogo'], correct: 0 },
        { question: '"Half" significa:', options: ['Metade', 'Cheio', 'Dobro', 'Triplo'], correct: 0 },
      ],
      animals: [
        { question: '"Cachorro" em inglês:', options: ['Dog', 'Cat', 'Bird', 'Fish'], correct: 0 },
        { question: '"Cat" em português:', options: ['Gato', 'Rato', 'Pato', 'Sapo'], correct: 0 },
        { question: '"Bird" significa:', options: ['Pássaro', 'Urso', 'Cobra', 'Peixe'], correct: 0 },
        { question: '"Borboleta" em inglês:', options: ['Butterfly', 'Dragonfly', 'Bee', 'Ant'], correct: 0 },
        { question: '"Elephant" significa:', options: ['Elefante', 'Girafa', 'Leão', 'Tigre'], correct: 0 },
        { question: '"Tubarão" em inglês:', options: ['Shark', 'Whale', 'Dolphin', 'Octopus'], correct: 0 },
        { question: '"Horse" significa:', options: ['Cavalo', 'Vaca', 'Ovelha', 'Porco'], correct: 0 },
        { question: '"Tartaruga" em inglês:', options: ['Turtle', 'Toad', 'Turkey', 'Tiger'], correct: 0 },
        { question: 'O que é isso?', options: ['Dog (Cachorro)', 'Cat (Gato)', 'Bear (Urso)', 'Wolf (Lobo)'], correct: 0, type: 'whatis', emoji: '🐕' },
        { question: 'O que é isso?', options: ['Butterfly (Borboleta)', 'Bee (Abelha)', 'Bird (Pássaro)', 'Bat (Morcego)'], correct: 0, type: 'whatis', emoji: '🦋' },
        { question: '🔊 Ouça e escolha:', options: ['Gato', 'Cachorro', 'Pássaro', 'Peixe'], correct: 0, type: 'listen', listenWord: 'Cat' },
      ],
      colors: [
        { question: '"Vermelho" em inglês:', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 0 },
        { question: '"Blue" em português:', options: ['Azul', 'Amarelo', 'Verde', 'Roxo'], correct: 0 },
        { question: '"Green" significa:', options: ['Verde', 'Cinza', 'Marrom', 'Branco'], correct: 0 },
        { question: '"Amarelo" em inglês:', options: ['Yellow', 'Orange', 'Purple', 'Pink'], correct: 0 },
        { question: '"Purple" significa:', options: ['Roxo', 'Rosa', 'Preto', 'Branco'], correct: 0 },
        { question: '"Preto" em inglês:', options: ['Black', 'White', 'Gray', 'Brown'], correct: 0 },
        { question: '"Orange" significa:', options: ['Laranja', 'Limão', 'Pêssego', 'Manga'], correct: 0 },
        { question: '"Rosa" em inglês:', options: ['Pink', 'Red', 'Purple', 'Peach'], correct: 0 },
        { question: 'O que é isso?', options: ['Red (Vermelho)', 'Orange (Laranja)', 'Yellow (Amarelo)', 'Pink (Rosa)'], correct: 0, type: 'whatis', emoji: '🔴' },
        { question: 'O que é isso?', options: ['Blue (Azul)', 'Green (Verde)', 'Purple (Roxo)', 'Gray (Cinza)'], correct: 0, type: 'whatis', emoji: '🔵' },
      ],
    },
    es: {
      greetings: [
        { question: 'Como se diz "Olá" em espanhol?', options: ['Hola', 'Adiós', 'Gracias', 'Perdón'], correct: 0 },
        { question: '"Bom dia" em espanhol:', options: ['Buenos días', 'Buenas noches', 'Buenas tardes', 'Adiós'], correct: 0 },
        { question: '"Mucho gusto" significa:', options: ['Muito prazer', 'Muito gosto', 'Muita comida', 'Muito tempo'], correct: 0 },
        { question: 'Complete: "¿Cómo ___?"', options: ['estás', 'comes', 'duermes', 'vives'], correct: 0 },
        { question: '"Hasta luego" significa:', options: ['Até logo', 'Até amanhã', 'Até nunca', 'Até a volta'], correct: 0 },
        { question: '"Buenas noches":', options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Bom ano'], correct: 0 },
        { question: '"Me llamo Pedro":', options: ['Meu nome é Pedro', 'Me chamo pedra', 'Eu peço', 'Eu chamo'], correct: 0 },
        { question: '"Encantado de conocerte":', options: ['Prazer em conhecê-lo', 'Encantado com você', 'Conheço você', 'Prazer encantar'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: 'Hola' },
      ],
      food: [
        { question: '"Água" em espanhol:', options: ['Agua', 'Vino', 'Jugo', 'Leche'], correct: 0 },
        { question: '"Pão" em espanhol:', options: ['Pan', 'Carne', 'Arroz', 'Pastel'], correct: 0 },
        { question: '"Pollo" significa:', options: ['Frango', 'Peixe', 'Porco', 'Vaca'], correct: 0 },
        { question: '"Café da manhã" em espanhol:', options: ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'], correct: 0 },
        { question: '"Cerveza" significa:', options: ['Cerveja', 'Cereja', 'Cenoura', 'Cebola'], correct: 0 },
        { question: '"Huevo" em português:', options: ['Ovo', 'Osso', 'Olho', 'Orelha'], correct: 0 },
        { question: '"Quiero un helado":', options: ['Quero um sorvete', 'Quero gelo', 'Quero algo gelado', 'Quero um bolo'], correct: 0 },
        { question: '"Fresa" significa:', options: ['Morango', 'Fresco', 'Frito', 'Feijão'], correct: 0 },
        { question: 'O que é isso?', options: ['Taco', 'Burrito', 'Enchilada', 'Quesadilla'], correct: 0, type: 'whatis', emoji: '🌮' },
      ],
      travel: [
        { question: '"Aeroporto" em espanhol:', options: ['Aeropuerto', 'Estación', 'Hotel', 'Playa'], correct: 0 },
        { question: '"¿Dónde está el ___?"', options: ['hotel', 'hola', 'comida', 'agua'], correct: 0 },
        { question: '"Billete" significa:', options: ['Passagem', 'Bilhete', 'Boleto', 'Bife'], correct: 0 },
        { question: '"Playa" em português:', options: ['Praia', 'Praça', 'Prancha', 'Placa'], correct: 0 },
        { question: '"Maleta" significa:', options: ['Mala', 'Maldade', 'Malha', 'Manga'], correct: 0 },
        { question: '"Tren" em português:', options: ['Trem', 'Três', 'Treno', 'Terra'], correct: 0 },
        { question: '"Necesito un mapa":', options: ['Preciso de um mapa', 'Necessito mapear', 'Não preciso de mapa', 'Mapa necessário'], correct: 0 },
        { question: '"Pasaporte" significa:', options: ['Passaporte', 'Passagem', 'Passarela', 'Passado'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Aeroporto', 'Estação', 'Hotel', 'Praia'], correct: 0, type: 'listen', listenWord: 'Aeropuerto' },
      ],
      work: [
        { question: '"Reunião" em espanhol:', options: ['Reunión', 'Fiesta', 'Almuerzo', 'Descanso'], correct: 0 },
        { question: '"Necesito escribir un informe":', options: ['Preciso escrever um relatório', 'Preciso comer', 'Preciso dormir', 'Preciso jogar'], correct: 0 },
        { question: '"Jefe" significa:', options: ['Chefe', 'Jovem', 'Juiz', 'Jardineiro'], correct: 0 },
        { question: '"Trabajo" em português:', options: ['Trabalho', 'Tabaco', 'Trajeto', 'Trânsito'], correct: 0 },
        { question: '"Empresa" significa:', options: ['Empresa', 'Impressa', 'Emprego', 'Empréstimo'], correct: 0 },
        { question: '"Sueldo" em português:', options: ['Salário', 'Solo', 'Suor', 'Soldado'], correct: 0 },
        { question: '"Oficina" em espanhol significa:', options: ['Escritório', 'Oficina mecânica', 'Fábrica', 'Loja'], correct: 0 },
        { question: '"Compañero de trabajo":', options: ['Colega de trabalho', 'Companheiro de viagem', 'Amigo de escola', 'Chefe de equipe'], correct: 0 },
      ],
      daily: [
        { question: '"Casa" em espanhol:', options: ['Casa', 'Coche', 'Perro', 'Gato'], correct: 0 },
        { question: '"Me despierto" significa:', options: ['Eu acordo', 'Eu durmo', 'Eu corro', 'Eu como'], correct: 0 },
        { question: '"Familia" em português:', options: ['Família', 'Fome', 'Fama', 'Fada'], correct: 0 },
        { question: '"Cocina" significa:', options: ['Cozinha', 'Cocheira', 'Coxinha', 'Costura'], correct: 0 },
        { question: '"Dormir" em espanhol é:', options: ['Dormir', 'Comer', 'Beber', 'Correr'], correct: 0 },
        { question: '"Baño" significa:', options: ['Banheiro', 'Banho', 'Banco', 'Bando'], correct: 0 },
        { question: '"Vecino" significa:', options: ['Vizinho', 'Veado', 'Véu', 'Velho'], correct: 0 },
        { question: '"Lavar la ropa":', options: ['Lavar a roupa', 'Levar a roupa', 'Limpar a rua', 'Largar a roupa'], correct: 0 },
        { question: 'O que é isso?', options: ['Casa', 'Carro', 'Escola', 'Igreja'], correct: 0, type: 'whatis', emoji: '🏠' },
      ],
      numbers: [
        { question: '"Vinte" em espanhol:', options: ['Veinte', 'Doce', 'Dos', 'Diez'], correct: 0 },
        { question: '"Cien" em português:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
        { question: '"Quince" significa:', options: ['Quinze', 'Cinco', 'Cinquenta', 'Quinhentos'], correct: 0 },
        { question: '"Mil" em espanhol é:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"Treinta" significa:', options: ['Trinta', 'Três', 'Treze', 'Trezentos'], correct: 0 },
        { question: '"Cuarenta" significa:', options: ['Quarenta', 'Quatro', 'Quatorze', 'Quatrocentos'], correct: 0 },
        { question: '"Noventa y nueve":', options: ['Noventa e nove', 'Novecentos', 'Nove', 'Dezenove'], correct: 0 },
        { question: '"Primero" significa:', options: ['Primeiro', 'Prêmio', 'Primo', 'Prisioneiro'], correct: 0 },
      ],
      animals: [
        { question: '"Perro" em português:', options: ['Cachorro', 'Gato', 'Cavalo', 'Pássaro'], correct: 0 },
        { question: '"Gato" em espanhol:', options: ['Gato', 'Pato', 'Rato', 'Sapo'], correct: 0 },
        { question: '"Pájaro" significa:', options: ['Pássaro', 'Palheiro', 'Palhaço', 'Pajem'], correct: 0 },
        { question: '"Mariposa" significa:', options: ['Borboleta', 'Margarida', 'Mariposa', 'Marisco'], correct: 0 },
        { question: '"Caballo" em português:', options: ['Cavalo', 'Cabelo', 'Cabeça', 'Cabana'], correct: 0 },
        { question: '"Tiburón" significa:', options: ['Tubarão', 'Turbina', 'Turista', 'Tucano'], correct: 0 },
        { question: '"Tortuga" em português:', options: ['Tartaruga', 'Tortura', 'Torta', 'Toalha'], correct: 0 },
        { question: '"Conejo" significa:', options: ['Coelho', 'Conselho', 'Cogumelo', 'Conexão'], correct: 0 },
        { question: 'O que é isso?', options: ['Gato', 'Cachorro', 'Coelho', 'Rato'], correct: 0, type: 'whatis', emoji: '🐱' },
      ],
      colors: [
        { question: '"Rojo" em português:', options: ['Vermelho', 'Roxo', 'Rosa', 'Ruivo'], correct: 0 },
        { question: '"Azul" em espanhol:', options: ['Azul', 'Amarillo', 'Verde', 'Morado'], correct: 0 },
        { question: '"Verde" significa:', options: ['Verde', 'Vermelho', 'Violeta', 'Vinho'], correct: 0 },
        { question: '"Amarillo" significa:', options: ['Amarelo', 'Amargo', 'Ameixa', 'Amor'], correct: 0 },
        { question: '"Negro" em português:', options: ['Preto', 'Negro', 'Neve', 'Nó'], correct: 0 },
        { question: '"Blanco" significa:', options: ['Branco', 'Banco', 'Barco', 'Brilho'], correct: 0 },
        { question: '"Morado" significa:', options: ['Roxo', 'Morango', 'Morada', 'Moral'], correct: 0 },
        { question: '"Naranja" significa:', options: ['Laranja', 'Nariz', 'Nardo', 'Navalha'], correct: 0 },
      ],
    },
    fr: {
      greetings: [
        { question: 'Como se diz "Olá" em francês?', options: ['Bonjour', 'Au revoir', 'Merci', "S'il vous plaît"], correct: 0 },
        { question: '"Bonsoir" significa:', options: ['Boa noite', 'Bom dia', 'Tchau', 'Obrigado'], correct: 0 },
        { question: '"Comment allez-vous?":', options: ['Como vai você?', 'Como chama?', 'Como come?', 'Como dorme?'], correct: 0 },
        { question: '"Au revoir" significa:', options: ['Tchau', 'Olá', 'Obrigado', 'Desculpe'], correct: 0 },
        { question: '"Merci beaucoup":', options: ['Muito obrigado', 'Muito bonito', 'Muito bom', 'Muito feliz'], correct: 0 },
        { question: '"Excusez-moi":', options: ['Com licença', 'Me excuse', 'Desculpa-me', 'Me perdoe'], correct: 0 },
        { question: '"Enchanté" significa:', options: ['Prazer', 'Encantado', 'Feliz', 'Surpreso'], correct: 0 },
        { question: '"S\'il vous plaît":', options: ['Por favor', 'Se agrada', 'Sim por favor', 'Se puder'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: 'Bonjour' },
      ],
      food: [
        { question: '"Água" em francês:', options: ['Eau', 'Vin', 'Jus', 'Lait'], correct: 0 },
        { question: '"Pain" significa:', options: ['Pão', 'Dor', 'Panela', 'Pano'], correct: 0 },
        { question: '"Fromage" significa:', options: ['Queijo', 'Formiga', 'Forma', 'Forno'], correct: 0 },
        { question: '"Poulet" significa:', options: ['Frango', 'Polvo', 'Porco', 'Peru'], correct: 0 },
        { question: '"Petit déjeuner":', options: ['Café da manhã', 'Pequeno almoço', 'Lanche', 'Jantar'], correct: 0 },
        { question: '"Beurre" significa:', options: ['Manteiga', 'Bezerro', 'Berço', 'Bife'], correct: 0 },
        { question: '"Vin rouge" significa:', options: ['Vinho tinto', 'Vinho branco', 'Vinho rosé', 'Vinagre'], correct: 0 },
        { question: '"Gâteau" significa:', options: ['Bolo', 'Gato', 'Garrafa', 'Galinha'], correct: 0 },
        { question: 'O que é isso?', options: ['Croissant', 'Baguette', 'Brioche', 'Crêpe'], correct: 0, type: 'whatis', emoji: '🥐' },
      ],
      travel: [
        { question: '"Aéroport" em português:', options: ['Aeroporto', 'Avião', 'Automóvel', 'Atividade'], correct: 0 },
        { question: '"Billet" significa:', options: ['Passagem', 'Bilhete', 'Bile', 'Bicicleta'], correct: 0 },
        { question: '"Gare" significa:', options: ['Estação', 'Garagem', 'Garrafa', 'Garantia'], correct: 0 },
        { question: '"Hôtel" em português:', options: ['Hotel', 'Hostel', 'Hospital', 'Hospício'], correct: 0 },
        { question: '"Plage" significa:', options: ['Praia', 'Placa', 'Praça', 'Planeta'], correct: 0 },
        { question: '"Valise" significa:', options: ['Mala', 'Valsa', 'Válvula', 'Vale'], correct: 0 },
        { question: '"Train" em português:', options: ['Trem', 'Trânsito', 'Trajeto', 'Trilho'], correct: 0 },
        { question: '"Passeport" significa:', options: ['Passaporte', 'Passagem', 'Passarela', 'Passante'], correct: 0 },
      ],
      work: [
        { question: '"Réunion" em português:', options: ['Reunião', 'Região', 'Religião', 'Revisão'], correct: 0 },
        { question: '"Bureau" significa:', options: ['Escritório', 'Buraco', 'Burocracia', 'Burro'], correct: 0 },
        { question: '"Patron" significa:', options: ['Chefe', 'Patrão', 'Patrono', 'Patrulha'], correct: 0 },
        { question: '"Travail" significa:', options: ['Trabalho', 'Viagem', 'Treino', 'Trilha'], correct: 0 },
        { question: '"Salaire" significa:', options: ['Salário', 'Sal', 'Sala', 'Saúde'], correct: 0 },
        { question: '"Collègue" significa:', options: ['Colega', 'Colégio', 'Coleção', 'Coleira'], correct: 0 },
        { question: '"Entreprise" significa:', options: ['Empresa', 'Entrada', 'Entrega', 'Entrevista'], correct: 0 },
        { question: '"Le projet est terminé":', options: ['O projeto está terminado', 'O projeto está terminando', 'O projeto terminou', 'Projeto terminal'], correct: 0 },
      ],
      daily: [
        { question: '"Maison" em português:', options: ['Casa', 'Mansão', 'Mesa', 'Mãe'], correct: 0 },
        { question: '"Famille" significa:', options: ['Família', 'Fome', 'Fama', 'Fêmea'], correct: 0 },
        { question: '"Cuisine" significa:', options: ['Cozinha', 'Costura', 'Cuscuz', 'Custo'], correct: 0 },
        { question: '"Dormir" em francês é:', options: ['Dormir', 'Comer', 'Beber', 'Correr'], correct: 0 },
        { question: '"Se réveiller" significa:', options: ['Acordar', 'Revelar', 'Revoltar', 'Reviver'], correct: 0 },
        { question: '"Voisin" significa:', options: ['Vizinho', 'Visão', 'Viagem', 'Violino'], correct: 0 },
        { question: '"Chambre" significa:', options: ['Quarto', 'Câmara', 'Câmera', 'Cambista'], correct: 0 },
        { question: '"Nettoyer" significa:', options: ['Limpar', 'Nadar', 'Navegar', 'Negar'], correct: 0 },
      ],
      numbers: [
        { question: '"Vingt" em português:', options: ['Vinte', 'Vindo', 'Vento', 'Cinco'], correct: 0 },
        { question: '"Cent" significa:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
        { question: '"Quinze":', options: ['Quinze', 'Cinco', 'Cinquenta', 'Quatro'], correct: 0 },
        { question: '"Mille" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"Trente" significa:', options: ['Trinta', 'Três', 'Treze', 'Trezentos'], correct: 0 },
        { question: '"Cinquante" significa:', options: ['Cinquenta', 'Cinco', 'Quinze', 'Quinhentos'], correct: 0 },
        { question: '"Soixante-dix" significa:', options: ['Setenta', 'Sessenta', 'Setenta e dez', 'Dezesseis'], correct: 0 },
        { question: '"Quatre-vingts" significa:', options: ['Oitenta', 'Quarenta', 'Quatro vinhos', 'Quatrocentos'], correct: 0 },
      ],
      animals: [
        { question: '"Chien" em português:', options: ['Cachorro', 'China', 'Chaminé', 'Chave'], correct: 0 },
        { question: '"Chat" significa:', options: ['Gato', 'Chapéu', 'Chato', 'Chá'], correct: 0 },
        { question: '"Oiseau" significa:', options: ['Pássaro', 'Osso', 'Olho', 'Orelha'], correct: 0 },
        { question: '"Papillon" significa:', options: ['Borboleta', 'Papai', 'Papel', 'Papila'], correct: 0 },
        { question: '"Cheval" significa:', options: ['Cavalo', 'Cabelo', 'Chaveiro', 'Chevalier'], correct: 0 },
        { question: '"Poisson" significa:', options: ['Peixe', 'Veneno', 'Pessoa', 'Porção'], correct: 0 },
        { question: '"Lapin" significa:', options: ['Coelho', 'Lápis', 'Lata', 'Lampião'], correct: 0 },
        { question: '"Tortue" significa:', options: ['Tartaruga', 'Torta', 'Tortura', 'Torre'], correct: 0 },
      ],
      colors: [
        { question: '"Rouge" em português:', options: ['Vermelho', 'Ruge', 'Roda', 'Rosa'], correct: 0 },
        { question: '"Bleu" significa:', options: ['Azul', 'Branco', 'Brilhante', 'Bege'], correct: 0 },
        { question: '"Vert" significa:', options: ['Verde', 'Verdade', 'Verão', 'Verso'], correct: 0 },
        { question: '"Jaune" significa:', options: ['Amarelo', 'Janeiro', 'Jovem', 'Janela'], correct: 0 },
        { question: '"Noir" significa:', options: ['Preto', 'Noite', 'Norte', 'Nó'], correct: 0 },
        { question: '"Blanc" significa:', options: ['Branco', 'Bloco', 'Brasa', 'Brilho'], correct: 0 },
        { question: '"Rose" significa:', options: ['Rosa', 'Roça', 'Roda', 'Rosto'], correct: 0 },
        { question: '"Violet" significa:', options: ['Roxo', 'Violino', 'Violeta', 'Viúva'], correct: 0 },
      ],
    },
    de: {
      greetings: [
        { question: 'Como se diz "Olá" em alemão?', options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'], correct: 0 },
        { question: '"Guten Morgen" significa:', options: ['Bom dia', 'Boa noite', 'Boa tarde', 'Tchau'], correct: 0 },
        { question: '"Auf Wiedersehen":', options: ['Até logo', 'Até amanhã', 'Até nunca', 'Bem-vindo'], correct: 0 },
        { question: '"Danke schön":', options: ['Muito obrigado', 'Bom dia', 'Boa noite', 'Com licença'], correct: 0 },
        { question: '"Wie heißen Sie?":', options: ['Qual é o seu nome?', 'Como vai?', 'Onde mora?', 'Quantos anos?'], correct: 0 },
        { question: '"Guten Abend":', options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Tchau'], correct: 0 },
        { question: '"Entschuldigung":', options: ['Desculpe', 'Obrigado', 'Por favor', 'Olá'], correct: 0 },
        { question: '"Bitte" significa:', options: ['Por favor', 'Pedaço', 'Bituca', 'Bife'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: 'Hallo' },
      ],
      food: [
        { question: '"Wasser" em português:', options: ['Água', 'Vaca', 'Vassoura', 'Vaso'], correct: 0 },
        { question: '"Brot" significa:', options: ['Pão', 'Broto', 'Bolo', 'Brócolis'], correct: 0 },
        { question: '"Milch" significa:', options: ['Leite', 'Milho', 'Mel', 'Manga'], correct: 0 },
        { question: '"Frühstück" significa:', options: ['Café da manhã', 'Fruta', 'Frio', 'Frango'], correct: 0 },
        { question: '"Käse" significa:', options: ['Queijo', 'Casa', 'Caso', 'Caixa'], correct: 0 },
        { question: '"Bier" significa:', options: ['Cerveja', 'Bezerro', 'Bife', 'Berço'], correct: 0 },
        { question: '"Kuchen" significa:', options: ['Bolo', 'Cozinha', 'Coelho', 'Cubo'], correct: 0 },
        { question: '"Kartoffel" significa:', options: ['Batata', 'Cartão', 'Cartucho', 'Caneca'], correct: 0 },
        { question: 'O que é isso?', options: ['Pretzel', 'Pão', 'Rosca', 'Biscoito'], correct: 0, type: 'whatis', emoji: '🥨' },
      ],
      travel: [
        { question: '"Flughafen" em português:', options: ['Aeroporto', 'Flutuação', 'Fluxo', 'Floresta'], correct: 0 },
        { question: '"Bahnhof" significa:', options: ['Estação de trem', 'Banheiro', 'Banco', 'Bar'], correct: 0 },
        { question: '"Fahrkarte" significa:', options: ['Passagem', 'Fato', 'Farinha', 'Faixa'], correct: 0 },
        { question: '"Koffer" significa:', options: ['Mala', 'Cofre', 'Café', 'Colher'], correct: 0 },
        { question: '"Reise" significa:', options: ['Viagem', 'Risco', 'Reis', 'Ritmo'], correct: 0 },
        { question: '"Zug" significa:', options: ['Trem', 'Zoológico', 'Zona', 'Zumo'], correct: 0 },
        { question: '"Reisepass" significa:', options: ['Passaporte', 'Reisado', 'Passe', 'Passado'], correct: 0 },
        { question: '"Strand" significa:', options: ['Praia', 'Estranho', 'Estrela', 'Estado'], correct: 0 },
      ],
      work: [
        { question: '"Besprechung" significa:', options: ['Reunião', 'Besouro', 'Besteira', 'Bebida'], correct: 0 },
        { question: '"Arbeit" significa:', options: ['Trabalho', 'Árvore', 'Areia', 'Arte'], correct: 0 },
        { question: '"Büro" significa:', options: ['Escritório', 'Buraco', 'Burro', 'Bule'], correct: 0 },
        { question: '"Chef" em alemão significa:', options: ['Chefe', 'Chef de cozinha', 'Cheque', 'Chave'], correct: 0 },
        { question: '"Gehalt" significa:', options: ['Salário', 'Gelado', 'Gelatina', 'Geral'], correct: 0 },
        { question: '"Kollege" significa:', options: ['Colega', 'Colégio', 'Colar', 'Colina'], correct: 0 },
        { question: '"Firma" significa:', options: ['Empresa', 'Firme', 'Forma', 'Fórmula'], correct: 0 },
        { question: '"Termin" significa:', options: ['Compromisso', 'Terminal', 'Término', 'Terça'], correct: 0 },
      ],
      daily: [
        { question: '"Haus" em português:', options: ['Casa', 'Hora', 'Haste', 'Hábito'], correct: 0 },
        { question: '"Familie" significa:', options: ['Família', 'Fome', 'Fama', 'Fazenda'], correct: 0 },
        { question: '"Küche" significa:', options: ['Cozinha', 'Cubo', 'Cuba', 'Cueca'], correct: 0 },
        { question: '"Schlafen" significa:', options: ['Dormir', 'Chafurdar', 'Chamar', 'Chuva'], correct: 0 },
        { question: '"Aufwachen" significa:', options: ['Acordar', 'Aguar', 'Avançar', 'Arrancar'], correct: 0 },
        { question: '"Nachbar" significa:', options: ['Vizinho', 'Nacho', 'Nacção', 'Navio'], correct: 0 },
        { question: '"Zimmer" significa:', options: ['Quarto', 'Zinco', 'Zero', 'Zona'], correct: 0 },
        { question: '"Putzen" significa:', options: ['Limpar', 'Pular', 'Pintar', 'Pregar'], correct: 0 },
      ],
      numbers: [
        { question: '"Zwanzig" em português:', options: ['Vinte', 'Doze', 'Dois', 'Dez'], correct: 0 },
        { question: '"Hundert" significa:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
        { question: '"Fünfzehn":', options: ['Quinze', 'Cinquenta', 'Cinco', 'Quatorze'], correct: 0 },
        { question: '"Tausend" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"Dreißig" significa:', options: ['Trinta', 'Três', 'Treze', 'Trezentos'], correct: 0 },
        { question: '"Fünfzig" significa:', options: ['Cinquenta', 'Cinco', 'Quinze', 'Quinhentos'], correct: 0 },
        { question: '"Siebzig" significa:', options: ['Setenta', 'Sete', 'Sessenta', 'Seis'], correct: 0 },
        { question: '"Neunundneunzig" significa:', options: ['Noventa e nove', 'Novecentos', 'Noventa', 'Nove'], correct: 0 },
      ],
      animals: [
        { question: '"Hund" em português:', options: ['Cachorro', 'Cavalo', 'Gato', 'Coelho'], correct: 0 },
        { question: '"Katze" significa:', options: ['Gato', 'Café', 'Carro', 'Cama'], correct: 0 },
        { question: '"Vogel" significa:', options: ['Pássaro', 'Fogo', 'Vapor', 'Vaso'], correct: 0 },
        { question: '"Schmetterling" significa:', options: ['Borboleta', 'Schmuck', 'Schmalz', 'Schnee'], correct: 0 },
        { question: '"Pferd" significa:', options: ['Cavalo', 'Porco', 'Pato', 'Pombo'], correct: 0 },
        { question: '"Fisch" significa:', options: ['Peixe', 'Fita', 'Figo', 'Fio'], correct: 0 },
        { question: '"Kaninchen" significa:', options: ['Coelho', 'Canário', 'Caneca', 'Canal'], correct: 0 },
        { question: '"Schildkröte" significa:', options: ['Tartaruga', 'Escudo', 'Soldado', 'Sapato'], correct: 0 },
      ],
      colors: [
        { question: '"Rot" em português:', options: ['Vermelho', 'Rota', 'Roda', 'Roupa'], correct: 0 },
        { question: '"Blau" significa:', options: ['Azul', 'Branco', 'Brilhante', 'Bege'], correct: 0 },
        { question: '"Grün" significa:', options: ['Verde', 'Grande', 'Grama', 'Grão'], correct: 0 },
        { question: '"Gelb" significa:', options: ['Amarelo', 'Gelo', 'Gel', 'Gema'], correct: 0 },
        { question: '"Schwarz" significa:', options: ['Preto', 'Sujo', 'Sério', 'Sereno'], correct: 0 },
        { question: '"Weiß" significa:', options: ['Branco', 'Velho', 'Vento', 'Véu'], correct: 0 },
        { question: '"Rosa" em alemão:', options: ['Rosa', 'Rosado', 'Rosto', 'Roça'], correct: 0 },
        { question: '"Lila" significa:', options: ['Lilás/Roxo', 'Lima', 'Linha', 'Lira'], correct: 0 },
      ],
    },
    it: {
      greetings: [
        { question: 'Como se diz "Olá" em italiano?', options: ['Ciao', 'Arrivederci', 'Grazie', 'Prego'], correct: 0 },
        { question: '"Buongiorno" significa:', options: ['Bom dia', 'Boa noite', 'Boa tarde', 'Tchau'], correct: 0 },
        { question: '"Buonasera":', options: ['Boa noite', 'Bom dia', 'Boa tarde', 'Bom ano'], correct: 0 },
        { question: '"Come stai?":', options: ['Como vai?', 'Como come?', 'Como dorme?', 'Como mora?'], correct: 0 },
        { question: '"Arrivederci":', options: ['Tchau', 'Olá', 'Obrigado', 'Desculpe'], correct: 0 },
        { question: '"Piacere di conoscerti":', options: ['Prazer em conhecê-lo', 'Prazer em comer', 'Prazer no parque', 'Prazer em cantar'], correct: 0 },
        { question: '"Per favore" significa:', options: ['Por favor', 'Para o favor', 'Pelo fato', 'Por falar'], correct: 0 },
        { question: '"Mi chiamo Maria":', options: ['Meu nome é Maria', 'Me chamo Maria', 'Eu chamo Maria', 'Maria me chama'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: 'Ciao' },
      ],
      food: [
        { question: '"Acqua" em português:', options: ['Água', 'Aquário', 'Açúcar', 'Aço'], correct: 0 },
        { question: '"Pane" significa:', options: ['Pão', 'Panela', 'Pano', 'Pano'], correct: 0 },
        { question: '"Formaggio" significa:', options: ['Queijo', 'Formiga', 'Forma', 'Forno'], correct: 0 },
        { question: '"Pollo" significa:', options: ['Frango', 'Polvo', 'Porco', 'Peru'], correct: 0 },
        { question: '"Colazione" significa:', options: ['Café da manhã', 'Coleção', 'Colação', 'Colagem'], correct: 0 },
        { question: '"Gelato" significa:', options: ['Sorvete', 'Gelado', 'Gelatina', 'Gelo'], correct: 0 },
        { question: '"Vino rosso" significa:', options: ['Vinho tinto', 'Vinho branco', 'Vinho rosé', 'Vinagre'], correct: 0 },
        { question: '"Dolce" significa:', options: ['Doce/Sobremesa', 'Dor', 'Dúvida', 'Dose'], correct: 0 },
        { question: 'O que é isso?', options: ['Pasta (Macarrão)', 'Pizza', 'Risotto', 'Lasagna'], correct: 0, type: 'whatis', emoji: '🍝' },
      ],
      travel: [
        { question: '"Aeroporto" em italiano:', options: ['Aeroporto', 'Aeroplano', 'Aereo', 'Aerobica'], correct: 0 },
        { question: '"Biglietto" significa:', options: ['Passagem', 'Bigode', 'Bilhete', 'Bicicleta'], correct: 0 },
        { question: '"Stazione" significa:', options: ['Estação', 'Estado', 'Estádio', 'Estátua'], correct: 0 },
        { question: '"Albergo" significa:', options: ['Hotel', 'Albergue', 'Árvore', 'Alegria'], correct: 0 },
        { question: '"Spiaggia" significa:', options: ['Praia', 'Espaguete', 'Espião', 'Espada'], correct: 0 },
        { question: '"Valigia" significa:', options: ['Mala', 'Valsa', 'Válvula', 'Vale'], correct: 0 },
        { question: '"Treno" significa:', options: ['Trem', 'Treino', 'Trono', 'Trevo'], correct: 0 },
        { question: '"Passaporto" significa:', options: ['Passaporte', 'Passagem', 'Passarela', 'Passado'], correct: 0 },
      ],
      work: [
        { question: '"Riunione" significa:', options: ['Reunião', 'Ruína', 'Ritual', 'Rítmo'], correct: 0 },
        { question: '"Ufficio" significa:', options: ['Escritório', 'Oficial', 'Uniforme', 'Único'], correct: 0 },
        { question: '"Capo" significa:', options: ['Chefe', 'Capa', 'Capô', 'Capítulo'], correct: 0 },
        { question: '"Lavoro" significa:', options: ['Trabalho', 'Lavagem', 'Lavoura', 'Lava'], correct: 0 },
        { question: '"Stipendio" significa:', options: ['Salário', 'Estipulação', 'Estudante', 'Estágio'], correct: 0 },
        { question: '"Collega" significa:', options: ['Colega', 'Colégio', 'Coleção', 'Coleira'], correct: 0 },
        { question: '"Azienda" significa:', options: ['Empresa', 'Azulejo', 'Azeitona', 'Ação'], correct: 0 },
        { question: '"Il progetto è finito":', options: ['O projeto está terminado', 'O projeto é finito', 'O projeto é fino', 'O projeto é final'], correct: 0 },
      ],
      daily: [
        { question: '"Casa" em italiano:', options: ['Casa', 'Cama', 'Capa', 'Cana'], correct: 0 },
        { question: '"Famiglia" significa:', options: ['Família', 'Fome', 'Fama', 'Fazenda'], correct: 0 },
        { question: '"Cucina" significa:', options: ['Cozinha', 'Costura', 'Custo', 'Cura'], correct: 0 },
        { question: '"Dormire" significa:', options: ['Dormir', 'Domar', 'Dominar', 'Doar'], correct: 0 },
        { question: '"Svegliarsi" significa:', options: ['Acordar', 'Desvendar', 'Revelar', 'Svelto'], correct: 0 },
        { question: '"Vicino" significa:', options: ['Vizinho', 'Vício', 'Vítima', 'Vinho'], correct: 0 },
        { question: '"Camera" significa:', options: ['Quarto', 'Câmera', 'Camisa', 'Cama'], correct: 0 },
        { question: '"Pulire" significa:', options: ['Limpar', 'Pulir', 'Pular', 'Polir'], correct: 0 },
      ],
      numbers: [
        { question: '"Venti" em português:', options: ['Vinte', 'Vento', 'Vida', 'Vez'], correct: 0 },
        { question: '"Cento" significa:', options: ['Cem', 'Centro', 'Cento', 'Conta'], correct: 0 },
        { question: '"Quindici":', options: ['Quinze', 'Cinco', 'Cinquenta', 'Quatro'], correct: 0 },
        { question: '"Mille" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"Trenta" significa:', options: ['Trinta', 'Três', 'Treze', 'Trezentos'], correct: 0 },
        { question: '"Quaranta" significa:', options: ['Quarenta', 'Quatro', 'Quatorze', 'Quatrocentos'], correct: 0 },
        { question: '"Settanta" significa:', options: ['Setenta', 'Sete', 'Sessenta', 'Seis'], correct: 0 },
        { question: '"Novantanove" significa:', options: ['Noventa e nove', 'Novecentos', 'Noventa', 'Nove'], correct: 0 },
      ],
      animals: [
        { question: '"Cane" em português:', options: ['Cachorro', 'Cana', 'Canário', 'Canal'], correct: 0 },
        { question: '"Gatto" significa:', options: ['Gato', 'Gato', 'Galho', 'Ganso'], correct: 0 },
        { question: '"Uccello" significa:', options: ['Pássaro', 'Úlcera', 'Útero', 'Urso'], correct: 0 },
        { question: '"Farfalla" significa:', options: ['Borboleta', 'Farinha', 'Fardo', 'Farmácia'], correct: 0 },
        { question: '"Cavallo" significa:', options: ['Cavalo', 'Cabelo', 'Caverna', 'Caneta'], correct: 0 },
        { question: '"Pesce" significa:', options: ['Peixe', 'Pêssego', 'Peso', 'Pessoa'], correct: 0 },
        { question: '"Coniglio" significa:', options: ['Coelho', 'Conselho', 'Concha', 'Cone'], correct: 0 },
        { question: '"Tartaruga" em italiano:', options: ['Tartaruga', 'Torta', 'Torre', 'Touro'], correct: 0 },
      ],
      colors: [
        { question: '"Rosso" em português:', options: ['Vermelho', 'Roxo', 'Rosa', 'Rosto'], correct: 0 },
        { question: '"Blu" significa:', options: ['Azul', 'Branco', 'Brilho', 'Bronze'], correct: 0 },
        { question: '"Verde" em italiano:', options: ['Verde', 'Verdade', 'Verão', 'Verso'], correct: 0 },
        { question: '"Giallo" significa:', options: ['Amarelo', 'Gelo', 'Galho', 'Giro'], correct: 0 },
        { question: '"Nero" significa:', options: ['Preto', 'Nervo', 'Nerd', 'Neve'], correct: 0 },
        { question: '"Bianco" significa:', options: ['Branco', 'Banco', 'Bloco', 'Barco'], correct: 0 },
        { question: '"Rosa" em italiano:', options: ['Rosa', 'Roça', 'Rosto', 'Roda'], correct: 0 },
        { question: '"Viola" significa:', options: ['Roxo', 'Viola', 'Violino', 'Vila'], correct: 0 },
      ],
    },
    ja: {
      greetings: [
        { question: 'Como se diz "Olá" em japonês?', options: ['こんにちは', 'さようなら', 'ありがとう', 'すみません'], correct: 0 },
        { question: '"おはようございます" significa:', options: ['Bom dia', 'Boa noite', 'Tchau', 'Obrigado'], correct: 0 },
        { question: '"さようなら" significa:', options: ['Tchau', 'Olá', 'Obrigado', 'Desculpe'], correct: 0 },
        { question: '"ありがとうございます":', options: ['Muito obrigado', 'Bom dia', 'Boa noite', 'Desculpe'], correct: 0 },
        { question: '"すみません" significa:', options: ['Com licença/Desculpe', 'Obrigado', 'Olá', 'Tchau'], correct: 0 },
        { question: '"はじめまして":', options: ['Prazer em conhecer', 'Até logo', 'Bom dia', 'Boa viagem'], correct: 0 },
        { question: '"お元気ですか？":', options: ['Como vai?', 'Onde mora?', 'Como come?', 'Quantos anos?'], correct: 0 },
        { question: '"どういたしまして":', options: ['De nada', 'Obrigado', 'Desculpe', 'Olá'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: 'こんにちは' },
      ],
      food: [
        { question: '"水 (mizu)" significa:', options: ['Água', 'Leite', 'Suco', 'Chá'], correct: 0 },
        { question: '"パン (pan)" significa:', options: ['Pão', 'Panela', 'Pano', 'Pata'], correct: 0 },
        { question: '"ご飯 (gohan)" significa:', options: ['Arroz/Refeição', 'Pão', 'Macarrão', 'Carne'], correct: 0 },
        { question: '"寿司 (sushi)" é:', options: ['Sushi', 'Sopa', 'Salada', 'Sashimi'], correct: 0 },
        { question: '"お茶 (ocha)" significa:', options: ['Chá', 'Café', 'Água', 'Suco'], correct: 0 },
        { question: '"肉 (niku)" significa:', options: ['Carne', 'Peixe', 'Frango', 'Porco'], correct: 0 },
        { question: '"魚 (sakana)" significa:', options: ['Peixe', 'Carne', 'Frango', 'Camarão'], correct: 0 },
        { question: '"おいしい (oishii)" significa:', options: ['Delicioso', 'Feio', 'Grande', 'Pequeno'], correct: 0 },
        { question: 'O que é isso?', options: ['Sushi (寿司)', 'Ramen (ラーメン)', 'Onigiri (おにぎり)', 'Tempura (天ぷら)'], correct: 0, type: 'whatis', emoji: '🍣' },
      ],
      travel: [
        { question: '"空港 (kūkō)" significa:', options: ['Aeroporto', 'Céu', 'Porto', 'Ar'], correct: 0 },
        { question: '"駅 (eki)" significa:', options: ['Estação', 'Casa', 'Escola', 'Empresa'], correct: 0 },
        { question: '"ホテル (hoteru)" é:', options: ['Hotel', 'Hospital', 'Hostel', 'Hospício'], correct: 0 },
        { question: '"電車 (densha)" significa:', options: ['Trem', 'Eletricidade', 'Dinheiro', 'Telefone'], correct: 0 },
        { question: '"切符 (kippu)" significa:', options: ['Passagem', 'Corte', 'Cupom', 'Cartão'], correct: 0 },
        { question: '"地図 (chizu)" significa:', options: ['Mapa', 'Queijo', 'Chão', 'Terra'], correct: 0 },
        { question: '"旅行 (ryokō)" significa:', options: ['Viagem', 'Corrida', 'Exercício', 'Aventura'], correct: 0 },
        { question: '"パスポート (pasupōto)":', options: ['Passaporte', 'Pasta', 'Passe', 'Passeio'], correct: 0 },
      ],
      work: [
        { question: '"会議 (kaigi)" significa:', options: ['Reunião', 'Conta', 'Correio', 'Consulta'], correct: 0 },
        { question: '"仕事 (shigoto)" significa:', options: ['Trabalho', 'Cidade', 'Sentido', 'Sigilo'], correct: 0 },
        { question: '"事務所 (jimusho)" significa:', options: ['Escritório', 'Templo', 'Jardim', 'Museu'], correct: 0 },
        { question: '"上司 (jōshi)" significa:', options: ['Chefe', 'Superior', 'Juiz', 'Jovem'], correct: 0 },
        { question: '"給料 (kyūryō)" significa:', options: ['Salário', 'Comida', 'Presente', 'Férias'], correct: 0 },
        { question: '"同僚 (dōryō)" significa:', options: ['Colega', 'Doutor', 'Doente', 'Dono'], correct: 0 },
        { question: '"会社 (kaisha)" significa:', options: ['Empresa', 'Sociedade', 'Reunião', 'Conta'], correct: 0 },
        { question: '"締め切り (shimekiri)":', options: ['Prazo', 'Fechamento', 'Corte', 'Fim'], correct: 0 },
      ],
      daily: [
        { question: '"家 (ie)" significa:', options: ['Casa', 'Cama', 'Cão', 'Carro'], correct: 0 },
        { question: '"家族 (kazoku)" significa:', options: ['Família', 'Amigo', 'Vizinho', 'Colega'], correct: 0 },
        { question: '"台所 (daidokoro)" significa:', options: ['Cozinha', 'Quarto', 'Banheiro', 'Sala'], correct: 0 },
        { question: '"寝る (neru)" significa:', options: ['Dormir', 'Correr', 'Comer', 'Beber'], correct: 0 },
        { question: '"起きる (okiru)" significa:', options: ['Acordar', 'Levantar', 'Ocorrer', 'Abrir'], correct: 0 },
        { question: '"隣人 (rinjin)" significa:', options: ['Vizinho', 'Amigo', 'Primo', 'Irmão'], correct: 0 },
        { question: '"部屋 (heya)" significa:', options: ['Quarto', 'Parte', 'Andar', 'Piso'], correct: 0 },
        { question: '"掃除する (sōji suru)":', options: ['Limpar', 'Cozinhar', 'Lavar', 'Secar'], correct: 0 },
      ],
      numbers: [
        { question: '"二十 (nijū)" em português:', options: ['Vinte', 'Doze', 'Dois', 'Dez'], correct: 0 },
        { question: '"百 (hyaku)" significa:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
        { question: '"十五 (jūgo)":', options: ['Quinze', 'Cinco', 'Cinquenta', 'Dez'], correct: 0 },
        { question: '"千 (sen)" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"三十 (sanjū)" significa:', options: ['Trinta', 'Três', 'Treze', 'Trezentos'], correct: 0 },
        { question: '"四十 (yonjū)" significa:', options: ['Quarenta', 'Quatro', 'Quatorze', 'Quatrocentos'], correct: 0 },
        { question: '"七十 (nanajū)" significa:', options: ['Setenta', 'Sete', 'Sessenta', 'Seis'], correct: 0 },
        { question: '"九十九 (kyūjūkyū)":', options: ['Noventa e nove', 'Novecentos', 'Noventa', 'Nove'], correct: 0 },
      ],
      animals: [
        { question: '"犬 (inu)" significa:', options: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'], correct: 0 },
        { question: '"猫 (neko)" significa:', options: ['Gato', 'Rato', 'Macaco', 'Sapo'], correct: 0 },
        { question: '"鳥 (tori)" significa:', options: ['Pássaro', 'Tigre', 'Touro', 'Tartaruga'], correct: 0 },
        { question: '"蝶 (chō)" significa:', options: ['Borboleta', 'Chá', 'Chefe', 'Chave'], correct: 0 },
        { question: '"馬 (uma)" significa:', options: ['Cavalo', 'Vaca', 'Macaco', 'Urso'], correct: 0 },
        { question: '"魚 (sakana)" significa:', options: ['Peixe', 'Sapo', 'Saco', 'Sal'], correct: 0 },
        { question: '"うさぎ (usagi)" significa:', options: ['Coelho', 'Urso', 'Coruja', 'Cobra'], correct: 0 },
        { question: '"亀 (kame)" significa:', options: ['Tartaruga', 'Camelo', 'Cama', 'Caneta'], correct: 0 },
      ],
      colors: [
        { question: '"赤 (aka)" significa:', options: ['Vermelho', 'Azul', 'Verde', 'Amarelo'], correct: 0 },
        { question: '"青 (ao)" significa:', options: ['Azul', 'Branco', 'Preto', 'Roxo'], correct: 0 },
        { question: '"緑 (midori)" significa:', options: ['Verde', 'Cinza', 'Marrom', 'Rosa'], correct: 0 },
        { question: '"黄色 (kiiro)" significa:', options: ['Amarelo', 'Branco', 'Preto', 'Laranja'], correct: 0 },
        { question: '"黒 (kuro)" significa:', options: ['Preto', 'Branco', 'Cinza', 'Marrom'], correct: 0 },
        { question: '"白 (shiro)" significa:', options: ['Branco', 'Preto', 'Azul', 'Verde'], correct: 0 },
        { question: '"ピンク (pinku)" significa:', options: ['Rosa', 'Vermelho', 'Roxo', 'Laranja'], correct: 0 },
        { question: '"紫 (murasaki)" significa:', options: ['Roxo', 'Rosa', 'Azul', 'Verde'], correct: 0 },
      ],
    },
    ko: {
      greetings: [
        { question: 'Como se diz "Olá" em coreano?', options: ['안녕하세요', '감사합니다', '죄송합니다', '안녕히 가세요'], correct: 0 },
        { question: '"감사합니다" significa:', options: ['Obrigado', 'Olá', 'Tchau', 'Desculpe'], correct: 0 },
        { question: '"안녕히 가세요":', options: ['Tchau (para quem vai)', 'Olá', 'Obrigado', 'Desculpe'], correct: 0 },
        { question: '"죄송합니다" significa:', options: ['Desculpe', 'Obrigado', 'Olá', 'Tchau'], correct: 0 },
        { question: '"만나서 반갑습니다":', options: ['Prazer em conhecer', 'Até logo', 'Bom dia', 'Boa viagem'], correct: 0 },
        { question: '"잘 지내세요?":', options: ['Como vai?', 'Onde mora?', 'Quantos anos?', 'O que come?'], correct: 0 },
        { question: '"네" significa:', options: ['Sim', 'Não', 'Talvez', 'Obrigado'], correct: 0 },
        { question: '"아니요" significa:', options: ['Não', 'Sim', 'Talvez', 'Desculpe'], correct: 0 },
        { question: '🔊 Ouça e escolha:', options: ['Olá', 'Tchau', 'Obrigado', 'Desculpe'], correct: 0, type: 'listen', listenWord: '안녕하세요' },
      ],
      food: [
        { question: '"물 (mul)" significa:', options: ['Água', 'Leite', 'Suco', 'Chá'], correct: 0 },
        { question: '"밥 (bap)" significa:', options: ['Arroz/Refeição', 'Pão', 'Macarrão', 'Carne'], correct: 0 },
        { question: '"김치 (kimchi)" é:', options: ['Kimchi', 'Sopa', 'Salada', 'Carne'], correct: 0 },
        { question: '"고기 (gogi)" significa:', options: ['Carne', 'Peixe', 'Frango', 'Porco'], correct: 0 },
        { question: '"커피 (keopi)" é:', options: ['Café', 'Chá', 'Suco', 'Leite'], correct: 0 },
        { question: '"빵 (ppang)" significa:', options: ['Pão', 'Bolo', 'Biscoito', 'Torta'], correct: 0 },
        { question: '"맛있다 (masitda)":', options: ['Delicioso', 'Feio', 'Quente', 'Frio'], correct: 0 },
        { question: '"라면 (ramyeon)" é:', options: ['Lamen/Ramen', 'Macarrão', 'Sopa', 'Arroz'], correct: 0 },
      ],
      travel: [
        { question: '"공항 (gonghang)":', options: ['Aeroporto', 'Porto', 'Estação', 'Hotel'], correct: 0 },
        { question: '"역 (yeok)" significa:', options: ['Estação', 'Casa', 'Escola', 'Empresa'], correct: 0 },
        { question: '"호텔 (hotel)" é:', options: ['Hotel', 'Hospital', 'Casa', 'Loja'], correct: 0 },
        { question: '"기차 (gicha)" significa:', options: ['Trem', 'Carro', 'Ônibus', 'Avião'], correct: 0 },
        { question: '"표 (pyo)" significa:', options: ['Passagem/Ticket', 'Tabela', 'Papel', 'Cartão'], correct: 0 },
        { question: '"지도 (jido)" significa:', options: ['Mapa', 'Chão', 'Parede', 'Teto'], correct: 0 },
        { question: '"여행 (yeohaeng)":', options: ['Viagem', 'Caminhada', 'Corrida', 'Aventura'], correct: 0 },
        { question: '"여권 (yeogwon)":', options: ['Passaporte', 'Permissão', 'Documento', 'Identidade'], correct: 0 },
      ],
      work: [
        { question: '"회의 (hoeui)" significa:', options: ['Reunião', 'Empresa', 'Escola', 'Casa'], correct: 0 },
        { question: '"일 (il)" significa:', options: ['Trabalho', 'Um', 'Dia', 'Sol'], correct: 0 },
        { question: '"사무실 (samusil)":', options: ['Escritório', 'Sala', 'Quarto', 'Loja'], correct: 0 },
        { question: '"상사 (sangsa)" significa:', options: ['Chefe', 'Colega', 'Amigo', 'Cliente'], correct: 0 },
        { question: '"월급 (wolgeup)":', options: ['Salário', 'Mês', 'Prêmio', 'Bônus'], correct: 0 },
        { question: '"동료 (dongnyo)":', options: ['Colega', 'Amigo', 'Parente', 'Vizinho'], correct: 0 },
        { question: '"회사 (hoesa)" significa:', options: ['Empresa', 'Reunião', 'Sociedade', 'Associação'], correct: 0 },
        { question: '"마감 (magam)" significa:', options: ['Prazo', 'Final', 'Fechamento', 'Término'], correct: 0 },
      ],
      daily: [
        { question: '"집 (jip)" significa:', options: ['Casa', 'Jardim', 'Rua', 'Cidade'], correct: 0 },
        { question: '"가족 (gajok)" significa:', options: ['Família', 'Amigo', 'Vizinho', 'Colega'], correct: 0 },
        { question: '"부엌 (bueok)" significa:', options: ['Cozinha', 'Quarto', 'Banheiro', 'Sala'], correct: 0 },
        { question: '"자다 (jada)" significa:', options: ['Dormir', 'Comer', 'Beber', 'Correr'], correct: 0 },
        { question: '"일어나다 (ireonada)":', options: ['Acordar', 'Levantar', 'Começar', 'Abrir'], correct: 0 },
        { question: '"이웃 (iut)" significa:', options: ['Vizinho', 'Amigo', 'Primo', 'Irmão'], correct: 0 },
        { question: '"방 (bang)" significa:', options: ['Quarto', 'Casa', 'Porta', 'Janela'], correct: 0 },
        { question: '"청소하다 (cheongsohada)":', options: ['Limpar', 'Cozinhar', 'Lavar', 'Secar'], correct: 0 },
      ],
      numbers: [
        { question: '"이십 (isip)" significa:', options: ['Vinte', 'Doze', 'Dois', 'Dez'], correct: 0 },
        { question: '"백 (baek)" significa:', options: ['Cem', 'Dez', 'Mil', 'Um'], correct: 0 },
        { question: '"십오 (sibo)":', options: ['Quinze', 'Cinco', 'Cinquenta', 'Dez'], correct: 0 },
        { question: '"천 (cheon)" significa:', options: ['Mil', 'Cem', 'Dez', 'Milhão'], correct: 0 },
        { question: '"삼십 (samsip)":', options: ['Trinta', 'Três', 'Treze', 'Trezentos'], correct: 0 },
        { question: '"사십 (sasip)":', options: ['Quarenta', 'Quatro', 'Quatorze', 'Quatrocentos'], correct: 0 },
        { question: '"칠십 (chilsip)":', options: ['Setenta', 'Sete', 'Sessenta', 'Seis'], correct: 0 },
        { question: '"구십구 (gusipgu)":', options: ['Noventa e nove', 'Novecentos', 'Noventa', 'Nove'], correct: 0 },
      ],
      animals: [
        { question: '"개 (gae)" significa:', options: ['Cachorro', 'Gato', 'Pássaro', 'Peixe'], correct: 0 },
        { question: '"고양이 (goyangi)":', options: ['Gato', 'Cachorro', 'Coelho', 'Rato'], correct: 0 },
        { question: '"새 (sae)" significa:', options: ['Pássaro', 'Cobra', 'Sapo', 'Macaco'], correct: 0 },
        { question: '"나비 (nabi)" significa:', options: ['Borboleta', 'Navio', 'Nariz', 'Neve'], correct: 0 },
        { question: '"말 (mal)" significa:', options: ['Cavalo', 'Palavra', 'Mel', 'Mar'], correct: 0 },
        { question: '"물고기 (mulgogi)":', options: ['Peixe', 'Água', 'Polvo', 'Caranguejo'], correct: 0 },
        { question: '"토끼 (tokki)" significa:', options: ['Coelho', 'Toupeira', 'Tartaruga', 'Tigre'], correct: 0 },
        { question: '"거북이 (geobuki)":', options: ['Tartaruga', 'Aranha', 'Caracol', 'Cobra'], correct: 0 },
      ],
      colors: [
        { question: '"빨간색 (ppalgansaek)":', options: ['Vermelho', 'Azul', 'Verde', 'Amarelo'], correct: 0 },
        { question: '"파란색 (paransaek)":', options: ['Azul', 'Branco', 'Preto', 'Roxo'], correct: 0 },
        { question: '"초록색 (choroksaek)":', options: ['Verde', 'Cinza', 'Marrom', 'Rosa'], correct: 0 },
        { question: '"노란색 (noransaek)":', options: ['Amarelo', 'Branco', 'Preto', 'Laranja'], correct: 0 },
        { question: '"검은색 (geomeunsaek)":', options: ['Preto', 'Branco', 'Cinza', 'Marrom'], correct: 0 },
        { question: '"흰색 (huinsaek)":', options: ['Branco', 'Preto', 'Azul', 'Verde'], correct: 0 },
        { question: '"분홍색 (bunhongsaek)":', options: ['Rosa', 'Vermelho', 'Roxo', 'Laranja'], correct: 0 },
        { question: '"보라색 (borasaek)":', options: ['Roxo', 'Rosa', 'Azul', 'Verde'], correct: 0 },
      ],
    },
    pt: {
      greetings: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      food: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      travel: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      work: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      daily: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      numbers: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      animals: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
      colors: [{ question: 'Este é seu idioma nativo!', options: ['OK'], correct: 0 }],
    },
  },
  // For other native languages, create a fallback that uses the course language data from pt
  // and just wraps it. In production you'd fully translate each one.
  it: {
    en: {
      greetings: [
        { question: 'Come si dice "Ciao" in inglese?', options: ['Hello', 'Goodbye', 'Thanks', 'Please'], correct: 0 },
        { question: 'Completa: "Nice to ___ you"', options: ['meet', 'see', 'eat', 'have'], correct: 0 },
        { question: '"How are you?" rispondi:', options: ["I'm fine", "I'm hello", "I'm name", "I'm house"], correct: 0 },
        { question: '"Good evening" significa:', options: ['Buonasera', 'Buongiorno', 'Buon pomeriggio', 'Arrivederci'], correct: 0 },
        { question: '"Good morning" significa:', options: ['Buongiorno', 'Buonasera', 'Buonanotte', 'Arrivederci'], correct: 0 },
        { question: '"See you later" significa:', options: ['A dopo', 'A domani', 'Arrivederci', 'Ciao'], correct: 0 },
        { question: '"Excuse me" significa:', options: ['Scusi', 'Grazie', 'Prego', 'Ciao'], correct: 0 },
        { question: '"My name is..." significa:', options: ['Mi chiamo...', 'Il mio nome...', 'Io sono...', 'Mi presento...'], correct: 0 },
        { question: '🔊 Ascolta e scegli:', options: ['Ciao', 'Arrivederci', 'Grazie', 'Scusa'], correct: 0, type: 'listen', listenWord: 'Hello' },
        { question: 'Cosa è questo?', options: ['Handshake (Stretta di mano)', 'Hug (Abbraccio)', 'Wave (Saluto)', 'Bow (Inchino)'], correct: 0, type: 'whatis', emoji: '🤝' },
      ],
      food: [
        { question: '"Acqua" in inglese:', options: ['Water', 'Wine', 'Juice', 'Milk'], correct: 0 },
        { question: '"I would like ___"', options: ['a coffee', 'a table', 'a house', 'a car'], correct: 0 },
        { question: '"Bread" in italiano:', options: ['Pane', 'Torta', 'Riso', 'Fagioli'], correct: 0 },
        { question: '"Breakfast" significa:', options: ['Colazione', 'Pranzo', 'Cena', 'Merenda'], correct: 0 },
        { question: '"Chicken" significa:', options: ['Pollo', 'Pesce', 'Maiale', 'Manzo'], correct: 0 },
        { question: '"Cheese" significa:', options: ['Formaggio', 'Cioccolato', 'Fragola', 'Funghi'], correct: 0 },
        { question: '"Ice cream" significa:', options: ['Gelato', 'Ghiaccio', 'Gelo', 'Giacca'], correct: 0 },
        { question: '"Dessert" significa:', options: ['Dolce', 'Deserto', 'Destino', 'Dente'], correct: 0 },
        { question: '🔊 Ascolta e scegli:', options: ['Acqua', 'Latte', 'Succo', 'Vino'], correct: 0, type: 'listen', listenWord: 'Water' },
        { question: 'Cosa è questo?', options: ['Pizza', 'Hamburger', 'Insalata', 'Zuppa'], correct: 0, type: 'whatis', emoji: '🍕' },
      ],
      travel: [
        { question: '"Aeroporto" in inglese:', options: ['Airport', 'Station', 'Hotel', 'Beach'], correct: 0 },
        { question: '"Where is the ___?"', options: ['hotel', 'hello', 'food', 'water'], correct: 0 },
        { question: '"Ticket" in italiano:', options: ['Biglietto', 'Tavolo', 'Letto', 'Porta'], correct: 0 },
        { question: '"Luggage" significa:', options: ['Bagaglio', 'Cibo', 'Denaro', 'Mappa'], correct: 0 },
        { question: '"How much does it cost?":', options: ['Quanto costa?', "Dov'è?", 'Quando arriva?', 'Come va?'], correct: 0 },
        { question: '"Passport" significa:', options: ['Passaporto', 'Passaggio', 'Passerella', 'Passato'], correct: 0 },
        { question: '"Flight" significa:', options: ['Volo', 'Volley', 'Festa', 'Film'], correct: 0 },
        { question: '"Train" significa:', options: ['Treno', 'Allenamento', 'Traccia', 'Trauma'], correct: 0 },
        { question: '"Beach" significa:', options: ['Spiaggia', 'Pesca', 'Panchina', 'Piazza'], correct: 0 },
      ],
      work: [
        { question: '"Riunione" in inglese:', options: ['Meeting', 'Party', 'Lunch', 'Break'], correct: 0 },
        { question: '"I need to ___ a report"', options: ['write', 'eat', 'sleep', 'play'], correct: 0 },
        { question: '"Deadline" in italiano:', options: ['Scadenza', 'Festa', 'Pranzo', 'Pausa'], correct: 0 },
        { question: '"Colleague" significa:', options: ['Collega', 'Capo', 'Cliente', 'Amico'], correct: 0 },
        { question: '"Salary" significa:', options: ['Stipendio', 'Sala', 'Sale', 'Salute'], correct: 0 },
        { question: '"Office" significa:', options: ['Ufficio', 'Ufficiale', 'Offerta', 'Ufficio postale'], correct: 0 },
        { question: '"Interview" significa:', options: ['Colloquio', 'Intervallo', 'Interesse', 'Interno'], correct: 0 },
        { question: '"Boss" significa:', options: ['Capo', 'Ragazzo', 'Amico', 'Padre'], correct: 0 },
        { question: '"Resign" significa:', options: ['Dimettersi', 'Firmare', 'Disegnare', 'Rassegnare'], correct: 0 },
      ],
      daily: [
        { question: '"Casa" in inglese:', options: ['House', 'Car', 'Dog', 'Cat'], correct: 0 },
        { question: '"I ___ every morning"', options: ['wake up', 'sleep', 'eat', 'run'], correct: 0 },
        { question: '"Family" in italiano:', options: ['Famiglia', 'Amico', 'Vicino', 'Collega'], correct: 0 },
        { question: '"To clean" significa:', options: ['Pulire', 'Cucinare', 'Dormire', 'Correre'], correct: 0 },
        { question: '"Bathroom" significa:', options: ['Bagno', 'Camera', 'Cucina', 'Sala'], correct: 0 },
        { question: '"Kitchen" significa:', options: ['Cucina', 'Camera', 'Bagno', 'Giardino'], correct: 0 },
        { question: '"Neighbor" significa:', options: ['Vicino', 'Amico', 'Parente', 'Collega'], correct: 0 },
        { question: '"Bedroom" significa:', options: ['Camera da letto', 'Bagno', 'Cucina', 'Sala'], correct: 0 },
        { question: '"Garden" significa:', options: ['Giardino', 'Garage', 'Porta', 'Finestra'], correct: 0 },
      ],
      numbers: [
        { question: '"Venti" in inglese:', options: ['Twenty', 'Twelve', 'Two', 'Ten'], correct: 0 },
        { question: '"One hundred" in italiano:', options: ['Cento', 'Dieci', 'Mille', 'Uno'], correct: 0 },
        { question: 'Come si dice 15?', options: ['Fifteen', 'Fifty', 'Five', 'Fourteen'], correct: 0 },
        { question: '"Thousand" significa:', options: ['Mille', 'Cento', 'Dieci', 'Milione'], correct: 0 },
        { question: '"Thirty" significa:', options: ['Trenta', 'Tre', 'Tredici', 'Trecento'], correct: 0 },
        { question: '"Fifty" significa:', options: ['Cinquanta', 'Cinque', 'Quindici', 'Cinquecento'], correct: 0 },
        { question: '"Seventy" significa:', options: ['Settanta', 'Sette', 'Sessanta', 'Sei'], correct: 0 },
        { question: '"Ninety-nine" significa:', options: ['Novantanove', 'Novecento', 'Novanta', 'Nove'], correct: 0 },
      ],
      animals: [
        { question: '"Cane" in inglese:', options: ['Dog', 'Cat', 'Bird', 'Fish'], correct: 0 },
        { question: '"Cat" in italiano:', options: ['Gatto', 'Ratto', 'Pato', 'Rospo'], correct: 0 },
        { question: '"Bird" significa:', options: ['Uccello', 'Orso', 'Serpente', 'Pesce'], correct: 0 },
        { question: '"Butterfly" significa:', options: ['Farfalla', 'Libellula', 'Ape', 'Formica'], correct: 0 },
        { question: '"Horse" significa:', options: ['Cavallo', 'Mucca', 'Pecora', 'Maiale'], correct: 0 },
        { question: '"Shark" significa:', options: ['Squalo', 'Balena', 'Delfino', 'Polpo'], correct: 0 },
        { question: '"Rabbit" significa:', options: ['Coniglio', 'Canguro', 'Koala', 'Orso'], correct: 0 },
        { question: '"Turtle" significa:', options: ['Tartaruga', 'Rana', 'Lucertola', 'Serpente'], correct: 0 },
      ],
      colors: [
        { question: '"Rosso" in inglese:', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 0 },
        { question: '"Blue" in italiano:', options: ['Blu', 'Giallo', 'Verde', 'Viola'], correct: 0 },
        { question: '"Green" significa:', options: ['Verde', 'Grigio', 'Marrone', 'Bianco'], correct: 0 },
        { question: '"Giallo" in inglese:', options: ['Yellow', 'Orange', 'Purple', 'Pink'], correct: 0 },
        { question: '"Purple" significa:', options: ['Viola', 'Rosa', 'Nero', 'Bianco'], correct: 0 },
        { question: '"Nero" in inglese:', options: ['Black', 'White', 'Gray', 'Brown'], correct: 0 },
        { question: '"Orange" significa:', options: ['Arancione', 'Limone', 'Pesca', 'Mango'], correct: 0 },
        { question: '"Pink" significa:', options: ['Rosa', 'Rosso', 'Viola', 'Pesca'], correct: 0 },
      ],
    },
  },
};

// Writing/speaking exercises (shared, using emojis as "photos")
const writingExercises: Record<string, Record<string, Exercise[]>> = {
  pt: {
    en: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'apple' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'dog' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'house' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'write', answer: 'sun' },
      { question: '', emoji: '🚗', options: [], correct: 0, type: 'write', answer: 'car' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'book' },
      { question: '', emoji: '🌊', options: [], correct: 0, type: 'speak', answer: 'water' },
      { question: '', emoji: '🌙', options: [], correct: 0, type: 'speak', answer: 'moon' },
      { question: '', emoji: '🎸', options: [], correct: 0, type: 'speak', answer: 'guitar' },
      { question: '', emoji: '✈️', options: [], correct: 0, type: 'speak', answer: 'airplane' },
    ],
    es: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'manzana' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'perro' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'casa' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'write', answer: 'sol' },
      { question: '', emoji: '🚗', options: [], correct: 0, type: 'write', answer: 'carro' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'libro' },
      { question: '', emoji: '🌊', options: [], correct: 0, type: 'speak', answer: 'agua' },
      { question: '', emoji: '🌙', options: [], correct: 0, type: 'speak', answer: 'luna' },
    ],
    fr: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'pomme' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'chien' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'maison' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'write', answer: 'soleil' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'livre' },
      { question: '', emoji: '🌊', options: [], correct: 0, type: 'speak', answer: 'eau' },
    ],
    de: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'Apfel' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'Hund' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'Haus' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'write', answer: 'Sonne' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'Buch' },
      { question: '', emoji: '🌊', options: [], correct: 0, type: 'speak', answer: 'Wasser' },
    ],
    it: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'mela' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'cane' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'casa' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'write', answer: 'sole' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'libro' },
    ],
    ja: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'りんご' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'いぬ' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'いえ' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'speak', answer: 'たいよう' },
    ],
    pt: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'maçã' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'cachorro' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'casa' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'speak', answer: 'sol' },
    ],
    ko: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: '사과' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: '개' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: '집' },
      { question: '', emoji: '☀️', options: [], correct: 0, type: 'speak', answer: '태양' },
    ],
  },
  en: {
    es: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'manzana' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'perro' },
      { question: '', emoji: '🏠', options: [], correct: 0, type: 'write', answer: 'casa' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'libro' },
    ],
    fr: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'pomme' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'chien' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'livre' },
    ],
    de: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'Apfel' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'Hund' },
      { question: '', emoji: '📚', options: [], correct: 0, type: 'speak', answer: 'Buch' },
    ],
    it: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'mela' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'cane' },
    ],
    ja: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'りんご' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'いぬ' },
    ],
    pt: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: 'maçã' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: 'cachorro' },
    ],
    ko: [
      { question: '', emoji: '🍎', options: [], correct: 0, type: 'write', answer: '사과' },
      { question: '', emoji: '🐕', options: [], correct: 0, type: 'write', answer: '개' },
    ],
    en: [],
  },
};

// Universal fallback: try native→course, then pt→course, then any lang→course, then pt→en
const getFallbackExercises = (nativeLang: string, course: string, category: string): Exercise[] => {
  if (category === 'writing') {
    return writingExercises[nativeLang]?.[course] 
      || writingExercises.pt?.[course] 
      || writingExercises.en?.[course]
      || writingExercises.pt?.en || [];
  }
  // Try exact match first
  const exact = allExercises[nativeLang]?.[course]?.[category];
  if (exact && exact.length > 0) return exact;
  // Try pt as native with same course
  const ptCourse = allExercises.pt?.[course]?.[category];
  if (ptCourse && ptCourse.length > 0) return ptCourse;
  // Try en as native with same course  
  const enCourse = allExercises.en?.[course]?.[category];
  if (enCourse && enCourse.length > 0) return enCourse;
  // Try any native lang that has this course
  for (const nl of Object.keys(allExercises)) {
    const data = allExercises[nl]?.[course]?.[category];
    if (data && data.length > 0) return data;
  }
  // Ultimate fallback: pt→en
  return allExercises.pt?.en?.[category] || [];
};

const ExercisesTab = () => {
  const { course, nativeLang, level, completeExercise } = useApp();
  const tr = useTranslation(nativeLang);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [writeAnswer, setWriteAnswer] = useState('');
  const [writeResult, setWriteResult] = useState<'correct' | 'wrong' | null>(null);

  const rawExercises = useMemo(() => {
    if (!selectedCat) return [];
    if (selectedCat === 'writing') {
      return getFallbackExercises(nativeLang, course, 'writing');
    }
    const leveled = getExercisesForLevel(nativeLang, course, selectedCat, level);
    return leveled.length > 0 ? leveled : getFallbackExercises(nativeLang, course, selectedCat);
  }, [selectedCat, nativeLang, course, level]);

  // Shuffle exercises once when category is selected
  const exercises = useMemo(() => rawExercises.map(ex => shuffleExercise(ex)), [rawExercises]);
  const current = exercises[currentIdx];

  const langMap: Record<string, string> = {
    en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', it: 'it-IT', ja: 'ja-JP', pt: 'pt-BR', ko: 'ko-KR'
  };

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[course] || 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }, [course]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowFeedback(true);
    const correct = idx === current.correct;
    if (correct) setScore(s => s + 1);
    completeExercise(correct);

    setTimeout(() => {
      if (currentIdx < exercises.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelected(null);
        setShowFeedback(false);
        setWriteAnswer('');
        setWriteResult(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const handleWriteSubmit = () => {
    if (!writeAnswer.trim() || !current.answer) return;
    const correct = writeAnswer.trim().toLowerCase() === current.answer.toLowerCase();
    setWriteResult(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    completeExercise(correct);

    setTimeout(() => {
      if (currentIdx < exercises.length - 1) {
        setCurrentIdx(c => c + 1);
        setWriteAnswer('');
        setWriteResult(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  };

  const handleSpeakSubmit = () => {
    // Use speech recognition if available, otherwise fallback to write
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = langMap[course] || 'en-US';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const correct = transcript.includes(current.answer?.toLowerCase() || '');
        setWriteResult(correct ? 'correct' : 'wrong');
        setWriteAnswer(transcript);
        if (correct) setScore(s => s + 1);
        completeExercise(correct);

        setTimeout(() => {
          if (currentIdx < exercises.length - 1) {
            setCurrentIdx(c => c + 1);
            setWriteAnswer('');
            setWriteResult(null);
          } else {
            setFinished(true);
          }
        }, 1200);
      };
      recognition.onerror = () => {
        // Fallback: treat as text input
        handleWriteSubmit();
      };
      recognition.start();
    } else {
      handleWriteSubmit();
    }
  };

  const handleBack = () => {
    setSelectedCat(null);
    setCurrentIdx(0);
    setSelected(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setWriteAnswer('');
    setWriteResult(null);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-center">
          <span className="text-7xl block mb-4">🎉</span>
          <h2 className="text-2xl font-black text-foreground mb-2">{tr('congrats')}</h2>
          <p className="text-muted-foreground mb-6">{tr('you_scored')} {score} {tr('of')} {exercises.length}!</p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
            {tr('continue')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!selectedCat) {
    return (
      <div className="space-y-5 pb-4">
        <div className="text-center mb-2">
          <span className="text-4xl">📝</span>
          <h2 className="text-2xl font-black text-foreground">{tr('exercises_title')}</h2>
          <p className="text-sm text-muted-foreground">{tr('level')} {level} · {tr('choose_category')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedCat(cat.id)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="text-4xl block mb-2">{cat.emoji}</span>
              <p className="font-bold text-foreground">{tr(cat.nameKey)}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tr('no_exercises') || 'Nenhum exercício disponível ainda.'}</p>
        <button onClick={handleBack} className="mt-4 bg-primary text-primary-foreground font-bold px-6 py-2 rounded-full">
          {tr('back') || 'Voltar'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={handleBack} className="text-foreground hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-muted-foreground">{currentIdx + 1}/{exercises.length}</span>
            <span className="font-bold text-primary">🏆 {score}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${((currentIdx + 1) / exercises.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>

          {/* Write/Speak type */}
          {(current.type === 'write' || current.type === 'speak') && current.emoji && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center bg-card border-2 border-primary/30 rounded-2xl p-8 mb-3">
                <span className="text-8xl">{current.emoji}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                {current.type === 'write' ? <PenLine size={18} /> : <Mic size={18} />}
                <span className="text-sm font-bold">
                  {current.type === 'write'
                    ? (tr('write_what_you_see') || 'Escreva o que você vê!')
                    : (tr('speak_what_you_see') || 'Fale o que você vê!')}
                </span>
              </div>
              <div className="max-w-xs mx-auto space-y-3">
                <input
                  type="text"
                  value={writeAnswer}
                  onChange={e => setWriteAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (current.type === 'write' ? handleWriteSubmit() : handleSpeakSubmit())}
                  placeholder={current.type === 'write' ? (tr('type_answer') || 'Digite a resposta...') : (tr('type_or_speak') || 'Digite ou clique no microfone...')}
                  className={`w-full bg-card border-2 rounded-xl px-4 py-3 text-foreground font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary ${
                    writeResult === 'correct' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                    writeResult === 'wrong' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-border'
                  }`}
                  disabled={writeResult !== null}
                />
                {writeResult === 'wrong' && (
                  <p className="text-sm text-red-500 font-bold">
                    {tr('correct_answer') || 'Resposta correta'}: <span className="text-foreground">{current.answer}</span>
                  </p>
                )}
                {writeResult === null && (
                  <div className="flex gap-2">
                    <button
                      onClick={current.type === 'write' ? handleWriteSubmit : handleWriteSubmit}
                      className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl active:scale-95 transition-transform"
                    >
                      {tr('confirm') || 'Confirmar'}
                    </button>
                    {current.type === 'speak' && (
                      <button
                        onClick={handleSpeakSubmit}
                        className="bg-primary/10 text-primary p-3 rounded-xl hover:bg-primary/20 transition-colors active:scale-95"
                      >
                        <Mic size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What is this - show emoji */}
          {current.type === 'whatis' && current.emoji && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center bg-card border-2 border-primary/30 rounded-2xl p-6 mb-2">
                <span className="text-7xl">{current.emoji}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Eye size={18} />
                <span className="text-sm font-bold">{tr('what_is_this') || 'O que é isso?'}</span>
              </div>
            </div>
          )}

          {/* Listen - show audio button */}
          {current.type === 'listen' && current.listenWord && (
            <div className="text-center mb-4">
              <button
                onClick={() => speak(current.listenWord!)}
                className="inline-flex flex-col items-center gap-3 bg-primary/10 rounded-2xl p-6 border-2 border-primary/30 hover:bg-primary/20 transition-colors active:scale-95"
              >
                <Volume2 size={48} className="text-primary" />
                <span className="font-bold text-primary text-sm">{tr('tap_to_listen')}</span>
              </button>
            </div>
          )}

          {/* Multiple choice questions */}
          {current.type !== 'write' && current.type !== 'speak' && (
            <>
              <h3 className="text-xl font-black text-foreground mb-6 text-center">{current.question}</h3>
              <div className="space-y-3">
                {current.options.map((opt, i) => {
                  let bg = 'bg-card border-border';
                  if (showFeedback) {
                    if (i === current.correct) bg = 'bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600';
                    else if (i === selected) bg = 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all active:scale-[0.98] flex items-center justify-between ${bg}`}
                    >
                      <span className="text-foreground">{opt}</span>
                      {showFeedback && i === current.correct && <Check className="text-green-500" size={20} />}
                      {showFeedback && i === selected && i !== current.correct && <X className="text-red-500" size={20} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExercisesTab;
