'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  FileText,
  SlidersHorizontal,
  CalendarCheck,
  Edit3,
  Trash2,
  Plus,
  Eye,
  Check
} from 'lucide-react';
import { DailyTask, ExamTarget, CycleDay, SavedAISchedule } from '@/lib/types';
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
  currentStudent?: { id?: string; name: string; email: string; targetExam: string } | null;
  aiSchedules?: SavedAISchedule[];
  activeAIScheduleId?: string | null;
  onSaveAISchedule?: (schedule: SavedAISchedule, isEditing: boolean) => void;
  onSelectAISchedule?: (scheduleId: string) => void;
  onDeleteAISchedule?: (scheduleId: string) => void;
}

export function StudyScheduleView({
  tasks,
  onToggleTask,
  currentTarget,
  onOpenPasteEdital,
  onUpdateTasks,
  cycleDays: initialCycleDays,
  onUpdateCycleDays,
  currentStudent,
  aiSchedules = [],
  activeAIScheduleId = null,
  onSaveAISchedule,
  onSelectAISchedule,
  onDeleteAISchedule,
}: StudyScheduleViewProps) {
  const [activeCycleTab, setActiveCycleTab] = useState<'diario' | 'semanal' | 'edital'>('diario');
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<SavedAISchedule | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedTextId, setExpandedTextId] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  const activeAISchedule = aiSchedules.find((s) => s.id === activeAIScheduleId) || null;
  const effectiveSyllabus = activeAISchedule?.syllabus || currentTarget.syllabus;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenCreateAI = () => {
    setEditingSchedule(null);
    setIsAutoModalOpen(true);
  };

  const handleOpenEditAI = (schedule: SavedAISchedule) => {
    setEditingSchedule(schedule);
    setIsAutoModalOpen(true);
  };

  const handleSaveSchedule = (schedule: SavedAISchedule, isEditing: boolean) => {
    setCycleDaysState(schedule.cycleDays);
    if (onSaveAISchedule) {
      onSaveAISchedule(schedule, isEditing);
    } else {
      onUpdateCycleDays?.(schedule.cycleDays);
      onUpdateTasks?.(schedule.tasks);
    }
    showToast(
      isEditing
        ? `Cronograma "${schedule.title}" atualizado com base no texto do edital!`
        : `Novo cronograma "${schedule.title}" criado pela IA!`
    );
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

  const methodologyLabel = (m: SavedAISchedule['methodology']) => {
    if (m === 'foco_questoes') return 'Foco em Questões';
    if (m === 'reta_final') return 'Reta Final';
    return 'Ciclo Equilibrado';
  };

  const totalWeeklyHoursPlanned = activeCycleDays.reduce((acc, d) => acc + (d.hours || 4), 0);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

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
            {currentStudent && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
                Perfil: {currentStudent.name.split(' ')[0]}
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Cronograma Inteligente & Ciclo de Estudos
          </h2>
          <p className="text-xs text-[#475569] max-w-xl">
            Copie e cole seu edital para a IA gerar um novo cronograma personalizado. Você pode editar o texto colado ou excluir cronogramas a qualquer momento.
          </p>
        </div>

        {/* Tab switcher, Auto Schedule & Custom Cycle buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Option: Criar Novo Cronograma com IA (via edital colado) */}
          <button
            type="button"
            onClick={handleOpenCreateAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Criar Cronograma com IA
          </button>

          {/* Option: Usuário Criar seu Ciclo e Cronograma */}
          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB]" />
            Personalizar Meu Ciclo
          </button>

          {onOpenPasteEdital && (
            <button
              type="button"
              onClick={onOpenPasteEdital}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#64748B]" />
              Colar Edital
            </button>
          )}

          <div className="flex items-center rounded-lg border border-[#CBD5E1] p-1 bg-[#F8FAFC]">
            <button
              type="button"
              onClick={() => setActiveCycleTab('diario')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeCycleTab === 'diario' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Visão Diária
            </button>
            <button
              type="button"
              onClick={() => setActiveCycleTab('semanal')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeCycleTab === 'semanal' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Ciclo Semanal
            </button>
            <button
              type="button"
              onClick={() => setActiveCycleTab('edital')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeCycleTab === 'edital' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Cobertura do Edital
            </button>
          </div>
        </div>
      </div>

      {/* Saved AI Schedules Section (Editar / Excluir / Alternar com base no edital colado) */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
              Cronogramas Criados com IA ({aiSchedules.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateAI}
            className="text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Cronograma (Colar Edital)
          </button>
        </div>

        {aiSchedules.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#0F172A]">
                Nenhum cronograma gerado por edital colado ainda.
              </p>
              <p className="text-[11px] text-[#64748B]">
                Clique em &ldquo;Criar Cronograma com IA&rdquo;, copie e cole o texto do edital no campo específico e gere seu plano completo.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateAI}
              className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Colar Edital e Gerar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiSchedules.map((sched) => {
              const isActive = sched.id === activeAIScheduleId;
              const isConfirmingDelete = confirmDeleteId === sched.id;
              const isTextExpanded = expandedTextId === sched.id;

              return (
                <div
                  key={sched.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'border-[#2563EB] bg-[#EFF6FF]/40 ring-1 ring-[#2563EB]/30 shadow-2xs'
                      : 'border-[#E2E8F0] bg-[#F8FAFC]/50 hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {isActive && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                              Ativo
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {methodologyLabel(sched.methodology)}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
                            {sched.weeklyHours}h/sem
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
                          {sched.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B]">
                          {sched.subjectsCount} {sched.subjectsCount === 1 ? 'matéria' : 'matérias'} •{' '}
                          {sched.topicsCount} {sched.topicsCount === 1 ? 'tópico' : 'tópicos'} • Atualizado em {sched.updatedAt}
                        </p>
                      </div>
                    </div>

                    {/* Extracted subjects badges */}
                    {sched.extractedSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {sched.extractedSubjects.slice(0, 4).map((subj, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#475569]"
                          >
                            {subj}
                          </span>
                        ))}
                        {sched.extractedSubjects.length > 4 && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#64748B]">
                            +{sched.extractedSubjects.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Toggle preview of pasted text */}
                    {isTextExpanded && (
                      <div className="p-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[11px] font-mono text-[#334155] whitespace-pre-line max-h-36 overflow-y-auto">
                        {sched.editalText}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2.5 border-t border-[#E2E8F0]/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {!isActive && onSelectAISchedule && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAISchedule(sched.id);
                            showToast(`Cronograma "${sched.title}" ativado.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Ativar</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedTextId(isTextExpanded ? null : sched.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Visualizar texto do edital colado"
                      >
                        <Eye className="w-3 h-3 text-[#2563EB]" />
                        <span>{isTextExpanded ? 'Ocultar Texto' : 'Ver Edital'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Editar com base no texto copiado e colado */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditAI(sched)}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Editar texto do edital colado e atualizar este cronograma"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>

                      {/* Excluir cronograma */}
                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteAISchedule?.(sched.id);
                              setConfirmDeleteId(null);
                              showToast(`Cronograma "${sched.title}" excluído.`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] text-[11px] font-bold cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(sched.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Excluir este cronograma"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Excluir</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
                {activeAISchedule
                  ? `Tarefas de Hoje • ${activeAISchedule.title}`
                  : 'Tarefas do Ciclo de Hoje'}
              </h3>
            </div>
            <span className="text-xs text-[#64748B] tabular-nums">
              Tempo estimado:{' '}
              {tasks.reduce((acc, t) => acc + t.durationMinutes, 0)} min
            </span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {tasks.map((task, index) => (
              <div 
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${
                      task.completed
                        ? 'bg-[#10B981] border-[#10B981] text-white shadow-2xs'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#2563EB]'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>

                  <div className="min-w-0">
                    <p className={`text-xs md:text-sm font-bold ${
                      task.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'
                    }`}>
                      {index + 1}. {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                        {task.subject}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">
                        Modalidade: {task.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
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
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
                  Verticalização do Edital ({currentTarget.agency})
                </h3>
                {effectiveSyllabus && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Edital Colado Personalizado
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B]">
                {effectiveSyllabus 
                  ? `Baseado no edital importado: ${effectiveSyllabus.title}`
                  : 'Progresso consolidado por matéria do edital vigente.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                {effectiveSyllabus ? '100% Estruturado' : `${currentTarget.progressPercent}% Percorrido`}
              </span>
            </div>
          </div>

          {effectiveSyllabus && Array.isArray(effectiveSyllabus.subjects) && effectiveSyllabus.subjects.length > 0 ? (
            <div className="space-y-4">
              {effectiveSyllabus.subjects.map((sub, sIdx) => {
                const topicsList = Array.isArray(sub?.topics) ? sub.topics : [];
                return (
                  <div key={sub.id || `sub-${sIdx}`} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/50 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#0F172A] text-white flex items-center justify-center text-[10px] font-bold">
                          {sIdx + 1}
                        </span>
                        <h4 className="text-xs font-extrabold text-[#0F172A]">
                          {sub.subject || 'Disciplina'}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-[#2563EB] tabular-nums">
                        {topicsList.length} tópicos catalogados
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {topicsList.map((topic, tIdx) => (
                        <div 
                          key={topic.id || `top-${tIdx}`}
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
                            Relevância {topic.weight || 'Média'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : currentTarget.isCustom || (effectiveSyllabus && Array.isArray(effectiveSyllabus.subjects) && effectiveSyllabus.subjects.length === 0) ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-[#CBD5E1] space-y-3">
              <CalendarCheck className="w-8 h-8 text-blue-500 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0F172A]">Estrutura Programática do Curso</h4>
                <p className="text-[11px] text-[#64748B] max-w-sm mx-auto">
                  Cole o conteúdo programático do edital para gerar seu cronograma com IA ou verticalizar as matérias.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateAI}
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>+ Colar Edital e Criar Cronograma com IA</span>
              </button>
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
              <span className="text-2xl font-black text-[#0F172A] tabular-nums">
                {totalWeeklyHoursPlanned.toFixed(1)}h
              </span>
              <p className="text-[11px] text-[#64748B] mt-2">Distribuição equilibrada entre segunda e domingo.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#64748B] block mb-1">Proporção Questões vs Teoria</span>
              <span className="text-2xl font-black text-[#2563EB]">
                {activeAISchedule?.methodology === 'foco_questoes' ? '75% / 25%' : '70% / 30%'}
              </span>
              <p className="text-[11px] text-[#64748B] mt-2">Foco pesado em resolução ativa com justificativa doutrinária.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#64748B] block mb-1">Simulado de Fechamento</span>
              <span className="text-2xl font-black text-[#10B981]">Sábado 08:30</span>
              <p className="text-[11px] text-[#64748B] mt-2">Simulação integral cronometrada com revisão no domingo.</p>
            </div>
          </div>
        </div>
      )}

      {/* Auto Schedule AI Modal (Criar & Editar a partir do texto colado) */}
      <AutoScheduleModal
        isOpen={isAutoModalOpen}
        onClose={() => {
          setIsAutoModalOpen(false);
          setEditingSchedule(null);
        }}
        currentTarget={currentTarget}
        studentId={currentStudent?.id || 'usr-1'}
        editingSchedule={editingSchedule}
        onSaveAISchedule={handleSaveSchedule}
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
