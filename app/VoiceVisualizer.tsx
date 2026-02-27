import { motion } from 'framer-motion';

export const VoiceVisualizer = ({ isListening }: { isListening: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={isListening ? {
            height: [10, 40, 15, 35, 10],
          } : { height: 10 }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
        />
      ))}
    </div>
  );
};