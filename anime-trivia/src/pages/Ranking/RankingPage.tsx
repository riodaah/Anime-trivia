import { useEffect, useState } from 'react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { getLeaderboard, LeaderboardEntry, LeaderboardFilters } from '@/lib/leaderboardApi';
import { Trophy, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RankingPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    period: 'global',
    anime: 'all',
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const leaderboardFilters: LeaderboardFilters = {
          period: filters.period,
        };
        if (filters.anime && filters.anime !== 'all') {
          leaderboardFilters.anime = filters.anime;
        }
        const data = await getLeaderboard(leaderboardFilters);
        setEntries(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filters]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <div className="flex items-center justify-center mb-8">
          <Trophy size={48} className="text-yellow-400 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Ranking Global
          </h1>
        </div>

        {/* Zona para AdSense - Banner arriba del fold */}
        <div className="mb-8">
          {/* <AdSense adSlot="1234567894" adFormat="horizontal" /> */}
          <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Zona para Google AdSense (Banner superior)
          </div>
        </div>

        {/* Filtros */}
        <div className="card-glow p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter size={24} className="mr-2 text-gray-400" />
            <h2 className="text-xl font-semibold">Filtros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Período</label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value as 'global' | 'month' })}
                className="w-full px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="global">Global</option>
                <option value="month">Este Mes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Anime (Próximamente)</label>
              <select
                value={filters.anime || 'all'}
                onChange={(e) => setFilters({ ...filters, anime: e.target.value })}
                className="w-full px-4 py-2 bg-dark-surface border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled
              >
                <option value="all">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Ranking */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="card-glow p-12 text-center">
            <p className="text-gray-400 text-lg">Aún no hay puntuaciones. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="card-glow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400">Pos</th>
                  <th className="text-left py-4 px-4 text-gray-400">Nickname</th>
                  <th className="text-left py-4 px-4 text-gray-400">País</th>
                  <th className="text-left py-4 px-4 text-gray-400">Anime</th>
                  <th className="text-right py-4 px-4 text-gray-400">Puntaje</th>
                  <th className="text-right py-4 px-4 text-gray-400">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <motion.tr
                    key={entry.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-800 hover:bg-gray-800/20 transition"
                  >
                    <td className="py-4 px-4">
                      {index === 0 && <Trophy size={20} className="text-yellow-400 inline mr-2" />}
                      <span className="text-gray-400">#{index + 1}</span>
                    </td>
                    <td className="py-4 px-4 font-medium">{entry.nickname}</td>
                    <td className="py-4 px-4 text-gray-400">{entry.country || 'N/A'}</td>
                    <td className="py-4 px-4 text-gray-400">{entry.anime || 'N/A'}</td>
                    <td className="py-4 px-4 text-right font-bold text-gradient">{entry.score}</td>
                    <td className="py-4 px-4 text-right text-gray-400 text-sm">
                      {formatDate(entry.timestamp || entry.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MotionFadeIn>
    </div>
  );
}

