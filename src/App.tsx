import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CloneView } from './components/CloneView';
import { CharacterList } from './components/CharacterList';
import { CharacterDetail } from './components/CharacterDetail';
import { LearningView } from './components/LearningView';
import { Toast } from './components/Toast';
import { ViewState, LanguageCode, Character } from './types';
import { storage } from './utils/storage';
import { LANGUAGES } from './constants';

const App = () => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('zh-CN');
  const [view, setView] = useState<ViewState>('CLONE');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load saved language and characters
  useEffect(() => {
    const savedLang = storage.getLanguage();
    if (savedLang && LANGUAGES.find(l => l.code === savedLang)) {
      setCurrentLang(savedLang as LanguageCode);
    }

    const savedChars = storage.getCharacters();
    if (savedChars && savedChars.length > 0) {
      setCharacters(savedChars);
    }
  }, []);

  // Save characters when they change
  useEffect(() => {
    if (characters.length > 0) {
      storage.saveCharacters(characters);
    }
  }, [characters]);

  const handleLangChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    storage.setLanguage(lang);
  };

  const handleCloneStart = (tempChar: Character) => {
    setCharacters(prev => [tempChar, ...prev]);
  };

  const handleCloneSuccess = (newChar: Character) => {
    setCharacters(prev => prev.map(c => 
      c.id === newChar.id ? newChar : c
    ));
  };

  const handleCloneFailed = (charId: string) => {
    setCharacters(prev => prev.filter(c => c.id !== charId));
  };

  const handleSelectCharacter = (char: Character) => {
    if (char.status === 'ready') {
      setSelectedCharId(char.id);
      setView('CHARACTER_DETAIL');
    }
  };

  const selectedChar = characters.find(c => c.id === selectedCharId);

  const updateCharacter = (updated: Character) => {
    setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  let content;
  switch (view) {
    case 'CLONE':
      content = (
        <CloneView 
          onCloneSuccess={handleCloneSuccess}
          onCloneFailed={handleCloneFailed}
          onCloneStart={handleCloneStart}
          hasInvited={storage.hasInvited()}
          characters={characters}
          onSelectCharacter={handleSelectCharacter}
        />
      );
      break;
    case 'CHARACTER_LIST':
      content = (
        <CharacterList 
          characters={characters} 
          onSelect={(c) => {
            setSelectedCharId(c.id);
            setView('CHARACTER_DETAIL');
          }} 
          onCreateNew={() => setView('CLONE')}
        />
      );
      break;
    case 'CHARACTER_DETAIL':
      if (selectedChar) {
        content = (
          <CharacterDetail 
            character={selectedChar} 
            onBack={() => setView('CHARACTER_LIST')}
            onStartLearning={() => setView('LEARNING')}
            onUpdateCharacter={updateCharacter}
            showToast={setToastMsg}
            onCreateNew={() => setView('CLONE')}
          />
        );
      }
      break;
    case 'LEARNING':
      if (selectedChar) {
        content = (
          <LearningView 
            character={selectedChar} 
            onBack={() => setView('CHARACTER_DETAIL')}
          />
        );
      }
      break;
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50/50 pb-safe">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
      
      {view !== 'LEARNING' && (
        <Header 
          currentLang={currentLang} 
          setLang={handleLangChange} 
          goHome={() => setView('CLONE')}
          goToCharacters={() => {
            if (characters.length > 0) setView('CHARACTER_LIST');
            else setView('CLONE');
          }}
        />
      )}

      <main className="pt-2">
        {content}
      </main>

      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default App;

