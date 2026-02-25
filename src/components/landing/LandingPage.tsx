import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { BookOpen, Mic, Heart } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        {/* Logo / 品牌 */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
          bewithyou
        </h1>
        <p className="text-slate-500 text-lg mb-12">
          用你喜爱或熟悉的声音，陪你学英语
        </p>

        {/* 价值点 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
            <div className="p-2.5 rounded-xl bg-violet-100 text-violet-600">
              <BookOpen size={22} />
            </div>
            <span className="text-slate-700 font-medium">沉浸式背单词</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
              <Mic size={22} />
            </div>
            <span className="text-slate-700 font-medium">克隆专属声音</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-500">
              <Heart size={22} />
            </div>
            <span className="text-slate-700 font-medium">情感陪伴学习</span>
          </div>
        </div>

        {/* CTA：登录 */}
        <div className="mb-8">
          <p className="text-slate-600 mb-6">登录后即可创建你的第一个声音角色，开始陪伴学习</p>
          <SignInButton mode="modal">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-lg shadow-lg shadow-slate-900/25 hover:bg-slate-800 transition-colors">
              登录 / 注册
            </button>
          </SignInButton>
        </div>

        <p className="text-sm text-slate-400">
          登录即表示同意服务条款与隐私政策
        </p>
      </div>
    </div>
  );
};
