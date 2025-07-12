import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import Timer from './Timer';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Props {
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void; // Nueva prop para actualizar el puntaje en App.tsx
}

// --- Cargar preguntas desde JSON ---
const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch('/questions.json');
  const data = await response.json();
  return data;
};
// --- Fin de la carga ---

const GameScreen: React.FC<Props> = ({ onGameOver, onScoreUpdate }) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const loadInitialQuestions = async () => {
      try {
        const questions = await fetchQuestions();
        setAllQuestions(questions);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
        // Opcional: manejar el error, por ejemplo, mostrando un mensaje al usuario
      }
    };
    loadInitialQuestions();
  }, []);

  useEffect(() => {
    if (allQuestions.length > 0) {
      loadQuestion();
    }
  }, [allQuestions]);

  const loadQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setQuestion(null); // Muestra el spinner

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

  if (!question || allQuestions.length === 0) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <Card className="p-4">
        <Card.Body>
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GameScreen;
