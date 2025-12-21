import React from 'react';
import { Plus } from 'lucide-react';
import { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
  onSelect: (char: Character) => void;
  onCreateNew: () => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({ 
  characters, 
  onSelect,
  onCreateNew
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">我的角色</h2>
        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={16} /> 新增
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {characters.map(char => (
          <div 
            key={char.id}
            onClick={() => onSelect(char)}
            className={`
              group relative bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer overflow-hidden
              ${char.status === 'cloning' ? 'opacity-50' : ''}
            `}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
              <img 
                src={char.avatarUrl} 
                alt={char.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {char.status === 'cloning' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-xs font-medium">克隆中...</div>
                </div>
              )}
            </div>
            <h3 className="font-bold text-gray-900 truncate">{char.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(char.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

