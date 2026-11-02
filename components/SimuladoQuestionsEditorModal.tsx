'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  Edit3,
  Plus,
  Trash2,
  Search,
  ArrowUp,
  ArrowDown,
  Save,
  Copy,
  AlertTriangle,
  Layers,
  Database,
  Scale,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MockExam, ExamQuestion, QuestionOption } from '@/lib/types';

interface SimuladoQuestionsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: MockExam;
  allAvailableQuestions?: ExamQuestion[];
  onSaveExam: (updatedExam: MockExam) => void;
}

const COMMON_SUBJECTS = [
  'Direito Constitucional',
  'Direito Administrativo',
  'Direito Tributário',
  'Direito Penal',
  'Direito Processual Penal',
  'Direito Civil',
  'Direito Processual Civil',
  'Ética na Advocacia (OAB)',
  'Direito do Trabalho',
  'Direito Processual do Trabalho',
  'Legislação Tributária & Aduaneira',
  'Contabilidade Geral & Avançada',
  'Auditoria Governamental',
  'Língua Portuguesa & Redação Oficial',
  'Raciocínio Lógico-Quantitativo',
  'Direito Financeiro'
];

let simQuestionSeq = 0;
function generateSimQuestionId(prefix: string): string {
  simQuestionSeq += 1;
  return `${prefix}-${Date.now()}-${simQuestionSeq}`;
}

