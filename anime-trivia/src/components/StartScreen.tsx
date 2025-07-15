import React, { useState } from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';

interface Props {
  onStart: (nickname: string) => void;
}

const StartScreen: React.FC<Props> = ({ onStart }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onStart(nickname.trim());
    }
  };

  return (
    <Container>
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title as="h1">Bienvenido a la trivia de LuffySunny</Card.Title>
          <Card.Text>
            Ingresa tu nickname para comenzar.
          </Card.Text>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tu nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" size="lg">
              Jugar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StartScreen;
