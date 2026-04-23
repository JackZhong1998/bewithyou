export type LanguageCode = 'zh-CN' | 'zh-TW' | 'ko-KR' | 'ja-JP' | 'th-TH' | 'vi-VN' | 'en-US';

export type ViewState = 'HOME' | 'CHARACTER_LIST' | 'CHARACTER_DETAIL' | 'LEARNING';
export type HomeTab = 'learn' | 'clone';

export interface Character {
  id: string;
  name: string;
  avatarUrl: string;
  voiceId: string;
  status: 'cloning' | 'ready';
  createdAt: number;
  /**
   * 角色简介，例如“温柔恋人”“严厉老师”等。
   * v1 中未使用，v2 开始支持，可选字段。
   */
  description?: string;
  /**
   * 是否公开到社区角色（与 voiceId 一并写入 Supabase `characters.is_public`）。
   */
  isPublic?: boolean;
  /**
   * 创建者昵称（本地标记，未来可与账号体系对接）。
   */
  creatorName?: string;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  phonetic?: string;
  sentences: Array<{
    en: string;
    cn: string;
  }>;
}

export type LearningResult = 'known' | 'vague' | 'unknown';

export interface WordLearningRecord {
  word: string;
  characterId: string;
  totalTimes: number;
  knownTimes: number;
  lastResult: LearningResult;
  lastAt: number;
}

export interface Language {
  code: LanguageCode;
  label: string;
}

