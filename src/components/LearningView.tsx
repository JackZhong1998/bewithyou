import React, { useState } from 'react';
import { ChevronLeft, Volume2, Play, RefreshCw, ChevronRight } from 'lucide-react';
import { Character } from '../types';
import { VOCABULARY_LIST } from '../constants';
import { playAudio } from '../services/inworldService';

interface LearningViewProps {
  character: Character;
  onBack: () => void;
}

export const LearningView: React.FC<LearningViewProps> = ({ 
  character, 
  onBack 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const word = VOCABULARY_LIST[currentIndex];
  const [playing, setPlaying] = useState<string | null>(null);

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

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % VOCABULARY_LIST.length);
    setPlaying(null);
  };

  const reloadCurrent = () => {
    handlePlay(word.word, 'main-word');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 h-screen flex flex-col animate-slide-in-right">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1">
          <img src={character.avatarUrl} className="w-6 h-6 rounded-full" alt="avatar" />
          <span className="text-xs font-semibold text-gray-700">{character.name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Word Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-100/50 border border-gray-50 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{word.word}</h1>
          <p className="text-xl text-gray-500 font-medium">{word.meaning}</p>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <img 
              src={character.avatarUrl} 
              className="w-8 h-8 rounded-full border border-gray-200" 
              alt="char" 
            />
            <button 
              onClick={() => handlePlay(word.word, 'main-word')}
              className="p-4 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600 transition-colors inline-flex"
            >
              {playing === 'main-word' ? (
                <Volume2 size={20} className="animate-pulse text-blue-600" />
              ) : (
                <Play fill="currentColor" size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Sentences */}
        <div className="space-y-4">
          {word.sentences.map((sent, idx) => {
            const id = `sent-${idx}`;
            return (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800 leading-relaxed">{sent.en}</p>
                  <p className="text-sm text-gray-400 mt-2">{sent.cn}</p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-1">
                  <img 
                    src={character.avatarUrl} 
                    className="w-8 h-8 rounded-full border border-gray-200" 
                    alt="char" 
                  />
                  <button 
                    onClick={() => handlePlay(sent.en, id)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {playing === id ? (
                      <Volume2 size={18} className="text-blue-600 animate-pulse" />
                    ) : (
                      <Volume2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8 pb-8">
        <button 
          onClick={reloadCurrent}
          className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw size={20} /> 重读
        </button>
        <button 
          onClick={nextWord}
          className="flex-1 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 shadow-lg shadow-black/20"
        >
          下一个单词 <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

