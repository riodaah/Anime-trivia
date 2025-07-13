import React, { useState } from 'react';
import { Card, Button, Container, Table, Pagination } from 'react-bootstrap';

interface Score {
  nickname: string;
  score: number;
}

interface Props {
  onRestart: () => void;
  lastScore: number | null;
  nickname: string;
  scores: Score[];
}

const Leaderboard: React.FC<Props> = ({ onRestart, lastScore, nickname, scores }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 15;

  const indexOfLastScore = currentPage * scoresPerPage;
  const indexOfFirstScore = indexOfLastScore - scoresPerPage;
  const currentScores = scores.slice(indexOfFirstScore, indexOfLastScore);

  const totalPages = Math.ceil(scores.length / scoresPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
              {currentScores.map((score, index) => (
                <tr key={index} className={score.nickname === nickname ? 'table-primary' : ''}>
                  <td>{indexOfFirstScore + index + 1}</td>
                  <td>{score.nickname}</td>
                  <td>{score.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                {number}
              </Pagination.Item>
            ))}
          </Pagination>
          <Button variant="primary" size="lg" onClick={onRestart} className="mt-3">
            Jugar de Nuevo
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Leaderboard;
