import { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-rose-50">
      <Header />
      
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.main
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto px-4 py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                あなたのそばにチャット相談
              </h1>
              <p className="text-xl text-gray-600 mb-3">
                24時間365日・誰でも無料・匿名
              </p>
              <p className="text-lg text-gray-500">
                【試験運用中】
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="bg-blue-500 text-white px-12 py-4 rounded-full text-xl font-medium inline-flex items-center gap-2 hover:bg-blue-600 transition-colors"
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
  );
}

export default App;