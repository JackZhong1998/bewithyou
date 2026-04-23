import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { storage } from '../../utils/storage';
import { useI18n } from '../../i18n';

export interface OnboardingAnswers {
  goal?: string;
  style?: string;
  voice?: string;
}

interface OnboardingQuestionsProps {
  onComplete: () => void;
}

export const OnboardingQuestions: React.FC<OnboardingQuestionsProps> = ({ onComplete }) => {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const questions: Array<{
    key: keyof OnboardingAnswers;
    title: string;
    options: Array<{ value: string; label: string }>;
  }> = [
    {
      key: 'goal',
      title: t('onboarding.goal.title'),
      options: [
        { value: 'exam', label: t('onboarding.goal.exam') },
        { value: 'daily', label: t('onboarding.goal.daily') },
        { value: 'work', label: t('onboarding.goal.work') },
        { value: 'interest', label: t('onboarding.goal.interest') },
      ],
    },
    {
      key: 'style',
      title: t('onboarding.style.title'),
      options: [
        { value: 'alone', label: t('onboarding.style.alone') },
        { value: 'with_voice', label: t('onboarding.style.with_voice') },
        { value: 'game', label: t('onboarding.style.game') },
        { value: 'mixed', label: t('onboarding.style.mixed') },
      ],
    },
    {
      key: 'voice',
      title: t('onboarding.voice.title'),
      options: [
        { value: 'idol', label: t('onboarding.voice.idol') },
        { value: 'lover', label: t('onboarding.voice.lover') },
        { value: 'teacher', label: t('onboarding.voice.teacher') },
        { value: 'any', label: t('onboarding.voice.any') },
      ],
    },
  ];

  const current = questions[step];
  const isLast = step === questions.length - 1;

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
          {questions.map((_, i) => (
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
            {t('onboarding.prev')}
          </button>
        )}
      </div>
    </div>
  );
};
