import { motion } from 'framer-motion';

type CharacterProps = {
  type: string;
  mood?: 'happy' | 'thinking' | 'listening';
  className?: string;
};

export default function Character({ type, mood = 'happy', className = '' }: CharacterProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      <motion.img 
        src={`/characters/${type}-${mood}.svg`} 
        alt="キャラクター" 
        className="w-full h-full object-contain"
        animate={{ y: [0, -5, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gray-100 rounded-full blur-sm -z-10 opacity-30"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}