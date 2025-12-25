import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3001");

function App() {
  console.log("App rendering...");
  const [gameState, setGameState] = useState('menu'); // menu, lobby, playing, finished
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on('room_created', (code) => {
      setRoomCode(code);
      setGameState('lobby');
    });

    socket.on('room_joined', (code) => {
      setRoomCode(code);
      setGameState('lobby');
    });

    socket.on('update_players', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('error', (msg) => {
      alert(msg);
    });

    socket.on('game_started', () => {
      setGameState('playing');
    });

    socket.on('new_question', (questionData) => {
      setCurrentQuestion(questionData);
      setTimeLeft(questionData.timeLimit);
      setMessage('');
    });

    socket.on('question_ended', (data) => {
      setMessage(`Time's up! Correct answer: ${data.correctAnswer}`);
      setPlayers(data.scores); // Update scores
    });

    socket.on('game_over', (finalPlayers) => {
      setGameState('finished');
      setLeaderboard(finalPlayers.sort((a, b) => b.score - a.score));
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('update_players');
      socket.off('error');
      socket.off('game_started');
      socket.off('new_question');
      socket.off('question_ended');
      socket.off('game_over');
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && currentQuestion && !message) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, currentQuestion, message]);

  const createRoom = () => {
    if (name) {
      socket.emit('create_room', { name, numQuestions });
    } else {
      alert("Please enter your name");
    }
  };

  const joinRoom = () => {
    if (name && roomCode) {
      socket.emit('join_room', { name, roomCode });
    } else {
      alert("Please enter name and room code");
    }
  };

  const startGame = () => {
    socket.emit('start_game', roomCode);
  };

  const submitAnswer = (answer) => {
    socket.emit('submit_answer', { roomCode, answer, timeRemaining: timeLeft });
    setMessage('Answer submitted! Waiting for others...');
  };

  console.log("Rendering App. GameState:", gameState);

  return (
    <div className="App">
      <h1>Quiz Game</h1>
      
      {gameState === 'menu' && (
        <div className="menu">
          <div className="input-group">
            <input 
              placeholder="Enter Name" 
              onChange={(e) => setName(e.target.value)} 
            />
            <div className="settings-group">
              <label>Questions:</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(Number(e.target.value))} 
              />
            </div>
            <button onClick={createRoom}>Create Room</button>
          </div>
          <div className="input-group">
            <input 
              placeholder="Room Code" 
              onChange={(e) => setRoomCode(e.target.value)} 
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        </div>
      )}

      {gameState === 'lobby' && (
        <div className="lobby">
          <h2>Room Code: {roomCode}</h2>
          <h3>Players:</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
          {players.length > 0 && players[0].id === socket.id && (
             <button onClick={startGame}>Start Game</button>
          )}
          <p>Waiting for host to start...</p>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game">
          <div className="timer">Time Left: {timeLeft}s</div>
          {message && <div className="message">{message}</div>}
          
          {currentQuestion && (
            <div className="question-card">
              <h2>{currentQuestion.question}</h2>
              <div className="options">
                {currentQuestion.options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => submitAnswer(opt)}
                    disabled={!!message}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="scoreboard">
             <h3>Live Scores</h3>
             <ul>
                {players.map((p, i) => (
                    <li key={i}>{p.name}: {p.score}</li>
                ))}
             </ul>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="leaderboard-container">
          <h2>Game Over!</h2>
          
          <div className="podium">
            {/* 2nd Place */}
            {leaderboard.length > 1 && (
              <div className="podium-step second">
                <div className="avatar">{leaderboard[1].name.charAt(0).toUpperCase()}</div>
                <div className="bar">2</div>
                <div className="name">{leaderboard[1].name}</div>
                <div className="score">{leaderboard[1].score} pts</div>
              </div>
            )}

            {/* 1st Place */}
            {leaderboard.length > 0 && (
              <div className="podium-step first">
                <div className="crown">👑</div>
                <div className="avatar">{leaderboard[0].name.charAt(0).toUpperCase()}</div>
                <div className="bar">1</div>
                <div className="name">{leaderboard[0].name}</div>
                <div className="score">{leaderboard[0].score} pts</div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboard.length > 2 && (
              <div className="podium-step third">
                <div className="avatar">{leaderboard[2].name.charAt(0).toUpperCase()}</div>
                <div className="bar">3</div>
                <div className="name">{leaderboard[2].name}</div>
                <div className="score">{leaderboard[2].score} pts</div>
              </div>
            )}
          </div>

          <div className="results-list">
            <h3>Full Results</h3>
            <ul>
              {leaderboard.slice(3).map((p, i) => (
                <li key={i + 3} className="result-item">
                  <span className="rank">#{i + 4}</span>
                  <span className="name">{p.name}</span>
                  <span className="score">{p.score} pts</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button onClick={() => window.location.reload()} className="play-again-btn">Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
