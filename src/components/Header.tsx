import React, { useState } from 'react';
import { Globe, User } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES } from '../constants';

interface HeaderProps {
  currentLang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  goHome: () => void;
  goToCharacters: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentLang, 
  setLang, 
  goHome,
  goToCharacters
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLangLabel = LANGUAGES.find(l => l.code === currentLang)?.label || '中文';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={goHome} 
          className="font-bold text-2xl tracking-tighter cursor-pointer select-none bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          withyou
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={goToCharacters}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <User size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              <Globe size={16} />
              <span>{currentLangLabel}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLang(lang.code as LanguageCode);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      currentLang === lang.code ? 'font-bold text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

