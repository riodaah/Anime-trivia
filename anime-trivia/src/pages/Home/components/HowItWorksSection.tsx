import { MotionFadeIn, MotionStagger } from '@/components/ui/MotionFadeIn';
import { copywriting } from '@/config/siteConfig';
import { motion } from 'framer-motion';
import { User, Clock, Trophy, TrendingUp } from 'lucide-react';

const icons = [User, Clock, Trophy, TrendingUp];

export const HowItWorksSection = () => {
  return (
    <section className="section-container py-20">
      <MotionFadeIn>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
          {copywriting.howItWorks.title}
        </h2>
      </MotionFadeIn>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {copywriting.howItWorks.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
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
      </MotionStagger>

      {/* Zona para AdSense - Banner horizontal */}
      <div className="mt-16">
        {/* <AdSense adSlot="1234567890" adFormat="horizontal" /> */}
        <div className="h-24 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
          Zona para Google AdSense (Banner horizontal)
        </div>
      </div>
    </section>
  );
};

