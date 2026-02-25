import React, { useState } from 'react';
import { Globe, BookOpen, Mic, User, UserCircle } from 'lucide-react';
import { AuthButtons } from './AuthButtons';
import { LanguageCode } from '../types';
import { ViewState, HomeTab } from '../types';
import { LANGUAGES } from '../constants';

interface HeaderProps {
  view: ViewState;
  homeTab: HomeTab;
  hasSelectedCharacter: boolean;
  currentLang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  goToLearn: () => void;
  goToClone: () => void;
  goToCharacterList: () => void;
  goToCharacterDetail: () => void;
  onBack?: () => void;
  showBackButton: boolean;
}

const TAB_STYLE = 'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors';
const TAB_ACTIVE = 'bg-black text-white';
const TAB_INACTIVE = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

export const Header: React.FC<HeaderProps> = ({
  view,
  homeTab,
  hasSelectedCharacter,
  currentLang,
  setLang,
  goToLearn,
  goToClone,
  goToCharacterList,
  goToCharacterDetail,
  onBack,
  showBackButton,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLangLabel = LANGUAGES.find((l) => l.code === currentLang)?.label || '中文';

  const isLearnActive = view === 'HOME' && homeTab === 'learn';
  const isCloneActive = view === 'HOME' && homeTab === 'clone';
  const isCharacterListActive = view === 'CHARACTER_LIST';
  const isCharacterDetailActive = view === 'CHARACTER_DETAIL';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* 左上角：返回（如有）+ 四个页面 Tab */}
        <div className="flex items-center gap-2 min-w-0">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0"
              title="返回"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <nav className="flex items-center gap-1 flex-wrap">
            <button
              onClick={goToLearn}
              className={`${TAB_STYLE} ${isLearnActive ? TAB_ACTIVE : TAB_INACTIVE}`}
            >
              <BookOpen size={16} /> 背单词
            </button>
            <button
              onClick={goToClone}
              className={`${TAB_STYLE} ${isCloneActive ? TAB_ACTIVE : TAB_INACTIVE}`}
            >
              <Mic size={16} /> 克隆
            </button>
            <button
              onClick={goToCharacterList}
              className={`${TAB_STYLE} ${isCharacterListActive ? TAB_ACTIVE : TAB_INACTIVE}`}
            >
              <User size={16} /> 角色
            </button>
            {hasSelectedCharacter && (
              <button
                onClick={goToCharacterDetail}
                className={`${TAB_STYLE} ${isCharacterDetailActive ? TAB_ACTIVE : TAB_INACTIVE}`}
              >
                <UserCircle size={16} /> 详情
              </button>
            )}
          </nav>
        </div>

        {/* 右侧：语言、登录等 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{currentLangLabel}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLang(lang.code as LanguageCode);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      currentLang === lang.code ? 'font-semibold text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};