export function SimuladoQuestionsEditorModal({
  isOpen,
  onClose,
  exam,
  allAvailableQuestions = [],
  onSaveExam,
}: SimuladoQuestionsEditorModalProps) {
  // Working copy of the questions in this exam
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    return Array.isArray(exam.questions) ? [...exam.questions] : [];
  });

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Question editing submodal state
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);
  const [isEditingNew, setIsEditingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Question form state
  const [formCode, setFormCode] = useState('');
  const [formSubject, setFormSubject] = useState(COMMON_SUBJECTS[0]);
  const [formCustomSubject, setFormCustomSubject] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formBoard, setFormBoard] = useState(exam.board || 'FGV Conhecimento');
  const [formYear, setFormYear] = useState<number>(2026);
  const [formDifficulty, setFormDifficulty] = useState<'Fácil' | 'Média' | 'Difícil'>('Média');
  const [formPoints, setFormPoints] = useState<number>(1);
  const [formStatement, setFormStatement] = useState('');
  const [formLegalBasis, setFormLegalBasis] = useState('');
  const [formCorrectOptionId, setFormCorrectOptionId] = useState('opt-a');
  const [formOptions, setFormOptions] = useState<QuestionOption[]>([
    { id: 'opt-a', label: 'A', text: '', explanation: '' },
    { id: 'opt-b', label: 'B', text: '', explanation: '' },
    { id: 'opt-c', label: 'C', text: '', explanation: '' },
    { id: 'opt-d', label: 'D', text: '', explanation: '' },
    { id: 'opt-e', label: 'E', text: '', explanation: '' },
  ]);
  const [formError, setFormError] = useState('');

  // Import from global question bank submodal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSearch, setImportSearch] = useState('');
  const [importSubject, setImportSubject] = useState('all');
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([]);

  // Expanded explanations toggle
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  // Filtered list of questions in current exam
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      !searchQuery ||
      q.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  // Unique subjects in the current questions list
  const currentExamSubjects = Array.from(new Set(questions.map((q) => q.subject)));

  // Available questions for importing (not yet in this exam)
  const availableToImport = allAvailableQuestions.filter(
    (globalQ) => !questions.some((examQ) => examQ.id === globalQ.id || examQ.code === globalQ.code)
  );

  const filteredImportQuestions = availableToImport.filter((q) => {
    const matchesSearch =
      !importSearch ||
      q.statement.toLowerCase().includes(importSearch.toLowerCase()) ||
      q.code.toLowerCase().includes(importSearch.toLowerCase()) ||
      q.subject.toLowerCase().includes(importSearch.toLowerCase());
    const matchesSubject = importSubject === 'all' || q.subject === importSubject;
    return matchesSearch && matchesSubject;
  });

  // Reordering questions
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const copy = [...questions];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setQuestions(copy);
  };

  // Delete question from exam
  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    showToast('Questão removida do simulado.');
  };

  // Duplicate question
  const handleDuplicateQuestion = (q: ExamQuestion, index: number) => {
    const duplicated: ExamQuestion = {
      ...q,
      id: generateSimQuestionId('q-sim-dup'),
      code: `${q.code}-CÓPIA`,
      statement: `${q.statement} (Cópia)`,
    };
    const copy = [...questions];
    copy.splice(index + 1, 0, duplicated);
    setQuestions(copy);
    showToast('Questão duplicada com sucesso.');
  };

  // Open Question Form for Existing Question
  const handleOpenEditQuestion = (q: ExamQuestion, index: number) => {
    setEditingQuestion(q);
    setIsEditingNew(false);
    setEditingIndex(index);
    setFormCode(q.code || `SIM-Q${index + 1}`);
    setFormSubject(COMMON_SUBJECTS.includes(q.subject) ? q.subject : 'Outra');
    if (!COMMON_SUBJECTS.includes(q.subject)) {
      setFormCustomSubject(q.subject);
    } else {
      setFormCustomSubject('');
    }
    setFormTopic(q.topic || '');
    setFormBoard(q.board || exam.board);
    setFormYear(q.year || 2026);
    setFormDifficulty(q.difficulty || 'Média');
    setFormPoints(q.points ?? 1);
    setFormStatement(q.statement || '');
    setFormLegalBasis(q.legalBasis || '');
    setFormCorrectOptionId(q.correctOptionId || 'opt-a');
    setFormOptions(
      q.options && q.options.length === 5
        ? q.options
        : [
            { id: 'opt-a', label: 'A', text: q.options?.[0]?.text || '', explanation: q.options?.[0]?.explanation || '' },
            { id: 'opt-b', label: 'B', text: q.options?.[1]?.text || '', explanation: q.options?.[1]?.explanation || '' },
            { id: 'opt-c', label: 'C', text: q.options?.[2]?.text || '', explanation: q.options?.[2]?.explanation || '' },
            { id: 'opt-d', label: 'D', text: q.options?.[3]?.text || '', explanation: q.options?.[3]?.explanation || '' },
            { id: 'opt-e', label: 'E', text: q.options?.[4]?.text || '', explanation: q.options?.[4]?.explanation || '' },
          ]
    );
    setFormError('');
  };

  // Open Question Form for New Question
  const handleOpenNewQuestion = () => {
    const nextNum = questions.length + 1;
    setEditingQuestion(null);
    setIsEditingNew(true);
    setEditingIndex(null);
    setFormCode(`SIM-${exam.code || 'EXAM'}-Q${String(nextNum).padStart(2, '0')}`);
    setFormSubject(COMMON_SUBJECTS[0]);
    setFormCustomSubject('');
    setFormTopic('Tópico Geral');
    setFormBoard(exam.board || 'FGV Conhecimento');
    setFormYear(2026);
    setFormDifficulty('Média');
    setFormPoints(1);
    setFormStatement('');
    setFormLegalBasis('');
    setFormCorrectOptionId('opt-a');
    setFormOptions([
      { id: 'opt-a', label: 'A', text: '', explanation: '' },
      { id: 'opt-b', label: 'B', text: '', explanation: '' },
      { id: 'opt-c', label: 'C', text: '', explanation: '' },
      { id: 'opt-d', label: 'D', text: '', explanation: '' },
      { id: 'opt-e', label: 'E', text: '', explanation: '' },
    ]);
    setFormError('');
  };

  // Save edited/created question
  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formStatement.trim()) {
      setFormError('Por favor, informe o enunciado da questão.');
      return;
    }

    const hasEmptyOption = formOptions.some((opt) => !opt.text.trim());
    if (hasEmptyOption) {
      setFormError('Todas as 5 alternativas (A, B, C, D e E) devem estar preenchidas.');
      return;
    }

    const resolvedSubject = formSubject === 'Outra' && formCustomSubject.trim() ? formCustomSubject.trim() : formSubject;

    const savedQuestion: ExamQuestion = {
      id: editingQuestion ? editingQuestion.id : generateSimQuestionId('q-sim'),
      code: formCode.trim() || `SIM-Q${questions.length + 1}`,
      year: Number(formYear) || 2026,
      board: formBoard.trim() || exam.board,
      agency: exam.agency || 'Simulado Oficial',
      role: 'Candidato / Membro',
      subject: resolvedSubject,
      topic: formTopic.trim() || 'Geral',
      difficulty: formDifficulty,
      points: Math.max(1, Number(formPoints) || 1),
      statement: formStatement.trim(),
      options: formOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        text: opt.text.trim(),
        explanation: opt.explanation.trim(),
      })),
      correctOptionId: formCorrectOptionId,
      legalBasis: formLegalBasis.trim() || undefined,
      tags: [resolvedSubject, formDifficulty, formBoard.trim()],
      origin: 'oficial',
    };

    if (isEditingNew) {
      setQuestions((prev) => [...prev, savedQuestion]);
      showToast('Nova questão adicionada ao simulado!');
    } else if (editingIndex !== null) {
      const copy = [...questions];
      copy[editingIndex] = savedQuestion;
      setQuestions(copy);
      showToast('Questão atualizada com sucesso!');
    }

    setEditingQuestion(null);
    setIsEditingNew(false);
    setEditingIndex(null);
  };

  // Import selected questions from global bank
  const handleConfirmImport = () => {
    if (selectedImportIds.length === 0) return;

    const toAdd = allAvailableQuestions.filter((q) => selectedImportIds.includes(q.id));
    setQuestions((prev) => [...prev, ...toAdd]);
    setSelectedImportIds([]);
    setIsImportModalOpen(false);
    showToast(`${toAdd.length} questão(ões) importada(s) do banco de questões!`);
  };

  // Toggle import selection
  const handleToggleImportId = (id: string) => {
    setSelectedImportIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Save all changes to the Simulado
  const handleSaveAll = () => {
    if (questions.length === 0) {
      showToast('O simulado precisa ter pelo menos 1 questão antes de ser salvo.');
      return;
    }

    const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject)));
    const totalPoints = questions.reduce((acc, q) => acc + (q.points ?? 1), 0);
    const updatedExam: MockExam = {
      ...exam,
      questions,
      totalQuestions: questions.length,
      totalPoints,
      subjectsCovered: uniqueSubjects.length > 0 ? uniqueSubjects : exam.subjectsCovered,
    };

    onSaveExam(updatedExam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-4"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Painel do Administrador
              </span>
              <span className="text-[11px] font-mono text-slate-300 font-bold px-2 py-0.5 rounded bg-white/10">
                {exam.code}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                {exam.difficulty}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Editar Questões do Simulado: {exam.title}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
              <span>{exam.agency}</span>
              <span>•</span>
              <span>Banca: {exam.board}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                {questions.length} questões cadastradas
              </span>
              <span>•</span>
              <span className="text-amber-300 font-black px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30">
                Pontuação Máxima: {questions.reduce((acc, q) => acc + (q.points ?? 1), 0)} pts
              </span>
              <span>•</span>
              <span>Duração: {exam.durationMinutes} min</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center animate-in fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Toolbar: Actions & Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenNewQuestion}
              className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Questão Inédita</span>
            </button>

            {availableToImport.length > 0 && (
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] border border-[#CBD5E1] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Importar do Banco de Questões ({availableToImport.length} disp.)</span>
              </button>
            )}
          </div>

          {/* Search & Subject filter */}
          <div className="flex items-center gap-2 flex-wrap flex-1 max-w-lg justify-end">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por enunciado, código, disciplina..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 outline-none"
            >
              <option value="all">Todas Disciplinas</option>
              {currentExamSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 outline-none"
            >
              <option value="all">Todas Dificuldades</option>
              <option value="Fácil">Fácil</option>
              <option value="Média">Média</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
        </div>

        {/* Question List Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-100/60">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                Nenhuma questão encontrada com os filtros selecionados
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tente ajustar os termos de busca ou clique em &quot;Adicionar Questão Inédita&quot; para cadastrar questões no simulado.
              </p>
              <button
                onClick={handleOpenNewQuestion}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Primeira Questão</span>
              </button>
            </div>
          ) : (
            filteredQuestions.map((q, displayIdx) => {
              const actualIndex = questions.findIndex((item) => item.id === q.id);
              const isExpanded = Boolean(expandedQuestions[q.id]);
              const correctOption = q.options?.find((opt) => opt.id === q.correctOptionId);

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-4 sm:p-5 space-y-3"
                >
                  {/* Question Header & Ordering Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                        #{actualIndex + 1}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                        {q.code}
                      </span>
                      <span className="text-xs font-extrabold text-[#2563EB]">
                        {q.subject}
                      </span>
                      {q.topic && (
                        <span className="text-xs text-slate-500 font-medium">
                          • {q.topic}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.difficulty === 'Difícil'
                          ? 'bg-rose-50 text-rose-700'
                          : q.difficulty === 'Média'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {q.board} {q.year}
                      </span>

                      {/* Question Points Value */}
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg px-2 py-0.5 text-xs font-black shadow-2xs">
                        <span>⭐ {q.points ?? 1} {(q.points ?? 1) === 1 ? 'ponto' : 'pontos'}</span>
                      </div>

                      {/* Quick inline points adjuster */}
                      <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg overflow-hidden" title="Ajustar pontuação da questão">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = q.points ?? 1;
                            if (cur <= 1) return;
                            setQuestions((prev) =>
                              prev.map((item, idx) => (idx === actualIndex ? { ...item, points: cur - 1 } : item))
                            );
                          }}
                          className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-mono font-bold px-1 text-slate-900">{q.points ?? 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = q.points ?? 1;
                            setQuestions((prev) =>
                              prev.map((item, idx) => (idx === actualIndex ? { ...item, points: cur + 1 } : item))
                            );
                          }}
                          className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(actualIndex, 'up')}
                        disabled={actualIndex === 0}
                        title="Mover para cima"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(actualIndex, 'down')}
                        disabled={actualIndex === questions.length - 1}
                        title="Mover para baixo"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateQuestion(q, actualIndex)}
                        title="Duplicar questão"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditQuestion(q, actualIndex)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Remover do simulado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                    {q.statement}
                  </div>

                  {/* Alternatives Preview with Correct Answer Highlighted */}
                  <div className="space-y-1.5 pt-1">
                    {q.options?.map((opt) => {
                      const isCorrect = opt.id === q.correctOptionId;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 text-emerald-950 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="leading-snug">{opt.text}</span>
                              {isCorrect && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-900 font-bold text-[9px] uppercase tracking-wide">
                                  <Check className="w-2.5 h-2.5" />
                                  Gabarito Oficial
                                </span>
                              )}
                            </div>
                            {isExpanded && opt.explanation && (
                              <div className="mt-1.5 text-[11px] text-emerald-800/90 pl-2 border-l-2 border-emerald-400 italic">
                                {opt.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legal Basis & Toggle Explanation */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2 min-w-0">
                      {q.legalBasis && (
                        <span className="text-[11px] font-semibold text-slate-600 truncate flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{q.legalBasis}</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedQuestions((prev) => ({
                          ...prev,
                          [q.id]: !prev[q.id],
                        }))
                      }
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>{isExpanded ? 'Recolher Comentários' : 'Ver Fundamentação & Comentários'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Total no Simulado: {questions.length} questões
            </span>
            <span>•</span>
            <span className="text-slate-500">
              Disciplinas cobertas: {currentExamSubjects.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações do Simulado</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-MODAL: EDIT OR CREATE QUESTION */}
      {/* ======================================================== */}
      {(editingQuestion || isEditingNew) && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-300 space-y-4 my-6 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    {isEditingNew ? 'Nova Questão do Simulado' : `Editar Questão ${formCode}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajuste o enunciado, opções A-E, gabarito e fundamentação legal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsEditingNew(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shrink-0">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveQuestionForm} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Row 1: Code, Subject, Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código Identificador
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="SIM-RFB-01"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Disciplina / Matéria
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500 bg-white"
                  >
                    {COMMON_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                    <option value="Outra">Outra (Personalizada)</option>
                  </select>
                </div>

                {formSubject === 'Outra' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome da Disciplina
                    </label>
                    <input
                      type="text"
                      value={formCustomSubject}
                      onChange={(e) => setFormCustomSubject(e.target.value)}
                      placeholder="Ex: Direito Previdenciário"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tópico Específico
                    </label>
                    <input
                      type="text"
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      placeholder="Ex: Imunidades Tributárias"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Row 2: Board, Year, Difficulty */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Banca Examinadora
                  </label>
                  <input
                    type="text"
                    value={formBoard}
                    onChange={(e) => setFormBoard(e.target.value)}
                    placeholder="FGV, Cebraspe, FCC"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ano da Prova
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nível de Dificuldade
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as 'Fácil' | 'Média' | 'Difícil')}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Média">Média</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              {/* Row: Score / Points value for this question */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <label className="block text-xs font-black text-amber-950 mb-0.5">
                    Valor / Pontuação desta Questão no Simulado *
                  </label>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Defina quantos pontos esta questão vale para a nota e ranking (ex: Questão 1: 2 pontos, Questão 2: 3 pontos).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={formPoints}
                      onChange={(e) => setFormPoints(Math.max(1, Number(e.target.value) || 1))}
                      className="w-14 text-center font-black text-xs text-amber-950 outline-none"
                    />
                    <span className="text-xs font-bold text-amber-900">
                      {formPoints === 1 ? 'ponto' : 'pontos'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormPoints(val)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                          formPoints === val
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-amber-200 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        {val} {val === 1 ? 'pt' : 'pts'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enunciado Completo da Questão
                </label>
                <textarea
                  rows={4}
                  value={formStatement}
                  onChange={(e) => setFormStatement(e.target.value)}
                  placeholder="Escreva ou cole o enunciado do problema prático ou tese jurídica da questão..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 outline-none focus:border-blue-500 leading-relaxed font-sans"
                  required
                />
              </div>

              {/* Options A, B, C, D, E */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Alternativas & Marcação do Gabarito Oficial
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Clique no botão circular para definir a resposta correta
                  </span>
                </div>

                {formOptions.map((opt, optIndex) => {
                  const isCorrect = formCorrectOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isCorrect
                          ? 'border-emerald-400 bg-emerald-50/50 ring-1 ring-emerald-400'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => setFormCorrectOptionId(opt.id)}
                          title={`Marcar Alternativa ${opt.label} como Gabarito`}
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 cursor-pointer transition-all ${
                            isCorrect
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                              : 'bg-white border-2 border-slate-300 text-slate-600 hover:border-emerald-500'
                          }`}
                        >
                          {opt.label}
                        </button>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">
                              Alternativa ({opt.label})
                            </span>
                            {isCorrect && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Gabarito Oficial Definido
                              </span>
                            )}
                          </div>

                          <textarea
                            rows={2}
                            value={opt.text}
                            onChange={(e) => {
                              const copy = [...formOptions];
                              copy[optIndex] = { ...copy[optIndex], text: e.target.value };
                              setFormOptions(copy);
                            }}
                            placeholder={`Texto da alternativa ${opt.label}...`}
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white outline-none focus:border-blue-500 leading-snug"
                            required
                          />

                          <input
                            type="text"
                            value={opt.explanation}
                            onChange={(e) => {
                              const copy = [...formOptions];
                              copy[optIndex] = { ...copy[optIndex], explanation: e.target.value };
                              setFormOptions(copy);
                            }}
                            placeholder="Comentário explicativo da alternativa (opcional)..."
                            className="w-full text-[11px] px-2.5 py-1 rounded-md border border-slate-200 bg-white/80 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legal Basis / Jurisprudência */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fundamentação Legal / Jurisprudência Vinculada (Opcional)
                </label>
                <input
                  type="text"
                  value={formLegalBasis}
                  onChange={(e) => setFormLegalBasis(e.target.value)}
                  placeholder="Ex: CF/88, Art. 150, VI, 'a' • Súmula Vinculante 52 do STF"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsEditingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditingNew ? 'Adicionar ao Simulado' : 'Salvar Questão'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL: IMPORT QUESTIONS FROM GLOBAL BANK */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-300 space-y-4 my-6 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Importar Questões do Banco Geral
                  </h3>
                  <p className="text-xs text-slate-500">
                    Selecione questões existentes para incluir neste simulado.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar questão por enunciado ou disciplina..."
                  value={importSearch}
                  onChange={(e) => setImportSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              <select
                value={importSubject}
                onChange={(e) => setImportSubject(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 outline-none"
              >
                <option value="all">Todas as Disciplinas</option>
                {COMMON_SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Available List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-96">
              {filteredImportQuestions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Nenhuma questão disponível para importação com esses filtros.
                </div>
              ) : (
                filteredImportQuestions.map((q) => {
                  const isChecked = selectedImportIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleToggleImportId(q.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'border-indigo-400 bg-indigo-50/70 ring-1 ring-indigo-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="mt-0.5 rounded text-indigo-600 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[10px] text-slate-500">
                            {q.code}
                          </span>
                          <span className="font-extrabold text-[#2563EB]">
                            {q.subject}
                          </span>
                          <span className="text-slate-400">• {q.board}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-slate-700 leading-snug">
                          {q.statement}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-600">
                {selectedImportIds.length} questão(ões) selecionada(s)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={selectedImportIds.length === 0}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Importar Selecionadas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
