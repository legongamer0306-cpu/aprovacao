'use client';

import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  RotateCcw, 
  Scale, 
  Eye, 
  Award,
  X
} from 'lucide-react';
import { MockExam, ExamQuestion } from '@/lib/types';

interface ExamRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam;
  onFinishExam: (examId: string, score: number, correctCount: number, timeSpentSec: number) => void;
}

export function ExamRunnerModal({
  isOpen,
  onClose,
  exam,
  onFinishExam,
}: ExamRunnerModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCorrectCount, setFinalCorrectCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleFinish = React.useCallback(() => {
    let correct = 0;
    exam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / exam.questions.length) * 100);
    setFinalScore(scorePct);
    setFinalCorrectCount(correct);
    setIsFinished(true);

    onFinishExam(exam.id, scorePct, correct, timeSpent);
  }, [exam, selectedAnswers, timeSpent, onFinishExam]);

  const handleFinishRef = React.useRef(handleFinish);
  useEffect(() => {
    handleFinishRef.current = handleFinish;
  }, [handleFinish]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isFinished) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishRef.current();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const currentQ: ExamQuestion = exam.questions[currentQuestionIndex] || exam.questions[0];

  const handleSelectOption = (optId: string) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isTimeCritical = secondsRemaining < 600; // less than 10 mins

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl h-[92vh] bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Real Exam Header Bar */}
        <div className="px-5 py-3.5 bg-[#0F172A] text-white border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white">
              {currentQuestionIndex + 1}
            </span>
            <div>
              <h3 className="text-xs md:text-sm font-extrabold truncate max-w-md">
                {exam.title}
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                {exam.agency} • Questão {currentQuestionIndex + 1} de {exam.questions.length}
              </p>
            </div>
          </div>

          {/* Center: Live Countdown Timer */}
          {!isFinished && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-xs md:text-sm font-black tabular-nums transition-colors ${
              isTimeCritical
                ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
                : 'bg-white/10 border-white/20 text-white'
            }`}>
              <Timer className="w-4 h-4 text-emerald-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          )}

          {/* Right Exit / Submit */}
          <div className="flex items-center gap-2">
            {!isFinished ? (
              <button
                onClick={handleFinish}
                className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Entregar Simulado ({answeredCount}/{exam.questions.length})
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white text-[#0F172A] text-xs font-bold hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Fechar Gabarito
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Area */}
        {isFinished ? (
          /* Report & Score Diagnosis View */
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${
              finalScore >= exam.cutoffRate
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
            }`}>
              <Award className="w-12 h-12 mx-auto stroke-[1.5]" />
              <h2 className="text-xl md:text-2xl font-black">
                {finalScore >= exam.cutoffRate ? 'APROVADO NA NOTA DE CORTE!' : 'SIMULADO CONCLUÍDO - VULNERABILIDADE DETECTADA'}
              </h2>
              <p className="text-xs md:text-sm font-medium opacity-90 max-w-lg mx-auto">
                Você atingiu <strong className="tabular-nums">{finalScore}%</strong> de acerto ({finalCorrectCount} de {exam.questions.length} questões). A nota de corte prevista para este concurso era de {exam.cutoffRate}%.
              </p>
              <div className="pt-2 flex items-center justify-center gap-4 text-xs font-bold font-mono">
                <span>Tempo Utilizado: {formatTime(timeSpent)}</span>
                <span>Média por Questão: ~{Math.round(timeSpent / exam.questions.length)}s</span>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Gabarito Comentado e Revisão Questão a Questão
              </h3>

              {exam.questions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctOptionId;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0F172A] text-white">
                          Questão {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#2563EB]">{q.subject}</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrect ? 'Acertou' : 'Errou'}
                      </span>
                    </div>

                    <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
                      {q.statement}
                    </p>

                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs space-y-1">
                      <div className="font-bold text-[#0F172A]">
                        Gabarito Oficial: Alternativa {q.options.find(o => o.id === q.correctOptionId)?.label}
                      </div>
                      <p className="text-[#475569] leading-relaxed">
                        {q.options.find(o => o.id === q.correctOptionId)?.explanation}
                      </p>
                      {q.legalBasis && (
                        <div className="text-[11px] font-mono text-[#2563EB] pt-1">
                          Base legal: {q.legalBasis}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Live Solver Area */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Question Stem & Options */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                    {currentQ.subject}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">
                    {currentQ.topic}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0F172A] tabular-nums">
                  Questão {currentQuestionIndex + 1} de {exam.questions.length}
                </span>
              </div>

              {/* Statement */}
              <div className="text-sm md:text-base text-[#0F172A] leading-relaxed whitespace-pre-line">
                {currentQ.statement}
              </div>

              {/* 5 Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] ring-1 ring-[#2563EB]/40'
                          : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="text-xs md:text-sm text-[#1E293B] leading-relaxed pt-0.5">
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>

                <div className="text-xs text-[#64748B] font-medium">
                  {selectedAnswers[currentQ.id] ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Alternativa Marcada
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold">Pendente de Resposta</span>
                  )}
                </div>

                <button
                  disabled={currentQuestionIndex >= exam.questions.length - 1}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  Próxima <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Question Navigation Matrix */}
            <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-[#E2E8F0] p-4 bg-[#F8FAFC] flex flex-col justify-between shrink-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                  <span>Cartão de Respostas</span>
                  <span className="tabular-nums text-[#2563EB]">{answeredCount}/{exam.questions.length}</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {exam.questions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                          isCurrent
                            ? 'ring-2 ring-[#2563EB] ring-offset-1 font-black'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:border-[#94A3B8]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#2563EB]" />
                  <span>Questão respondida</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-white border border-[#CBD5E1]" />
                  <span>Em branco</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
