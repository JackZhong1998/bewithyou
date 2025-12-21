export type LanguageCode = 'zh-CN' | 'zh-TW' | 'ko-KR' | 'ja-JP' | 'th-TH' | 'vi-VN';

export type ViewState = 'CLONE' | 'CHARACTER_LIST' | 'CHARACTER_DETAIL' | 'LEARNING';

export interface Character {
  id: string;
  name: string;
  avatarUrl: string;
  voiceId: string;
  status: 'cloning' | 'ready';
  createdAt: number;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  sentences: Array<{
    en: string;
    cn: string;
  }>;
}

export interface Language {
  code: LanguageCode;
  label: string;
}

