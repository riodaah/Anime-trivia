import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import './App.css';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';

interface Score {
  nickname: string;
  score: number;
}

type GameState = 'start' | 'playing' | 'gameOver';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [nickname, setNickname] = useState('');
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('animeTriviaScores') || '[]') as Score[];
    setScores(savedScores);
  }, []);

  const handleStart = (name: string) => {
    setNickname(name);
    setGameState('playing');
    setLastScore(null); // Reset last score for new game
  };

  const handleGameOver = (score: number) => {
    setLastScore(score);
    const updatedScores = [...scores, { nickname, score }];
    const sortedScores = [...updatedScores].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('animeTriviaScores', JSON.stringify(sortedScores));
    setScores(sortedScores); // Update scores state
    setGameState('gameOver');
  };

  const handleScoreUpdate = (currentScore: number) => {
    // This function will be called by GameScreen to update the score in App.tsx
    // For now, we just update the lastScore, but we can make it more dynamic if needed
    setLastScore(currentScore);
  };

  const handleRestart = () => {
    setNickname('');
    setLastScore(null);
    setGameState('start');
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'playing':
        return (
          <Row>
            <Col md={8}>
              <GameScreen onGameOver={handleGameOver} onScoreUpdate={handleScoreUpdate} />
            </Col>
            <Col md={4}>
              <Leaderboard onRestart={handleRestart} lastScore={lastScore} nickname={nickname} scores={scores} />
            </Col>
          </Row>
        );
      case 'gameOver':
        return <Leaderboard onRestart={handleRestart} lastScore={lastScore} nickname={nickname} scores={scores} />;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="App">
      {renderGameState()}
    </div>
  );
}

export default App;