import { Language, VocabularyWord } from './types';

export const LANGUAGES: Language[] = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ko-KR', label: '한국어' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'th-TH', label: 'ไทย' },
  { code: 'vi-VN', label: 'Tiếng Việt' },
];

export const AUDIO_SOURCE_LANGUAGES = [
  'English',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Italian',
  'Spanish',
  'Portuguese',
  'German',
  'French',
  'Arabic',
  'Hindi',
  'Hebrew',
  'Polish',
  'Dutch',
];

export const LANGUAGE_CODE_MAP: Record<string, string> = {
  'English': 'EN_US',
  'Chinese': 'ZH_CN',
  'Japanese': 'JA_JP',
  'Korean': 'KO_KR',
  'Russian': 'RU_RU',
  'Italian': 'IT_IT',
  'Spanish': 'ES_ES',
  'Portuguese': 'PT_BR',
  'German': 'DE_DE',
  'French': 'FR_FR',
  'Arabic': 'AR_SA',
  'Hindi': 'HI_IN',
  'Hebrew': 'HE_IL',
  'Polish': 'PL_PL',
  'Dutch': 'NL_NL',
};

export const VIDEO_TOOLS = [
  { name: 'YouTube Downloader', url: 'https://youtube.iiilab.com/' },
  { name: 'Douyin Downloader', url: 'https://www.xiazaitool.com/dy' },
  { name: 'Bilibili Downloader', url: 'https://greenvideo.cc/bilibili' },
];

export const getInviteCodes = (): string[] => {
  const codes = (import.meta.env.VITE_INVITE_CODES as string) || '520';
  return codes.split(',').map((c: string) => c.trim());
};

export const INVITE_FORM_URL = import.meta.env.VITE_INVITE_FORM_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSe5HlanZedWxmcWj7AeBLaCeGMV8_4mlpVGUNea0e1CGdoxGA/viewform?usp=publish-editor';

