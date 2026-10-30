'use client';

import React from 'react';
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
  TrendingDown
} from 'lucide-react';
import { SubjectPerformance } from '@/lib/types';

interface PerformanceAuditViewProps {
  performances: SubjectPerformance[];
  onFocusSubject: (subject: string) => void;
}

export function PerformanceAuditView({
  performances,
  onFocusSubject,
}: PerformanceAuditViewProps) {
  const totalQuestions = performances.reduce((acc, p) => acc + p.questionsAnswered, 0);
  const totalCorrect = performances.reduce((acc, p) => acc + p.correctCount, 0);
  const overallRate = ((totalCorrect / totalQuestions) * 100).toFixed(1);

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
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Diagnóstico Estatístico de Desempenho
          </h2>
          <p className="text-xs text-[#475569]">
            Métricas tabulares consolidadas com índice de corte estimado da banca organizadora.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Nota de Corte Prevista</span>
            <span className="text-lg font-black text-[#0F172A]">82.0%</span>
          </div>
          <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-right">
            <span className="text-[10px] uppercase font-bold text-[#1D4ED8] block">Seu Índice Atual</span>
            <span className="text-lg font-black text-[#2563EB]">{overallRate}%</span>
          </div>
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
          <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Total Amostral</div>
          <div className="text-2xl font-black text-[#0F172A] tabular-nums">
            {totalQuestions.toLocaleString('pt-BR')} <span className="text-xs font-normal text-[#64748B]">questões resolvidas</span>
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
            Contabilidade Geral
          </div>
          <div className="text-[11px] text-[#991B1B] font-semibold mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            64.8% (10.2% abaixo do corte)
          </div>
        </div>
      </div>

      {/* High Density Precision Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0F172A]">
            Tabela Analítica por Disciplina
          </h3>
          <span className="text-xs text-[#64748B]">Clique em uma matéria para filtrar o caderno</span>
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
    </div>
  );
}
