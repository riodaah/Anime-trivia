import React, { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import Lottie from 'react-lottie';
import animationData from '../Lotties/lightning(neon).json';

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

  const getButtonVariant = (option: string) => {
    if (!isAnswered) return 'primary';
    if (option === selectedAnswer) {
        return option === question?.correctAnswer ? 'success' : 'danger';
    }
    if (option === question?.correctAnswer) return 'success';
    return 'secondary';
  };

  return (
    <Container>
      <Card className="p-4">
        <Card.Body>
          {(!question || allQuestions.length === 0) ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col><h4>Puntaje: {score}</h4></Col>
                <Col><h4>Pregunta: {questionCount + 1}</h4></Col>
              </Row>
              <Timer onTimeUp={handleTimeUp} timerKey={timerKey} />
              <Card.Title as="h2" className="my-4">{question.question}</Card.Title>
              <Row xs={1} md={2} className="g-3">
                {question.options.map((option, index) => (
                  <Col key={index} style={{ position: 'relative' }}>
                    {showLottie && option === question.correctAnswer && (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
                        <Lottie options={defaultOptions} height="100%" width="100%" />
                      </div>
                    )}
                    <Button
                      ref={option === question.correctAnswer ? correctButtonRef : null}
                      className={`answer-btn w-100 p-3 ${selectedAnswer === option ? (option === question.correctAnswer ? 'correct' : 'incorrect') : ''}`}
                      variant={getButtonVariant(option)}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                    >
                      {option}
                    </Button>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GameScreen;
