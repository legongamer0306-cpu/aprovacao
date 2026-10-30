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
  Scale
} from 'lucide-react';
import { MockExam, ExamQuestion } from '@/lib/types';
import { MOCK_QUESTIONS } from '@/lib/mockData';

interface SimuladosViewProps {
  simulados: MockExam[];
  onStartExam: (exam: MockExam) => void;
  onCreateCustomSimulado: (newSim: MockExam) => void;
}

export function SimuladosView({
  simulados,
  onStartExam,
  onCreateCustomSimulado,
}: SimuladosViewProps) {
  const [activeTab, setActiveTab] = useState<'disponiveis' | 'historico'>('disponiveis');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

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
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Criar Simulado Personalizado
          </button>
        </div>
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
        </div>

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
      </div>

      {/* Grid of Simulated Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSimulados.map((exam) => {
          const isDone = exam.status === 'concluido';
          const passedCutoff = exam.score && exam.score >= exam.cutoffRate;

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
                          ({exam.correctAnswers}/{exam.totalQuestions} questões)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">Nota de Corte</span>
                      <span className="text-sm font-bold text-[#0F172A] tabular-nums">{exam.cutoffRate}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">Questões</span>
                      <span className="font-extrabold text-[#0F172A] tabular-nums">{exam.totalQuestions}</span>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Create Custom Mock Exam */}
      {isCreateModalOpen && (
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
    </div>
  );
}
