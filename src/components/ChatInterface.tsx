import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Character from './Character';
import { GoogleGenerativeAI } from "@google/generative-ai";

type Question = {
  id: number;
  text: string;
  options?: string[];
  allowFreeText?: boolean;
};

const CHAT_FLOW: Question[] = [
  {
    id: 1,
    text: 'どの地域に住んでいますか？',
    options: ['北海道・東北', '関東', '中部', '近畿', '中国・四国', '九州・沖縄']
  },
  {
    id: 2,
    text: 'どの都道府県に住んでいますか？',
    options: [] // Will be populated based on region selection
  },
  {
    id: 3,
    text: 'どの市町村に住んでいますか？',
    options: [] // Will be populated based on prefecture selection
  },
  {
    id: 4,
    text: 'どんな制度を希望されていますか？',
    options: ['児童扶養手当', '児童育成手当', '医療費助成', '保育所優先入所', '就学援助', 'ひとり親家庭等日常生活支援']
  },
  {
    id: 5,
    text: '追加で情報を入力したいことがあれば、こちらに記入してください。',
    allowFreeText: true
  }
];

const PREFECTURE_MAP = {
  '北海道・東北': ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  '関東': ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
  '中部': ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
  '近畿': ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
  '中国・四国': ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'],
  '九州・沖縄': ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
};

type ChatInterfaceProps = {
  character: {
    id: string;
    name: string;
  };
  onBack: () => void;
};

type SearchResult = {
  content: string;
  source?: string;
};

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export default function ChatInterface({ character, onBack }: ChatInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [currentOptions, setCurrentOptions] = useState<string[]>(CHAT_FLOW[0].options || []);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentStep === 0) {
      setCurrentOptions(PREFECTURE_MAP[answer as keyof typeof PREFECTURE_MAP]);
    } else if (currentStep === 1) {
      setCurrentOptions(['市区町村A', '市区町村B', '市区町村C']);
    }

    if (currentStep === CHAT_FLOW.length - 1) {
      await searchSupportInfo(newAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const searchSupportInfo = async (answers: string[]) => {
    setIsSearching(true);
    try {
      console.log('API接続テスト開始');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const testResult = await model.generateContent('こんにちは');
      console.log('テスト応答:', await testResult.response.text());
      
      const [region, prefecture, city, supportType, additionalInfo] = answers;
      
      const prompt = `
        以下の条件に基づいて、ひとり親支援制度について具体的に説明してください：
        
        居住地域: ${prefecture}${city}
        希望する支援制度: ${supportType}
        追加情報: ${additionalInfo || 'なし'}
        
        回答は以下の形式でお願いします：
        1. 制度の概要
        2. 申請方法
        3. 必要書類
        4. 問い合わせ先
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setSearchResult({
        content: text,
        source: '情報提供：各自治体公式サイト及びGemini AI'
      });
    } catch (error) {
      console.error('検索エラー:', error);
      setSearchResult({
        content: '申し訳ありません。情報の取得に失敗しました。',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
    } else {
      onBack();
    }
  };

  const handleFreeTextSubmit = () => {
    if (!input.trim()) return;
    handleAnswer(input);
    setInput('');
  };

  const currentQuestion = CHAT_FLOW[currentStep];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 pb-4 min-h-[calc(100vh-5rem)] flex flex-col">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBack}
        className="fixed top-20 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <div className="relative w-full">
          <div className="flex items-start gap-6 mb-8">
            <Character 
              type={character.id}
              mood={currentQuestion.allowFreeText ? 'listening' : 'thinking'} 
              className="w-40 h-40 flex-shrink-0"
            />
            <div className="chat-bubble relative bg-white rounded-2xl shadow-lg p-6 flex-1 mt-4">
              <div className="absolute -left-4 top-6 w-4 h-4 bg-white transform rotate-45" />
              <p className="text-xl text-gray-800">
                {currentQuestion.text}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentQuestion.allowFreeText ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFreeTextSubmit()}
                  placeholder="こちらに入力してください..."
                  className="flex-1 border rounded-lg px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleFreeTextSubmit}
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-600 transition-colors"
                >
                  送信
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {currentOptions.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left px-6 py-4 text-lg border rounded-xl hover:bg-blue-50 hover:border-blue-500 transition-colors"
                  >
                    {option}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {answers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto w-full"
        >
          <h3 className="font-medium text-gray-700 mb-3 text-lg">これまでの回答:</h3>
          <ul className="space-y-2">
            {answers.map((answer, index) => (
              <li key={index} className="text-gray-600">
                {CHAT_FLOW[index].text}: <span className="font-medium">{answer}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto w-full"
        >
          <div className="flex items-start gap-6">
            <Character 
              type={character.id}
              mood="happy"
              className="w-32 hh-32 flex-shrink-0"
            />
            <div className="chat-bubble relative bg-white rounded-2xl shadow-lg p-6 flex-1">
              <div className="absolute -left-4 top-6 w-4 h-4 bg-white transform rotate-45" />
              {isSearching ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <>
                  <div className="prose prose-blue">
                    <p className="text-lg text-gray-800 whitespace-pre-wrap">
                      {searchResult.content}
                    </p>
                  </div>
                  {searchResult.source && (
                    <p className="mt-4 text-sm text-gray-500">
                      {searchResult.source}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}