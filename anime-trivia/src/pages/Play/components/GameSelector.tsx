import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, User } from 'lucide-react';

interface Question {
  anime?: string;
  difficulty?: string;
}

interface GameSelectorProps {
  questions: Question[];
  onStart: (nickname: string, anime: string, difficulty: string) => void;
}

export const GameSelector = ({ questions, onStart }: GameSelectorProps) => {
  const [nickname, setNickname] = useState('');
  const [selectedAnime, setSelectedAnime] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Obtener animes únicos
  const animes = Array.from(new Set(questions.map(q => q.anime).filter(Boolean))) as string[];
  const difficulties = Array.from(new Set(questions.map(q => q.difficulty).filter(Boolean))) as string[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onStart(nickname.trim(), selectedAnime, selectedDifficulty);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="card-glow p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gradient">
          Configura tu Partida
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <User size={20} className="mr-2" />
              Tu Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ingresa tu nickname"
              required
              className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {animes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Selecciona un Anime (Opcional)
              </label>
              <select
                value={selectedAnime}
                onChange={(e) => setSelectedAnime(e.target.value)}
                className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos los animes</option>
                {animes.map(anime => (
                  <option key={anime} value={anime}>{anime}</option>
                ))}
              </select>
            </div>
          )}

          {difficulties.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Dificultad (Opcional)
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-dark-surface border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todas las dificultades</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Play size={20} />
            <span>¡Jugar Ahora!</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
};




