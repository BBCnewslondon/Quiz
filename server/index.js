const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : ""
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

const quizData = [
    {
        question: "How many hearts does an octopus have?",
        answer: "3",
        options: ["3", "1", "2", "4"]
    },
    {
        question: "What is the largest desert?",
        answer: "Antarctica",
        options: ["Antarctica", "Sahara", "Gobi", "Kalahari"]
    },
    {
        question: "What does Volkswagen, the German car, mean in English?",
        answer: "The people's car",
        options: ["The people's car", "The fast car", "The strong car", "The family car"]
    },
    {
        question: "In what month is the official first day of summer in the northern Hemisphere?",
        answer: "June",
        options: ["June", "May", "July", "August"]
    },
    {
        question: "In the Heinz slogan, how many varieties are they famous for?",
        answer: "57",
        options: ["57", "47", "67", "75"]
    },
    {
        question: "What is the name of the 4 pointed pattern on a screwdriver?",
        answer: "Philips head",
        options: ["Philips head", "Flat head", "Torx", "Hex"]
    },
    {
        question: "What is the colloquial name of a New Zealander?",
        answer: "Kiwi",
        options: ["Kiwi", "Aussie", "Roo", "Emu"]
    },
    {
        question: "Which mythological creature lends its name to a US city, Irish park and Harry Potter?",
        answer: "Phoenix",
        options: ["Phoenix", "Dragon", "Griffin", "Unicorn"]
    },
    {
        question: "What are baby owls called?",
        answer: "Owlets (or Nestlings)",
        options: ["Owlets (or Nestlings)", "Chicks", "Pups", "Cubs"]
    },
    {
        question: "Which colours do most colourblind people struggle to distinguish?",
        answer: "Red and Green",
        options: ["Red and Green", "Blue and Yellow", "Black and White", "Orange and Purple"]
    },
    {
        question: "What is Alektorophobia a fear of?",
        answer: "Chickens",
        options: ["Chickens", "Spiders", "Heights", "Darkness"]
    },
    {
        question: "Which country consumes the most chocolate per capita?",
        answer: "Switzerland",
        options: ["Switzerland", "Belgium", "USA", "Germany"]
    },
    {
        question: "How fast does the earth spin?",
        answer: "1000mph",
        options: ["1000mph", "500mph", "2000mph", "100mph"]
    },
    {
        question: "What is the capital of Paraguay?",
        answer: "Asuncion",
        options: ["Asuncion", "Lima", "Montevideo", "Santiago"]
    },
    {
        question: "Mauritius is the only country where the most commonly practiced religion is what?",
        answer: "Hinduism",
        options: ["Hinduism", "Christianity", "Islam", "Buddhism"]
    },
    {
        question: "What is the chemical symbol for Gold?",
        answer: "Au",
        options: ["Au", "Ag", "Fe", "Cu"]
    },
    {
        question: "Which planet is known as the Red Planet?",
        answer: "Mars",
        options: ["Mars", "Venus", "Jupiter", "Saturn"]
    },
    {
        question: "Who painted the Mona Lisa?",
        answer: "Leonardo da Vinci",
        options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"]
    },
    {
        question: "What is the largest mammal in the world?",
        answer: "Blue Whale",
        options: ["Blue Whale", "African Elephant", "Giraffe", "Hippopotamus"]
    },
    {
        question: "How many players are there in a soccer team?",
        answer: "11",
        options: ["11", "10", "12", "9"]
    },
    {
        question: "What is the hardest natural substance on Earth?",
        answer: "Diamond",
        options: ["Diamond", "Gold", "Iron", "Platinum"]
    },
    {
        question: "Which ocean is the largest?",
        answer: "Pacific Ocean",
        options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"]
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        answer: "William Shakespeare",
        options: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"]
    },
    {
        question: "What is the smallest prime number?",
        answer: "2",
        options: ["2", "1", "3", "0"]
    },
    {
        question: "Which element has the atomic number 1?",
        answer: "Hydrogen",
        options: ["Hydrogen", "Helium", "Oxygen", "Carbon"]
    },
    {
        question: "What is the capital of Japan?",
        answer: "Tokyo",
        options: ["Tokyo", "Kyoto", "Osaka", "Seoul"]
    },
    {
        question: "How many continents are there on Earth?",
        answer: "7",
        options: ["7", "5", "6", "8"]
    },
    {
        question: "Which planet is closest to the Sun?",
        answer: "Mercury",
        options: ["Mercury", "Venus", "Earth", "Mars"]
    },
    {
        question: "What is the main ingredient in guacamole?",
        answer: "Avocado",
        options: ["Avocado", "Tomato", "Onion", "Pepper"]
    },
    {
        question: "Who is known as the father of computers?",
        answer: "Charles Babbage",
        options: ["Charles Babbage", "Alan Turing", "Bill Gates", "Steve Jobs"]
    },
    {
        question: "What is the largest organ in the human body?",
        answer: "Skin",
        options: ["Skin", "Liver", "Heart", "Brain"]
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answer: "Japan",
        options: ["Japan", "China", "South Korea", "Thailand"]
    },
    {
        question: "What is the chemical symbol for water?",
        answer: "H2O",
        options: ["H2O", "CO2", "O2", "NaCl"]
    },
    {
        question: "Who discovered penicillin?",
        answer: "Alexander Fleming",
        options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Isaac Newton"]
    },
    {
        question: "What is the tallest mountain in the world?",
        answer: "Mount Everest",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"]
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        answer: "Carbon Dioxide",
        options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"]
    },
    {
        question: "What is the currency of the United Kingdom?",
        answer: "Pound Sterling",
        options: ["Pound Sterling", "Euro", "Dollar", "Yen"]
    },
    {
        question: "Who was the first person to walk on the Moon?",
        answer: "Neil Armstrong",
        options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"]
    },
    {
        question: "What is the study of mushrooms called?",
        answer: "Mycology",
        options: ["Mycology", "Biology", "Botany", "Zoology"]
    },
    {
        question: "How many bones are in the adult human body?",
        answer: "206",
        options: ["206", "205", "201", "210"]
    },
    {
        question: "Which planet has the most moons?",
        answer: "Saturn",
        options: ["Saturn", "Jupiter", "Uranus", "Neptune"]
    },
    {
        question: "What is the chemical symbol for Iron?",
        answer: "Fe",
        options: ["Fe", "Ir", "In", "Au"]
    },
    {
        question: "Who painted the Starry Night?",
        answer: "Vincent van Gogh",
        options: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dali"]
    },
    {
        question: "What is the longest river in the world?",
        answer: "Nile",
        options: ["Nile", "Amazon", "Yangtze", "Mississippi"]
    },
    {
        question: "Which country is home to the kangaroo?",
        answer: "Australia",
        options: ["Australia", "New Zealand", "South Africa", "Brazil"]
    },
    {
        question: "What is the speed of light?",
        answer: "299,792,458 m/s",
        options: ["299,792,458 m/s", "300,000,000 m/s", "150,000,000 m/s", "1,000,000 m/s"]
    },
    {
        question: "Who is the author of Harry Potter?",
        answer: "J.K. Rowling",
        options: ["J.K. Rowling", "J.R.R. Tolkien", "George R.R. Martin", "Stephen King"]
    },
    {
        question: "What is the capital of Canada?",
        answer: "Ottawa",
        options: ["Ottawa", "Toronto", "Vancouver", "Montreal"]
    },
    {
        question: "Which element is needed for combustion?",
        answer: "Oxygen",
        options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon"]
    },
    {
        question: "What is the largest bird in the world?",
        answer: "Ostrich",
        options: ["Ostrich", "Emu", "Eagle", "Albatross"]
    }
];

