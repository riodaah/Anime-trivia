import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { copywriting } from '@/config/siteConfig';
import { Play } from 'lucide-react';

/**
 * Hero Section con video de fondo
 * 
 * VIDEO: Coloca tu video en src/assets/videos/home-hero-loop.mp4
 * Formato recomendado: .mp4, H.264, 1920×1080 o 1280×720, < 10 MB
 * Optimizar con: ffmpeg -i input.mp4 -crf 28 -preset veryfast -vf scale=1920:1080 output.mp4
 */
export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video de fondo */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          {/* Reemplazar con tu video */}
          <source src="/videos/home-hero-loop.mp4" type="video/mp4" />
          {/* Fallback si no hay video */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/60 to-dark-bg/80" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-gradient"
        >
          {copywriting.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          {copywriting.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/play"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <Play size={24} />
            <span>{copywriting.hero.cta}</span>
          </Link>
        </motion.div>
      </div>

      {/* Efecto parallax de estrellas */}
      <div className="absolute inset-0 z-0 parallax">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </section>
  );
};

