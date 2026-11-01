'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight,
  BookOpen,
  Layers,
  ListChecks,
  CheckCircle2,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { ExamTarget, CustomSyllabus } from '@/lib/types';
import { parsePastedSyllabus, SAMPLE_EDITAL_TEXT } from '@/lib/syllabusParser';

interface PasteEditalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: ExamTarget;
  onSaveSyllabus: (targetId: string, syllabus: CustomSyllabus) => void;
  currentStudent?: { name: string; email: string } | null;
}

export function PasteEditalModal({
  isOpen,
  onClose,
  currentTarget,
  onSaveSyllabus,
  currentStudent,
}: PasteEditalModalProps) {
  const [editalText, setEditalText] = useState('');
  const [editalTitle, setEditalTitle] = useState(
    currentStudent 
      ? `Edital Verticalizado (${currentStudent.name.split(' ')[0]}) • ${currentTarget.name}`
      : `Edital Verticalizado • ${currentTarget.name}`
  );
  const [parsedPreview, setParsedPreview] = useState<CustomSyllabus | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [activeStep, setActiveStep] = useState<'paste' | 'preview'>('paste');

  if (!isOpen) return null;

  const handleProcessText = () => {
    if (!editalText.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      const parsed = parsePastedSyllabus(editalText, currentTarget.id, editalTitle);
      setParsedPreview(parsed);
      setIsParsing(false);
      setActiveStep('preview');
    }, 200);
  };

  const handleUseSample = () => {
    setEditalText(SAMPLE_EDITAL_TEXT);
  };

  const handleConfirmSave = () => {
    if (parsedPreview) {
      onSaveSyllabus(currentTarget.id, parsedPreview);
      onClose();
    }
  };

  const totalTopicsCount = parsedPreview
    ? parsedPreview.subjects.reduce((sum, s) => sum + s.topics.length, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center text-white">
              <FileText className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#0F172A]">
                  Colar Edital para Estudos
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  Verticalizador Inteligente
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Vincule o conteúdo programático oficial a <strong className="text-[#0F172A]">{currentTarget.name}</strong>
                {currentStudent && <> no perfil exclusivo de <strong className="text-[#2563EB]">{currentStudent.name}</strong></>}.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-[#E2E8F0] flex items-center justify-between bg-white text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep('paste')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeStep === 'paste'
                  ? 'bg-[#0F172A] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              1. Colar Conteúdo Bruto
            </button>
            <button
              disabled={!parsedPreview}
              onClick={() => setActiveStep('preview')}
              className={`px-3 py-1 rounded-lg font-bold transition-all disabled:opacity-40 ${
                activeStep === 'preview'
                  ? 'bg-[#0F172A] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              2. Matriz Extraída {parsedPreview && `(${parsedPreview.subjects.length} Matérias)`}
            </button>
          </div>

          {activeStep === 'paste' && (
            <button
              onClick={handleUseSample}
              className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Preencher Modelo de Exemplo
            </button>
          )}
        </div>

        {/* Body Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeStep === 'paste' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  Título do Edital / Caderno
                </label>
                <input
                  type="text"
                  value={editalTitle}
                  onChange={(e) => setEditalTitle(e.target.value)}
                  placeholder="Ex: Edital Verticalizado RFB 2026"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Copie e cole aqui o texto do edital (PDF, Diário Oficial ou site da banca)
                  </label>
                  <span className="text-[11px] text-[#94A3B8]">
                    {editalText.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={12}
                  value={editalText}
                  onChange={(e) => setEditalText(e.target.value)}
                  placeholder={`Cole o texto do conteúdo programático aqui...\nExemplo:\nDIREITO CONSTITUCIONAL:\n1. Conceito e princípios fundamentais.\n2. Direitos e garantias individuais.\n\nDIREITO TRIBUTÁRIO:\n1. Princípios tributários e imunidades.\n2. Crédito tributário e lançamento.`}
                  className="w-full p-3.5 text-xs font-mono leading-relaxed rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#1E3A8A] leading-relaxed">
                  O algoritmo divide automaticamente os tópicos por disciplinas, identifica enumerações e gera tarefas de estudo, questões sugeridas e checklist de verticalização.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {parsedPreview && (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#0F172A]">
                        {parsedPreview.title}
                      </h4>
                      <p className="text-[11px] text-[#64748B]">
                        {parsedPreview.subjects.length} disciplinas estruturadas • {totalTopicsCount} tópicos catalogados
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
                      Pronto para Estudo
                    </span>
                  </div>

                  <div className="space-y-3">
                    {parsedPreview.subjects.map((subj, idx) => (
                      <div key={subj.id} className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                          <span className="text-xs font-extrabold text-[#0F172A] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-black">
                              {idx + 1}
                            </span>
                            {subj.subject}
                          </span>
                          <span className="text-[11px] font-bold text-[#64748B] tabular-nums">
                            {subj.topics.length} tópicos
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {subj.topics.map((top, tIdx) => (
                            <div key={top.id} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-[#F8FAFC]">
                              <span className="text-[#334155] truncate max-w-[480px]">
                                <strong className="text-[#0F172A] font-mono mr-1.5">{tIdx + 1}.</strong>
                                {top.name}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                top.weight === 'Alto' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                Peso {top.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          {activeStep === 'preview' ? (
            <button
              onClick={() => setActiveStep('paste')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Voltar ao Texto
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
            >
              Cancelar
            </button>
          )}

          {activeStep === 'paste' ? (
            <button
              onClick={handleProcessText}
              disabled={!editalText.trim() || isParsing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#CBD5E1] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isParsing ? 'Processando Edital...' : 'Processar e Estruturar'}
            </button>
          ) : (
            <button
              onClick={handleConfirmSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Salvar e Incorporar ao Plano
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
