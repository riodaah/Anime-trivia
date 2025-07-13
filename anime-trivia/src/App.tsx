import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import { collection, addDoc, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';
import { Spinner, Row, Col } from 'react-bootstrap';

interface Score {
  nickname: string;
  score: number;
}

type GameState = 'start' | 'playing' | 'gameOver';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [nickname, setNickname] = useState('');
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    const fetchQuestions = async (): Promise<Question[]> => {
      const questionsCollection = collection(db, 'questions');
      const questionsSnapshot = await getDocs(questionsCollection);
      const questionsList = questionsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Question));
      return questionsList;
    };

    const loadAllQuestions = async () => {
      try {
        const questions = await fetchQuestions();
        setAllQuestions(questions);
      } catch (error) {
        console.error("Error al cargar todas las preguntas:", error);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadAllQuestions();

    const q = query(collection(db, "scores"), orderBy("score", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scoresData: Score[] = [];
      querySnapshot.forEach((doc) => {
        scoresData.push(doc.data() as Score);
      });
      setScores(scoresData);
    });

    return () => unsubscribe();
  }, []);

  const handleStart = (name: string) => {
    setNickname(name);
    setGameState('playing');
    setLastScore(null);
  };

  const handleGameOver = async (score: number) => {
    setLastScore(score);
    await addDoc(collection(db, "scores"), { nickname, score });
    setGameState('gameOver');
  };

  const handleScoreUpdate = (currentScore: number) => {
    setScores(prevScores => {
      const newScores = [...prevScores];
      const playerIndex = newScores.findIndex(s => s.nickname === nickname);
      if (playerIndex !== -1) {
        newScores[playerIndex] = { ...newScores[playerIndex], score: currentScore };
      } else {
        newScores.push({ nickname, score: currentScore });
      }
      return newScores.sort((a, b) => b.score - a.score);
    });
  };

  const handleRestart = () => {
    setNickname('');
    setLastScore(null);
    setGameState('start');
  };

  const renderGameState = () => {
    if (loadingQuestions) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Spinner animation="border" />
        </div>
      );
    }

    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'playing':
        return (
          <Row>
            <Col md={7}>
              <GameScreen allQuestions={allQuestions} onGameOver={handleGameOver} onScoreUpdate={handleScoreUpdate} />
            </Col>
            <Col md={5}>
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

  console.log("App.tsx se está renderizando.");
  return (
    <div className="App">
      {renderGameState()}
    </div>
  );
}

export default App;