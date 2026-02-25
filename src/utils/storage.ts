const STORAGE_KEYS = {
  LANGUAGE: 'bewithyou_language',
  INVITE_CODE: 'bewithyou_invite_code',
  CHARACTERS: 'bewithyou_characters',
  LEARNING_RECORDS: 'bewithyou_learning_records',
  ONBOARDING_DONE: 'bewithyou_onboarding_done',
  ONBOARDING_ANSWERS: 'bewithyou_onboarding_answers',
};

export const storage = {
  getLanguage: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  },
  
  setLanguage: (lang: string): void => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },
  
  getInviteCode: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.INVITE_CODE);
  },
  
  setInviteCode: (code: string): void => {
    localStorage.setItem(STORAGE_KEYS.INVITE_CODE, code);
  },
  
  hasInvited: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.INVITE_CODE);
  },
  
  getCharacters: (): any[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    return data ? JSON.parse(data) : [];
  },
  
  saveCharacters: (characters: any[]): void => {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  },

  getLearningRecords: (): any => {
    const data = localStorage.getItem(STORAGE_KEYS.LEARNING_RECORDS);
    return data ? JSON.parse(data) : {};
  },

  saveLearningRecords: (records: any): void => {
    localStorage.setItem(STORAGE_KEYS.LEARNING_RECORDS, JSON.stringify(records));
  },

  getOnboardingDone: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === '1';
  },

  setOnboardingDone: (): void => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, '1');
  },

  getOnboardingAnswers: (): Record<string, string> | null => {
    const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_ANSWERS);
    return data ? JSON.parse(data) : null;
  },

  saveOnboardingAnswers: (answers: Record<string, string>): void => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_ANSWERS, JSON.stringify(answers));
  },
};

