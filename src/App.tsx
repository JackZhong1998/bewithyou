import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import { I18nProvider } from './i18n';
import {
  fetchMyCharacters,
  upsertCharacter,
  deleteCharacter,
  shouldSyncCharacterToSupabase,
} from './services/characterDb';

const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const App = () => {
  const { userId } = useAuth();
  const [currentLang, setCurrentLang] = useState<LanguageCode>('zh-CN');
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    const savedLang = storage.getLanguage();
    if (savedLang && LANGUAGES.find((l) => l.code === savedLang)) {
      setCurrentLang(savedLang as LanguageCode);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setOnboardingDone(storage.getOnboardingDone());
      return;
    }
    setOnboardingDone(false);
  }, [userId]);

  const handleLangChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    storage.setLanguage(lang);
  };

  return (
    <I18nProvider language={currentLang} setLanguage={handleLangChange}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/onboarding"
          element={
            userId ? (
              onboardingDone ? (
                <Navigate to="/app/learn" replace />
              ) : (
                <OnboardingQuestions onComplete={() => setOnboardingDone(true)} />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/app/*"
          element={
            userId ? (
              onboardingDone ? (
                <ProductApp currentLang={currentLang} onLanguageChange={handleLangChange} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={userId ? (onboardingDone ? '/app/learn' : '/onboarding') : '/'}
              replace
            />
          }
        />
      </Routes>
    </I18nProvider>
  );
};

interface ProductAppProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const ProductApp: React.FC<ProductAppProps> = ({ currentLang, onLanguageChange }) => {
  const { userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lastSelectedCharId, setLastSelectedCharId] = useState<string | null>(null);
  const [previewCharacter, setPreviewCharacter] = useState<Character | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 角色列表：已登录且配置了 Supabase 则从数据库拉取，否则从本地恢复
  useEffect(() => {
    if (userId && hasSupabase) {
      fetchMyCharacters(userId).then(setCharacters);
    } else {
      const saved = storage.getCharacters();
      setCharacters(saved?.length ? saved : []);
    }
  }, [userId]);

  // 角色变更：写回本地；Supabase 只同步「ready + 已有 Inworld voice_id」
  //（含分享到社区：is_public 与 voice_id 同一行 upsert）
  useEffect(() => {
    storage.saveCharacters(characters);
    if (userId && hasSupabase) {
      characters.filter(shouldSyncCharacterToSupabase).forEach((c) => {
        void upsertCharacter(userId, c);
      });
    }
  }, [characters, userId]);

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
      setPreviewCharacter(char);
      setLastSelectedCharId(char.id);
      navigate(`/app/characters/${char.id}`);
    }
  };

  const isLearningView = location.pathname.startsWith('/app/learning/');
  const isCharacterDetailView = location.pathname.startsWith('/app/characters/') && location.pathname !== '/app/characters';
  const isCharacterListView = location.pathname === '/app/characters';
  const homeTab: HomeTab = location.pathname === '/app/clone' ? 'clone' : 'learn';
  const view: ViewState = isLearningView
    ? 'LEARNING'
    : isCharacterDetailView
      ? 'CHARACTER_DETAIL'
      : isCharacterListView
        ? 'CHARACTER_LIST'
        : 'HOME';

  const detailId = useMemo(() => {
    const match = location.pathname.match(/^\/app\/characters\/([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  }, [location.pathname]);

  const learningId = useMemo(() => {
    const match = location.pathname.match(/^\/app\/learning\/([^/]+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  }, [location.pathname]);

  const activeCharacterId = learningId || detailId || lastSelectedCharId;
  const selectedChar = useMemo(() => {
    if (!activeCharacterId) return null;
    const found = characters.find((c) => c.id === activeCharacterId);
    if (found) return found;
    if (previewCharacter?.id === activeCharacterId) return previewCharacter;
    return null;
  }, [activeCharacterId, characters, previewCharacter]);

  useEffect(() => {
    if (selectedChar) {
      setLastSelectedCharId(selectedChar.id);
    }
  }, [selectedChar]);

  useEffect(() => {
    if ((isCharacterDetailView || isLearningView) && !selectedChar) {
      navigate('/app/characters', { replace: true });
    }
  }, [isCharacterDetailView, isLearningView, navigate, selectedChar]);

  const updateCharacter = (updated: Character) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== characterId));
    if (lastSelectedCharId === characterId) setLastSelectedCharId(null);
    if (previewCharacter?.id === characterId) setPreviewCharacter(null);
    if (userId && hasSupabase) deleteCharacter(userId, characterId);
  };

  let content;
  switch (view) {
    case 'HOME':
      content = (
        <HomeView
          homeTab={homeTab}
          setHomeTab={(tab) => navigate(tab === 'learn' ? '/app/learn' : '/app/clone')}
          characters={characters}
          onSelectCharacterForLearning={(c) => {
            setPreviewCharacter(c);
            setLastSelectedCharId(c.id);
            navigate(`/app/learning/${c.id}`);
          }}
          onCloneSuccess={handleCloneSuccess}
          onCloneFailed={handleCloneFailed}
          onCloneStart={handleCloneStart}
          hasInvited={storage.hasInvited()}
          onSelectCharacter={handleSelectCharacter}
          onGoToCharacterList={() => navigate('/app/characters')}
        />
      );
      break;
    case 'CHARACTER_LIST':
      content = (
        <CharacterList 
          characters={characters} 
          onSelect={(c) => {
            setPreviewCharacter(c);
            setLastSelectedCharId(c.id);
            navigate(`/app/characters/${c.id}`);
          }} 
          onCreateNew={() => navigate('/app/clone')}
          onUseCommunity={(char) => setCharacters((prev) => [char, ...prev])}
        />
      );
      break;
    case 'CHARACTER_DETAIL':
      if (selectedChar) {
        content = (
          <CharacterDetail 
            character={selectedChar} 
            onBack={() => navigate('/app/characters')}
            onStartLearning={() => navigate(`/app/learning/${selectedChar.id}`)}
            onUpdateCharacter={updateCharacter}
            onDelete={handleDeleteCharacter}
            showToast={setToastMsg}
            onCreateNew={() => navigate('/app/clone')}
          />
        );
      }
      break;
    case 'LEARNING':
      if (selectedChar) {
        content = (
          <LearningView 
            character={selectedChar} 
            onBack={() => navigate(`/app/characters/${selectedChar.id}`)}
          />
        );
      }
      break;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
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
        hasSelectedCharacter={!!lastSelectedCharId}
        currentLang={currentLang}
        setLang={onLanguageChange}
        goHome={() => navigate('/')}
        goToLearn={() => navigate('/app/learn')}
        goToClone={() => navigate('/app/clone')}
        goToCharacterList={() => navigate('/app/characters')}
        goToCharacterDetail={() => lastSelectedCharId && navigate(`/app/characters/${lastSelectedCharId}`)}
        onBack={
          view === 'LEARNING' && selectedChar ? () => navigate(`/app/characters/${selectedChar.id}`)
          : view === 'CHARACTER_DETAIL' ? () => navigate('/app/characters')
          : undefined
        }
        showBackButton={view === 'LEARNING' || view === 'CHARACTER_DETAIL'}
      />

      <main className="min-h-screen min-w-0 flex-1 overflow-x-auto pb-safe py-6">
        <div className="mx-auto max-w-5xl px-5">{content}</div>
      </main>

      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
};

export default App;

