import React from 'react';
import { BookOpen, Mic } from 'lucide-react';
import { Character } from '../types';
import { CloneView } from './CloneView';
import { HomeTab } from '../types';
import { useI18n } from '../i18n';

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
  const { t } = useI18n();
  const readyCharacters = characters.filter((c) => c.status === 'ready');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tab 切换 */}
      <div className="mb-7 flex rounded-2xl border border-black/10 bg-white p-1">
        <button
          onClick={() => setHomeTab('learn')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-colors ${
            homeTab === 'learn'
              ? 'bg-[#1d1d1f] text-white'
              : 'text-gray-500 hover:bg-black/5 hover:text-gray-700'
          }`}
        >
          <BookOpen size={18} />
          {t('home.learnTab')}
        </button>
        <button
          onClick={() => setHomeTab('clone')}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-colors ${
            homeTab === 'clone'
              ? 'bg-[#1d1d1f] text-white'
              : 'text-gray-500 hover:bg-black/5 hover:text-gray-700'
          }`}
        >
          <Mic size={18} />
          {t('home.cloneTab')}
        </button>
      </div>

      {homeTab === 'learn' ? (
        /* 背单词 Tab：选角色开始学习 */
        <div className="px-2 pb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">{t('home.learnTitle')}</h2>
            {readyCharacters.length > 0 && (
              <button
                onClick={onGoToCharacterList}
                className="text-sm font-medium text-gray-500 hover:text-black"
              >
                {t('home.manageCharacters')}
              </button>
            )}
          </div>

          {readyCharacters.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-700 font-medium mb-2">{t('home.emptyReadyTitle')}</p>
              <p className="text-sm text-gray-500 mb-6">{t('home.emptyReadyDesc')}</p>
              <button
                onClick={() => setHomeTab('clone')}
                className="rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
              >
                {t('home.goClone')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {readyCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacterForLearning(char)}
                  className="group cursor-pointer rounded-3xl border border-black/10 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="truncate font-semibold text-[#1d1d1f]">{char.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{t('home.tapToStart')}</p>
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
