import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { motion } from 'framer-motion';

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const TikTokPromoSection = () => {
  return (
    <section className="section-container py-20">
      <MotionFadeIn>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-pink-500/20 p-12 max-w-2xl mx-auto"
        >
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 animate-gradient" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/50">
                <TikTokIcon />
              </div>
            </motion.div>
            
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Síguenos en TikTok
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
              Contenido exclusivo, retos épicos de anime, memes y mucho más 🔥
            </p>
            
            <motion.a
              href="https://tiktok.com/@payasin889"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold text-lg shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
            >
              <TikTokIcon />
              <span>@LuffySunny</span>
            </motion.a>
            
            <p className="text-sm text-gray-500 mt-6">
              Síguenos para contenido exclusivo
            </p>
          </div>
        </motion.div>
      </MotionFadeIn>
    </section>
  );
};

