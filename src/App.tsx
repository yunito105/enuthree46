import { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CITY_MAP } from './data/cityData';

const PREFECTURES = Object.keys(CITY_MAP);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const SYSTEMS = [
  '経済的支援（生活費・住居費など）',
  '就労支援（仕事探し・職業訓練など）',
  '子育て支援（保育・教育など）',
  '健康・医療支援（医療費・健康相談など）',
  '介護支援（介護サービス・介護相談など）',
  '住まいの支援（住宅相談・家賃補助など）',
  'こころの健康支援（メンタルヘルス・相談など）',
  '法律相談（借金・トラブルなど）'
];

function ResultDisplay({ result, isLoading }: { result: string | null, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!result) return null;

  // 結果を行ごとに分割
  const sections = result.split('\n\n').filter(Boolean);
  
  return (
    <div className="pl-12">
      <div className="space-y-12">
        {sections.map((section, index) => {
          // セクションの先頭に【】がない場合は、エラーメッセージとして表示
          if (!section.includes('【')) {
            return (
              <div key={index} className="flex items-center gap-3 text-red-600 pl-2">
                <span>⚠️</span>
                <p>{section}</p>
              </div>
            );
          }

          const [title, ...content] = section.split('\n');
          const titleText = title.replace(/【|】/g, '');
          
          // 色の設定
          const colors = {
            title: {
              0: 'text-orange-600',
              1: 'text-yellow-600',
              2: 'text-green-600',
              3: 'text-blue-600',
              4: 'text-purple-600',
              5: 'text-red-600',
            }[index] || 'text-gray-600',
            icon: {
              0: 'bg-orange-100 text-orange-500',
              1: 'bg-yellow-100 text-yellow-500',
              2: 'bg-green-100 text-green-500',
              3: 'bg-blue-100 text-blue-500',
              4: 'bg-purple-100 text-purple-500',
              5: 'bg-red-100 text-red-500',
            }[index] || 'bg-gray-100 text-gray-500',
          };

          return (
            <div key={index} className="relative">
              {/* アイコン */}
              <div className="absolute -left-12 top-0 w-12 h-12 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full ${colors.icon} flex items-center justify-center shadow-sm relative z-10`}>
                  {index === 0 ? '🚀' :
                   index === 1 ? '📝' :
                   index === 2 ? '📋' :
                   index === 3 ? '🤝' :
                   index === 4 ? '💬' :
                   '✨'}
                </div>
              </div>

              {/* 内容 */}
              <div>
                <h3 className={`text-xl font-bold mb-6 ${colors.title}`}>
                  {titleText}
                </h3>
                <div className="space-y-4">
                  {content.map((line, idx) => {
                    if (!line.trim()) return null;
                    
                    // 文を分割して処理
                    const sentences = line
                      .replace(/^[・＊▼■]+\s*/, '') // 箇条書き記号を削除
                      .split(/\*+/); // アスタリスクで分割
                    
                    // 番号付きリストの場合
                    if (/^\d+\./.test(line)) {
                      const [num, ...textParts] = line.split('.');
                      const text = textParts.join('.').trim();
                      const splitText = text.split(/\*+/);
                      
                      return (
                        <div key={idx} className="flex items-start gap-4 pl-2">
                          <span className={`${colors.title} font-bold min-w-[1.5rem] mt-1.5`}>{num}.</span>
                          <div className="space-y-2">
                            {splitText.map((sentence, sIdx) => (
                              sentence.trim() && (
                                <p key={sIdx} className="text-gray-600">
                                  {sentence.trim()}
                                </p>
                              )
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    // 箇条書きの場合
                    if (line.trim().startsWith('・')) {
                      return (
                        <div key={idx} className="flex items-start gap-4 pl-2">
                          <span className={`${colors.title} min-w-[1rem] mt-1.5`}>•</span>
                          <div className="space-y-2">
                            {sentences.map((sentence, sIdx) => (
                              sentence.trim() && (
                                <p key={sIdx} className="text-gray-600">
                                  {sentence.trim()}
                                </p>
                              )
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    // 通常のテキストの場合
                    return (
                      <div key={idx} className="pl-2 space-y-2">
                        {sentences.map((sentence, sIdx) => (
                          sentence.trim() && (
                            <p key={sIdx} className="text-gray-600">
                              {sentence.trim()}
                            </p>
                          )
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [step, setStep] = useState<'title' | 'selection' | 'result'>('title');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const cities = selectedPrefecture ? CITY_MAP[selectedPrefecture] : [];

  const handleStartSelection = () => {
    setStep('selection');
  };

  const handleBack = () => {
    if (step === 'result') {
      setStep('selection');
    } else if (step === 'selection') {
      setStep('title');
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // テスト用のシンプルなプロンプトで接続を確認
      try {
        const testResult = await model.generateContent('こんにちは');
        console.log('API接続テスト:', await testResult.response.text());
      } catch (testError) {
        console.error('API接続テストエラー:', testError);
        throw new Error('API接続に失敗しました');
      }

      const prompt = `
あなたは${selectedPrefecture}${selectedCity}のひとり親支援制度に詳しい相談員です。
ひとり親家庭の方から${selectedSystem}について相談を受けました。
以下の形式で、具体的にアドバイスしてください。
各セクションは必ず記入し、できるだけ具体的な情報を提供してください。

【制度の名前】
${selectedSystem}に関連する具体的なひとり親支援制度名を列挙
※児童扶養手当、ひとり親医療費助成、就学援助など

【制度の概要】
・対象となるひとり親家庭の条件（所得制限、子どもの年齢など）*具体的な条件を記載
・支援の具体的な内容（金額、サービス内容など）*具体的な金額や内容を記載
・併用できる他のひとり親支援制度*制度名と概要を記載
・利用できるサービスの詳細（頻度、期間、回数など）*具体的な利用条件を記載

【申請の手順】
1. 申請の開始方法*どの窓口に行くか*電話予約が必要か*予約方法の詳細
2. 必要書類の準備方法*どこで入手できるか*準備に必要な期間
3. 申請書の入手方法*窓口での入手方法*郵送での入手方法*オンラインでの入手方法
4. 申請書の提出方法*持参が必須か*郵送可能か*提出時の注意点
5. 審査期間の目安*標準的な審査期間*結果通知方法
6. 支援開始までの流れ*承認後の手続き*支援開始時期

【必要な書類】
・ひとり親であることの証明*戸籍謄本の詳細*離婚届受理証明書の詳細
・本人確認書類*具体的な書類名と注意点
・所得証明関係*必要な証明書の種類*取得方法
・子どもの証明書類*保険証の詳細*在学証明書の詳細
・その他必要書類*具体的な書類名と入手方法

【申請窓口情報】
・${selectedPrefecture}${selectedCity}のひとり親支援窓口の正式名称*窓口の場所
・所在地*最寄り駅からの経路
・電話番号*問い合わせ可能な時間帯
・受付時間*混雑する時間帯の注意点
・アクセス方法*バス路線*駐車場情報
・担当課の名称*担当部署の詳細

【注意事項】
・申請期限や締切日*年度内の申請期限*更新時期
・更新手続きの時期と方法*更新に必要な書類*手続きの流れ
・他の制度との併用可否*併用できる制度の詳細*併用時の注意点
・所得制限や支給停止の条件*具体的な所得制限額*支給停止となる条件
・その他のひとり親家庭向け支援情報*関連する支援制度の紹介

${additionalInfo ? `
【個別の相談内容への回答】
${additionalInfo}
についての具体的なアドバイスと利用可能な支援制度*具体的な対応方法*利用可能な制度の紹介
` : ''}

以下の点に特に注意して回答してください：
1. 必ず全てのセクションに具体的な情報を記入すること
2. 金額や条件は具体的な数値を含めること
3. ${selectedPrefecture}${selectedCity}の実際の窓口情報を含めること
4. 専門用語は避け、分かりやすい言葉で説明すること
5. 申請時の実務的なアドバイスも含めること
6. ひとり親家庭が利用できる関連制度も併せて紹介すること

回答は必ず【】で区切られた各セクションに分けて説明してください。
各セクションの説明は箇条書き（・）や番号付きリスト（1. 2. 3.）を使用してください。
長い説明は「*」で区切って改行してください。
`;

      console.log('生成開始:', { selectedPrefecture, selectedCity, selectedSystem });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('生成完了:', text.substring(0, 100) + '...');

      if (!text || text.trim() === '') {
        throw new Error('空の応答が返されました');
      }

      // 応答を整形
      const formattedText = text
        .split('\n')
        .map(line => {
          // セクションタイトル行はそのまま
          if (line.includes('【')) return line;
          // 箇条書きや番号付きリストの行は前後に改行を追加
          if (line.trim().match(/^[・\d]/) && line.trim().length > 0) {
            return `\n${line}\n`;
          }
          return line;
        })
        .join('\n')
        .replace(/\n{3,}/g, '\n\n'); // 3つ以上の連続した改行を2つに

      setSearchResult(formattedText);
      setStep('result');
    } catch (error) {
      console.error('検索エラー:', error);
      setSearchResult(error instanceof Error ? error.message : '申し訳ありません。情報の取得に失敗しました。しばらく時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 opacity-90" />

      <div className="relative z-10 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {step === 'title' && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-4xl mx-auto px-4 text-center"
            >
              <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-bold mb-4"
              >
                あなたのそばにチャット相談
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xl mb-8"
              >
                24時間365日・誰でも無料・匿名
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartSelection}
                className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                はじめる
              </motion.button>
            </motion.div>
          )}

          {step === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
            >
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl font-bold mb-6"
              >
                お住まいの地域と制度を選択
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    都道府県 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedPrefecture}
                    onChange={(e) => {
                      setSelectedPrefecture(e.target.value);
                      setSelectedCity('');
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">選択してください</option>
                    {Object.keys(CITY_MAP).map((prefecture) => (
                      <option key={prefecture} value={prefecture}>
                        {prefecture}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    市区町村 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                    disabled={!selectedPrefecture}
                  >
                    <option value="">選択してください</option>
                    {selectedPrefecture &&
                      CITY_MAP[selectedPrefecture].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    お困りの内容 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">どのような支援をお探しですか？</option>
                    {SYSTEMS.map((system) => (
                      <option key={system} value={system}>
                        {system}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    具体的な制度名が分からなくても選択してください
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    その他の情報 <span className="text-gray-500">(任意)</span>
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="その他の情報があれば入力してください"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[120px] resize-y"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex justify-between mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="bg-gray-500 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  戻る
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                  disabled={!selectedPrefecture || !selectedCity || !selectedSystem || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      検索中...
                    </>
                  ) : (
                    <>
                      検索する
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-4xl mx-auto p-6"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  制度の説明
                </h2>
                <div className="relative max-w-3xl mx-auto">
                  {/* 垂直の点線 */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <ResultDisplay result={searchResult} isLoading={isLoading} />
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex justify-center mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="bg-gray-500 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  戻る
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;