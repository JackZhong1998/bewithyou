import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CharacterList } from './components/CharacterList';
import { CharacterDetail } from './components/CharacterDetail';
import { LearningView } from './components/LearningView';
import { Toast } from './components/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingQuestions } from './components/landing/OnboardingQuestions';
import { ViewState, HomeTab, LanguageCode, Character } from './types';
import { storage } from './utils/storage';
import { LANGUAGES } from './constants';
import { fetchMyCharacters, upsertCharacter, deleteCharacter } from './services/characterDb';

const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const App = () => {
  const { userId } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    if (userId) setOnboardingDone(storage.getOnboardingDone());
  }, [userId]);

  // 官网流程：未登录 → 落地页；已登录未完成问卷 → 问卷；否则 → 产品内页
  if (!userId) return <LandingPage />;
  if (!onboardingDone) {
    return (
      <OnboardingQuestions
        onComplete={() => setOnboardingDone(true)}
      />
    );
  }

  return <ProductApp />;
};

const ProductApp = () => {
  const { userId } = useAuth();
  const [currentLang, setCurrentLang] = useState<LanguageCode>('zh-CN');
  const [view, setView] = useState<ViewState>('HOME');
  const [homeTab, setHomeTab] = useState<HomeTab>('learn');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 语言：始终从本地恢复
  useEffect(() => {
    const savedLang = storage.getLanguage();
    if (savedLang && LANGUAGES.find(l => l.code === savedLang)) {
      setCurrentLang(savedLang as LanguageCode);
    }
  }, []);

  // 角色列表：已登录且配置了 Supabase 则从数据库拉取，否则从本地恢复
  useEffect(() => {
    if (userId && hasSupabase) {
      fetchMyCharacters(userId).then(setCharacters);
    } else {
      const saved = storage.getCharacters();
      setCharacters(saved?.length ? saved : []);
    }
  }, [userId]);

  // 角色变更：写回本地，已登录且配置了 Supabase 则同步到数据库
  useEffect(() => {
    if (characters.length > 0) storage.saveCharacters(characters);
    if (userId && hasSupabase) {
      characters.forEach((c) => upsertCharacter(userId, c));
    }
  }, [characters, userId]);

  const handleLangChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    storage.setLanguage(lang);
  };

  const handleCloneStart = (tempChar: Character) => {
    setCharacters(prev => [tempChar, ...prev]);
  };

  const handleCloneSuccess = (newChar: Character) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === newChar.id ? newChar : c))
    );
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
    setCharacters((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== characterId));
    if (selectedCharId === characterId) setSelectedCharId(null);
    if (userId && hasSupabase) deleteCharacter(userId, characterId);
  };

  let content;
  switch (view) {
    case 'HOME':
      content = (
        <HomeView
          homeTab={homeTab}
          setHomeTab={setHomeTab}
          characters={characters}
          onSelectCharacterForLearning={(c) => {
            setSelectedCharId(c.id);
            setView('LEARNING');
          }}
          onCloneSuccess={handleCloneSuccess}
          onCloneFailed={handleCloneFailed}
          onCloneStart={handleCloneStart}
          hasInvited={storage.hasInvited()}
          onSelectCharacter={handleSelectCharacter}
          onGoToCharacterList={() => setView('CHARACTER_LIST')}
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
          onCreateNew={() => {
            setHomeTab('clone');
            setView('HOME');
          }}
          onUseCommunity={(char) => setCharacters((prev) => [char, ...prev])}
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
            onDelete={handleDeleteCharacter}
            showToast={setToastMsg}
            onCreateNew={() => {
              setHomeTab('clone');
              setView('HOME');
            }}
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
      
      <Header
        view={view}
        homeTab={homeTab}
        hasSelectedCharacter={!!selectedCharId}
        currentLang={currentLang}
        setLang={handleLangChange}
        goToLearn={() => { setView('HOME'); setHomeTab('learn'); }}
        goToClone={() => { setView('HOME'); setHomeTab('clone'); }}
        goToCharacterList={() => setView('CHARACTER_LIST')}
        goToCharacterDetail={() => selectedCharId && setView('CHARACTER_DETAIL')}
        onBack={
          view === 'LEARNING' ? () => setView('CHARACTER_DETAIL')
          : view === 'CHARACTER_DETAIL' ? () => setView('CHARACTER_LIST')
          : undefined
        }
        showBackButton={view === 'LEARNING' || view === 'CHARACTER_DETAIL'}
      />

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

