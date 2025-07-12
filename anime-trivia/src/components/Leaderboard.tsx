import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Table } from 'react-bootstrap';

interface Score {
  nickname: string;
  score: number;
}

interface Props {
  onRestart: () => void;
  lastScore: number | null;
  nickname: string;
  scores: Score[]; // Ahora recibe las puntuaciones como prop
}

const Leaderboard: React.FC<Props> = ({ onRestart, lastScore, nickname, scores }) => {

  return (
    <Container>
      <Card className="text-center p-4">
        <Card.Body>
          <Card.Title as="h1">Tabla de Posiciones</Card.Title>
          {lastScore !== null && (
            <Card.Text as="h3" className="mb-4">
              {nickname}, tu puntaje fue: {lastScore}
            </Card.Text>
          )}
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Nickname</th>
                <th>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score.nickname}</td>
                  <td>{score.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" size="lg" onClick={onRestart} className="mt-3">
            Jugar de Nuevo
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Leaderboard;
