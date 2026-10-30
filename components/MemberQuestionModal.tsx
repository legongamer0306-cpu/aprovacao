'use client';

import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Check, 
  HelpCircle, 
  Scale, 
  BookOpen, 
  AlertCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { ExamQuestion, QuestionOption } from '@/lib/types';

interface MemberQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuestion: (question: ExamQuestion) => void;
}

export function MemberQuestionModal({
  isOpen,
  onClose,
  onSaveQuestion,
}: MemberQuestionModalProps) {
  const [statement, setStatement] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Média' | 'Difícil'>('Média');
  const [agency, setAgency] = useState('Simulado Colaborativo');
  const [legalBasis, setLegalBasis] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [authorName, setAuthorName] = useState('Lê Gonçalves');

  // The 5 mandatory options (A, B, C, D, E) with text and explanation
  const [options, setOptions] = useState<Array<{ text: string; explanation: string }>>([
    { text: '', explanation: '' },
    { text: '', explanation: '' },
    { text: '', explanation: '' },
    { text: '', explanation: '' },
    { text: '', explanation: '' },
  ]);

  if (!isOpen) return null;

  const handleOptionTextChange = (index: number, text: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text };
      return copy;
    });
  };

  const handleOptionExplanationChange = (index: number, explanation: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], explanation };
      return copy;
    });
  };

  const labels = ['A', 'B', 'C', 'D', 'E'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      alert('Por favor, informe a disciplina da questão.');
      return;
    }

    // Validation: Enforce all 5 options to be filled
    for (let i = 0; i < 5; i++) {
      if (!options[i].text.trim()) {
        alert(`A alternativa ${labels[i]} é obrigatória. Preencha todas as 5 alternativas.`);
        return;
      }
    }

    // Validation: Enforce correct option explanation / gabarito fundamentado
    if (!options[correctOptionIndex].explanation.trim()) {
      alert(`O gabarito fundamentado (comentário da alternativa correta ${labels[correctOptionIndex]}) é obrigatório.`);
      return;
    }

    if (!legalBasis.trim()) {
      alert('Informe a base legal ou jurisprudência que fundamenta a questão.');
      return;
    }

    const newQuestionId = `q-mem-${Date.now()}`;
    const formattedOptions: QuestionOption[] = options.map((opt, idx) => ({
      id: `opt-${labels[idx].toLowerCase()}-${Date.now()}`,
      label: labels[idx],
      text: opt.text.trim(),
      explanation: opt.explanation.trim() || `Alternativa ${labels[idx]} incorreta segundo a doutrina aplicável.`,
    }));

    const newQuestion: ExamQuestion = {
      id: newQuestionId,
      code: `MB-${Math.floor(10000 + Math.random() * 90000)}`,
      year: 2026,
      board: 'Comunidade Elite',
      agency: agency.trim() || 'Simulado dos Membros',
      role: 'Auditor & Carreiras Jurídicas',
      subject: subject.trim(),
      topic: topic.trim() || 'Geral',
      difficulty,
      statement: statement.trim(),
      options: formattedOptions,
      correctOptionId: formattedOptions[correctOptionIndex].id,
      legalBasis: legalBasis.trim(),
      tags: [subject, 'Questão de Membro', 'Inédita'],
      origin: 'membros',
      author: {
        name: authorName.trim() || 'Membro da Comunidade',
        badge: 'Membro Criador',
      },
    };

    onSaveQuestion(newQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center text-white">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#0F172A]">
                  Criar Questão Inédita (Membro)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  5 Opções Obrigatórias + Gabarito Fundamentado
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Compartilhe questões elaboradas com a comunidade de estudos com fundamentação jurídica completa.
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
          {/* Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Disciplina Escolhida pelo Autor *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Direito Penal, Direito Civil, Tributário, etc."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Tópico do Edital *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Responsabilidade dos Sócios (CTN 135)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Dificuldade Estimada
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Fácil' | 'Média' | 'Difícil')}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
              >
                <option value="Fácil">Fácil</option>
                <option value="Média">Média</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
          </div>

          {/* Statement */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#475569] mb-1">
              Enunciado da Questão (Caso Concreto ou Questão Doutrinária) *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Descreva a situação-problema ou afirmação teórica..."
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:bg-white focus:border-[#2563EB] outline-none resize-none leading-relaxed"
            />
          </div>

          {/* 5 Mandatory Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-[#E2E8F0]">
              <span className="font-extrabold uppercase tracking-wide text-[#0F172A] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[10px]">5</span>
                As 5 Alternativas Obrigatórias (A, B, C, D, E)
              </span>
              <span className="text-[11px] font-semibold text-[#64748B]">
                Selecione qual alternativa será o gabarito oficial
              </span>
            </div>

            {labels.map((label, idx) => {
              const isCorrect = correctOptionIndex === idx;

              return (
                <div 
                  key={label}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCorrect 
                      ? 'border-[#10B981] bg-[#ECFDF5]/50 ring-1 ring-[#10B981]/30' 
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                        isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {label}
                      </span>
                      <span className="font-bold text-[#0F172A]">Alternativa {label} *</span>
                    </div>

                    {/* Radio to choose correct answer */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold select-none">
                      <input
                        type="radio"
                        name="correctOptionRadio"
                        checked={isCorrect}
                        onChange={() => setCorrectOptionIndex(idx)}
                        className="accent-[#10B981] w-4 h-4 cursor-pointer"
                      />
                      <span className={isCorrect ? 'text-[#065F46]' : 'text-[#64748B]'}>
                        {isCorrect ? 'Gabarito Correto' : 'Marcar como Gabarito'}
                      </span>
                    </label>
                  </div>

                  {/* Option Text */}
                  <textarea
                    rows={2}
                    required
                    placeholder={`Texto completo da alternativa ${label}...`}
                    value={options[idx].text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB] mb-2 leading-relaxed"
                  />

                  {/* Option Justification */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                      {isCorrect ? 'Gabarito Fundamentado (Explicação Completa do Gabarito) *' : `Justificativa do Erro da Alternativa ${label} (Opcional/Recomendado)`}
                    </label>
                    <input
                      type="text"
                      required={isCorrect}
                      placeholder={isCorrect ? 'Explicação detalhada: Por que esta alternativa é a correta...' : 'Por que esta alternativa está incorreta...'}
                      value={options[idx].explanation}
                      onChange={(e) => handleOptionExplanationChange(idx, e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border outline-none text-xs ${
                        isCorrect 
                          ? 'border-emerald-300 bg-white font-medium text-emerald-950 focus:border-emerald-500' 
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] focus:bg-white'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal Basis & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-[#2563EB]" />
                Fundamentação Legal / Jurisprudência *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: CF/88, art. 5º, LXXII c/c Súmula 2 do STJ"
                value={legalBasis}
                onChange={(e) => setLegalBasis(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Nome do Autor (Crédito do Membro)
              </label>
              <input
                type="text"
                placeholder="Ex: Seu Nome ou Nickname"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between bg-white">
            <span className="text-[11px] text-[#64748B]">
              A questão ficará salva na aba <strong>&ldquo;Criadas por Membros&rdquo;</strong> com gabarito auditado.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                Publicar Questão de Membro
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
