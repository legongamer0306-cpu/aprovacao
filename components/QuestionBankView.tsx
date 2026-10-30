'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Flag, 
  RotateCcw, 
  SlidersHorizontal, 
  Scale, 
  BookOpen, 
  FileCheck, 
  Timer, 
  Eye, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Users,
  BrainCircuit,
  Plus,
  Trash2
} from 'lucide-react';
import { ExamQuestion } from '@/lib/types';
import { MemberQuestionModal } from '@/components/MemberQuestionModal';

export type QuestionOriginSubgroup = 'all' | 'oficial' | 'ia' | 'membros';

interface QuestionBankViewProps {
  questions: ExamQuestion[];
  initialSubjectFilter?: string;
  onBookmarkToggle?: (questionId: string) => void;
  onRecordAnswer?: (questionId: string, isCorrect: boolean) => void;
  onAddQuestion?: (question: ExamQuestion) => void;
  onDeleteQuestion?: (questionId: string) => void;
}

export function QuestionBankView({
  questions,
  initialSubjectFilter,
  onBookmarkToggle,
  onRecordAnswer,
  onAddQuestion,
  onDeleteQuestion,
}: QuestionBankViewProps) {
  const [selectedSubgroup, setSelectedSubgroup] = useState<QuestionOriginSubgroup>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectFilter || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, boolean>>({});

  // Modal for creating member questions
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Filter questions by Subgroup (Oficiais, IA, Membros), Subject and Difficulty
  const filteredQuestions = questions.filter((q) => {
    // Subgroup filter
    if (selectedSubgroup === 'ia' && q.origin !== 'ia') return false;
    if (selectedSubgroup === 'membros' && q.origin !== 'membros') return false;
    if (selectedSubgroup === 'oficial' && q.origin && q.origin !== 'oficial') return false;

    // Subject filter
    if (selectedSubject !== 'all' && !q.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
      return false;
    }
    // Difficulty filter
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  const activeQuestion = filteredQuestions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: string) => {
    if (verifiedMap[activeQuestion.id]) return; // locked once verified
    setSelectedAnswers((prev) => ({ ...prev, [activeQuestion.id]: optionId }));
  };

  const handleVerify = () => {
    if (!selectedAnswers[activeQuestion.id]) return;
    const isCorrect = selectedAnswers[activeQuestion.id] === activeQuestion.correctOptionId;
    setVerifiedMap((prev) => ({ ...prev, [activeQuestion.id]: true }));
    setShowExplanation(true);
    onRecordAnswer?.(activeQuestion.id, isCorrect);
  };

  const handleResetQuestion = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[activeQuestion.id];
      return copy;
    });
    setVerifiedMap((prev) => {
      const copy = { ...prev };
      delete copy[activeQuestion.id];
      return copy;
    });
    setShowExplanation(false);
    setEliminatedOptions({});
  };

  const toggleBookmark = () => {
    setBookmarkedMap((prev) => ({
      ...prev,
      [activeQuestion.id]: !prev[activeQuestion.id],
    }));
    onBookmarkToggle?.(activeQuestion.id);
  };

  const toggleEliminate = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    setEliminatedOptions((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const isVerified = verifiedMap[activeQuestion.id];
  const userChoice = selectedAnswers[activeQuestion.id];
  const isCorrectChoice = userChoice === activeQuestion.correctOptionId;

  // Extract unique subjects
  const subjects = ['all', ...Array.from(new Set(questions.map((q) => q.subject)))];

  const fontSizeClass = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed',
  }[fontSize];

  // Counts for subgroups
  const totalCount = questions.length;
  const officialCount = questions.filter(q => !q.origin || q.origin === 'oficial').length;
  const aiCount = questions.filter(q => q.origin === 'ia').length;
  const memberCount = questions.filter(q => q.origin === 'membros').length;

  return (
    <div className="space-y-4">
      {/* Subgroup Navigation Banner & Quick Actions */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Subgroups: Todas, Oficiais, Geradas por IA, Criadas por Membros */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => {
              setSelectedSubgroup('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedSubgroup === 'all'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span>Todas as Questões</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'all' ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
            }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedSubgroup('oficial');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedSubgroup === 'oficial'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bancas Oficiais</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'oficial' ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
            }`}>
              {officialCount}
            </span>
          </button>

          {/* Subgrupo: Questões Geradas por IA */}
          <button
            onClick={() => {
              setSelectedSubgroup('ia');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedSubgroup === 'ia'
                ? 'bg-gradient-to-r from-purple-700 to-blue-600 text-white shadow-2xs ring-1 ring-purple-400'
                : 'bg-[#FAF5FF] border border-purple-200 text-purple-700 hover:bg-purple-100/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Questões Geradas por IA</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'ia' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              {aiCount}
            </span>
          </button>

          {/* Subgrupo: Questões Criadas por Membros */}
          <button
            onClick={() => {
              setSelectedSubgroup('membros');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedSubgroup === 'membros'
                ? 'bg-emerald-700 text-white shadow-2xs ring-1 ring-emerald-500'
                : 'bg-[#ECFDF5] border border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Questões Criadas por Membros</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'membros' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {memberCount}
            </span>
          </button>
        </div>

        {/* Action Button to Create Member Questions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Questão (Membro)
          </button>
        </div>
      </div>

      {/* Filters & Zen Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject selector */}
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentIndex(0);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB] outline-none cursor-pointer"
          >
            <option value="all">Todas as Disciplinas</option>
            {subjects.filter((s) => s !== 'all').map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>

          {/* Difficulty filter */}
          <div className="hidden sm:flex items-center rounded-lg border border-[#CBD5E1] p-0.5 bg-[#F8FAFC]">
            {(['all', 'Fácil', 'Média', 'Difícil'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white text-[#0F172A] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {diff === 'all' ? 'Todas' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Question Counter & Font Size Adjuster */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] p-0.5 text-xs font-semibold">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-white shadow-2xs text-[#0F172A]' : 'text-[#64748B]'}`}
              title="Texto menor"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-0.5 rounded ${fontSize === 'md' ? 'bg-white shadow-2xs text-[#0F172A]' : 'text-[#64748B]'}`}
              title="Texto padrão"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-white shadow-2xs text-[#0F172A]' : 'text-[#64748B]'}`}
              title="Texto ampliado"
            >
              A+
            </button>
          </div>

          <div className="text-xs font-bold text-[#0F172A] px-2.5 py-1 bg-[#F1F5F9] rounded-lg tabular-nums">
            {currentIndex + 1} de {filteredQuestions.length}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1));
                setShowExplanation(false);
              }}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed text-[#0F172A]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentIndex >= filteredQuestions.length - 1}
              onClick={() => {
                setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
                setShowExplanation(false);
              }}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed text-[#0F172A]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Solver Grid: Split View (Question: 8 cols | Resolution & Legal Basis: 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Question Card) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs space-y-5">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0F172A] text-white">
                {activeQuestion.code}
              </span>

              {/* Subgroup Badge */}
              {activeQuestion.origin === 'ia' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" /> Gerada por IA
                </span>
              )}
              {activeQuestion.origin === 'membros' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-600" /> Criada por Membro
                </span>
              )}

              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                {activeQuestion.subject}
              </span>
              <span className="text-xs text-[#64748B] font-medium">
                {activeQuestion.board} • {activeQuestion.agency} • {activeQuestion.year}
              </span>

              {activeQuestion.author && (
                <span className="text-[11px] text-[#475569] font-semibold bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                  Autor: <strong>{activeQuestion.author.name}</strong>
                </span>
              )}

              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                activeQuestion.difficulty === 'Fácil'
                  ? 'bg-[#ECFDF5] text-[#047857]'
                  : activeQuestion.difficulty === 'Média'
                  ? 'bg-[#FFFBEB] text-[#B45309]'
                  : 'bg-[#FEF2F2] text-[#B91C1C]'
              }`}>
                {activeQuestion.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                title="Marcar questão para revisão posterior"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  bookmarkedMap[activeQuestion.id]
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedMap[activeQuestion.id] ? 'fill-amber-500' : ''}`} />
              </button>

              {onDeleteQuestion && (
                <button
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir a questão ${activeQuestion.code} do banco?`)) {
                      onDeleteQuestion(activeQuestion.id);
                      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                    }
                  }}
                  title="Excluir questão do banco (Ação Administrativa)"
                  className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Topic Subhead */}
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Tópico: <span className="text-[#0F172A]">{activeQuestion.topic}</span>
          </div>

          {/* Question Statement */}
          <div className={`text-[#1E293B] whitespace-pre-line leading-relaxed ${fontSizeClass} max-w-[68ch]`}>
            {activeQuestion.statement}
          </div>

          {/* Choice Options List */}
          <div className="space-y-2.5 pt-2">
            {activeQuestion.options.map((option) => {
              const isSelected = userChoice === option.id;
              const isEliminated = eliminatedOptions[option.id];
              const isThisCorrect = option.id === activeQuestion.correctOptionId;

              // Determine visual styling according to Aprovação Total design tokens
              let borderClass = 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]';
              let badgeClass = 'bg-[#F1F5F9] text-[#475569]';
              let bgClass = 'bg-white';

              if (isSelected && !isVerified) {
                borderClass = 'border-[#2563EB] ring-1 ring-[#2563EB]/30';
                badgeClass = 'bg-[#2563EB] text-white';
                bgClass = 'bg-[#EFF6FF]/40';
              }

              if (isVerified) {
                if (isThisCorrect) {
                  borderClass = 'border-[#10B981] ring-1 ring-[#10B981]/40';
                  badgeClass = 'bg-[#10B981] text-white font-black';
                  bgClass = 'bg-[#ECFDF5]/60';
                } else if (isSelected && !isThisCorrect) {
                  borderClass = 'border-[#EF4444] ring-1 ring-[#EF4444]/40';
                  badgeClass = 'bg-[#EF4444] text-white font-black';
                  bgClass = 'bg-[#FEF2F2]/60';
                }
              }

              return (
                <div
                  key={option.id}
                  onClick={() => !isEliminated && handleSelectOption(option.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative ${borderClass} ${bgClass} ${
                    isEliminated ? 'opacity-35 line-through pointer-events-none' : ''
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeClass}`}>
                    {option.label}
                  </div>

                  <div className="flex-1 text-xs md:text-sm text-[#1E293B] leading-relaxed pt-0.5">
                    {option.text}
                  </div>

                  {/* Eliminate tool button */}
                  {!isVerified && (
                    <button
                      onClick={(e) => toggleEliminate(e, option.id)}
                      title={isEliminated ? 'Restaurar alternativa' : 'Riscar alternativa (eliminar)'}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#EF4444] rounded transition-opacity"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer Bar */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetQuestion}
                disabled={!userChoice && !isVerified}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar
              </button>
              {isVerified && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showExplanation ? 'Ocultar Justificativa' : 'Ver Justificativa'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isVerified ? (
                <button
                  onClick={handleVerify}
                  disabled={!userChoice}
                  className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Responder e Confirmar
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentIndex < filteredQuestions.length - 1) {
                      setCurrentIndex((prev) => prev + 1);
                      setShowExplanation(false);
                    }
                  }}
                  disabled={currentIndex >= filteredQuestions.length - 1}
                  className="px-5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  Próxima Questão
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Legal Basis & Resolution Notes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Resolution Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#0F172A]">
                <Scale className="w-4 h-4 text-[#2563EB]" />
                Fundamento Jurídico & Gabarito
              </div>
            </div>

            {isVerified ? (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                {/* Result Pill */}
                <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                  isCorrectChoice
                    ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                    : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                }`}>
                  {isCorrectChoice ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-black">
                      {isCorrectChoice ? 'PARABÉNS! RESPOSTA EXATA' : 'GABARITO INCORRETO'}
                    </div>
                    <div className="text-[11px] font-medium opacity-90">
                      Gabarito Oficial: Alternativa <strong>{activeQuestion.options.find(o => o.id === activeQuestion.correctOptionId)?.label}</strong>
                    </div>
                  </div>
                </div>

                {/* Legal Basis */}
                {activeQuestion.legalBasis && (
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#2563EB]" /> Base Legal & Súmula
                    </span>
                    <p className="text-xs font-bold text-[#0F172A] font-mono leading-relaxed">
                      {activeQuestion.legalBasis}
                    </p>
                  </div>
                )}

                {/* Option Explanation */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#0F172A]">Comentário do Professor:</span>
                  <div className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                    {activeQuestion.options.find(o => o.id === activeQuestion.correctOptionId)?.explanation}
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block mb-1.5">
                    Palavras-chave do Edital
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeQuestion.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-[#0F172A]">Modo Prova Ativo</h4>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Selecione uma alternativa e confirme para revelar a análise doutrinária, súmula aplicável e estatísticas da banca.
                </p>
              </div>
            )}
          </div>

          {/* Quick Solver Stats */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mb-2">
              <span>Desempenho no Caderno</span>
              <span className="text-[#0F172A] tabular-nums">
                {Object.keys(verifiedMap).length} respondidas
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {filteredQuestions.map((q, idx) => {
                const verified = verifiedMap[q.id];
                const correct = selectedAnswers[q.id] === q.correctOptionId;
                const isCurrent = idx === currentIndex;

                let color = 'bg-[#E2E8F0]';
                if (verified) {
                  color = correct ? 'bg-[#10B981]' : 'bg-[#EF4444]';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowExplanation(false);
                    }}
                    className={`flex-1 h-3 rounded-xs transition-all ${color} ${
                      isCurrent ? 'ring-2 ring-[#2563EB] ring-offset-1' : ''
                    }`}
                    title={`Questão ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Member Question Creator Modal (5 Mandatory Options + Grounded Justification) */}
      <MemberQuestionModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSaveQuestion={(newQ) => {
          onAddQuestion?.(newQ);
          setSelectedSubgroup('membros');
          setCurrentIndex(0);
        }}
      />
    </div>
  );
}
