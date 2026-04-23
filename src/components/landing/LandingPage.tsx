import React from 'react';
import { SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BookOpen, Globe, HeartHandshake, Mic2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LANGUAGES } from '../../constants';
import { useI18n } from '../../i18n';
import { LanguageCode } from '../../types';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-end px-6 pt-6">
        <div className="relative">
          <Globe size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="appearance-none rounded-full border border-black/10 bg-white pl-8 pr-8 py-2 text-xs font-medium text-[#1d1d1f] shadow-sm outline-none transition hover:border-black/20"
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-8 md:pb-20 md:pt-16">
        <section className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6e6e73]">
            {t('landing.badge')}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            bewithyou
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-xl font-medium text-[#1d1d1f] md:text-2xl">
            {t('landing.title')}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6e6e73] md:text-base">
            {t('landing.subtitle')}
          </p>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-black/10 bg-white p-6 text-left shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <div className="mb-4 inline-flex rounded-2xl bg-black/5 p-2.5 text-[#1d1d1f]">
              <BookOpen size={20} />
            </div>
            <h3 className="text-base font-semibold">{t('landing.point1.title')}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{t('landing.point1.desc')}</p>
          </article>
          <article className="rounded-3xl border border-black/10 bg-white p-6 text-left shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <div className="mb-4 inline-flex rounded-2xl bg-black/5 p-2.5 text-[#1d1d1f]">
              <Mic2 size={20} />
            </div>
            <h3 className="text-base font-semibold">{t('landing.point2.title')}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{t('landing.point2.desc')}</p>
          </article>
          <article className="rounded-3xl border border-black/10 bg-white p-6 text-left shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
            <div className="mb-4 inline-flex rounded-2xl bg-black/5 p-2.5 text-[#1d1d1f]">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-base font-semibold">{t('landing.point3.title')}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{t('landing.point3.desc')}</p>
          </article>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-[28px] border border-black/10 bg-white p-8 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-[#6e6e73]">{t('landing.ctaHint')}</p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="mt-5 inline-flex items-center justify-center rounded-full bg-[#1d1d1f] px-8 py-3 text-sm font-semibold text-white transition hover:bg-black">
                {t('landing.signIn')}
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/app/learn"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#1d1d1f] px-8 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              {t('landing.enterApp')}
            </Link>
          </SignedIn>
          <p className="mt-5 text-xs text-[#8e8e93]">{t('landing.terms')}</p>
        </section>
      </div>
    </div>
  );
};
