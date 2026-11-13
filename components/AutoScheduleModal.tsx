'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  X,
  FileText,
  Eraser,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { DailyTask, CycleDay, ExamTarget, SavedAISchedule } from '@/lib/types';
import { parsePastedSyllabus, SAMPLE_EDITAL_TEXT } from '@/lib/syllabusParser';
import { generateScheduleFromEdital } from '@/lib/scheduleGenerator';

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: ExamTarget;
  studentId: string;
  editingSchedule?: SavedAISchedule | null;
  onSaveAISchedule: (schedule: SavedAISchedule, isEditing: boolean) => void;
}

export function AutoScheduleModal({
  isOpen,
  onClose,
  currentTarget,
  studentId,
  editingSchedule = null,
  onSaveAISchedule,
}: AutoScheduleModalProps) {
  const isEditing = Boolean(editingSchedule);

  const [title, setTitle] = useState<string>(
    editingSchedule?.title || `Cronograma IA • ${currentTarget.name}`
  );
  const [editalText, setEditalText] = useState<string>(
    editingSchedule?.editalText || ''
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(
    editingSchedule?.weeklyHours || 30
  );
  const [methodology, setMethodology] = useState<
    'ciclo_intercalado' | 'foco_questoes' | 'reta_final'
  >(editingSchedule?.methodology || 'ciclo_intercalado');
  const [focusWeaknesses, setFocusWeaknesses] = useState<boolean>(
    editingSchedule?.focusWeaknesses ?? true
  );
  const [includeDiscursivas, setIncludeDiscursivas] = useState<boolean>(
    editingSchedule?.includeDiscursivas ?? false
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync form when editingSchedule or modal open state changes
  const [prevKey, setPrevKey] = useState<string>('');
  const currentKey = `${isOpen}-${editingSchedule?.id || 'new'}-${currentTarget.id}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    if (isOpen) {
      setTitle(editingSchedule?.title || `Cronograma IA • ${currentTarget.name}`);
      setEditalText(editingSchedule?.editalText || '');
      setWeeklyHours(editingSchedule?.weeklyHours || 30);
      setMethodology(editingSchedule?.methodology || 'ciclo_intercalado');
      setFocusWeaknesses(editingSchedule?.focusWeaknesses ?? true);
      setIncludeDiscursivas(editingSchedule?.includeDiscursivas ?? false);
      setErrorMsg(null);
    }
  }

  // Live preview of detected subjects & topics from the pasted edital text
  const liveDetection = useMemo(() => {
    if (editalText.trim().length < 10) {
      return { subjectsCount: 0, topicsCount: 0, subjects: [] as string[] };
    }
    const parsed = parsePastedSyllabus(editalText, currentTarget.id, title || 'Edital');
    const topicsCount = parsed.subjects.reduce((acc, s) => acc + s.topics.length, 0);
    return {
      subjectsCount: parsed.subjects.length,
      topicsCount,
      subjects: parsed.subjects.map((s) => s.subject),
    };
  }, [editalText, currentTarget.id, title]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (editalText.trim().length < 15) {
      setErrorMsg(
        'Por favor, copie e cole o texto do edital (ou pelo menos os tópicos e disciplinas) no campo específico abaixo para a IA montar o cronograma.'
      );
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    setTimeout(() => {
      const schedule = generateScheduleFromEdital({
        studentId,
        targetId: currentTarget.id,
        targetName: currentTarget.name,
        title: title.trim() || `Cronograma IA • ${currentTarget.name}`,
        editalText,
        weeklyHours,
        methodology,
        focusWeaknesses,
        includeDiscursivas,
        existingScheduleId: editingSchedule?.id,
        existingCreatedAt: editingSchedule?.createdAt,
      });

      onSaveAISchedule(schedule, isEditing);
      setIsGenerating(false);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-[#0F172A] truncate">
                {isEditing
                  ? 'Editar Cronograma com IA (Texto do Edital)'
                  : 'Criar Novo Cronograma com IA a partir do Edital'}
              </h3>
              <p className="text-xs text-[#64748B] truncate">
                {isEditing
                  ? 'Altere o texto do edital colado abaixo para recalcular e atualizar este cronograma.'
                  : `Copie e cole o edital no campo específico para gerar um novo cronograma (${currentTarget.name}).`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Título do Cronograma */}
          <div>
            <label className="block font-bold text-[#475569] mb-1">
              Nome / Identificação do Cronograma
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Cronograma RFB 2026 - Reta Final"
              className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] font-semibold focus:border-[#2563EB] outline-none"
            />
          </div>

          {/* Campo Específico: Copiar e Colar Edital */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Campo Específico: Copie e Cole o Edital Aqui *</span>
              </label>

              <div className="flex items-center gap-2">
                {editalText.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEditalText('')}
                    className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Eraser className="w-3 h-3" />
                    Limpar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditalText(SAMPLE_EDITAL_TEXT);
                    setErrorMsg(null);
                  }}
                  className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Usar Edital de Exemplo
                </button>
              </div>
            </div>

            <textarea
              rows={7}
              value={editalText}
              onChange={(e) => {
                setEditalText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder={`Cole aqui as matérias e tópicos do edital (PDF, Diário Oficial ou site da banca)...\n\nExemplo:\nDIREITO CONSTITUCIONAL:\n1. Princípios fundamentais e direitos individuais (Art. 5º).\n2. Remédios constitucionais e controle de constitucionalidade.\n\nDIREITO TRIBUTÁRIO:\n1. Sistema Tributário Nacional e imunidades.\n2. Obrigação e crédito tributário.`}
              className="w-full p-3 text-xs font-mono leading-relaxed rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none resize-y"
            />

            {/* Live AI detection feedback */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              {liveDetection.subjectsCount > 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    IA identificou {liveDetection.subjectsCount}{' '}
                    {liveDetection.subjectsCount === 1 ? 'disciplina' : 'disciplinas'} e{' '}
                    {liveDetection.topicsCount}{' '}
                    {liveDetection.topicsCount === 1 ? 'tópico' : 'tópicos'} no texto colado
                  </span>
                </div>
              ) : (
                <span className="text-[#64748B] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Cole as matérias e tópicos do edital para a IA estruturar o ciclo semanal e tarefas.
                </span>
              )}
              <span className="text-[#94A3B8] font-mono tabular-nums">
                {editalText.length} caracteres
              </span>
            </div>
          </div>

          {/* Weekly Hours */}
          <div className="pt-2 border-t border-[#E2E8F0]">
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

          {/* Methodology */}
          <div>
            <label className="block font-bold text-[#475569] mb-1.5">
              Metodologia de Estudo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethodology('ciclo_intercalado')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  methodology === 'ciclo_intercalado'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold ring-1 ring-[#2563EB]/40'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold">Ciclo Equilibrado</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">
                  Teoria + Questões intercaladas
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethodology('foco_questoes')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  methodology === 'foco_questoes'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold ring-1 ring-[#2563EB]/40'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold">Foco em Questões</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">
                  75% resolução + engenharia reversa
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethodology('reta_final')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  methodology === 'reta_final'
                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] font-bold ring-1 ring-[#2563EB]/40'
                    : 'border-[#CBD5E1] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-xs font-bold">Reta Final Acelerada</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">
                  Simulados + Lei Seca e Súmulas
                </div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={focusWeaknesses}
                onChange={(e) => setFocusWeaknesses(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded"
              />
              <span>Priorizar tópicos de maior peso do edital</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0F172A]">
              <input
                type="checkbox"
                checked={includeDiscursivas}
                onChange={(e) => setIncludeDiscursivas(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded"
              />
              <span>Incluir bloco semanal de Redação / Discursiva</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating
              ? 'Processando Edital com IA...'
              : isEditing
              ? 'Atualizar Cronograma com IA'
              : 'Criar Novo Cronograma com IA'}
          </button>
        </div>
      </div>
    </div>
  );
}
