import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Form, Row, Col, Spinner } from 'react-bootstrap';

interface CharacterQuestion {
  imageUrl: string;
  correctName: string;
}

interface Props {
  onGameOver: (score: number) => void;
}

const characterQuestions: CharacterQuestion[] = [
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Eren_Yeager_anime_design.png/220px-Eren_Yeager_anime_design.png',
    correctName: 'Eren Yeager'
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Naruto_Uzumaki.png/220px-Naruto_Uzumaki.png',
    correctName: 'Naruto Uzumaki'
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Monkey_D._Luffy_anime_design.png/220px-Monkey_D._Luffy_anime_design.png',
    correctName: 'Monkey D. Luffy'
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Goku_anime_design.png/220px-Goku_anime_design.png',
    correctName: 'Goku'
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Natsu_Dragneel.png/220px-Natsu_Dragneel.png',
    correctName: 'Natsu Dragneel'
  }
];

const MAX_ATTEMPTS = 3; // Número máximo de intentos incorrectos

const GuessCharacterScreen: React.FC<Props> = ({ onGameOver }) => {
  const [currentQuestion, setCurrentQuestion] = useState<CharacterQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    setIsAnswered(false);
    setUserGuess('');
    setFeedback(null);
    setAttemptsLeft(MAX_ATTEMPTS); // Reiniciar intentos para cada nueva pregunta
    const randomIndex = Math.floor(Math.random() * characterQuestions.length);
    setCurrentQuestion(characterQuestions[randomIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || isAnswered) return;

    const isCorrect = userGuess.trim().toLowerCase() === currentQuestion.correctName.toLowerCase();
    setIsAnswered(true);

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
      setTimeout(() => {
        setQuestionCount(questionCount + 1);
        if (questionCount + 1 >= 5) { // Limitar a 5 preguntas por ahora
          onGameOver(score + 1); // Pasa el puntaje actualizado
        } else {
          loadNewQuestion();
        }
      }, 2000);
    } else {
      setFeedback('incorrect');
      setAttemptsLeft(attemptsLeft - 1);
      if (attemptsLeft - 1 <= 0) {
        setTimeout(() => {
          onGameOver(score); // Termina el juego si no quedan intentos
        }, 2000);
      } else {
        // Si aún quedan intentos, permite al usuario intentar de nuevo
        setIsAnswered(false); // Permite que el usuario intente de nuevo
        setUserGuess(''); // Limpia el campo de entrada
      }
    }
  };

  if (!currentQuestion) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <Card className="p-4">
        <Card.Body>
          <Row className="justify-content-between mb-3">
            <Col><h4>Puntaje: {score}</h4></Col>
            <Col><h4>Pregunta: {questionCount + 1}/5</h4></Col>
            <Col><h4>Intentos: {attemptsLeft}</h4></Col>
          </Row>
          <Card.Title as="h2" className="my-4">¿Quién es este personaje?</Card.Title>
          <div className="mb-4">
            <img src={currentQuestion.imageUrl} alt="Character close-up" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tu respuesta"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                disabled={isAnswered && feedback === 'correct'} // Deshabilitar solo si la respuesta es correcta
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" size="lg" disabled={isAnswered && feedback === 'correct'}>
              Adivinar
            </Button>
          </Form>
          {feedback && (
            <div className={`mt-3 ${feedback === 'correct' ? 'text-success' : 'text-danger'}`}>
              {feedback === 'correct' ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion.correctName}`}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GuessCharacterScreen;
