import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export const TikTokPromoSection = () => {
  return (
    <section className="section-container py-20">
      <MotionFadeIn>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card-glow text-center max-w-2xl mx-auto"
        >
          <div className="flex justify-center mb-4">
            <Music size={48} className="text-pink-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Síguenos en TikTok</h2>
          <p className="text-gray-400 mb-6">
            Contenido exclusivo, retos, y más sobre anime
          </p>
          <a
            href="https://tiktok.com/@luffysunny"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Seguir en TikTok</span>
          </a>
        </motion.div>
      </MotionFadeIn>
    </section>
  );
};

