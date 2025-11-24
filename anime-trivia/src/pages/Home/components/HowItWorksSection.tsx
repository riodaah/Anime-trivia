import { MotionFadeIn, MotionStagger } from '@/components/ui/MotionFadeIn';
import { copywriting } from '@/config/siteConfig';
import { motion } from 'framer-motion';
import { User, Clock, Trophy, TrendingUp, Zap, Star } from 'lucide-react';

const icons = [User, Clock, Trophy, TrendingUp];
const colors = [
  { gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-500/30', iconBg: 'bg-blue-500/20' },
  { gradient: 'from-purple-500 to-pink-500', border: 'border-purple-500/30', iconBg: 'bg-purple-500/20' },
  { gradient: 'from-orange-500 to-red-500', border: 'border-orange-500/30', iconBg: 'bg-orange-500/20' },
  { gradient: 'from-green-500 to-emerald-500', border: 'border-green-500/30', iconBg: 'bg-green-500/20' },
];

export const HowItWorksSection = () => {
  return (
    <section className="section-container py-24 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <MotionFadeIn>
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Zap size={48} className="text-yellow-400" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-yellow-400 rounded-full blur-xl"
                />
              </div>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {copywriting.howItWorks.title}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Pasos simples para convertirte en el maestro de la trivia de anime
            </p>
          </div>
        </div>
      </MotionFadeIn>

      {/* Steps Grid */}
      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {copywriting.howItWorks.steps.map((step, index) => {
          const Icon = icons[index];
          const color = colors[index];
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, y: -15 }}
              className="relative group"
            >
              {/* Número de paso */}
              <div className={`absolute -top-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br ${color.gradient} border-2 ${color.border} flex items-center justify-center text-3xl font-black text-white z-10 group-hover:scale-110 transition-transform shadow-lg`}>
                {index + 1}
              </div>

              {/* Card principal */}
              <div className={`relative overflow-hidden rounded-2xl bg-dark-card border-2 ${color.border} p-6 text-center backdrop-blur-sm h-full`}>
                {/* Efecto de shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

                {/* Ícono */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${color.gradient} shadow-2xl mb-4 relative`}
                >
                  <div className="text-white relative z-10">
                    <Icon size={32} />
                  </div>
                  {/* Glow effect */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl blur-xl`}
                  />
                </motion.div>

                {/* Contenido */}
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Decoración: estrellas */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                </div>

                {/* Hover glow */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${color.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10`} />
              </div>
            </motion.div>
          );
        })}
      </MotionStagger>

      {/* Zona para AdSense - Banner horizontal */}
      <div className="mt-16 relative z-10">
        {/* <AdSense adSlot="1234567890" adFormat="horizontal" /> */}
        <div className="h-24 bg-gradient-to-r from-dark-surface/50 to-dark-card/50 rounded-2xl border border-white/10 flex items-center justify-center text-gray-500 text-sm backdrop-blur-sm">
          Zona para Google AdSense (Banner horizontal)
        </div>
      </div>
    </section>
  );
};

