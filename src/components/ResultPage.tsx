import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Character from './Character';
import type { SearchResult } from '../types';

type ResultPageProps = {
  character: {
    id: string;
    name: string;
  };
  searchResult: SearchResult;
  isSearching: boolean;
  onBack: () => void;
};

// 水玉アニメーションのコンポーネント
const BubblesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bubble rounded-full bg-sky-200/30 backdrop-blur-sm"
          style={{
            width: `${Math.random() * 60 + 40}px`,
            height: `${Math.random() * 60 + 40}px`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 10}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function ResultPage({ character, searchResult, isSearching, onBack }: ResultPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景のベース色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 opacity-90" />

      {/* 水玉アニメーション */}
      <BubblesBackground />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="fixed top-20 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-[90vw] max-w-[1400px] bg-green-50/90 backdrop-blur-sm rounded-[40px] p-16 shadow-lg"
          >
            <div className="flex items-start gap-6">
              <Character 
                type={character.id}
                mood="happy"
                className="w-32 h-32 flex-shrink-0"
              />
              <div className="chat-bubble relative bg-white/80 rounded-2xl shadow-lg p-8 flex-1">
                <div className="absolute -left-4 top-6 w-4 h-4 bg-white transform rotate-45" />
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                ) : (
                  <>
                    <div className="prose prose-blue max-w-none">
                      <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {searchResult.content}
                      </p>
                    </div>
                    {searchResult.source && (
                      <p className="mt-6 text-sm text-gray-500">
                        {searchResult.source}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 