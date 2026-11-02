'use client';

import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  RotateCcw, 
  FileText, 
  Calendar, 
  BarChart3, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  Plus,
  X,
  Scale,
  Edit3,
  ShieldCheck,
  Trophy,
  Medal,
  UserCheck
} from 'lucide-react';
import { MockExam, ExamQuestion, MockExamRankingEntry, ManagedUser } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';
import { SimuladoQuestionsEditorModal } from './SimuladoQuestionsEditorModal';

interface SimuladosViewProps {
  simulados: MockExam[];
  onStartExam: (exam: MockExam) => void;
  onCreateCustomSimulado: (newSim: MockExam) => void;
  isAdmin?: boolean;
  onUpdateSimulado?: (updated: MockExam) => void;
  allQuestions?: ExamQuestion[];
  rankings?: MockExamRankingEntry[];
  currentStudent?: ManagedUser | null;
}

export function SimuladosView({
  simulados,
  onStartExam,
  onCreateCustomSimulado,
  isAdmin = false,
  onUpdateSimulado,
  allQuestions = [],
  rankings = [],
  currentStudent = null,
}: SimuladosViewProps) {
  const [activeTab, setActiveTab] = useState<'disponiveis' | 'historico' | 'ranking'>('disponiveis');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRankingExamId, setSelectedRankingExamId] = useState<string>('all');
  const [editingExamForQuestions, setEditingExamForQuestions] = useState<MockExam | null>(null);

  // Form state for creating custom mock exam
  const [newTitle, setNewTitle] = useState('');
  const [newAgency, setNewAgency] = useState('Receita Federal / FGV');
  const [newBoard, setNewBoard] = useState('FGV');
  const [newTotalQ, setNewTotalQ] = useState(60);
  const [newDuration, setNewDuration] = useState(180);
  const [newCutoff, setNewCutoff] = useState(80);
  const [newDifficulty, setNewDifficulty] = useState<'Média' | 'Difícil' | 'Padrão Oficial'>('Padrão Oficial');

  const filteredSimulados = simulados.filter((s) => {
    if (activeTab === 'historico' && s.status !== 'concluido') return false;
    if (activeTab === 'disponiveis' && s.status === 'concluido') return false;
    if (selectedDifficulty !== 'all' && s.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newTitle.trim()) return;

    const created: MockExam = {
      id: `sim-${Date.now()}`,
      title: newTitle.trim(),
      code: `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      agency: newAgency.trim(),
      board: newBoard.trim(),
      totalQuestions: Number(newTotalQ) || 50,
      durationMinutes: Number(newDuration) || 180,
      cutoffRate: Number(newCutoff) || 80,
      status: 'disponivel',
      difficulty: newDifficulty,
      questions: MOCK_QUESTIONS,
      subjectsCovered: ['Direito Constitucional', 'Direito Tributário', 'Administrativo', 'Contabilidade'],
    };

    onCreateCustomSimulado(created);
    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#ECFDF5] text-[#047857]">
              <Timer className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Simulação Realística de Prova
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Simulados Cronometrados & Diagnóstico Oficial
          </h2>
          <p className="text-xs text-[#475569] max-w-xl">
            Treine sob condições reais de pressão, tempo e nota de corte. Receba diagnóstico detalhado por disciplina com gabarito fundamentado.
          </p>
          {isAdmin && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Painel do Administrador Ativo: Você pode editar o enunciado, alternativas e gabarito das questões de qualquer simulado.</span>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Criar Simulado Personalizado
            </button>
          </div>
        )}
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('disponiveis')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'disponiveis'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Simulados Disponíveis ({simulados.filter(s => s.status !== 'concluido').length})
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'historico'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Histórico & Desempenho ({simulados.filter(s => s.status === 'concluido').length})
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ranking'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Ranking Oficial (Líderes de Acertos)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
              {rankings.length}
            </span>
          </button>
        </div>

        {activeTab === 'ranking' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Filtrar Simulado:</span>
            <select
              value={selectedRankingExamId}
              onChange={(e) => setSelectedRankingExamId(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none max-w-xs truncate"
            >
              <option value="all">Todos os Simulados (Geral)</option>
              {simulados.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Dificuldade:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none"
            >
              <option value="all">Todas as Dificuldades</option>
              <option value="Padrão Oficial">Padrão Oficial</option>
              <option value="Difícil">Difícil</option>
              <option value="Média">Média</option>
            </select>
          </div>
        )}
      </div>

      {/* View Content: Ranking vs Simulado Cards */}
      {activeTab === 'ranking' ? (
        (() => {
          // Sort primarily by HIGHEST CORRECT ANSWERS, then total points earned, then lowest time
          const sortedRankings = rankings
            .filter((r) => selectedRankingExamId === 'all' || (r.examId || r.mockExamId) === selectedRankingExamId)
            .slice()
            .sort((a, b) => {
              if (b.correctAnswers !== a.correctAnswers) {
                return b.correctAnswers - a.correctAnswers;
              }
              if ((b.pointsEarned ?? 0) !== (a.pointsEarned ?? 0)) {
                return (b.pointsEarned ?? 0) - (a.pointsEarned ?? 0);
              }
              return a.timeSpentSeconds - b.timeSpentSeconds;
            });

          const topThree = sortedRankings.slice(0, 3);

          return (
            <div className="space-y-6">
              {/* Podium Header Banner */}
              <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold">
                      <Trophy className="w-3.5 h-3.5 text-amber-200" />
                      Classificação Oficial por Maior Número de Acertos
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">
                      Quadro de Líderes do Simulado
                    </h3>
                    <p className="text-xs text-white/90 max-w-xl font-medium">
                      Critério de desempate homologado: 1º Maior número de questões corretas; 2º Soma de pontos ponderados por questão; 3º Menor tempo decorrido.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-center">
                      <span className="text-[10px] uppercase font-bold text-white/80 block">Participantes</span>
                      <span className="text-xl font-black">{sortedRankings.length}</span>
                    </div>
                    {sortedRankings.length > 0 && (
                      <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-center">
                        <span className="text-[10px] uppercase font-bold text-white/80 block">Recorde de Acertos</span>
                        <span className="text-xl font-black text-amber-200">{sortedRankings[0].correctAnswers} acertos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top 3 Podium Cards */}
              {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topThree.map((entry, idx) => {
                    const isFirst = idx === 0;
                    const isSecond = idx === 1;
                    const medalEmoji = isFirst ? '🥇' : isSecond ? '🥈' : '🥉';
                    const medalColor = isFirst 
                      ? 'border-amber-300 bg-linear-to-b from-amber-50 to-white shadow-amber-100/50' 
                      : isSecond 
                      ? 'border-slate-300 bg-linear-to-b from-slate-50 to-white shadow-slate-100/50' 
                      : 'border-orange-300 bg-linear-to-b from-orange-50 to-white shadow-orange-100/50';

                    return (
                      <div 
                        key={entry.id} 
                        className={`rounded-2xl border-2 p-5 shadow-sm transition-all flex flex-col justify-between ${medalColor}`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{medalEmoji}</span>
                            <span className="font-mono text-xs font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                              {idx + 1}º Lugar
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <img 
                              src={entry.studentAvatar || 'https://picsum.photos/seed/student-default/240/240'} 
                              alt={entry.studentName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-slate-900 truncate">
                                {entry.studentName}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate font-medium">
                                {entry.examTitle || entry.mockExamTitle}
                              </p>
                            </div>
                          </div>

                          {/* Scores with primary focus on Acertos */}
                          <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60 space-y-1.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-bold text-slate-600">Total de Acertos:</span>
                              <span className="text-lg font-black text-emerald-700 tabular-nums">
                                {entry.correctAnswers} <span className="text-xs font-bold text-slate-500">/ {entry.totalQuestions}</span>
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>Pontos Conquistados:</span>
                              <span className="font-extrabold text-indigo-700 tabular-nums">
                                ⭐ {entry.pointsEarned ?? entry.correctAnswers} pts
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>Aproveitamento:</span>
                              <span className="font-bold text-slate-800 tabular-nums">{entry.percentage ?? entry.scorePercent ?? 0}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {Math.floor(entry.timeSpentSeconds / 60)}m {entry.timeSpentSeconds % 60}s
                          </span>
                          <span>{entry.completedAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Complete Ranking Table */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50/70 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Tabela Geral de Classificação ({sortedRankings.length} Submissões)
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    Ordenado por Maior Nº de Acertos
                  </span>
                </div>

                {sortedRankings.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <Award className="w-10 h-10 text-slate-300 mx-auto" />
                    <h5 className="text-sm font-bold text-slate-800">Nenhum resultado registrado ainda</h5>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Conclua um simulado cronometrado para registrar sua pontuação e disputar os primeiros lugares no ranking.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8FAFC] text-slate-600 font-bold uppercase text-[10px] border-b border-[#E2E8F0]">
                        <tr>
                          <th className="py-3 px-4">Posição</th>
                          <th className="py-3 px-4">Aluno / Concursando</th>
                          <th className="py-3 px-4">Simulado</th>
                          <th className="py-3 px-4 text-center font-black text-emerald-800 bg-emerald-50/50">
                            Maior Nº de Acertos
                          </th>
                          <th className="py-3 px-4 text-center">Pontos Totais</th>
                          <th className="py-3 px-4 text-center">Rendimento (%)</th>
                          <th className="py-3 px-4 text-center">Tempo Gasto</th>
                          <th className="py-3 px-4 text-right">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {sortedRankings.map((entry, idx) => {
                          const isCurrentUser = currentStudent && currentStudent.id === entry.studentId;
                          const rankNumber = idx + 1;
                          const rankBadge = rankNumber === 1 
                            ? '🥇 1º' 
                            : rankNumber === 2 
                            ? '🥈 2º' 
                            : rankNumber === 3 
                            ? '🥉 3º' 
                            : `#${rankNumber}`;

                          return (
                            <tr 
                              key={entry.id}
                              className={`hover:bg-[#F8FAFC] transition-colors ${
                                isCurrentUser ? 'bg-amber-50/40 font-semibold' : ''
                              }`}
                            >
                              <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                                  rankNumber <= 3 ? 'bg-amber-100 text-amber-900 font-black' : 'text-slate-600'
                                }`}>
                                  {rankBadge}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img 
                                    src={entry.studentAvatar || 'https://picsum.photos/seed/student-default/240/240'} 
                                    alt={entry.studentName}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                  />
                                  <div>
                                    <span className="font-bold text-slate-900 flex items-center gap-1">
                                      {entry.studentName}
                                      {isCurrentUser && (
                                        <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase">
                                          Você
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                                {entry.examTitle || entry.mockExamTitle}
                              </td>
                              <td className="py-3 px-4 text-center font-black text-emerald-700 text-sm bg-emerald-50/30 tabular-nums">
                                {entry.correctAnswers} <span className="text-[11px] font-medium text-slate-500">/ {entry.totalQuestions}</span>
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-indigo-700 tabular-nums">
                                ⭐ {entry.pointsEarned ?? entry.correctAnswers} pts
                              </td>
                              <td className="py-3 px-4 text-center font-extrabold text-slate-800 tabular-nums">
                                {entry.percentage ?? entry.scorePercent ?? 0}%
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-slate-600">
                                {Math.floor(entry.timeSpentSeconds / 60)}m {entry.timeSpentSeconds % 60}s
                              </td>
                              <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                                {entry.completedAt}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        /* Grid of Simulated Exams */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSimulados.map((exam) => {
            const isDone = exam.status === 'concluido';
            const passedCutoff = exam.score && exam.score >= exam.cutoffRate;
            const totalExamPoints = exam.totalPoints || exam.questions?.reduce((acc, q) => acc + (q.points ?? 1), 0) || exam.totalQuestions;

            return (
              <div
                key={exam.id}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Header Pills */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#0F172A] text-white">
                        {exam.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.difficulty === 'Difícil'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {exam.difficulty}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        ⭐ {totalExamPoints} pts máx
                      </span>
                    </div>

                    {isDone ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        Disponível
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-extrabold text-[#0F172A] leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 font-medium">
                    {exam.agency} • Banca: <strong>{exam.board}</strong>
                  </p>

                  {/* Covered Subjects */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {exam.subjectsCovered.map((sub) => (
                      <span key={sub} className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exam Specs or Completed Results */}
                <div className="pt-3 border-t border-[#F1F5F9] space-y-3">
                  {isDone ? (
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#64748B] block">Seu Rendimento</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-xl font-black tabular-nums ${passedCutoff ? 'text-emerald-600' : 'text-red-600'}`}>
                            {exam.score}%
                          </span>
                          <span className="text-xs text-[#64748B] font-medium">
                            ({exam.correctAnswers}/{exam.totalQuestions} questões • {exam.pointsEarned ?? exam.correctAnswers} pts)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#64748B] block">Nota de Corte</span>
                        <span className="text-sm font-bold text-[#0F172A] tabular-nums">{exam.cutoffRate}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[10px] uppercase font-bold text-[#64748B] block">Questões</span>
                        <span className="font-extrabold text-[#0F172A] tabular-nums">{exam.totalQuestions}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[10px] uppercase font-bold text-[#64748B] block">Pontos</span>
                        <span className="font-extrabold text-indigo-700 tabular-nums">{totalExamPoints} pts</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[10px] uppercase font-bold text-[#64748B] block">Tempo</span>
                        <span className="font-extrabold text-[#0F172A] tabular-nums">{Math.floor(exam.durationMinutes / 60)}h {exam.durationMinutes % 60 ? `${exam.durationMinutes % 60}m` : ''}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span className="text-[10px] uppercase font-bold text-[#64748B] block">Corte Previsto</span>
                        <span className="font-extrabold text-emerald-600 tabular-nums">{exam.cutoffRate}%</span>
                      </div>
                    </div>
                  )}

                  {/* Card CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#64748B] flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {isDone ? `Realizado em ${exam.submittedAt}` : `${exam.durationMinutes} min de prova`}
                    </span>

                    <button
                      onClick={() => onStartExam(exam)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDone
                          ? 'border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A]'
                          : 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          Refazer Simulado
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Iniciar Simulado
                        </>
                      )}
                    </button>
                  </div>

                  {/* Admin Question Editor Trigger */}
                  {isAdmin && (
                    <div className="pt-3 border-t border-dashed border-[#CBD5E1] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Gestão de Questões & Pesos:
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingExamForQuestions(exam)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-200 shadow-2xs transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Editar Questões & Pontuações ({exam.questions?.length || exam.totalQuestions})</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to Create Custom Mock Exam (Admin Only) */}
      {isCreateModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
                  <Timer className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">
                    Criar Simulado Sob Medida
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Configure o volume de questões, tempo de prova e nota de corte.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Título do Simulado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Simulado Geral de Direito Público e Auditoria"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Banca Referência
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: FGV ou Cebraspe"
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Dificuldade
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  >
                    <option value="Padrão Oficial">Padrão Oficial</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Média">Média</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Qtd Questões
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={newTotalQ}
                    onChange={(e) => setNewTotalQ(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Tempo (minutos)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={360}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Corte (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={95}
                    value={newCutoff}
                    onChange={(e) => setNewCutoff(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-[#64748B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm"
                >
                  Salvar Simulado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Administrator to Edit Questions of this Mock Exam */}
      {editingExamForQuestions && (
        <SimuladoQuestionsEditorModal
          isOpen={!!editingExamForQuestions}
          onClose={() => setEditingExamForQuestions(null)}
          exam={editingExamForQuestions}
          allAvailableQuestions={allQuestions}
          onSaveExam={(updated) => {
            if (onUpdateSimulado) {
              onUpdateSimulado(updated);
            }
            setEditingExamForQuestions(null);
          }}
        />
      )}
    </div>
  );
}
