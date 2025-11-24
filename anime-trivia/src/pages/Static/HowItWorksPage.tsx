import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { copywriting } from '@/config/siteConfig';
import { User, Clock, Trophy, TrendingUp, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const icons = [User, Clock, Trophy, TrendingUp];

export default function HowItWorksPage() {
  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
          Cómo Funciona
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {copywriting.howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glow text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Icon size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/play" className="btn-primary inline-flex items-center space-x-2">
            <Play size={20} />
            <span>¡Empezar a Jugar!</span>
          </Link>
        </div>
      </MotionFadeIn>
    </div>
  );
}

