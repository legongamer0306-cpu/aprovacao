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
  Trash2, 
  AlertCircle,
  Search,
  X,
  Scissors,
  SkipForward,
  Building2,
  User
} from 'lucide-react';
import { ExamQuestion } from '@/lib/types';
import { MemberQuestionModal } from '@/components/MemberQuestionModal';

export type QuestionOriginSubgroup = 'all' | 'oficial' | 'membros' | 'marcadas' | 'erros';

interface QuestionBankViewProps {
  questions: ExamQuestion[];
  initialSubjectFilter?: string;
  initialMode?: QuestionOriginSubgroup;
  bookmarkedQuestionIds?: string[];
  mistakesMap?: Record<string, { count: number; lastMissedAt: string }>;
  scratchedQuestionIds?: string[];
  onBookmarkToggle?: (questionId: string) => void;
  onRecordAnswer?: (questionId: string, isCorrect: boolean) => void;
  onRemoveMistake?: (questionId: string) => void;
  onToggleScratchQuestion?: (questionId: string) => void;
  onAddQuestion?: (question: ExamQuestion) => void;
  onDeleteQuestion?: (questionId: string) => void;
}

export function QuestionBankView({
  questions,
  initialSubjectFilter,
  initialMode,
  bookmarkedQuestionIds = [],
  mistakesMap = {},
  scratchedQuestionIds = [],
  onBookmarkToggle,
  onRecordAnswer,
  onRemoveMistake,
  onToggleScratchQuestion,
  onAddQuestion,
  onDeleteQuestion,
}: QuestionBankViewProps) {
  const [selectedSubgroup, setSelectedSubgroup] = useState<QuestionOriginSubgroup>(initialMode || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectFilter || 'all');
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, boolean>>({});

  // Modal for creating member questions
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [savedToastMessage, setSavedToastMessage] = useState<string | null>(null);

  // Sync state on prop changes without cascading useEffect re-renders (official React pattern)
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setSelectedSubgroup(initialMode || 'all');
    setCurrentIndex(0);
    setShowExplanation(false);
  }

  const [prevSubjectFilter, setPrevSubjectFilter] = useState(initialSubjectFilter);
  if (initialSubjectFilter !== prevSubjectFilter) {
    setPrevSubjectFilter(initialSubjectFilter);
    setSelectedSubject(initialSubjectFilter || 'all');
    setCurrentIndex(0);
  }

  // Helper to extract question board/banca robustly
  const getQuestionBoard = (q: ExamQuestion) => (q.board || q.banca || '').trim();

  // Extract unique boards dynamically
  const uniqueBoards = Array.from(
    new Set(questions.map((q) => getQuestionBoard(q)).filter(Boolean))
  ).sort();

  // Helper to extract question author robustly
  const getQuestionAuthor = (q: ExamQuestion): string => {
    if (q.author?.name?.trim()) return q.author.name.trim();
    if (q.origin === 'membros') return 'Membro da Comunidade';
    const b = getQuestionBoard(q);
    if (b) return `Banca ${b}`;
    return 'Coordenação Pedagógica';
  };

  // Extract unique authors dynamically
  const uniqueAuthors = Array.from(
    new Set(questions.map((q) => getQuestionAuthor(q)).filter(Boolean))
  ).sort();

  // Extract unique subjects
  const subjects = ['all', ...Array.from(new Set(questions.map((q) => q.subject)))];

  // Extract unique topics for the selected subject (or across all)
  const availableTopics = Array.from(
    new Set(
      questions
        .filter((q) => selectedSubject === 'all' || q.subject.toLowerCase() === selectedSubject.toLowerCase())
        .map((q) => q.topic)
        .filter(Boolean)
    )
  ).sort();

  // Filter questions combining Subgroup, Banca, Subject, Assunto, Difficulty, Search Query
  let filteredQuestions = questions.filter((q) => {
    // Subgroup filter
    if (selectedSubgroup === 'membros' && q.origin !== 'membros') return false;
    if (selectedSubgroup === 'oficial' && q.origin === 'membros') return false;
    if (selectedSubgroup === 'marcadas' && !bookmarkedQuestionIds.includes(q.id)) return false;
    if (selectedSubgroup === 'erros' && !mistakesMap[q.id]) return false;

    // Board / Banca filter (ex: FGV, Cebraspe, FCC, etc.)
    if (selectedBoard !== 'all') {
      const qBoard = getQuestionBoard(q).toLowerCase();
      const targetBoard = selectedBoard.toLowerCase();
      if (!qBoard.includes(targetBoard) && !targetBoard.includes(qBoard)) {
        return false;
      }
    }

    // Author filter (Autor da questão)
    if (selectedAuthor !== 'all') {
      const qAuthor = getQuestionAuthor(q).toLowerCase();
      const targetAuthor = selectedAuthor.toLowerCase();
      if (!qAuthor.includes(targetAuthor) && !targetAuthor.includes(qAuthor)) {
        return false;
      }
    }

    // Subject filter (Matéria / Disciplina)
    if (selectedSubject !== 'all' && !q.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
      return false;
    }

    // Topic filter (Assunto)
    if (selectedTopic !== 'all' && q.topic.toLowerCase() !== selectedTopic.toLowerCase()) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
      return false;
    }

    // Search query filter (combina busca por banca, autor, matéria, assunto, enunciado ou código)
    if (searchQuery.trim()) {
      const term = searchQuery.trim().toLowerCase();
      const qBoard = getQuestionBoard(q).toLowerCase();
      const qAuthor = getQuestionAuthor(q).toLowerCase();
      const qSubject = (q.subject || '').toLowerCase();
      const qTopic = (q.topic || '').toLowerCase();
      const qCode = (q.code || '').toLowerCase();
      const qStatement = (q.statement || '').toLowerCase();
      const qAgency = (q.agency || '').toLowerCase();
      const qLegal = (q.legalBasis || '').toLowerCase();

      const matches =
        qBoard.includes(term) ||
        qAuthor.includes(term) ||
        qSubject.includes(term) ||
        qTopic.includes(term) ||
        qCode.includes(term) ||
        qStatement.includes(term) ||
        qAgency.includes(term) ||
        qLegal.includes(term);

      if (!matches) return false;
    }

    return true;
  });

  // If Erros Frequentes, sort by mistake count descending
  if (selectedSubgroup === 'erros') {
    filteredQuestions = [...filteredQuestions].sort((a, b) => {
      const countA = mistakesMap[a.id]?.count || 0;
      const countB = mistakesMap[b.id]?.count || 0;
      return countB - countA;
    });
  }

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isBookmarked = activeQuestion ? bookmarkedQuestionIds.includes(activeQuestion.id) : false;
  const isMistake = activeQuestion ? Boolean(mistakesMap[activeQuestion.id]) : false;

  const handleSelectOption = (optionId: string) => {
    if (!activeQuestion || verifiedMap[activeQuestion.id]) return; // locked once verified
    setSelectedAnswers((prev) => ({ ...prev, [activeQuestion.id]: optionId }));
  };

  const handleVerify = () => {
    if (!activeQuestion || !selectedAnswers[activeQuestion.id]) return;
    const isCorrect = selectedAnswers[activeQuestion.id] === activeQuestion.correctOptionId;
    setVerifiedMap((prev) => ({ ...prev, [activeQuestion.id]: true }));
    setShowExplanation(true);
    onRecordAnswer?.(activeQuestion.id, isCorrect);
  };

  // Pular questão: avança sem registrar resposta, acerto ou erro, e sem afetar desempenho
  const handleSkipQuestion = () => {
    if (filteredQuestions.length <= 1) return;
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
    setCurrentIndex(nextIndex);
    setShowExplanation(false);
    setSavedToastMessage('Questão pulada. Você poderá retornar a ela a qualquer momento.');
  };

  const handleResetQuestion = () => {
    if (!activeQuestion) return;
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
    setEliminatedOptions((prev) => {
      const copy = { ...prev };
      activeQuestion.options.forEach((opt) => {
        delete copy[`${activeQuestion.id}__${opt.id}`];
      });
      return copy;
    });
  };

  const toggleBookmark = () => {
    if (!activeQuestion) return;
    onBookmarkToggle?.(activeQuestion.id);
    setSavedToastMessage(
      isBookmarked
        ? 'Questão removida das Questões Marcadas.'
        : '⭐ Questão favoritada com sucesso! Acesse na aba Questões Marcadas.'
    );
  };

  const toggleEliminate = (e: React.MouseEvent, optionId: string) => {
    e.stopPropagation();
    if (!activeQuestion) return;
    const key = `${activeQuestion.id}__${optionId}`;
    setEliminatedOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isVerified = activeQuestion ? verifiedMap[activeQuestion.id] : false;
  const userChoice = activeQuestion ? selectedAnswers[activeQuestion.id] : undefined;
  const isCorrectChoice = activeQuestion ? userChoice === activeQuestion.correctOptionId : false;

  const fontSizeClass = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed',
  }[fontSize];

  // Counts for subgroups
  const totalCount = questions.length;
  const officialCount = questions.filter(q => !q.origin || q.origin === 'oficial').length;
  const memberCount = questions.filter(q => q.origin === 'membros').length;
  const markedCount = questions.filter(q => bookmarkedQuestionIds.includes(q.id)).length;
  const mistakesCount = questions.filter(q => Boolean(mistakesMap[q.id])).length;

  const isAnyFilterActive =
    selectedBoard !== 'all' ||
    selectedAuthor !== 'all' ||
    selectedSubject !== 'all' ||
    selectedTopic !== 'all' ||
    selectedDifficulty !== 'all' ||
    searchQuery.trim().length > 0;

  const handleClearAllFilters = () => {
    setSelectedBoard('all');
    setSelectedAuthor('all');
    setSelectedSubject('all');
    setSelectedTopic('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-4">
      {savedToastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedToastMessage}</span>
          </div>
          <button
            onClick={() => setSavedToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Subgroup Navigation Banner & Quick Actions */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Subgroups: Todas, Oficiais, Membros, Marcadas, Erros, Riscadas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => {
              setSelectedSubgroup('all');
              setCurrentIndex(0);
              setShowExplanation(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
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
              setShowExplanation(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
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

          {/* Subgrupo: Questões Criadas por Membros */}
          <button
            onClick={() => {
              setSelectedSubgroup('membros');
              setCurrentIndex(0);
              setShowExplanation(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedSubgroup === 'membros'
                ? 'bg-emerald-700 text-white shadow-2xs ring-1 ring-emerald-500'
                : 'bg-[#ECFDF5] border border-emerald-200 text-emerald-800 hover:bg-emerald-100/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Questões de Membros</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'membros' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
            }`}>
              {memberCount}
            </span>
          </button>

          {/* Subgrupo: Questões Marcadas */}
          <button
            onClick={() => {
              setSelectedSubgroup('marcadas');
              setCurrentIndex(0);
              setShowExplanation(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedSubgroup === 'marcadas'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-amber-50/80 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${selectedSubgroup === 'marcadas' ? 'fill-white' : 'fill-amber-500 text-amber-500'}`} />
            <span>Marcadas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'marcadas' ? 'bg-white/25 text-white' : 'bg-amber-200 text-amber-900'
            }`}>
              {markedCount}
            </span>
          </button>

          {/* Subgrupo: Erros Frequentes / Caderno de Erros */}
          <button
            onClick={() => {
              setSelectedSubgroup('erros');
              setCurrentIndex(0);
              setShowExplanation(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedSubgroup === 'erros'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50/80 border border-rose-200 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Erros Frequentes</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
              selectedSubgroup === 'erros' ? 'bg-white/25 text-white' : 'bg-rose-200 text-rose-900'
            }`}>
              {mistakesCount}
            </span>
          </button>
        </div>

        {/* Action Button to Create Member Questions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova Questão (Membro)</span>
            <span className="sm:hidden">Criar Questão</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-2xs space-y-3">
        {/* Top Line: Search Input with dedicated search button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              placeholder="Pesquisar por autor, banca (ex: FGV, Cebraspe), matéria, assunto, enunciado ou código..."
              className="w-full text-xs font-medium pl-9 pr-8 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentIndex(0);
                }}
                className="absolute right-2.5 p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                title="Limpar termo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setCurrentIndex(0)}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Pesquisar</span>
            </button>

            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Redefinir todos os filtros de busca"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Limpar Filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Line: Filters and Zen controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#F1F5F9]">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Banca filter dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#64748B] hidden sm:block shrink-0" />
              <select
                value={selectedBoard}
                onChange={(e) => {
                  setSelectedBoard(e.target.value);
                  setCurrentIndex(0);
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer max-w-[150px] truncate transition-colors ${
                  selectedBoard !== 'all'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold'
                    : 'border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB]'
                }`}
                title="Filtrar por banca examinadora"
              >
                <option value="all">Todas as Bancas</option>
                {uniqueBoards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Author filter dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <User className="w-3.5 h-3.5 text-[#64748B] hidden sm:block shrink-0" />
              <select
                value={selectedAuthor}
                onChange={(e) => {
                  setSelectedAuthor(e.target.value);
                  setCurrentIndex(0);
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer max-w-[160px] truncate transition-colors ${
                  selectedAuthor !== 'all'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold'
                    : 'border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB]'
                }`}
                title="Filtrar questões por autor"
              >
                <option value="all">Todos os Autores</option>
                {uniqueAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject selector */}
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('all');
                setCurrentIndex(0);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB] outline-none cursor-pointer max-w-[170px] truncate"
              title="Filtrar por disciplina"
            >
              <option value="all">Todas as Disciplinas</option>
              {subjects.filter((s) => s !== 'all').map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>

            {/* Topic / Assunto selector */}
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentIndex(0);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB] outline-none cursor-pointer max-w-[170px] truncate"
              title="Filtrar por assunto específico"
            >
              <option value="all">Todos os Assuntos</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            {/* Difficulty filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB] outline-none cursor-pointer"
              title="Filtrar por dificuldade"
            >
              <option value="all">Dificuldade: Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Média">Média</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          {/* Question Counter & Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Font Size Adjuster */}
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

            <div className="text-xs font-bold text-[#0F172A] px-2.5 py-1 bg-[#F1F5F9] rounded-lg tabular-nums shrink-0">
              {filteredQuestions.length > 0 ? `${currentIndex + 1} de ${filteredQuestions.length}` : '0 de 0'}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                disabled={currentIndex === 0 || filteredQuestions.length === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setShowExplanation(false);
                }}
                className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed text-[#0F172A]"
                title="Questão anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentIndex >= filteredQuestions.length - 1 || filteredQuestions.length === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
                  setShowExplanation(false);
                }}
                className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed text-[#0F172A]"
                title="Próxima questão"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Solver Grid or Dedicated Empty State */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          {selectedSubgroup === 'marcadas' ? (
            <>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
                <Bookmark className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-500 text-amber-500" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-black text-[#0F172A]">Nenhuma questão marcada ainda</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Você ainda não favoritou questões. Durante seus estudos, clique no botão <strong>Marcar</strong> para favoritá-la aqui.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubgroup('all');
                  setCurrentIndex(0);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                Explorar Todas as Questões
              </button>
            </>
          ) : selectedSubgroup === 'erros' ? (
            <>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-black text-[#0F172A]">Seu Caderno de Erros está limpo!</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Excelente! Sempre que você errar uma questão no Banco de Questões ou nos Simulados, ela será salva automaticamente aqui para consolidação.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubgroup('all');
                  setCurrentIndex(0);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                Praticar Questões Agora
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-black text-[#0F172A]">Nenhuma questão encontrada</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Não encontramos questões correspondentes aos filtros aplicados {selectedAuthor !== 'all' && `(Autor: ${selectedAuthor})`} {selectedBoard !== 'all' && `(Banca: ${selectedBoard})`} {selectedSubject !== 'all' && `(Disciplina: ${selectedSubject})`} {searchQuery && `(Termo: "${searchQuery}")`}.
                </p>
              </div>
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                Limpar Todos os Filtros
              </button>
            </>
          )}
        </div>
      ) : (
        /* Main Solver Grid: Split View (Question: 8 cols | Resolution & Legal Basis: 4 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (Question Card) */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
            {/* Header Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0F172A] text-white">
                  {activeQuestion.code}
                </span>

                {/* Subgroup Badge */}
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

                {/* Interactive Author Badge */}
                <button
                  type="button"
                  onClick={() => {
                    const auth = getQuestionAuthor(activeQuestion);
                    setSelectedAuthor(selectedAuthor === auth ? 'all' : auth);
                    setCurrentIndex(0);
                  }}
                  title={selectedAuthor === getQuestionAuthor(activeQuestion) ? 'Clique para remover filtro de autor' : `Filtrar apenas questões de ${getQuestionAuthor(activeQuestion)}`}
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                    selectedAuthor === getQuestionAuthor(activeQuestion)
                      ? 'bg-[#2563EB] text-white shadow-2xs font-bold ring-1 ring-[#2563EB]'
                      : 'text-[#475569] dark:text-[#f8fafc] bg-[#F1F5F9] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700'
                  }`}
                >
                  <User className={`w-3 h-3 ${selectedAuthor === getQuestionAuthor(activeQuestion) ? 'text-white' : 'text-[#2563EB]'}`} />
                  <span>Autor: <strong>{getQuestionAuthor(activeQuestion)}</strong></span>
                  {activeQuestion.author?.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ml-1 ${
                      selectedAuthor === getQuestionAuthor(activeQuestion)
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activeQuestion.author.badge}
                    </span>
                  )}
                </button>

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
                <span className="text-[11px] font-medium text-[#64748B] hidden sm:inline-flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dica: Risque opções para ir por exclusão</span>
                </span>

                {/* Botão de Marcar / Favoritar */}
                <button
                  type="button"
                  onClick={toggleBookmark}
                  title={isBookmarked ? 'Remover das Questões Marcadas' : 'Marcar questão para revisão posterior'}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                    isBookmarked
                      ? 'bg-amber-500/15 border-amber-300 text-amber-800 shadow-2xs'
                      : 'border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 text-amber-500 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  <span>{isBookmarked ? 'Marcada' : 'Marcar'}</span>
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

            {/* Caderno de Erros Banner if activeQuestion has registered mistake */}
            {isMistake && activeQuestion && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Caderno de Erros:</strong> Você errou esta questão <strong>{mistakesMap[activeQuestion.id]?.count || 1} {((mistakesMap[activeQuestion.id]?.count || 1) === 1) ? 'vez' : 'vezes'}</strong>.
                    {mistakesMap[activeQuestion.id]?.lastMissedAt && (
                      <span className="text-rose-700 font-normal"> (Último erro: {mistakesMap[activeQuestion.id].lastMissedAt})</span>
                    )}
                  </span>
                </div>
                {onRemoveMistake && (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveMistake(activeQuestion.id);
                      setSavedToastMessage('Questão marcada como dominada e removida do Caderno de Erros!');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marcar como Dominada</span>
                  </button>
                )}
              </div>
            )}

          {/* Topic Subhead */}
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Tópico: <span className="text-[#0F172A]">{activeQuestion.topic}</span>
          </div>

          {/* Question Statement */}
          <div className={`whitespace-pre-line leading-relaxed ${fontSizeClass} max-w-[68ch] text-[#1E293B]`}>
            {activeQuestion.statement}
          </div>

          {/* Choice Options List com opção de riscar alternativa para ir por exclusão */}
          <div className="space-y-2.5 pt-2">
            {activeQuestion.options.map((option) => {
              const isSelected = userChoice === option.id;
              const optionKey = `${activeQuestion.id}__${option.id}`;
              const isOptionScratched = Boolean(eliminatedOptions[optionKey]);
              const isThisCorrect = option.id === activeQuestion.correctOptionId;

              // Determine visual styling according to Aprovação Total design tokens
              let borderClass = 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]';
              let badgeClass = 'bg-[#F1F5F9] text-[#475569]';
              let bgClass = 'bg-white';

              if (isOptionScratched) {
                borderClass = 'border-dashed border-rose-300 bg-rose-50/20';
                badgeClass = 'bg-rose-100 text-rose-500 line-through';
                bgClass = 'bg-slate-50/60';
              } else if (isSelected && !isVerified) {
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
                  onClick={() => {
                    if (isOptionScratched) {
                      toggleEliminate({ stopPropagation: () => {} } as any, option.id);
                      handleSelectOption(option.id);
                    } else {
                      handleSelectOption(option.id);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative group ${borderClass} ${bgClass}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeClass}`}>
                    {option.label}
                  </div>

                  <div className={`flex-1 text-xs md:text-sm leading-relaxed pt-0.5 ${
                    isOptionScratched ? 'line-through text-slate-400 select-none' : 'text-[#1E293B]'
                  }`}>
                    {option.text}
                  </div>

                  {/* Botão de Riscar / Desriscar Alternativa (Ir por Exclusão) */}
                  {!isVerified && (
                    <button
                      type="button"
                      onClick={(e) => toggleEliminate(e, option.id)}
                      title={isOptionScratched ? 'Restaurar alternativa (desriscar)' : 'Riscar alternativa que você acha errada (eliminar por exclusão)'}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        isOptionScratched
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300 shadow-2xs'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Scissors className={`w-3.5 h-3.5 ${isOptionScratched ? 'text-rose-600 rotate-90' : 'text-slate-400'}`} />
                      <span>{isOptionScratched ? 'Riscada' : 'Riscar'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer Bar */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleResetQuestion}
                disabled={!userChoice && !isVerified}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar
              </button>

              {/* Botão Pular Questão */}
              <button
                type="button"
                onClick={handleSkipQuestion}
                title="Pular esta questão sem responder e sem registrar acerto ou erro. Ela pode ser revisitada a qualquer momento."
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5 text-slate-600" />
                <span>Pular Questão</span>
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
      )}

      {/* Member Question Creator Modal (5 Mandatory Options + Grounded Justification) */}
      <MemberQuestionModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSaveQuestion={(newQ) => {
          onAddQuestion?.(newQ);
          setSelectedSubgroup('membros');
          setCurrentIndex(0);
          setSavedToastMessage(`Questão ${newQ.code || ''} salva automaticamente no banco de dados e adicionada ao repositório permanente!`);
          setTimeout(() => {
            setSavedToastMessage(null);
          }, 4500);
        }}
      />
    </div>
  );
}
