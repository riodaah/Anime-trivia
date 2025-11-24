import { useEffect, useState } from 'react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { getTopScores, LeaderboardEntry } from '@/lib/leaderboardApi';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LeaderboardPreview = () => {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const scores = await getTopScores(5);
        setTopScores(scores);
      } catch (error) {
        console.error('Error fetching top scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScores();
  }, []);

  return (
    <section className="section-container py-20">
      <MotionFadeIn>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient">
            Top 5 Jugadores
          </h2>
          <Link
            to="/ranking"
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
          >
            <span>Ver todos</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : topScores.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Aún no hay puntuaciones. ¡Sé el primero!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topScores.map((entry, index) => (
              <motion.div
                key={entry.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glow text-center relative"
              >
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Trophy size={32} className="text-yellow-400" />
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-400 mb-2">
                  #{index + 1}
                </div>
                <div className="text-xl font-semibold mb-2 truncate">
                  {entry.nickname}
                </div>
                <div className="text-2xl font-bold text-gradient">
                  {entry.score}
                </div>
                {entry.country && (
                  <div className="text-sm text-gray-400 mt-2">
                    {entry.country}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </MotionFadeIn>
    </section>
  );
};

