import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  allQuestions: Question[];
}

const GameScreen: React.FC<Props> = ({ onGameOver, onScoreUpdate, allQuestions }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (allQuestions.length > 0) {
      loadQuestion();
    }
  }, [allQuestions]);

  const loadQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    

    let availableQuestions = allQuestions.filter(q => !usedQuestions.includes(q.question));

    if (availableQuestions.length === 0) {
        // Si ya se usaron todas las preguntas, se reinicia la lista de usadas
        setUsedQuestions([]);
        availableQuestions = allQuestions;
    }
    
    const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestions([...usedQuestions, newQuestion.question]);
    
    setQuestion(newQuestion);
    setTimerKey(prevKey => prevKey + 1); // Reinicia el temporizador
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    const isCorrect = answer === question?.correctAnswer;

    setTimeout(() => {
      let newScore = score;
      if (isCorrect) {
        newScore = score + 1;
        setScore(newScore);
        onScoreUpdate(newScore); // Notificar a App.tsx sobre el cambio de puntaje
      }
      
      setQuestionCount(questionCount + 1);

      if (!isCorrect) {
        onGameOver(newScore);
      } else {
        if (allQuestions.length > 0) {
          loadQuestion();
        }
      }
    }, 1000);
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
                  <Col key={index}>
                    <Button
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
