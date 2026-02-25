import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Users, User, Flame, Clock } from 'lucide-react';
import { Character } from '../types';
import { MOCK_COMMUNITY_CHARACTERS } from '../constants';
import { fetchPublicCharacters } from '../services/characterDb';

const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

type ListTab = 'mine' | 'community';
type CommunitySort = 'hot' | 'new';

interface CharacterListProps {
  characters: Character[];
  onSelect: (char: Character) => void;
  onCreateNew: () => void;
  onUseCommunity?: (char: Character) => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  onSelect,
  onCreateNew,
  onUseCommunity,
}) => {
  const [tab, setTab] = useState<ListTab>('mine');
  const [communitySort, setCommunitySort] = useState<CommunitySort>('new');
  const [communityFromDb, setCommunityFromDb] = useState<Character[] | null>(null);

  useEffect(() => {
    if (tab === 'community' && hasSupabase) {
      fetchPublicCharacters().then(setCommunityFromDb);
    }
  }, [tab]);

  const communityList = communityFromDb !== null && hasSupabase ? communityFromDb : MOCK_COMMUNITY_CHARACTERS;

  const sortedCommunity = useMemo(() => {
    const list = [...communityList];
    if (communitySort === 'new') {
      list.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      list.sort((a, b) => a.createdAt - b.createdAt);
    }
    return list;
  }, [communityList, communitySort]);

  const handleUseCommunity = (c: Character) => {
    const copy: Character = {
      ...c,
      id: `copy-${c.id}-${Date.now()}`,
      createdAt: Date.now(),
      creatorName: '本机用户',
      voiceId: c.voiceId || '',
    };
    onUseCommunity?.(copy);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Tab: 我的角色 | 社区角色 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('mine')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'mine'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={18} />
          我的角色
        </button>
        <button
          onClick={() => setTab('community')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'community'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} />
          社区角色
        </button>
      </div>

      {tab === 'mine' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">我的角色</h2>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
            >
              <Plus size={16} /> 新增
            </button>
          </div>

          {characters.length === 0 ? (
            <div className="rounded-3xl bg-gray-50 border border-gray-100 p-12 text-center">
              <User className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600 font-medium mb-2">还没有角色</p>
              <p className="text-sm text-gray-500 mb-6">点击「新增」克隆你的第一个声音角色</p>
              <button
                onClick={onCreateNew}
                className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
              >
                新增角色
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {characters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => onSelect(char)}
                  className={`group relative bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer overflow-hidden ${
                    char.status === 'cloning' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 relative">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {char.status === 'cloning' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">克隆中...</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{char.name}</h3>
                  {char.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{char.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(char.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">社区角色</h2>
            <div className="flex rounded-full bg-gray-100 p-0.5">
              <button
                onClick={() => setCommunitySort('hot')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  communitySort === 'hot' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                <Flame size={14} /> 最热
              </button>
              <button
                onClick={() => setCommunitySort('new')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  communitySort === 'new' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                <Clock size={14} /> 最新
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6">使用后角色会复制到「我的角色」，不占用克隆额度。</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sortedCommunity.map((char) => (
              <div
                key={char.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-gray-900 truncate">{char.name}</h3>
                {char.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{char.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">by {char.creatorName || '社区'}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onSelect(char)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    预览
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseCommunity(char);
                    }}
                    className="flex-1 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800"
                  >
                    使用
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
