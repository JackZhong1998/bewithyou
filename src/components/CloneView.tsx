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
import { useI18n } from '../i18n';

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
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const validateFileDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const isVideo = file.type.startsWith('video/');
      const media = document.createElement(isVideo ? 'video' : 'audio');
      const url = URL.createObjectURL(file);
      media.preload = 'metadata';
      media.src = url;
      media.onloadedmetadata = () => {
        const duration = media.duration || 0;
        URL.revokeObjectURL(url);
        resolve(duration);
      };
      media.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(t('clone.durationReadError')));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isAudio = file.type.startsWith('audio/');
      const isVideo = file.type.startsWith('video/');

      if (!isAudio && !isVideo) {
        alert(t('clone.fileTypeError'));
        return;
      }

      const maxSizeMB = isAudio ? 20 : 100;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(
          isAudio
            ? t('clone.fileAudioSizeError')
            : t('clone.fileVideoSizeError')
        );
        return;
      }

      try {
        const duration = await validateFileDuration(file);
        if (duration < 30 || duration > 300) {
          alert(t('clone.durationError'));
          return;
        }
      } catch (err) {
        console.error('读取音频时长失败:', err);
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
    setCloningProgress(t('clone.processingAudio'));
    
    const defaultNameIndex = (characters?.length || 0) + 1;
    const finalName = (roleName || '').trim() || t('clone.defaultName', { index: String(defaultNameIndex).padStart(3, '0') });
    const finalDescription = (roleDescription || '').trim() || t('clone.defaultDescription');

    // Create cloning character first
    const tempChar: Character = {
      id: Date.now().toString(),
      name: finalName,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
      voiceId: '',
      status: 'cloning',
      createdAt: Date.now(),
      description: finalDescription,
      isPublic: false,
      creatorName: t('characters.localUser'),
    };
    
    if (onCloneStart) {
      onCloneStart(tempChar);
    }
    
    try {
      const langCode = LANGUAGE_CODE_MAP[sourceLang] || 'AUTO';
      const voiceId = await cloneVoice(
        selectedFile!, 
        finalName,
        langCode,
        removeNoise
      );
      
      setCloningProgress(t('clone.processingDone'));
      
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
        setRoleName('');
        setRoleDescription('');
      }, 500);
    } catch (error: any) {
      console.error('Cloning failed:', error);
      alert(`${t('clone.failPrefix')}: ${error.message || 'Please retry.'}`);
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
    <div className="mx-auto max-w-3xl space-y-8 px-2 py-2 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">{t('clone.pageTitle')}</h1>
        <p className="text-sm text-gray-500">{t('clone.pageSubtitle')}</p>
      </div>

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-3xl border border-dashed p-10 text-center transition-all duration-300
          ${selectedFile ? 'border-black/30 bg-white' : 'border-black/20 bg-white hover:border-black/40'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="audio/*,video/*" 
          className="hidden" 
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${selectedFile ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            {selectedFile ? <CheckCircle size={32} /> : <Upload size={32} />}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {selectedFile ? t('clone.uploadTitle.selected', { name: selectedFile.name }) : t('clone.uploadTitle.empty')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('clone.uploadFormats')}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t('clone.uploadTip')}
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{t('clone.roleNameLabel')}</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder={t('clone.roleNamePlaceholder')}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{t('clone.roleDescLabel')}</label>
            <input
              type="text"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder={t('clone.roleDescPlaceholder')}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{t('clone.sourceLanguage')}</label>
          <select 
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
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
              className="mt-1 h-5 w-5 shrink-0 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
            />
            <span className="text-sm text-gray-600">
              {t('clone.removeNoise')}
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 text-blue-600 rounded focus:ring-blue-500 border-gray-300" 
            />
            <span className="text-sm text-gray-500 leading-relaxed">
              {t('clone.agreement')}
            </span>
          </label>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={handleStartClone}
        disabled={!selectedFile || !agreed || isProcessing}
        className={`
          w-full rounded-2xl py-4 text-lg font-semibold shadow-lg transition-all active:scale-[0.99]
          ${(!selectedFile || !agreed || isProcessing) 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-[#1d1d1f] text-white hover:bg-black shadow-black/20'}
        `}
      >
        {isProcessing ? (cloningProgress || t('clone.processing')) : t('clone.start')}
      </button>

      {/* Cloning Progress */}
      {cloningProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-blue-700 font-medium">{cloningProgress}</p>
        </div>
      )}

      {/* Video Tools */}
      <div className="pt-8 border-t border-gray-100">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">{t('clone.toolsTitle')}</h3>
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
          <h2 className="mb-6 text-2xl font-semibold text-[#1d1d1f]">{t('clone.myCharacters')}</h2>
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
                      <div className="text-white text-xs font-medium animate-pulse">{t('clone.cloning')}</div>
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

