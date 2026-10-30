'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  Target,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { DailyTask, ExamTarget, CycleDay } from '@/lib/types';
import { AutoScheduleModal } from '@/components/AutoScheduleModal';
import { CustomCycleModal } from '@/components/CustomCycleModal';

interface StudyScheduleViewProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  currentTarget: ExamTarget;
  onOpenPasteEdital?: () => void;
  onUpdateTasks?: (newTasks: DailyTask[]) => void;
  cycleDays?: CycleDay[];
  onUpdateCycleDays?: (newDays: CycleDay[]) => void;
}

export function StudyScheduleView({
  tasks,
  onToggleTask,
  currentTarget,
  onOpenPasteEdital,
  onUpdateTasks,
  cycleDays: initialCycleDays,
  onUpdateCycleDays,
}: StudyScheduleViewProps) {
  const [activeCycleTab, setActiveCycleTab] = useState<'diario' | 'semanal' | 'edital'>('diario');
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const defaultCycleDays: CycleDay[] = [
    { day: 'Seg', block: 'Tributário + CPC 47', status: 'concluido', hours: 4.2 },
    { day: 'Ter', block: 'Constitucional + Súmulas', status: 'concluido', hours: 4.5 },
    { day: 'Qua', block: 'Administrativo + Revisão SRS', status: 'hoje', hours: 4.0 },
    { day: 'Qui', block: 'Auditoria Governamental', status: 'pendente', hours: 4.0 },
    { day: 'Sex', block: 'Legislação Aduaneira', status: 'pendente', hours: 4.0 },
    { day: 'Sáb', block: 'Simulado Geral 70Q', status: 'pendente', hours: 5.5 },
    { day: 'Dom', block: 'Discursivas & Diagnóstico', status: 'pendente', hours: 3.0 },
  ];

  const [cycleDaysState, setCycleDaysState] = useState<CycleDay[]>(initialCycleDays || defaultCycleDays);
  const activeCycleDays = initialCycleDays || cycleDaysState;

  const handleApplyAuto = (newTasks: DailyTask[], newCycleDays: CycleDay[]) => {
    setCycleDaysState(newCycleDays);
    onUpdateCycleDays?.(newCycleDays);
    onUpdateTasks?.(newTasks);
  };

  const handleSaveCycleDay = (index: number, newBlock: string, hours: number) => {
    const updated = [...activeCycleDays];
    updated[index] = { ...updated[index], block: newBlock, hours };
    setCycleDaysState(updated);
    onUpdateCycleDays?.(updated);
  };

  const handleAddNewTask = (newTask: DailyTask) => {
    const updated = [newTask, ...tasks];
    onUpdateTasks?.(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Methodology Overview */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#EFF6FF] text-[#2563EB]">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Metodologia de Ciclos Intercalados
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Cronograma Inteligente & Ciclo de Estudos
          </h2>
          <p className="text-xs text-[#475569] max-w-xl">
            Planejamento dinâmico que recalibra o volume de questões e teoria de acordo com a sua curva de esquecimento e dias até a prova.
          </p>
        </div>

        {/* Tab switcher, Auto Schedule & Custom Cycle buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Option: Criar Automaticamente (IA) */}
          <button
            onClick={() => setIsAutoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Criar Automaticamente (IA)
          </button>

          {/* Option: Usuário Criar seu Ciclo e Cronograma */}
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB]" />
            Personalizar Meu Ciclo
          </button>

          {onOpenPasteEdital && (
            <button
              onClick={onOpenPasteEdital}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#64748B]" />
              Colar Edital
            </button>
          )}

          <div className="flex items-center rounded-lg border border-[#CBD5E1] p-1 bg-[#F8FAFC]">
            <button
              onClick={() => setActiveCycleTab('diario')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeCycleTab === 'diario' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Visão Diária
            </button>
            <button
              onClick={() => setActiveCycleTab('semanal')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeCycleTab === 'semanal' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Ciclo Semanal
            </button>
            <button
              onClick={() => setActiveCycleTab('edital')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeCycleTab === 'edital' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Cobertura do Edital
            </button>
          </div>
        </div>
      </div>

      {/* Week overview row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {activeCycleDays.map((c, idx) => (
          <div
            key={`${c.day}-${idx}`}
            onClick={() => setIsCustomModalOpen(true)}
            className={`p-3 rounded-xl border text-center transition-all cursor-pointer group hover:scale-[1.02] ${
              c.status === 'hoje'
                ? 'bg-[#EFF6FF] border-[#2563EB] shadow-xs'
                : c.status === 'concluido'
                ? 'bg-white border-[#E2E8F0]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-80'
            }`}
            title="Clique para editar este dia do ciclo"
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-black ${c.status === 'hoje' ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                {c.day}
              </span>
              {c.status === 'concluido' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              )}
              {c.status === 'hoje' && (
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              )}
            </div>
            <p className="text-[11px] font-semibold text-[#475569] leading-tight line-clamp-2 min-h-[32px]">
              {c.block}
            </p>
            <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-[#E2E8F0]/50 font-bold">
              <span className="text-[#64748B] tabular-nums">{c.hours || 4}h</span>
              <span className={
                c.status === 'hoje' ? 'text-[#2563EB]' : c.status === 'concluido' ? 'text-[#10B981]' : 'text-[#94A3B8]'
              }>
                {c.status === 'hoje' ? 'Hoje' : c.status === 'concluido' ? 'Feito' : 'Previsto'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content depending on tab */}
      {activeCycleTab === 'diario' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
              Tarefas do Ciclo de Hoje (Quarta-feira)
            </h3>
            <span className="text-xs text-[#64748B]">Tempo estimado: 3h 30min</span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {tasks.map((task, index) => (
              <div 
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="py-3.5 flex items-center justify-between gap-4 group cursor-pointer hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      task.completed
                        ? 'bg-[#10B981] border-[#10B981] text-white shadow-2xs'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#2563EB]'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>

                  <div>
                    <p className={`text-xs md:text-sm font-bold ${
                      task.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'
                    }`}>
                      {index + 1}. {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                        {task.subject}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">
                        Modalidade: {task.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-[#64748B] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {task.durationMinutes} min
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    task.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {task.completed ? 'Concluída' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCycleTab === 'edital' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
                  Verticalização do Edital ({currentTarget.agency})
                </h3>
                {currentTarget.syllabus && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Edital Colado Personalizado
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B]">
                {currentTarget.syllabus 
                  ? `Baseado no edital importado: ${currentTarget.syllabus.title}`
                  : 'Progresso consolidado por matéria do edital vigente.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                {currentTarget.syllabus ? '100% Estruturado' : `${currentTarget.progressPercent}% Percorrido`}
              </span>
            </div>
          </div>

          {/* If custom syllabus is present, render parsed subjects and granular topics */}
          {currentTarget.syllabus ? (
            <div className="space-y-4">
              {currentTarget.syllabus.subjects.map((sub, sIdx) => (
                <div key={sub.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#0F172A] text-white flex items-center justify-center text-[10px] font-bold">
                        {sIdx + 1}
                      </span>
                      <h4 className="text-xs font-extrabold text-[#0F172A]">
                        {sub.subject}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB] tabular-nums">
                      {sub.topics.length} tópicos catalogados
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {sub.topics.map((topic, tIdx) => (
                      <div 
                        key={topic.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                          <span className="text-xs text-[#334155] font-medium truncate">
                            <strong className="text-[#0F172A] font-mono mr-1">{tIdx + 1}.</strong>
                            {topic.name}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          topic.weight === 'Alto' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          Relevância {topic.weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { name: 'Direito Tributário', pct: 92, status: 'Revisão Final' },
                { name: 'Direito Constitucional', pct: 88, status: 'Revisão Final' },
                { name: 'Direito Administrativo', pct: 81, status: 'Em fechamento' },
                { name: 'Contabilidade Geral & CPCs', pct: 64, status: 'Vulnerável' },
                { name: 'Auditoria Governamental', pct: 85, status: 'Revisão Final' },
                { name: 'Legislação Tributária Federal', pct: 70, status: 'Em fechamento' },
              ].map((sub) => (
                <div key={sub.name} className="p-3 rounded-lg border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#0F172A]">{sub.name}</span>
                    <span className="tabular-nums text-[#2563EB]">{sub.pct}%</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.pct >= 85 ? 'bg-[#10B981]' : sub.pct >= 70 ? 'bg-[#2563EB]' : 'bg-[#EF4444]'
                      }`}
                      style={{ width: `${sub.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Status: <strong className="text-[#0F172A]">{sub.status}</strong></span>
                    <span>Faltam 4 tópicos para fechar</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeCycleTab === 'semanal' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
            Matriz de Carga Horária e Distribuição
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#64748B] block mb-1">Carga Semanal Planejada</span>
              <span className="text-2xl font-black text-[#0F172A] tabular-nums">32h 00m</span>
              <p className="text-[11px] text-[#64748B] mt-2">Distribuição em blocos de 45 min com 10 min de intervalo ativo.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#64748B] block mb-1">Proporção Questões vs Teoria</span>
              <span className="text-2xl font-black text-[#2563EB]">70% / 30%</span>
              <p className="text-[11px] text-[#64748B] mt-2">Foco pesado em resolução ativa com justificativa doutrinária.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#64748B] block mb-1">Simulado de Fechamento</span>
              <span className="text-2xl font-black text-[#10B981]">Sábado 08:30</span>
              <p className="text-[11px] text-[#64748B] mt-2">Simulação integral de 70 questões com cronômetro de prova.</p>
            </div>
          </div>
        </div>
      )}

      {/* Auto Schedule AI Modal */}
      <AutoScheduleModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
        currentTarget={currentTarget}
        onApplySchedule={handleApplyAuto}
      />

      {/* Custom Cycle Modal (User Defined) */}
      <CustomCycleModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        cycleDays={activeCycleDays}
        onSaveCycleDay={handleSaveCycleDay}
        onAddNewTask={handleAddNewTask}
      />
    </div>
  );
}
