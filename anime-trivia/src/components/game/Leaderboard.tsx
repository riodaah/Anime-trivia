import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Score {
  nickname: string;
  score: number;
  country?: string;
}

interface Props {
  onRestart: () => void;
  lastScore: number | null;
  nickname: string;
  scores: Score[];
  initialPage?: number;
  currentScore?: number;
  onBackToHome?: () => void;
}

const Leaderboard: React.FC<Props> = ({ 
  onRestart, 
  lastScore, 
  nickname, 
  scores, 
  initialPage = 1,
  currentScore,
  onBackToHome
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const scoresPerPage = 10;

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const indexOfLastScore = currentPage * scoresPerPage;
  const indexOfFirstScore = indexOfLastScore - scoresPerPage;
  const currentScores = scores.slice(indexOfFirstScore, indexOfLastScore);
  const totalPages = Math.ceil(scores.length / scoresPerPage);

  const paginate = (pageNumber: number) => {
    new Audio('/sounds/select.mp3').play();
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glow p-6"
    >
      <div className="text-center mb-6">
        <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Tabla de Posiciones
        </h2>
        {lastScore !== null && (
          <div className="text-xl mb-4">
            <span className="text-gray-400">{nickname},</span>{' '}
            <span className="text-gradient font-bold">tu puntaje fue: {lastScore}</span>
          </div>
        )}
        {currentScore !== undefined && lastScore === null && (
          <div className="text-lg mb-4">
            <span className="text-gray-400">Puntaje actual:</span>{' '}
            <span className="text-gradient font-bold">{currentScore}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 text-gray-400">#</th>
              <th className="text-left py-2 text-gray-400">Nickname</th>
              <th className="text-right py-2 text-gray-400">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {currentScores.map((score, index) => (
              <tr
                key={index}
                className={`border-b border-gray-800 ${
                  score.nickname === nickname ? 'bg-blue-900/20' : ''
                }`}
              >
                <td className="py-3 text-gray-400">{indexOfFirstScore + index + 1}</td>
                <td className="py-3 font-medium">{score.nickname}</td>
                <td className="py-3 text-right font-bold text-gradient">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition"
          >
            Anterior
          </button>
          <span className="text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 transition"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {lastScore !== null && (
          <button
            onClick={() => {
              onRestart();
              new Audio('/sounds/select.mp3').play();
            }}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Jugar de Nuevo</span>
          </button>
        )}
        {onBackToHome && (
          <Link
            to="/"
            onClick={onBackToHome}
            className="btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <Home size={20} />
            <span>Volver al Inicio</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default Leaderboard;

