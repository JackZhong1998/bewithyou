import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { storage } from '../../utils/storage';

export interface OnboardingAnswers {
  goal?: string;
  style?: string;
  voice?: string;
}

const QUESTIONS: Array<{
  key: keyof OnboardingAnswers;
  title: string;
  options: Array<{ value: string; label: string }>;
}> = [
  {
    key: 'goal',
    title: '你学英语的主要目的是？',
    options: [
      { value: 'exam', label: '备考（四六级 / 雅思 / 托福）' },
      { value: 'daily', label: '日常交流、旅行' },
      { value: 'work', label: '工作 / 商务' },
      { value: 'interest', label: '兴趣、追剧听歌' },
    ],
  },
  {
    key: 'style',
    title: '你喜欢的学习方式？',
    options: [
      { value: 'alone', label: '一个人安静学' },
      { value: 'with_voice', label: '有人陪着说、有声音反馈' },
      { value: 'game', label: '像玩游戏一样闯关' },
      { value: 'mixed', label: '看心情，多种都想试试' },
    ],
  },
  {
    key: 'voice',
    title: '你希望「陪伴你」的声音是？',
    options: [
      { value: 'idol', label: '偶像 / 喜欢的角色' },
      { value: 'lover', label: '恋人 / 朋友的声音' },
      { value: 'teacher', label: '像老师一样专业清晰' },
      { value: 'any', label: '都可以，好听就行' },
    ],
  },
];

interface OnboardingQuestionsProps {
  onComplete: () => void;
}

export const OnboardingQuestions: React.FC<OnboardingQuestionsProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const handleSelect = (key: keyof OnboardingAnswers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (isLast) {
      storage.saveOnboardingAnswers(next as Record<string, string>);
      storage.setOnboardingDone();
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* 进度 */}
        <div className="flex gap-2 mb-10">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-slate-900' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          {current.title}
        </h2>

        <ul className="space-y-3">
          {current.options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => handleSelect(current.key, opt.value)}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-slate-200 bg-white text-left font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors"
              >
                <span>{opt.label}</span>
                <ChevronRight size={20} className="text-slate-400 shrink-0" />
              </button>
            </li>
          ))}
        </ul>

        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-6 text-sm text-slate-500 hover:text-slate-700"
          >
            上一题
          </button>
        )}
      </div>
    </div>
  );
};
