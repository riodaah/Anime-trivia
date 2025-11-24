import { useEffect, useState } from 'react';
import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { getTopScores, LeaderboardEntry } from '@/lib/leaderboardApi';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Crown, Medal, Award } from 'lucide-react';
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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="text-yellow-400" size={32} />;
      case 1:
        return <Medal className="text-gray-300" size={28} />;
      case 2:
        return <Award className="text-orange-400" size={26} />;
      default:
        return null;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-yellow-500/20';
      case 1:
        return 'bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-gray-400/30';
      case 2:
        return 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30';
      default:
        return 'bg-dark-card/50 border-gray-800';
    }
  };

  return (
    <section className="section-container py-20 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <MotionFadeIn>
        <div className="relative z-10">
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <Trophy size={56} className="text-yellow-400" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                Top 5 Jugadores
              </span>
            </h2>
            <p className="text-gray-400 text-xl">Los mejores de todos los tiempos</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent"></div>
            </div>
          ) : topScores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 card-glow max-w-md mx-auto"
            >
              <Trophy size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">Aún no hay puntuaciones. ¡Sé el primero!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {topScores.map((entry, index) => (
                <motion.div
                  key={entry.id || index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`relative overflow-hidden rounded-2xl border-2 ${getRankBg(index)} backdrop-blur-sm p-6 text-center shadow-xl`}
                >
                  {/* Efecto shimmer para top 3 */}
                  {index < 3 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}

                  {/* Icono de rango */}
                  <motion.div
                    animate={index === 0 ? { 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    className="flex justify-center mb-4"
                  >
                    {getRankIcon(index) || (
                      <div className="w-12 h-12 rounded-full bg-dark-surface flex items-center justify-center text-2xl font-bold text-gray-500">
                        #{index + 1}
                      </div>
                    )}
                  </motion.div>

                  {/* Nombre del jugador */}
                  <h3 className="text-xl font-bold mb-3 truncate text-white">
                    {entry.nickname}
                  </h3>

                  {/* Score */}
                  <div className="relative">
                    <motion.p
                      whileHover={{ scale: 1.1 }}
                      className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1"
                    >
                      {entry.score}
                    </motion.p>
                    <p className="text-sm text-gray-400">puntos</p>
                  </div>

                  {/* País */}
                  {entry.country && (
                    <div className="mt-3 px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 inline-block">
                      {entry.country}
                    </div>
                  )}

                  {/* Glow effect para primer lugar */}
                  {index === 0 && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-2xl blur-xl -z-10 animate-pulse" />
                  )}
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/ranking"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-blue-500/50"
            >
              <Trophy size={22} />
              <span>Ver Ranking Completo</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </MotionFadeIn>
    </section>
  );
};

