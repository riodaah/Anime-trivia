import { useState, useEffect } from 'react';
import GameScreen from '@/components/game/GameScreen';
import Leaderboard from '@/components/game/Leaderboard';
import LoadingScreen from '@/components/game/LoadingScreen';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { submitScore } from '@/lib/leaderboardApi';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Score {
  nickname: string;
  score: number;
}

interface GameLayoutFrameProps {
  allQuestions: Question[];
  nickname: string;
  onGameOver: () => void;
}

export const GameLayoutFrame = ({ allQuestions, nickname, onGameOver }: GameLayoutFrameProps) => {
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'gameOver'>('loading');
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setGameState('playing');
    }, 1000);

    // Suscribirse a scores en tiempo real
    const q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scoresData: Score[] = [];
      querySnapshot.forEach((doc) => {
        scoresData.push(doc.data() as Score);
      });
      setScores(scoresData);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const handleGameOver = async (score: number) => {
    setLastScore(score);
    setCurrentScore(score);
    setGameState('gameOver');

    // Guardar puntuación
    try {
      await submitScore({
        nickname,
        score,
      });
    } catch (error) {
      console.error('Error al guardar puntuación:', error);
    }
  };

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  const handleRestart = () => {
    setGameState('playing');
    setLastScore(null);
    setCurrentScore(0);
  };

  if (gameState === 'loading') {
    return <LoadingScreen />;
  }

  if (gameState === 'gameOver') {
    return (
      <div className="max-w-4xl mx-auto">
        <Leaderboard
          onRestart={handleRestart}
          lastScore={lastScore}
          nickname={nickname}
          scores={scores}
          onBackToHome={onGameOver}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <GameScreen
          allQuestions={allQuestions}
          onGameOver={handleGameOver}
          onScoreUpdate={handleScoreUpdate}
          scores={scores}
          nickname={nickname}
        />
      </div>
      <div className="lg:col-span-1">
        <Leaderboard
          onRestart={handleRestart}
          lastScore={null}
          nickname={nickname}
          scores={scores}
          currentScore={currentScore}
        />
      </div>
    </div>
  );
};

