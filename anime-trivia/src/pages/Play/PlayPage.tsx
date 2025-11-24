import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { GameLayoutFrame } from './components/GameLayoutFrame';
import { GameSelector } from './components/GameSelector';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  anime?: string;
  difficulty?: string;
}

export default function PlayPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnime, setSelectedAnime] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [gameStarted, setGameStarted] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsCollection = collection(db, 'questions');
        const questionsSnapshot = await getDocs(questionsCollection);
        const questionsList = questionsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        } as Question));
        setAllQuestions(questionsList);
      } catch (error) {
        console.error('Error al cargar preguntas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = allQuestions.filter(q => {
    if (selectedAnime !== 'all' && q.anime !== selectedAnime) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleStart = (name: string, anime: string, difficulty: string) => {
    setNickname(name);
    setSelectedAnime(anime);
    setSelectedDifficulty(difficulty);
    setGameStarted(true);
  };

  const handleGameOver = () => {
    setGameStarted(false);
  };

  if (loading) {
    return (
      <div className="section-container py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      {/* Zona para AdSense - Banner arriba del fold */}
      <div className="mb-8">
        {/* <AdSense adSlot="1234567893" adFormat="horizontal" /> */}
        <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
          Zona para Google AdSense (Banner superior)
        </div>
      </div>

      {!gameStarted ? (
        <GameSelector
          questions={allQuestions}
          onStart={handleStart}
        />
      ) : (
        <GameLayoutFrame
          allQuestions={filteredQuestions}
          nickname={nickname}
          onGameOver={handleGameOver}
        />
      )}
    </div>
  );
}

