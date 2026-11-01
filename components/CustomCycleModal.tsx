'use client';

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  Check, 
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { DailyTask, CycleDay } from '@/lib/types';

interface CustomCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleDays: CycleDay[];
  onSaveCycleDay: (index: number, newBlock: string, hours: number) => void;
  onAddNewTask: (newTask: DailyTask) => void;
}

export function CustomCycleModal({
  isOpen,
  onClose,
  cycleDays,
  onSaveCycleDay,
  onAddNewTask,
}: CustomCycleModalProps) {
  const [activeTab, setActiveTab] = useState<'cycle' | 'task'>('cycle');

  // Editing cycle blocks
  const [editingBlocks, setEditingBlocks] = useState(cycleDays);

  // New Custom Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('');
  const [taskType, setTaskType] = useState<DailyTask['type']>('questoes');
  const [taskDuration, setTaskDuration] = useState<number>(45);
  const [taskTargetCount, setTaskTargetCount] = useState<number>(20);

  if (!isOpen) return null;

  const handleUpdateBlock = (index: number, blockText: string, hours: number) => {
    const updated = [...editingBlocks];
    updated[index] = { ...updated[index], block: blockText, hours };
    setEditingBlocks(updated);
    onSaveCycleDay(index, blockText, hours);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskSubject.trim()) return;

    const newTask: DailyTask = {
      id: `task-custom-${Date.now()}`,
      title: taskTitle.trim(),
      subject: taskSubject.trim(),
      type: taskType,
      durationMinutes: Number(taskDuration) || 45,
      completed: false,
      targetCount: Number(taskTargetCount) || undefined,
      currentCount: 0,
    };

    onAddNewTask(newTask);
    setTaskTitle('');
    setTaskSubject('');
    setTaskDuration(45);
    setTaskTargetCount(20);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center text-white">
              <SlidersHorizontal className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                Personalizar Cronograma & Ciclo de Estudos
              </h3>
              <p className="text-xs text-[#64748B]">
                Defina suas próprias matérias por dia da semana e monte suas tarefas diárias.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 border-b border-[#E2E8F0] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cycle')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'cycle'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            1. Blocos Semanais (Seg a Dom)
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'task'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            2. Adicionar Tarefa ao Dia
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'cycle' ? (
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Edite os blocos de disciplinas de cada dia da semana:
              </span>

              <div className="space-y-2.5">
                {editingBlocks.map((c, index) => (
                  <div 
                    key={c.day}
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#CBD5E1]"
                  >
                    <div className="flex items-center gap-2.5 min-w-[70px]">
                      <span className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-black text-xs flex items-center justify-center">
                        {c.day}
                      </span>
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={c.block}
                        onChange={(e) => handleUpdateBlock(index, e.target.value, c.hours || 4)}
                        placeholder="Ex: Direito Tributário + Contabilidade"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={1}
                        max={14}
                        step={0.5}
                        value={c.hours || 4}
                        onChange={(e) => handleUpdateBlock(index, c.block, Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-bold text-center text-[#0F172A] outline-none"
                      />
                      <span className="text-xs text-[#64748B] font-semibold">horas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Criar uma nova meta ou tarefa de estudo diária:
              </span>

              <div>
                <label className="block font-bold text-[#475569] mb-1">
                  Título da Tarefa / Meta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Resolução de 30 questões de Imunidades Tributárias"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Disciplina *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Direito Tributário"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Modalidade de Estudo
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as DailyTask['type'])}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  >
                    <option value="questoes">Resolução de Questões</option>
                    <option value="teoria">Teoria / Doutrina</option>
                    <option value="lei_seca">Leitura de Lei Seca</option>
                    <option value="revisao">Revisão Periódica / Resumos</option>
                    <option value="simulado">Simulado Cronometrado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Duração Estimada (minutos)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={360}
                    value={taskDuration}
                    onChange={(e) => setTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#475569] mb-1">
                    Meta de Questões / Artigos
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={taskTargetCount}
                    onChange={(e) => setTaskTargetCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm"
                >
                  Adicionar Tarefa ao Ciclo
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs text-[#64748B]">
            As alterações são salvas automaticamente no seu ciclo de estudos ativo.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
