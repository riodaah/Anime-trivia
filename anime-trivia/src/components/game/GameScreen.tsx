import React, { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import Lottie from 'react-lottie';
import animationData from '@/Lotties/lightning(neon).json';
import { motion } from 'framer-motion';

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

interface Props {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  allQuestions: Question[];
  scores: Score[];
  nickname: string;
}

const GameScreen: React.FC<Props> = ({ onGameOver, onScoreUpdate, allQuestions, scores, nickname }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [showLottie, setShowLottie] = useState(false);
  const correctButtonRef = useRef<HTMLButtonElement>(null);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    if (allQuestions.length > 0) {
      loadQuestion();
    }
  }, [allQuestions]);

  const loadQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowLottie(false);

    let availableQuestions = allQuestions.filter(q => !usedQuestions.includes(q.question));

    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      availableQuestions = allQuestions;
    }
    
    const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestions([...usedQuestions, newQuestion.question]);
    
    setQuestion(newQuestion);
    setTimerKey(prevKey => prevKey + 1);
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === question?.correctAnswer;

    if (isCorrect) {
      const playerRank = scores.findIndex(s => s.nickname === nickname) + 1;
      if (playerRank <= 5 && playerRank > 0) {
        setShowLottie(true);
      }
      new Audio('/sounds/correct.mp3').play();
    } else {
      new Audio('/sounds/incorrect.mp3').play();
    }

    setTimeout(() => {
      let newScore = score;
      if (isCorrect) {
        newScore = score + 1;
        setScore(newScore);
        onScoreUpdate(newScore);
      }
      
      setQuestionCount(questionCount + 1);

      if (!isCorrect) {
        onGameOver(newScore);
      } else {
        if (allQuestions.length > 0) {
          loadQuestion();
        }
      }
    }, isCorrect && showLottie ? 3000 : 1000);
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
        onGameOver(score);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) return 'bg-blue-600 hover:bg-blue-700';
    if (option === selectedAnswer) {
        return option === question?.correctAnswer 
          ? 'bg-green-600' 
          : 'bg-red-600';
    }
    if (option === question?.correctAnswer) return 'bg-green-600';
    return 'bg-gray-700';
  };

  if (!question || allQuestions.length === 0) {
    return (
      <div className="card-glow p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-glow p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">
          Puntaje: <span className="text-gradient">{score}</span>
        </div>
        <div className="text-xl text-gray-400">
          Pregunta: {questionCount + 1}
        </div>
      </div>

      <Timer onTimeUp={handleTimeUp} timerKey={timerKey} />

      <h2 className="text-2xl md:text-3xl font-bold my-6 text-center">
        {question.question}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {question.options.map((option, index) => (
          <div key={index} className="relative">
            {showLottie && option === question.correctAnswer && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <Lottie options={defaultOptions} height="100%" width="100%" />
              </div>
            )}
            <motion.button
              ref={option === question.correctAnswer ? correctButtonRef : null}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-lg text-white font-semibold transition-all ${getButtonClass(option)} ${
                selectedAnswer === option ? 'ring-4 ring-blue-400' : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
            >
              {option}
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameScreen;