// Helper to generate room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('create_room', (data) => {
    const roomCode = generateRoomCode();
    rooms.set(roomCode, {
      players: [],
      gameState: 'waiting', // waiting, playing, finished
      currentQuestionIndex: 0,
      questions: [], 
      scores: {},
      answeredPlayers: new Set(),
      questionTimeout: null
    });
    socket.join(roomCode);
    // Add host as player
    rooms.get(roomCode).players.push({ id: socket.id, name: data.name, score: 0 });
    socket.emit('room_created', roomCode);
    io.to(roomCode).emit('update_players', rooms.get(roomCode).players);
  });

  socket.on('join_room', (data) => {
    const { roomCode, name } = data;
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      if (room.players.length < 12 && room.gameState === 'waiting') {
        socket.join(roomCode);
        room.players.push({ id: socket.id, name, score: 0 });
        socket.emit('room_joined', roomCode);
        io.to(roomCode).emit('update_players', room.players);
      } else {
        socket.emit('error', 'Room is full or game started');
      }
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('start_game', (roomCode) => {
    if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);
        room.gameState = 'playing';
        
        // Generate questions with options from quizData
        room.questions = quizData.map(q => {
            // Shuffle the pre-defined options
            const options = [...q.options].sort(() => 0.5 - Math.random());
            
            return {
                question: q.question,
                options: options,
                answer: q.answer
            };
        });

        // Shuffle the questions themselves so they are in random order
        room.questions = room.questions.sort(() => 0.5 - Math.random());

        io.to(roomCode).emit('game_started');
        sendQuestion(roomCode);
    }
  });

  socket.on('submit_answer', ({ roomCode, answer, timeRemaining }) => {
      const room = rooms.get(roomCode);
      if (room && room.gameState === 'playing') {
          const player = room.players.find(p => p.id === socket.id);
          
          if (room.answeredPlayers.has(socket.id)) return;
          room.answeredPlayers.add(socket.id);

          const currentQuestion = room.questions[room.currentQuestionIndex];
          if (player && currentQuestion && currentQuestion.answer === answer) {
              // Calculate score based on time (max 30s)
              const points = Math.ceil(10 * timeRemaining);
              player.score += points;
          }

          if (room.answeredPlayers.size === room.players.length) {
              clearTimeout(room.questionTimeout);
              endQuestion(roomCode);
          }
      }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    // In a real app, handle player removal and notifying others
    // For MVP, we might leave them in the array but they won't respond
  });
});

function endQuestion(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;

    const question = room.questions[room.currentQuestionIndex];
    io.to(roomCode).emit('question_ended', {
        correctAnswer: question.answer,
        scores: room.players
    });
    
    setTimeout(() => {
        room.currentQuestionIndex++;
        if (room.currentQuestionIndex < room.questions.length) {
            sendQuestion(roomCode);
        } else {
            room.gameState = 'finished';
            io.to(roomCode).emit('game_over', room.players);
        }
    }, 5000); // 5s break between questions
}

function sendQuestion(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    if (room.currentQuestionIndex < room.questions.length) {
        const question = room.questions[room.currentQuestionIndex];
        
        room.answeredPlayers.clear();

        io.to(roomCode).emit('new_question', {
            question: question.question,
            options: question.options,
            timeLimit: 30
        });
        
        // Start timer on server to move to next question
        room.questionTimeout = setTimeout(() => {
            endQuestion(roomCode);
        }, 30000); // 30s per question
    }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});
