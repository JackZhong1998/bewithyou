import React, { useState } from 'react';
import { BookOpen, Mic } from 'lucide-react';
import { Character } from '../types';
import { CloneView } from './CloneView';
import { HomeTab } from '../types';

interface HomeViewProps {
  homeTab: HomeTab;
  setHomeTab: (t: HomeTab) => void;
  characters: Character[];
  onSelectCharacterForLearning: (char: Character) => void;
  onCloneSuccess: (char: Character) => void;
  onCloneFailed?: (charId: string) => void;
  onCloneStart?: (char: Character) => void;
  hasInvited: boolean;
  onSelectCharacter: (char: Character) => void;
  onGoToCharacterList: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  homeTab,
  setHomeTab,
  characters,
  onSelectCharacterForLearning,
  onCloneSuccess,
  onCloneFailed,
  onCloneStart,
  hasInvited,
  onSelectCharacter,
  onGoToCharacterList,
}) => {
  const readyCharacters = characters.filter((c) => c.status === 'ready');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab 切换 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setHomeTab('learn')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors border-b-2 ${
            homeTab === 'learn'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen size={18} />
          背单词
        </button>
        <button
          onClick={() => setHomeTab('clone')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors border-b-2 ${
            homeTab === 'clone'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mic size={18} />
          克隆
        </button>
      </div>

      {homeTab === 'learn' ? (
        /* 背单词 Tab：选角色开始学习 */
        <div className="px-4 pb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">选一个角色陪你背单词</h2>
            {readyCharacters.length > 0 && (
              <button
                onClick={onGoToCharacterList}
                className="text-sm font-medium text-gray-500 hover:text-black"
              >
                管理角色
              </button>
            )}
          </div>

          {readyCharacters.length === 0 ? (
            <div className="rounded-3xl bg-gray-50 border border-gray-100 p-12 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600 font-medium mb-2">还没有可用的角色</p>
              <p className="text-sm text-gray-500 mb-6">先去「克隆」tab 创建一个声音角色吧</p>
              <button
                onClick={() => setHomeTab('clone')}
                className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
              >
                去克隆
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {readyCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacterForLearning(char)}
                  className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{char.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">点击开始背单词</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 克隆 Tab */
        <CloneView
          onCloneSuccess={onCloneSuccess}
          onCloneFailed={onCloneFailed}
          onCloneStart={onCloneStart}
          hasInvited={hasInvited}
          characters={characters}
          onSelectCharacter={onSelectCharacter}
        />
      )}
    </div>
  );
};
