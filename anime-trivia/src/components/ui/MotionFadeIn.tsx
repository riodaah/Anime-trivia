import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionFadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const MotionFadeIn = ({ children, delay = 0, className = '' }: MotionFadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionStagger = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

