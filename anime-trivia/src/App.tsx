import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import { collection, addDoc, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';
import { Row, Col } from 'react-bootstrap';
import LoadingScreen from './components/LoadingScreen';

import wallpaper1 from './Images/Wallpapers/1.png';
import wallpaper2 from './Images/Wallpapers/2.jpeg';
import wallpaper3 from './Images/Wallpapers/3.jpg';
import wallpaper4 from './Images/Wallpapers/4.jpg';
import wallpaper5 from './Images/Wallpapers/5.png';
import wallpaper6 from './Images/Wallpapers/6.png';
import wallpaper7 from './Images/Wallpapers/7.png';
import wallpaper8 from './Images/Wallpapers/8.png';
import wallpaper9 from './Images/Wallpapers/9.png';


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

  const wallpapers = [
    wallpaper1, wallpaper2, wallpaper3, wallpaper4, wallpaper5,
    wallpaper6, wallpaper7, wallpaper8, wallpaper9
  ];
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);

  useEffect(() => {
    // Precargar imágenes
    wallpapers.forEach(image => {
      new Image().src = image;
    });

    if (!loadingQuestions) {
      document.body.classList.add('body-background');
      const interval = setInterval(() => {
        setCurrentWallpaperIndex(prevIndex => (prevIndex + 1) % wallpapers.length);
      }, 10000); // Cambia la imagen cada 10 segundos
      return () => clearInterval(interval);
    } else {
      document.body.classList.remove('body-background');
    }
  }, [loadingQuestions, wallpapers]);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${wallpapers[currentWallpaperIndex]})`;
  }, [currentWallpaperIndex, wallpapers]);

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
        setTimeout(() => {
          setLoadingQuestions(false);
        }, 500);
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

    return () => {
      unsubscribe();
      document.body.classList.remove('body-background');
    }
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

  if (loadingQuestions) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      {(() => {
        switch (gameState) {
          case 'start':
            return <StartScreen onStart={handleStart} />;
          case 'playing':
            return (
              <Row>
                <Col md={7}>
                  <GameScreen allQuestions={allQuestions} onGameOver={handleGameOver} onScoreUpdate={handleScoreUpdate} scores={scores} nickname={nickname} />
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
      })()}
    </div>
  );
}

export default App;