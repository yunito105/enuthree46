import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './components/ChatInterface';

const CHARACTERS = [
  { id: 'rabbit', name: 'うさぎさん' },
  { id: 'cat', name: 'ねこさん' },
  { id: 'dog', name: 'いぬさん' },
  { id: 'bear', name: 'くまさん' },
];

function App() {
  const [started, setStarted] = useState(false);
  const [character, setCharacter] = useState<typeof CHARACTERS[0] | null>(null);

  useEffect(() => {
    if (started && !character) {
      const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
      setCharacter(CHARACTERS[randomIndex]);
    }
  }, [started]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleBack = () => {
    setStarted(false);
    setCharacter(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* 背景画像レイヤー */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 opacity-80" />
        <img 
          src="/characters/parentsreading.png" 
          alt="background" 
          className="absolute bottom-[-55%] right-[-55%] w-[4000px] h-auto object-contain opacity-15 mix-blend-overlay"
          style={{ transform: 'translateX(-30%) translateY(10%)' }}
        />
        
        {/* 夢のような波アニメーション */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-pink-300/30 to-blue-200/20 animate-wave blur-3xl" />
        </div>
        
        {/* 重なる波アニメーション */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/10 via-purple-300/20 to-pink-200/10 animate-wave-slow blur-2xl" />
        </div>

        {/* 浮遊する光の粒 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ヘインコンテンツを中央配置 */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!started ? (
              <motion.main
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl w-full px-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="mb-8"
                >
                  <h1 className="text-4xl font-bold text-text-primary tracking-comfort font-sans mb-4">
                    あなたのそばにチャット相談
                  </h1>
                  <p className="text-xl text-text-secondary tracking-wide font-sans mb-3 opacity-70">
                    24時間365日・誰でも無料・匿名
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="bg-blue-500 text-white px-12 py-4 rounded-full text-xl font-medium tracking-wide font-sans inline-flex items-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  いますぐ話してみる
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </motion.main>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                {character && (
                  <ChatInterface
                    character={character}
                    onBack={handleBack}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;