'use client';

import React from 'react';
import { Flame, Trophy, Calendar, Sparkles, X, Check } from 'lucide-react';
import { StudentStreakData } from '@/lib/types';

interface StreakInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakData: StudentStreakData;
}

export function StreakInfoModal({
  isOpen,
  onClose,
  streakData
}: StreakInfoModalProps) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const hasStudiedToday = streakData.activityDates.includes(todayStr) || streakData.lastStudyDate === todayStr;

  // Generate the last 7 days badges
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const isToday = iso === todayStr;
    const studied = streakData.activityDates.includes(iso) || (isToday && hasStudiedToday);
    const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
    return { iso, dayLabel, isToday, studied };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Flame className="w-6 h-6 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Login Diário & Sequência Contínua</h3>
              <p className="text-xs text-slate-500">Começa em 1d e aumenta a cada novo dia logado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Card */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-md text-center">
          <div className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 fill-yellow-300 text-yellow-200 animate-bounce" />
            {Math.max(1, streakData.currentStreak)} {Math.max(1, streakData.currentStreak) === 1 ? 'Dia' : 'Dias'}
          </div>
          <p className="text-xs font-semibold text-amber-100 mt-1 uppercase tracking-wider">
            Dias Consecutivos de Acesso
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>Recorde Histórico: {Math.max(1, streakData.longestStreak)} dias</span>
          </div>
        </div>

        {/* 7-day mini calendar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Últimos 7 dias de login na conta:</span>
            <span className="text-[11px] text-slate-400 font-medium">
              {hasStudiedToday ? 'Login de hoje contabilizado' : 'Acesse a cada dia para somar +1d'}
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {last7Days.map((d) => (
              <div 
                key={d.iso}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                  d.studied 
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : d.isToday
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{d.dayLabel}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  d.studied 
                    ? 'bg-amber-500 text-white' 
                    : d.isToday
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  {d.studied ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span className="text-[10px] font-bold">•</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules and Explanation */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Como funciona a contagem:</strong> Sua conta começa com <strong>1d</strong> no primeiro login. A cada novo dia em que você acessar com seu e-mail cadastrado, a contagem aumenta +1 dia consecutivo.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              O progresso fica 100% vinculado ao seu e-mail de aluno. Seu recorde histórico de dias permanece sempre guardado.
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Entendido, continuar estudando
          </button>
        </div>
      </div>
    </div>
  );
}
