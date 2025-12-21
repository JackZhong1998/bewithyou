const STORAGE_KEYS = {
  LANGUAGE: 'withyou_language',
  INVITE_CODE: 'withyou_invite_code',
  CHARACTERS: 'withyou_characters',
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
};

