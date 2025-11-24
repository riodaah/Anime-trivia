import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { copywriting } from '@/config/siteConfig';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const EgoHookSection = () => {
  return (
    <section className="section-container py-20 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20">
      <MotionFadeIn>
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-block mb-6"
          >
            <Trophy size={64} className="text-yellow-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            {copywriting.egoHook.title}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {copywriting.egoHook.subtitle}
          </p>
          <Link
            to="/ranking"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Ver Ranking</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </MotionFadeIn>
    </section>
  );
};


