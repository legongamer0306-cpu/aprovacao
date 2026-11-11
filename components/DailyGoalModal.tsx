'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, Trophy, X, Sparkles, BookOpen } from 'lucide-react';
import { StudentDailyGoal } from '@/lib/types';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal: StudentDailyGoal;
  onUpdateTarget: (newTarget: number) => void;
}

export function DailyGoalModal({
  isOpen,
  onClose,
  dailyGoal,
  onUpdateTarget
}: DailyGoalModalProps) {
  const [selectedTarget, setSelectedTarget] = useState(dailyGoal.targetQuestions);
  const options = [15, 25, 30, 40, 50, 75, 100];

  if (!isOpen) return null;

  const percent = Math.min(100, Math.round((dailyGoal.answeredToday / dailyGoal.targetQuestions) * 100));
  const isGoalReached = dailyGoal.answeredToday >= dailyGoal.targetQuestions;

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
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Meta Diária de Questões</h3>
              <p className="text-xs text-slate-500">Configure seu ritmo ideal de estudos por dia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status card */}
        <div className={`mt-5 p-4 rounded-xl border ${
          isGoalReached 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : 'bg-blue-50/50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              {isGoalReached ? (
                <>
                  <Trophy className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Meta Concluída Hoje!</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Progresso de Hoje</span>
                </>
              )}
            </span>
            <span className="text-xs font-black text-slate-900 tabular-nums">
              {dailyGoal.answeredToday} / {dailyGoal.targetQuestions} questões
            </span>
          </div>

          <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-slate-200/60">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalReached ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 mt-2.5">
            {isGoalReached ? (
              <span className="text-emerald-800 font-semibold">
                Parabéns! Você alcançou {dailyGoal.answeredToday} questões hoje. Pode continuar treinando para acumular mais pontos no ranking!
              </span>
            ) : (
              <span>
                Faltam <strong>{Math.max(0, dailyGoal.targetQuestions - dailyGoal.answeredToday)}</strong> questões para bater sua meta diária de hoje.
              </span>
            )}
          </p>
        </div>

        {/* Change Target */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Escolha sua nova meta diária:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedTarget(opt)}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedTarget === opt
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs scale-105'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onUpdateTarget(selectedTarget);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Salvar Meta
          </button>
        </div>
      </div>
    </div>
  );
}