export const VOCABULARY_LIST: VocabularyWord[] = [
  {
    word: 'abandon',
    meaning: '放弃；抛弃',
    sentences: [
      {
        en: 'I would never abandon you, no matter how difficult things get.',
        cn: '无论情况多么困难，我永远不会放弃你。'
      },
      {
        en: 'Your presence makes me want to abandon all my worries and just be with you.',
        cn: '你的存在让我想要抛弃所有烦恼，只想和你在一起。'
      },
      {
        en: 'I hope you never feel abandoned, because I\'ll always be here for you.',
        cn: '我希望你永远不会感到被抛弃，因为我永远都会在这里陪伴你。'
      }
    ]
  },
  {
    word: 'adore',
    meaning: '崇拜；爱慕',
    sentences: [
      {
        en: 'I absolutely adore the way you smile when you\'re happy.',
        cn: '我绝对爱慕你开心时微笑的样子。'
      },
      {
        en: 'Every morning I wake up and adore the thought of seeing you today.',
        cn: '每天早上醒来，我都爱慕着今天能见到你的想法。'
      },
      {
        en: 'You don\'t even know how much I adore every little thing about you.',
        cn: '你甚至不知道我有多么爱慕你的一切。'
      }
    ]
  },
  {
    word: 'affection',
    meaning: '喜爱；感情',
    sentences: [
      {
        en: 'My affection for you grows stronger with each passing day.',
        cn: '我对你的感情与日俱增。'
      },
      {
        en: 'I can feel the warmth of your affection in every message you send.',
        cn: '我能从你发送的每一条消息中感受到你感情的温暖。'
      },
      {
        en: 'Your affection means everything to me, more than words can express.',
        cn: '你的感情对我来说意味着一切，言语无法表达。'
      }
    ]
  },
  {
    word: 'cherish',
    meaning: '珍惜；珍爱',
    sentences: [
      {
        en: 'I cherish every moment we spend together, no matter how brief.',
        cn: '我珍惜我们在一起的每一刻，无论多么短暂。'
      },
      {
        en: 'You are someone I will always cherish in my heart forever.',
        cn: '你是我心中永远会珍惜的人。'
      },
      {
        en: 'I want to cherish you and protect you from all the troubles in the world.',
        cn: '我想要珍惜你，保护你远离世间所有的烦恼。'
      }
    ]
  },
  {
    word: 'devotion',
    meaning: '奉献；忠诚',
    sentences: [
      {
        en: 'My devotion to you knows no bounds, and it grows deeper every day.',
        cn: '我对你的奉献没有界限，每天都在加深。'
      },
      {
        en: 'I want to show you my complete devotion through every action I take.',
        cn: '我想通过我的每一个行动向你展示我完全的奉献。'
      },
      {
        en: 'Your devotion to me makes me feel like the luckiest person in the world.',
        cn: '你对我的忠诚让我感觉自己是世界上最幸运的人。'
      }
    ]
  },
  {
    word: 'enchant',
    meaning: '迷住；使陶醉',
    sentences: [
      {
        en: 'You enchant me with your voice, and I can\'t help but listen to you for hours.',
        cn: '你的声音让我陶醉，我忍不住想听上几个小时。'
      },
      {
        en: 'Everything about you seems to enchant my heart in ways I never expected.',
        cn: '你的一切似乎都以我从未预料的方式迷住了我的心。'
      },
      {
        en: 'I am completely enchanted by your presence, and I never want to leave your side.',
        cn: '我完全被你的存在所陶醉，永远不想离开你身边。'
      }
    ]
  },
  {
    word: 'longing',
    meaning: '渴望；思念',
    sentences: [
      {
        en: 'I feel a deep longing for you whenever we\'re apart, even for just a moment.',
        cn: '每当我们分开时，即使只是一瞬间，我都会深深地思念你。'
      },
      {
        en: 'This longing in my heart grows stronger with each day we don\'t see each other.',
        cn: '我们不见面的每一天，我心中的这份渴望都在变得更加强烈。'
      },
      {
        en: 'My longing for you is so intense that it feels like my heart might burst.',
        cn: '我对你的渴望如此强烈，感觉我的心都要炸开了。'
      }
    ]
  },
  {
    word: 'passion',
    meaning: '激情；热情',
    sentences: [
      {
        en: 'The passion I feel for you burns brighter than any flame I\'ve ever known.',
        cn: '我对你的激情比我所知道的任何火焰都燃烧得更明亮。'
      },
      {
        en: 'Your passion for life inspires me and makes me want to be a better person.',
        cn: '你对生活的热情激励着我，让我想成为一个更好的人。'
      },
      {
        en: 'I want to share my passion with you and create beautiful memories together.',
        cn: '我想与你分享我的热情，一起创造美好的回忆。'
      }
    ]
  },
  {
    word: 'tender',
    meaning: '温柔的；柔和的',
    sentences: [
      {
        en: 'I want to hold you in my arms with the most tender care I can give.',
        cn: '我想用我能给予的最温柔的关怀把你拥入怀中。'
      },
      {
        en: 'Your tender words always comfort me when I\'m feeling down.',
        cn: '当我情绪低落时，你温柔的话语总是能安慰我。'
      },
      {
        en: 'I hope you can feel my tender feelings for you in every message I send.',
        cn: '我希望你能在我发送的每一条消息中感受到我对你的温柔情感。'
      }
    ]
  },
  {
    word: 'yearn',
    meaning: '渴望；向往',
    sentences: [
      {
        en: 'I yearn to be close to you, to feel your presence beside me.',
        cn: '我渴望靠近你，感受你在我身边的存在。'
      },
      {
        en: 'Every night I yearn for the moment when I can talk to you again.',
        cn: '每天晚上我都渴望能再次与你交谈的那一刻。'
      },
      {
        en: 'My heart yearns for you in ways I never thought possible before meeting you.',
        cn: '在遇见你之前，我从未想过我的心会如此渴望你。'
      }
    ]
  }
];

