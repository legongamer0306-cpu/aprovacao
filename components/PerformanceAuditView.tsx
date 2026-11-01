'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Target, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  PieChart,
  ArrowUpRight,
  TrendingDown,
  User,
  History,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { SubjectPerformance, ManagedUser, AuditEntry } from '@/lib/types';

interface PerformanceAuditViewProps {
  performances: SubjectPerformance[];
  onFocusSubject: (subject: string) => void;
  currentStudent?: ManagedUser | null;
  auditLogs?: AuditEntry[];
}

export function PerformanceAuditView({
  performances,
  onFocusSubject,
  currentStudent,
  auditLogs = [],
}: PerformanceAuditViewProps) {
  const [activeTab, setActiveTab] = useState<'metricas' | 'auditoria'>('metricas');

  const totalQuestions = performances.reduce((acc, p) => acc + p.questionsAnswered, 0);
  const totalCorrect = performances.reduce((acc, p) => acc + p.correctCount, 0);
  const overallRate = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : '0.0';

  const studentName = currentStudent?.name || 'Perfil de Aluno';
  const studentEmail = currentStudent?.email || 'aluno@concursos.com';
  const targetExam = currentStudent?.targetExam || 'Preparatório Geral';

  // Find lowest performing subject
  const bottleneckSubject = performances.length > 0
    ? [...performances].sort((a, b) => a.accuracyRate - b.accuracyRate)[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Title & Audit Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#EFF6FF] text-[#2563EB]">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Auditoria de Precisão & Vulnerabilidades
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
              Perfil: {studentName.split(' ')[0]}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Diagnóstico Estatístico & Auditoria do Perfil
          </h2>
          <p className="text-xs text-[#475569]">
            Métricas tabulares consolidadas e trilha de auditoria vinculadas estritamente à conta de <strong className="text-[#0F172A]">{studentName}</strong> ({studentEmail}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Corte Previsto</span>
            <span className="text-base font-black text-[#0F172A]">82.0%</span>
          </div>

          <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-[#1D4ED8] block">Seu Índice Atual</span>
            <span className="text-base font-black text-[#2563EB]">{overallRate}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Métricas vs Auditoria */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('metricas')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'metricas'
              ? 'bg-[#0F172A] text-white'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas por Matéria</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'auditoria'
              ? 'bg-[#0F172A] text-white'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Trilha de Auditoria do Perfil ({auditLogs.length})</span>
        </button>
      </div>

      {activeTab === 'metricas' ? (
        <>
          {/* Summary Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Total Amostral do Perfil</div>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {totalQuestions.toLocaleString('pt-BR')} <span className="text-xs font-normal text-[#64748B]">questões</span>
              </div>
              <div className="text-[11px] text-[#10B981] font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {totalCorrect.toLocaleString('pt-BR')} acertos confirmados
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Matérias em Domínio</div>
              <div className="text-2xl font-black text-[#10B981] tabular-nums">
                {performances.filter(p => p.status === 'Domínio').length} de {performances.length}
              </div>
              <div className="text-[11px] text-[#64748B] font-semibold mt-2">
                Acima de 80% de precisão líquida
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Gargalo Prioritário</div>
              <div className="text-xl font-black text-[#EF4444] truncate">
                {bottleneckSubject ? bottleneckSubject.subject : 'Nenhum identificado'}
              </div>
              <div className="text-[11px] text-[#991B1B] font-semibold mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {bottleneckSubject ? `${bottleneckSubject.accuracyRate}% (${bottleneckSubject.status})` : 'Resolva questões para mapear'}
              </div>
            </div>
          </div>

          {/* High Density Precision Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0F172A]">
                Tabela Analítica por Disciplina • {targetExam}
              </h3>
              <span className="text-xs text-[#64748B]">Clique em uma matéria para filtrar o caderno de questões</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Disciplina</th>
                    <th className="py-3 px-4 text-center">Volume</th>
                    <th className="py-3 px-4 text-center">Acertos</th>
                    <th className="py-3 px-4 text-center">Precisão</th>
                    <th className="py-3 px-4 text-center">Meta Banca</th>
                    <th className="py-3 px-4 text-center">Tendência</th>
                    <th className="py-3 px-4 text-center">Classificação</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] font-medium text-[#0F172A]">
                  {performances.map((perf) => {
                    const isCrit = perf.status === 'Atenção Crítica';
                    const isDom = perf.status === 'Domínio';

                    return (
                      <tr 
                        key={perf.subject}
                        onClick={() => onFocusSubject(perf.subject)}
                        className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 font-bold group-hover:text-[#2563EB] transition-colors">
                          {perf.subject}
                        </td>
                        <td className="py-3 px-4 text-center tabular-nums text-[#64748B]">
                          {perf.questionsAnswered}
                        </td>
                        <td className="py-3 px-4 text-center tabular-nums text-[#64748B]">
                          {perf.correctCount}
                        </td>
                        <td className="py-3 px-4 text-center font-bold tabular-nums">
                          <span className={`px-2 py-0.5 rounded ${
                            isCrit ? 'bg-red-50 text-red-700' : isDom ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {perf.accuracyRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center tabular-nums text-[#64748B]">
                          {perf.targetRate}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-0.5 font-bold ${
                            perf.trend === 'up' ? 'text-[#10B981]' : perf.trend === 'down' ? 'text-[#EF4444]' : 'text-[#64748B]'
                          }`}>
                            {perf.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : perf.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                            {perf.delta}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCrit 
                              ? 'bg-[#FEF2F2] text-[#B91C1C]' 
                              : isDom 
                              ? 'bg-[#ECFDF5] text-[#047857]' 
                              : 'bg-[#EFF6FF] text-[#1D4ED8]'
                          }`}>
                            {perf.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-xs font-bold text-[#2563EB] group-hover:underline flex items-center gap-1 justify-end ml-auto">
                            Treinar <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Isolated Audit Trail View */
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0F172A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Registros de Auditoria • Aluno: {studentName}
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Trilha cronológica auditável de cada ação de estudo, resolução de questão e edital personalizado deste perfil.
              </p>
            </div>
            <span className="text-xs font-mono text-[#64748B]">ID: {currentStudent?.id || 'usr-1'}</span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-[#64748B] text-xs">
                Nenhum evento registrado ainda. Resolva questões ou cole um edital para iniciar o histórico.
              </div>
            ) : (
              auditLogs.map((entry) => {
                const isCorreto = entry.result === 'correto';
                const isIncorreto = entry.result === 'incorreto';

                return (
                  <div key={entry.id} className="p-4 hover:bg-[#F8FAFC] transition-colors flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCorreto ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isIncorreto ? (
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                          <XCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {entry.description}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-mono tabular-nums">
                          {entry.timestamp}
                        </span>
                      </div>

                      {entry.subject && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">
                            {entry.subject}
                          </span>
                          {entry.details && (
                            <span className="text-[11px] text-[#64748B]">
                              {entry.details}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
