import React, { useRef } from 'react';
import { 
  ChevronLeft, Headphones, Phone, Newspaper, 
  MapPin, MessageSquare, Mic2, Plus
} from 'lucide-react';
import { Character } from '../types';

interface CharacterDetailProps {
  character: Character;
  onBack: () => void;
  onStartLearning: () => void;
  onUpdateCharacter: (c: Character) => void;
  showToast: (msg: string) => void;
  onCreateNew: () => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({ 
  character, 
  onBack,
  onStartLearning,
  onUpdateCharacter,
  showToast,
  onCreateNew
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onUpdateCharacter({ ...character, avatarUrl: url });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateCharacter({ ...character, name: e.target.value });
  };

  const handleComingSoon = (feature: string) => {
    showToast(`${feature} - 即将推出`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-slide-in-right">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-lg">角色详情</span>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={16} /> 新增
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            <img src={character.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
            更换
          </div>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            accept="image/*" 
          />
        </div>
        
        <div className="flex-1 w-full text-center md:text-left">
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
            角色名称
          </label>
          <input 
            type="text" 
            value={character.name}
            onChange={handleNameChange}
            className="text-3xl font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none w-full transition-colors"
            placeholder="输入角色名称"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={onStartLearning}
          className="bg-blue-50 hover:bg-blue-100 p-6 rounded-3xl cursor-pointer transition-colors flex flex-col items-center gap-3 text-blue-700"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
            <Headphones size={24} />
          </div>
          <span className="font-semibold text-sm">背单词</span>
        </div>

        {[
          { icon: Phone, label: '语音通话' },
          { icon: Newspaper, label: '听新闻' },
          { icon: MapPin, label: '陪你旅游' },
          { icon: MessageSquare, label: '练口语' },
          { icon: Mic2, label: '唱歌' },
        ].map((item, idx) => (
          <div 
            key={idx}
            onClick={() => handleComingSoon(item.label)}
            className="bg-gray-50 hover:bg-gray-100 p-6 rounded-3xl cursor-pointer transition-colors flex flex-col items-center gap-3 text-gray-600"
          >
            <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-500">
              <item.icon size={24} />
            </div>
            <span className="font-semibold text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

