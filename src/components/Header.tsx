import React, { useState } from 'react';
import { Globe, BookOpen, Mic, User, UserCircle } from 'lucide-react';
import { AuthButtons } from './AuthButtons';
import { LanguageCode } from '../types';
import { ViewState, HomeTab } from '../types';
import { LANGUAGES } from '../constants';
import { useI18n } from '../i18n';

interface HeaderProps {
  view: ViewState;
  homeTab: HomeTab;
  hasSelectedCharacter: boolean;
  currentLang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  goHome: () => void;
  goToLearn: () => void;
  goToClone: () => void;
  goToCharacterList: () => void;
  goToCharacterDetail: () => void;
  onBack?: () => void;
  showBackButton: boolean;
}

const TAB_STYLE =
  'flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors justify-start';
const TAB_ACTIVE = 'bg-[#1d1d1f] text-white';
const TAB_INACTIVE = 'text-gray-600 hover:bg-black/5 hover:text-gray-900';

export const Header: React.FC<HeaderProps> = ({
  view,
  homeTab,
  hasSelectedCharacter,
  currentLang,
  setLang,
  goHome,
  goToLearn,
  goToClone,
  goToCharacterList,
  goToCharacterDetail,
  onBack,
  showBackButton,
}) => {
  const { t } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLangLabel = LANGUAGES.find((l) => l.code === currentLang)?.label || '简体中文';

  const isLearnActive = view === 'HOME' && homeTab === 'learn';
  const isCloneActive = view === 'HOME' && homeTab === 'clone';
  const isCharacterListActive = view === 'CHARACTER_LIST';
  const isCharacterDetailActive = view === 'CHARACTER_DETAIL';

  return (
    <aside className="sticky top-0 z-50 flex h-screen w-[232px] shrink-0 flex-col border-r border-black/10 bg-[#fbfbfd] pb-safe">
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <button
          type="button"
          onClick={goHome}
          className="mb-2 flex items-center rounded-xl px-2.5 py-2 text-left transition hover:bg-black/5"
        >
          <span className="text-base font-semibold tracking-tight text-[#1d1d1f]">bewithyou</span>
        </button>
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="mb-2 flex shrink-0 items-center gap-2 rounded-xl p-2 text-gray-600 transition hover:bg-black/5"
            title={t('nav.back')}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{t('nav.back')}</span>
          </button>
        )}

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          <button type="button" onClick={goToLearn} className={`${TAB_STYLE} ${isLearnActive ? TAB_ACTIVE : TAB_INACTIVE}`}>
            <BookOpen size={16} className="shrink-0" /> {t('nav.learn')}
          </button>
          <button type="button" onClick={goToClone} className={`${TAB_STYLE} ${isCloneActive ? TAB_ACTIVE : TAB_INACTIVE}`}>
            <Mic size={16} className="shrink-0" /> {t('nav.clone')}
          </button>
          <button type="button" onClick={goToCharacterList} className={`${TAB_STYLE} ${isCharacterListActive ? TAB_ACTIVE : TAB_INACTIVE}`}>
            <User size={16} className="shrink-0" /> {t('nav.characters')}
          </button>
          {hasSelectedCharacter && (
            <button type="button" onClick={goToCharacterDetail} className={`${TAB_STYLE} ${isCharacterDetailActive ? TAB_ACTIVE : TAB_INACTIVE}`}>
              <UserCircle size={16} className="shrink-0" /> {t('nav.detail')}
            </button>
          )}
        </nav>

        <div className="mt-auto shrink-0 space-y-3 border-t border-black/5 pt-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-black/5 hover:text-black"
            >
              <Globe size={16} className="shrink-0" />
              <span className="truncate">{currentLangLabel}</span>
            </button>
            {showLangMenu && (
              <div className="absolute bottom-0 left-full z-50 ml-1 w-40 rounded-2xl border border-black/10 bg-white py-1 shadow-lg">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLang(lang.code as LanguageCode);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      currentLang === lang.code ? 'font-semibold text-black' : 'text-gray-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-start px-1">
            <AuthButtons />
          </div>
        </div>
      </div>
    </aside>
  );
};
