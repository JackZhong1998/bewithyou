import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, Video } from 'lucide-react';
import { Character } from '../types';
import { 
  AUDIO_SOURCE_LANGUAGES, 
  LANGUAGE_CODE_MAP, 
  VIDEO_TOOLS
} from '../constants';
import { cloneVoice } from '../services/inworldService';
import { InviteModal } from './InviteModal';

interface CloneViewProps {
  onCloneSuccess: (char: Character) => void;
  onCloneFailed?: (charId: string) => void;
  hasInvited: boolean;
  onCloneStart?: (char: Character) => void;
  characters?: Character[];
  onSelectCharacter?: (char: Character) => void;
}

export const CloneView: React.FC<CloneViewProps> = ({ 
  onCloneSuccess, 
  onCloneFailed,
  hasInvited,
  onCloneStart,
  characters = [],
  onSelectCharacter
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('English');
  const [removeNoise, setRemoveNoise] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [cloningProgress, setCloningProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleStartClone = () => {
    if (!selectedFile) return;
    if (!agreed) return;
    
    if (!hasInvited) {
      setShowInviteModal(true);
    } else {
      processCloning();
    }
  };

  const processCloning = async () => {
    setIsProcessing(true);
    setCloningProgress('正在处理音频...');
    
    // Create cloning character first
    const tempChar: Character = {
      id: Date.now().toString(),
      name: `Clone ${new Date().toLocaleDateString()}`,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
      voiceId: '',
      status: 'cloning',
      createdAt: Date.now()
    };
    
    if (onCloneStart) {
      onCloneStart(tempChar);
    }
    
    try {
      const langCode = LANGUAGE_CODE_MAP[sourceLang] || 'AUTO';
      const voiceId = await cloneVoice(
        selectedFile!, 
        `Clone ${new Date().toLocaleDateString()}`,
        langCode,
        removeNoise
      );
      
      setCloningProgress('克隆完成！');
      
      const newChar: Character = {
        ...tempChar,
        voiceId: voiceId,
        status: 'ready',
      };
      
      setTimeout(() => {
        onCloneSuccess(newChar);
        setCloningProgress(null);
        // Reset form
        setSelectedFile(null);
        setAgreed(false);
        setRemoveNoise(false);
      }, 500);
    } catch (error: any) {
      console.error('Cloning failed:', error);
      alert(`克隆失败: ${error.message || '请重试'}`);
      setCloningProgress(null);
      // Remove failed character
      if (onCloneFailed) {
        onCloneFailed(tempChar.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInviteSuccess = () => {
    setShowInviteModal(false);
    processCloning();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">克隆声音</h1>
        <p className="text-gray-500">创建属于你的数字陪伴</p>
      </div>

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300
          ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="audio/*" 
          className="hidden" 
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${selectedFile ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            {selectedFile ? <CheckCircle size={32} /> : <Upload size={32} />}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {selectedFile ? selectedFile.name : '点击上传音频'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              支持 WAV, MP3, M4A (最大 10MB)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              建议：5-15秒清晰音频，避免背景噪音
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">原声语言</label>
          <select 
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AUDIO_SOURCE_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={removeNoise}
              onChange={(e) => setRemoveNoise(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
            />
            <span className="text-sm text-gray-600">
              去掉背景噪音
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
            />
            <span className="text-sm text-gray-500 leading-relaxed">
              同意用户协议和隐私协议。通过使用语音克隆，您证明您拥有克隆这些语音样本的所有法律同意/权利，并且您不会将生成的任何用于非法或有害目的。该服务受服务条款和隐私政策的约束。
            </span>
          </label>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={handleStartClone}
        disabled={!selectedFile || !agreed || isProcessing}
        className={`
          w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all transform active:scale-95
          ${(!selectedFile || !agreed || isProcessing) 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-black text-white hover:bg-gray-800 shadow-blue-500/20'}
        `}
      >
        {isProcessing ? (cloningProgress || '克隆中...') : '去克隆'}
      </button>

      {/* Cloning Progress */}
      {cloningProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-blue-700 font-medium">{cloningProgress}</p>
        </div>
      )}

      {/* Video Tools */}
      <div className="pt-8 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">视频下载工具推荐</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VIDEO_TOOLS.map((tool) => (
            <a 
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Video size={14} />
              {tool.name}
            </a>
          ))}
        </div>
      </div>

      {showInviteModal && (
        <InviteModal 
          onClose={() => setShowInviteModal(false)}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Character List Below Clone Form */}
      {characters.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">我的角色</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {characters.map(char => (
              <div 
                key={char.id}
                onClick={() => onSelectCharacter && onSelectCharacter(char)}
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
                      <div className="text-white text-xs font-medium animate-pulse">克隆中...</div>
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
      )}
    </div>
  );
};

