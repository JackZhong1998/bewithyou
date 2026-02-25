import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  Headphones,
  Phone,
  Newspaper,
  MapPin,
  MessageSquare,
  Mic2,
  Plus,
  Share2,
  Trash2,
} from 'lucide-react';
import { Character } from '../types';

interface CharacterDetailProps {
  character: Character;
  onBack: () => void;
  onStartLearning: () => void;
  onUpdateCharacter: (c: Character) => void;
  onDelete?: (characterId: string) => void;
  showToast: (msg: string) => void;
  onCreateNew: () => void;
}

export const CharacterDetail: React.FC<CharacterDetailProps> = ({
  character,
  onBack,
  onStartLearning,
  onUpdateCharacter,
  onDelete,
  showToast,
  onCreateNew,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onUpdateCharacter({ ...character, avatarUrl: url });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateCharacter({ ...character, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateCharacter({ ...character, description: e.target.value });
  };

  const handleShareToggle = () => {
    const next = !(character.isPublic ?? false);
    onUpdateCharacter({ ...character, isPublic: next });
    showToast(next ? '已开启分享，角色将出现在社区' : '已关闭分享');
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(character.id);
      onBack();
    }
    setShowDeleteConfirm(false);
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

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center gap-6">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
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

        <div className="flex-1 w-full text-center md:text-left space-y-4">
          <div>
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
          <div>
            <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">
              角色描述
            </label>
            <textarea
              value={character.description ?? ''}
              onChange={handleDescriptionChange}
              rows={2}
              className="w-full text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
              placeholder="例如：温柔恋人、严厉老师、会耐心纠正发音的男友…"
            />
          </div>
          {character.creatorName && (
            <p className="text-xs text-gray-500">创建者：{character.creatorName}</p>
          )}
        </div>
      </div>

      {/* 分享到社区 */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Share2 size={20} className="text-gray-600" />
          <div>
            <p className="font-semibold text-gray-900">分享到社区</p>
            <p className="text-xs text-gray-500">开启后其他用户可在「社区角色」中看到并使用该角色</p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={character.isPublic ?? false}
          onClick={handleShareToggle}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            character.isPublic ? 'bg-black' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              character.isPublic ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {/* 删除角色 */}
      {onDelete && (
        <div className="border-t border-gray-100 pt-6">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            <Trash2 size={18} /> 删除该角色
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <p className="font-semibold text-gray-900 mb-2">确认删除？</p>
            <p className="text-sm text-gray-500 mb-6">删除后无法恢复，且若已分享到社区将不再展示。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
