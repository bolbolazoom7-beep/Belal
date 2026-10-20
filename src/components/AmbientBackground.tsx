import React from 'react';
import { motion } from 'motion/react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Warm ambient radial lights */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 80%)'
        }}
      />
      <div 
        className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full blur-[130px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.3) 0%, rgba(180, 83, 9, 0.1) 70%, transparent 90%)'
        }}
      />
      <div 
        className="absolute -bottom-24 -left-20 w-[550px] h-[550px] rounded-full blur-[150px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, rgba(120, 53, 15, 0.1) 60%, transparent 80%)'
        }}
      />

      {/* Floating subtle memory dust particles */}
      {[...Array(14)].map((_, i) => {
        const size = 3 + (i % 4) * 2;
        const initialX = (i * 7.5) % 100;
        const duration = 14 + (i % 8) * 3;
        const delay = (i * 1.3) % 7;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-200/40"
            style={{
              width: size,
              height: size,
              left: `${initialX}%`,
              bottom: '-20px',
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
            }}
            animate={{
              y: ['0vh', '-110vh'],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              opacity: [0, 0.7, 0.9, 0.2, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
};
