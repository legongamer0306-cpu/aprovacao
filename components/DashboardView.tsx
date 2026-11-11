'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Target, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Award, 
  ArrowUpRight, 
  Clock, 
  Layers, 
  BrainCircuit,
  AlertCircle,
  Play,
  FileText,
  Bookmark
} from 'lucide-react';
import { ExamTarget, DailyTask, SubjectPerformance, StudentStreakData, StudentDailyGoal } from '@/lib/types';
import { MOCK_HOURLY_HEATMAP } from '@/lib/mockData';

interface DashboardViewProps {
  currentTarget: ExamTarget;
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  performances: SubjectPerformance[];
  streakData?: StudentStreakData;
  dailyGoal?: StudentDailyGoal;
  onNavigateToQuestions: (subjectFilter?: string, mode?: 'all' | 'oficial' | 'membros' | 'marcadas' | 'erros') => void;
  onNavigateToSimulados?: () => void;
  onOpenPasteEdital?: () => void;
}

export function DashboardView({
  currentTarget,
  tasks,
  onToggleTask,
  performances,
  streakData,
  dailyGoal,
  onNavigateToQuestions,
  onNavigateToSimulados,
  onOpenPasteEdital,
}: DashboardViewProps) {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalQuestions = performances.reduce((acc, p) => acc + (p.questionsAnswered || 0), 0);
  const totalCorrect = performances.reduce((acc, p) => acc + (p.correctCount || 0), 0);
  const overallRate = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : '0.0';
  const isZeroState = totalQuestions === 0;

  return (
    <div className="space-y-6">
      {/* Target Focus Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              Foco Prioritário
            </span>
            <span className="text-xs text-[#64748B] font-medium">Banca Organizadora: {currentTarget.agency || 'Oficial'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            {currentTarget.name} — {currentTarget.role}
          </h1>
          <p className="text-xs md:text-sm text-[#475569] max-w-2xl">
            Edital ativo • Remuneração inicial estimada de <span className="font-semibold text-[#0F172A]">{currentTarget.salary}</span> • Prova prevista para <span className="font-semibold text-[#0F172A]">{currentTarget.examDate}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <div className="px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-center min-w-[90px]">
            <div className="text-[11px] uppercase font-bold text-[#64748B] tracking-wider">Contagem</div>
            <div className="text-2xl font-extrabold text-[#0F172A] tabular-nums">{currentTarget.daysRemaining}</div>
            <div className="text-[10px] font-medium text-[#64748B]">dias restantes</div>
          </div>
          {onOpenPasteEdital && (
            <button
              onClick={onOpenPasteEdital}
              className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
              Colar Edital
            </button>
          )}
          <button
            onClick={() => onNavigateToQuestions(undefined, 'marcadas')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-lg border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            title="Revisar questões marcadas com estrela"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span className="hidden sm:inline">Marcadas</span>
          </button>
          <button
            onClick={() => onNavigateToQuestions(undefined, 'erros')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-lg border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            title="Acessar caderno de erros frequentes"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Caderno de Erros</span>
          </button>
          <button
            onClick={() => onNavigateToQuestions()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-sm transition-all hover:translate-y-[-1px] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Iniciar Sessão
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Questões Resolvidas & Meta Diária */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-2">
            <span>Meta Diária de Questões</span>
            <span className="p-1.5 rounded-md bg-[#EFF6FF] text-[#2563EB]">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tabular-nums">
              {dailyGoal ? dailyGoal.answeredToday : totalQuestions}{' '}
              <span className="text-xs font-medium text-[#64748B]">
                / {dailyGoal ? dailyGoal.targetQuestions : 50} meta
              </span>
            </span>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              dailyGoal && dailyGoal.answeredToday >= dailyGoal.targetQuestions && dailyGoal.targetQuestions > 0
                ? 'text-emerald-700 bg-emerald-100'
                : isZeroState 
                ? 'text-slate-600 bg-slate-100' 
                : 'text-[#10B981] bg-[#ECFDF5]'
            }`}>
              {dailyGoal
                ? dailyGoal.answeredToday >= dailyGoal.targetQuestions && dailyGoal.targetQuestions > 0
                  ? 'Meta Batida! 🎯'
                  : `${Math.min(100, Math.round((dailyGoal.answeredToday / (dailyGoal.targetQuestions || 1)) * 100))}% da meta`
                : `${Math.min(100, Math.round((totalQuestions / 50) * 100))}% da meta`}
            </span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                dailyGoal && dailyGoal.answeredToday >= dailyGoal.targetQuestions && dailyGoal.targetQuestions > 0
                  ? 'bg-emerald-500'
                  : 'bg-[#2563EB]'
              }`}
              style={{
                width: `${
                  dailyGoal
                    ? Math.min(100, Math.round((dailyGoal.answeredToday / (dailyGoal.targetQuestions || 1)) * 100))
                    : Math.min(100, Math.round((totalQuestions / 50) * 100))
                }%`
              }}
            />
          </div>
        </div>

        {/* Metric 2: Taxa de Acerto */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-2">
            <span>Taxa de Acertos no Curso</span>
            <span className="p-1.5 rounded-md bg-[#ECFDF5] text-[#10B981]">
              <Target className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tabular-nums">
              {overallRate}<span className="text-sm font-semibold">%</span>
            </span>
            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              isZeroState ? 'text-slate-600 bg-slate-100' : 'text-[#10B981] bg-[#ECFDF5]'
            }`}>
              Meta: &gt;80%
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-3">
            {isZeroState
              ? 'Nenhuma questão respondida ainda neste curso'
              : `${totalCorrect} acertos em ${totalQuestions} questões resolvidas`}
          </p>
        </div>

        {/* Metric 3: Sequência & Login Diário */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-2">
            <span>Login Diário & Sequência</span>
            <span className="p-1.5 rounded-md bg-[#FEF3C7] text-[#B45309]">
              <Flame className="w-3.5 h-3.5 fill-[#F59E0B]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tabular-nums">
              {streakData ? Math.max(1, streakData.currentStreak) : 1}{' '}
              <span className="text-xs font-semibold text-[#64748B]">dias</span>
            </span>
            <span className="inline-flex items-center text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              Recorde: {streakData ? Math.max(1, streakData.longestStreak) : 1}d
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-3">
            {streakData && streakData.currentStreak > 1
              ? `${streakData.currentStreak} dias consecutivos acessando a plataforma`
              : '1º dia de acesso consecutivo hoje'}
          </p>
        </div>

        {/* Metric 4: Simulados & Provas Realizadas */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs hover:border-[#CBD5E1] transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold mb-2">
            <span>Simulados Oficiais</span>
            <span className="p-1.5 rounded-md bg-[#F5F3FF] text-[#7C3AED]">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tabular-nums">
              {isZeroState ? 0 : 8} <span className="text-xs font-semibold text-[#64748B]">provas</span>
            </span>
            {onNavigateToSimulados && (
              <button 
                onClick={onNavigateToSimulados}
                className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
              >
                Ver simulados →
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#10B981] mt-3 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>
              {isZeroState
                ? 'Nenhum simulado realizado neste curso'
                : `Média de acertos: ${overallRate}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tasks & Weekly Activity (8 cols / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Plano Diário & Tarefas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
                  Metas do Ciclo de Hoje
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] tabular-nums">
                  {completedTasks}/{totalTasks} concluídas ({completionPercentage}%)
                </span>
              </div>
              <span className="text-xs font-semibold text-[#2563EB]">Ciclo 3 • Bloco 2</span>
            </div>

            {/* Task list items */}
            <div className="divide-y divide-[#F1F5F9] mt-2">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors"
                >
                  <button 
                    type="button"
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      task.completed
                        ? 'bg-[#10B981] border-[#10B981] text-white shadow-2xs'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#2563EB]'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold ${
                        task.completed ? 'line-through text-[#94A3B8]' : 'text-[#0F172A]'
                      }`}>
                        {task.title}
                      </p>
                      <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#94A3B8]" />
                        {task.durationMinutes} min
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
                        {task.subject}
                      </span>
                      {task.targetCount && (
                        <span className="text-[10px] text-[#64748B] font-medium tabular-nums">
                          {task.currentCount}/{task.targetCount} concluídos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action bar */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Estimativa total: 3h 20m</span>
              <button
                onClick={() => onNavigateToQuestions('Direito Tributário')}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
              >
                Próximo bloco: Tributário <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekly Heatmap Activity */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Consistência Semanal
                </h3>
                <p className="text-sm font-bold text-[#0F172A]">Volume de Horas e Precisão</p>
              </div>
              <span className="text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
                Média: 4.6h/dia
              </span>
            </div>

            <div className="overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[280px]">
                {MOCK_HOURLY_HEATMAP.map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B]">{item.day}</span>
                    <div className="w-full bg-[#E2E8F0] h-10 sm:h-12 rounded flex flex-col justify-end p-0.5">
                      <div 
                        className="w-full bg-[#2563EB] rounded-xs transition-all"
                        style={{ height: `${(item.hours / 7) * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#0F172A] tabular-nums">{item.hours}h</span>
                    <span className="text-[8px] sm:text-[9px] font-semibold text-[#10B981] tabular-nums">{item.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Desempenho por Matéria & Alerta de Vulnerabilidade */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#0F172A]">
                Matérias no Radar
              </h2>
              <span className="text-xs text-[#64748B]">Acerto Médio</span>
            </div>

            <div className="space-y-3 mt-3">
              {performances.map((perf) => {
                const isWarning = perf.status === 'Atenção Crítica';
                const isMastery = perf.status === 'Domínio';

                return (
                  <div 
                    key={perf.subject}
                    onClick={() => onNavigateToQuestions(perf.subject)}
                    className="p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate max-w-[190px]">
                        {perf.subject}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black tabular-nums ${
                          isWarning ? 'text-[#EF4444]' : isMastery ? 'text-[#10B981]' : 'text-[#2563EB]'
                        }`}>
                          {perf.accuracyRate}%
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isWarning ? 'bg-red-50 text-red-700' : isMastery ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {perf.delta}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isWarning ? 'bg-[#EF4444]' : isMastery ? 'bg-[#10B981]' : 'bg-[#2563EB]'
                        }`}
                        style={{ width: `${perf.accuracyRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1.5 font-medium">
                      <span>{perf.questionsAnswered} resolvidas</span>
                      <span className={isWarning ? 'text-red-600 font-bold' : ''}>
                        {perf.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Warning / Recommendation Card */}
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#991B1B]">
                  Ponto Vulnerável Detectado
                </h4>
                <p className="text-[11px] text-[#7F1D1D] leading-relaxed">
                  Sua taxa em <strong>Contabilidade Geral (CPC 47 e CPC 00)</strong> caiu para 64.8% nas últimas 48h. A banca FGV cobra esse tema em 12% da prova.
                </p>
                <button
                  onClick={() => onNavigateToQuestions('Contabilidade Geral')}
                  className="mt-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  Resolver Caderno de Reforço (15q)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
