import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getInviteCodes, INVITE_FORM_URL } from '../constants';
import { storage } from '../utils/storage';

interface InviteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    const validCodes = getInviteCodes();
    if (validCodes.includes(code.trim())) {
      storage.setInviteCode(code.trim());
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4">需要邀请码</h2>
        <p className="text-gray-500 text-sm mb-6">
          为确保服务质量，需要邀请码才能使用。
        </p>
        
        <input 
          type="text" 
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder="输入邀请码"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black mb-2"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        {error && <p className="text-red-500 text-xs mb-4">邀请码无效，请重试。</p>}
        
        <div className="flex gap-3 mt-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl font-medium text-white bg-black hover:bg-gray-800"
          >
            确认
          </button>
        </div>

        <div className="mt-6 text-center">
          <a 
            href={INVITE_FORM_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1"
          >
            获取邀请码 <ChevronRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

