'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  BrainCircuit, 
  Check, 
  Clock, 
  Calendar, 
  Target,
  ArrowRight
} from 'lucide-react';
import { DailyTask, CycleDay, ExamTarget } from '@/lib/types';

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: ExamTarget;
  onApplySchedule: (newTasks: DailyTask[], newCycleDays: CycleDay[]) => void;
}

export function AutoScheduleModal({
  isOpen,
  onClose,
  currentTarget,
  onApplySchedule,
}: AutoScheduleModalProps) {
  const [weeklyHours, setWeeklyHours] = useState<number>(30);
  const [methodology, setMethodology] = useState<'ciclo_intercalado' | 'foco_questoes' | 'reta_final'>('ciclo_intercalado');
  const [focusWeaknesses, setFocusWeaknesses] = useState<boolean>(true);
  const [includeDiscursivas, setIncludeDiscursivas] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Generate optimized daily tasks based on target exam and methodology
      let generatedTasks: DailyTask[] = [];
      let generatedCycle: CycleDay[] = [];

      if (methodology === 'reta_final') {
        generatedTasks = [
          {
            id: `task-auto-${Date.now()}-1`,
            title: `Bateria Intensiva: 40 Questões Recentes (${currentTarget.agency})`,
            subject: 'Direito Tributário & Constitucional',
            type: 'questoes',
            durationMinutes: 60,
            completed: false,
            targetCount: 40,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-2`,
            title: 'Revisão Acelarada: Súmulas Vinculantes e Teses STF/STJ',
            subject: 'Jurisprudência Estratégica',
            type: 'lei_seca',
            durationMinutes: 40,
            completed: false,
            targetCount: 25,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-3`,
            title: 'Flashcards SRS de Erros Recorrentes (Fila Crítica)',
            subject: 'Revisão Espaçada',
            type: 'revisao',
            durationMinutes: 25,
            completed: false,
            targetCount: 30,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-4`,
            title: 'Simulação Rápida Cronometrada (30 questões estilo FGV/Cebraspe)',
            subject: 'Simulado Diário',
            type: 'simulado',
            durationMinutes: 50,
            completed: false,
            targetCount: 30,
            currentCount: 0,
          },
        ];

        generatedCycle = [
          { day: 'Seg', block: 'Simulado Tributário + Decisões STF', status: 'concluido', hours: 4.5 },
          { day: 'Ter', block: 'Constitucional + Súmulas FGV', status: 'concluido', hours: 4.5 },
          { day: 'Qua', block: 'Contabilidade CPCs + Administrativo', status: 'hoje', hours: 5.0 },
          { day: 'Qui', block: 'Auditoria + Legislação Aduaneira', status: 'pendente', hours: 4.5 },
          { day: 'Sex', block: 'Bateria de 80 Questões Mistas', status: 'pendente', hours: 5.0 },
          { day: 'Sáb', block: 'Simulado Completo Oficial (100Q)', status: 'pendente', hours: 6.0 },
          { day: 'Dom', block: 'Diagnóstico de Erros & Redação', status: 'pendente', hours: 3.5 },
        ];
      } else if (methodology === 'foco_questoes') {
        generatedTasks = [
          {
            id: `task-auto-${Date.now()}-1`,
            title: 'Resolução Ativa: 30 questões de Contabilidade Geral (CPC 47 e 00)',
            subject: 'Contabilidade Geral',
            type: 'questoes',
            durationMinutes: 55,
            completed: false,
            targetCount: 30,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-2`,
            title: 'Resolução Ativa: 25 questões de Direito Tributário (Imunidades)',
            subject: 'Direito Tributário',
            type: 'questoes',
            durationMinutes: 45,
            completed: false,
            targetCount: 25,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-3`,
            title: 'Caderno de Erros Comentado: Análise do Gabarito Fundamentado',
            subject: 'Diagnóstico de Erros',
            type: 'teoria',
            durationMinutes: 30,
            completed: false,
            targetCount: 15,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-4`,
            title: 'Ciclo Ativo Flashcards SRS (Revisão Espaçada)',
            subject: 'Revisão Espaçada',
            type: 'revisao',
            durationMinutes: 20,
            completed: false,
            targetCount: 20,
            currentCount: 0,
          },
        ];

        generatedCycle = [
          { day: 'Seg', block: '70Q Tributário + Caderno de Erros', status: 'concluido', hours: 4.0 },
          { day: 'Ter', block: '60Q Constitucional + Lei Seca', status: 'concluido', hours: 4.0 },
          { day: 'Qua', block: '60Q Contabilidade Geral & CPCs', status: 'hoje', hours: 4.5 },
          { day: 'Qui', block: '50Q Administrativo + Flashcards', status: 'pendente', hours: 4.0 },
          { day: 'Sex', block: '50Q Auditoria + Legislação Federal', status: 'pendente', hours: 4.0 },
          { day: 'Sáb', block: 'Maratona 100Q Mistas Cronometrada', status: 'pendente', hours: 5.5 },
          { day: 'Dom', block: 'Revisão SRS & Lei Seca', status: 'pendente', hours: 3.0 },
        ];
      } else {
        // Ciclo Intercalado Clássico equilibrado
        generatedTasks = [
          {
            id: `task-auto-${Date.now()}-1`,
            title: `Bloco 1: Teoria & Questões - ${currentTarget.name}`,
            subject: 'Direito Tributário',
            type: 'questoes',
            durationMinutes: 45,
            completed: false,
            targetCount: 20,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-2`,
            title: 'Bloco 2: Estudo de Lei Seca (Artigos Constitucionais Chave)',
            subject: 'Direito Constitucional',
            type: 'lei_seca',
            durationMinutes: 35,
            completed: false,
            targetCount: 15,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-3`,
            title: 'Bloco 3: Reforço em Ponto Fraco (Contabilidade CPCs)',
            subject: 'Contabilidade Geral',
            type: 'teoria',
            durationMinutes: 40,
            completed: false,
            targetCount: 1,
            currentCount: 0,
          },
          {
            id: `task-auto-${Date.now()}-4`,
            title: 'Bloco 4: Revisão SRS Flashcards Diários',
            subject: 'Revisão Espaçada',
            type: 'revisao',
            durationMinutes: 20,
            completed: false,
            targetCount: 25,
            currentCount: 0,
          },
        ];

        generatedCycle = [
          { day: 'Seg', block: 'Tributário + CPC 47', status: 'concluido', hours: 4.2 },
          { day: 'Ter', block: 'Constitucional + Súmulas', status: 'concluido', hours: 4.5 },
          { day: 'Qua', block: 'Administrativo + Revisão SRS', status: 'hoje', hours: 4.0 },
          { day: 'Qui', block: 'Auditoria Governamental', status: 'pendente', hours: 4.0 },
          { day: 'Sex', block: 'Legislação Aduaneira & Tributária', status: 'pendente', hours: 4.2 },
          { day: 'Sáb', block: 'Simulado Geral 70Q com Cronômetro', status: 'pendente', hours: 5.0 },
          { day: 'Dom', block: 'Discursivas & Diagnóstico de Falhas', status: 'pendente', hours: 3.0 },
        ];
      }

      onApplySchedule(generatedTasks, generatedCycle);
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Gerar Cronograma Automático por IA
              </h3>
              <p className="text-xs text-[#64748B]">
                Otimizado para <strong className="text-[#0F172A]">{currentTarget.name}</strong> ({currentTarget.daysRemaining} dias até a prova).
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#475569] mb-1">
              Carga Horária Semanal Disponível
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={55}
                step={5}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="flex-1 accent-[#2563EB]"
              />
              <span className="font-mono text-xs font-extrabold px-3 py-1 rounded bg-[#EFF6FF] text-[#2563EB] min-w-[75px] text-center">
                {weeklyHours}h / sem
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Média de ~{(weeklyHours / 7).toFixed(1)} horas de foco por dia
            </span>
          </div>

          <div>
            <label className="block font-bold text-[#475569] mb-1">
              Metodologia de Estudo
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethodology('ciclo_intercalado')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  methodology === 'ciclo_intercalado'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold ring-1 ring-[#2563EB]/40'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold">Ciclo Equilibrado</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Teoria + Questões intercaladas</div>
              </button>

              <button
                type="button"
                onClick={() => setMethodology('foco_questoes')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  methodology === 'foco_questoes'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold ring-1 ring-[#2563EB]/40'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold">Foco em Questões</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">75% resolução + engenharia reversa</div>
              </button>

              <button
                type="button"
                onClick={() => setMethodology('reta_final')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  methodology === 'reta_final'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold ring-1 ring-[#2563EB]/40'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold">Reta Final Acelarada</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Simulados + Súmulas e Decisões</div>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={focusWeaknesses}
                onChange={(e) => setFocusWeaknesses(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded"
              />
              <span>Priorizar Matérias Críticas (ex: Contabilidade &lt; 70% acerto)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={includeDiscursivas}
                onChange={(e) => setIncludeDiscursivas(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded"
              />
              <span>Incluir bloco semanal de Redação e Peça Prática / Discursiva</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? 'Calculando Matriz...' : 'Gerar Cronograma Automaticamente'}
          </button>
        </div>
      </div>
    </div>
  );
}
