import React, { useMemo, useState } from 'react';
import { ChevronLeft, Volume2, Play, Star } from 'lucide-react';
import { Character, LearningResult, WordLearningRecord } from '../types';
import { VOCABULARY_LIST } from '../constants';
import { playAudio } from '../services/inworldService';
import { storage } from '../utils/storage';
import { useI18n } from '../i18n';

interface LearningViewProps {
  character: Character;
  onBack: () => void;
}

export const LearningView: React.FC<LearningViewProps> = ({ 
  character, 
  onBack 
}) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const word = VOCABULARY_LIST[currentIndex];
  const [playing, setPlaying] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const learningKey = `${character.id}:${word.word}`;
  const learningRecord: WordLearningRecord | null = useMemo(() => {
    const all = storage.getLearningRecords();
    return all[learningKey] || null;
  }, [learningKey]);

  const handlePlay = async (text: string, id: string) => {
    if (playing) return;
    setPlaying(id);
    try {
      await playAudio(text, character.voiceId);
      setTimeout(() => setPlaying(null), 2000);
    } catch (error) {
      console.error('Play audio error:', error);
      setPlaying(null);
    }
  };

  const saveLearningResult = (result: LearningResult) => {
    const all = storage.getLearningRecords();
    const prev: WordLearningRecord | undefined = all[learningKey];
    const base: WordLearningRecord = prev || {
      word: word.word,
      characterId: character.id,
      totalTimes: 0,
      knownTimes: 0,
      lastResult: result,
      lastAt: Date.now(),
    };
    const updated: WordLearningRecord = {
      ...base,
      totalTimes: base.totalTimes + 1,
      knownTimes: base.knownTimes + (result === 'known' ? 1 : 0),
      lastResult: result,
      lastAt: Date.now(),
    };
    all[learningKey] = updated;
    storage.saveLearningRecords(all);
  };

  const handleResultAndNext = (result: LearningResult) => {
    saveLearningResult(result);
    setCurrentIndex((prev) => (prev + 1) % VOCABULARY_LIST.length);
    setPlaying(null);
    setIsFavorite(false);
  };

  const explainText = useMemo(() => {
    const roleDesc = character.description || t('learning.defaultRoleDesc');
    return t('learning.explain', { word: word.word, meaning: word.meaning, roleDesc });
  }, [character.description, t, word.meaning, word.word]);

  const masteryText = useMemo(() => {
    if (!learningRecord) return t('learning.noRecord');
    const rate = learningRecord.totalTimes > 0
      ? Math.round((learningRecord.knownTimes / learningRecord.totalTimes) * 100)
      : 0;
    return t('learning.stats', { total: learningRecord.totalTimes, rate });
  }, [learningRecord, t]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 背景：角色头像模糊大图 */}
      <div className="absolute inset-0">
        <img
          src={character.avatarUrl}
          alt="bg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 h-full max-w-xl mx-auto px-4 py-6 flex flex-col text-white">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur">
            <img
              src={character.avatarUrl}
              className="w-6 h-6 rounded-full border border-white/40"
              alt="avatar"
            />
            <span className="text-xs font-semibold truncate max-w-[120px]">
              {character.name}
            </span>
          </div>
        </div>

        {/* 单词 + 头像区 */}
        <div className="mt-4 mb-6 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-4">
            <span className="text-sm opacity-80">{t('learning.todayWord')}</span>
            <span className="text-xs opacity-60">
              {currentIndex + 1} / {VOCABULARY_LIST.length}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl font-extrabold tracking-wide">
              {word.word}
            </div>
            {word.phonetic && (
              <div className="text-sm opacity-80">[{word.phonetic}]</div>
            )}
            <div className="text-base opacity-90">{word.meaning}</div>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/40 shadow-lg shadow-black/40">
                <img
                  src={character.avatarUrl}
                  alt="char"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handlePlay(word.word, 'main-word')}
                className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {playing === 'main-word' ? (
                  <Volume2 size={22} className="text-blue-600 animate-pulse" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </button>
              <button
                onClick={() => setIsFavorite((v) => !v)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Star
                  size={20}
                  className={isFavorite ? 'text-yellow-300 fill-yellow-300' : 'text-white/60'}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 角色化讲解区 */}
        <div className="mb-4">
          <div className="rounded-3xl bg-white/10 backdrop-blur border border-white/10 p-4 text-sm leading-relaxed">
            {explainText}
          </div>
        </div>

        {/* 例句区 */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          {word.sentences.map((sent, idx) => {
            const id = `sent-${idx}`;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white/10 border border-white/10 p-4 flex items-start gap-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">
                    {sent.en}
                  </p>
                  <p className="text-xs opacity-70 mt-1">{sent.cn}</p>
                </div>
                <button
                  onClick={() => handlePlay(sent.en, id)}
                  className="mt-1 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  {playing === id ? (
                    <Volume2 size={18} className="animate-pulse text-blue-300" />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* 学习记录 + 认识/模糊/不认识 */}
        <div className="mt-4">
          <div className="text-[11px] opacity-70 mb-3">{masteryText}</div>
          <div className="grid grid-cols-3 gap-3 pb-4">
            <button
              onClick={() => handleResultAndNext('known')}
              className="py-3 rounded-2xl bg-emerald-400 text-gray-900 font-semibold text-sm shadow-lg shadow-emerald-500/40"
            >
              {t('learning.known')} 😊
            </button>
            <button
              onClick={() => handleResultAndNext('vague')}
              className="py-3 rounded-2xl bg-amber-300 text-gray-900 font-semibold text-sm shadow-lg shadow-amber-400/40"
            >
              {t('learning.vague')} 🤔
            </button>
            <button
              onClick={() => handleResultAndNext('unknown')}
              className="py-3 rounded-2xl bg-rose-400 text-gray-900 font-semibold text-sm shadow-lg shadow-rose-500/40"
            >
              {t('learning.unknown')} 😵
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-[10px] text-center opacity-60 pb-safe">
          {t('learning.tip')}
        </div>
      </div>
    </div>
  );
};

