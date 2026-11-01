'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Layers, 
  Calendar, 
  BarChart3, 
  FileText, 
  GraduationCap, 
  ArrowRight,
  Command,
  X,
  Network,
  Scale,
  ShieldAlert,
  Timer
} from 'lucide-react';
import { ExamTarget, ManagedUser } from '@/lib/types';
import { NavigationTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenTargetModal: () => void;
  onOpenPasteEdital?: () => void;
  onOpenStudentArea?: () => void;
  isAdminAuthenticated?: boolean;
  currentStudent?: ManagedUser | null;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenTargetModal,
  onOpenPasteEdital,
  onOpenStudentArea,
  isAdminAuthenticated = false,
  currentStudent,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle palette
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseActions = [
    { label: 'Ir para Banco de Questões', tab: 'questoes' as NavigationTab, icon: <BookOpen className="w-4 h-4 text-[#2563EB]" /> },
    { label: 'Simulados & Provas Cronometradas', tab: 'simulados' as NavigationTab, icon: <Timer className="w-4 h-4 text-emerald-600" /> },
    { label: 'Mapas Mentais & Mnemônicos Visuais', tab: 'mapas' as NavigationTab, icon: <Network className="w-4 h-4 text-purple-600" /> },
    { label: 'Meus PDFs (Download & Organização)', tab: 'pdfs' as NavigationTab, icon: <FileText className="w-4 h-4 text-[#2563EB]" /> },
    { label: 'Visualizar Cronograma de Hoje', tab: 'cronograma' as NavigationTab, icon: <Calendar className="w-4 h-4 text-emerald-600" /> },
    { label: 'Auditoria de Desempenho e Gargalos', tab: 'desempenho' as NavigationTab, icon: <BarChart3 className="w-4 h-4 text-amber-600" /> },
    { label: 'Súmulas, Lei Seca & Resoluções do CNJ', tab: 'jurisprudencia' as NavigationTab, icon: <Scale className="w-4 h-4 text-amber-600" /> },
  ];

  const quickActions = (isAdminAuthenticated && !currentStudent)
    ? [
        ...baseActions,
        { label: 'Painel do Administrador', tab: 'admin' as NavigationTab, icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
      ]
    : baseActions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden"
      >
        <div className="p-3 border-b border-[#E2E8F0] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#64748B]" />
          <input
            autoFocus
            type="text"
            placeholder="Digite um comando, disciplina ou atalho..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none"
          />
          <kbd className="text-[10px] uppercase font-bold text-[#64748B] bg-[#F1F5F9] border border-[#CBD5E1] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>

        <div className="p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Navegação Rápida
          </div>

          {quickActions.map((action) => (
            <div
              key={action.label}
              onClick={() => {
                onNavigate(action.tab);
                onClose();
              }}
              className="px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {action.icon}
                <span>{action.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}

          <div className="pt-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Ações Rápidas
          </div>
          <div
            onClick={() => {
              onClose();
              onOpenTargetModal();
            }}
            className="px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#0F172A]" />
              <span>Gerenciar Concursos Alvo (Adicionar / Excluir)</span>
            </div>
            <span className="text-[10px] text-[#64748B] font-mono">Foco</span>
          </div>

          {onOpenPasteEdital && (
            <div
              onClick={() => {
                onClose();
                onOpenPasteEdital();
              }}
              className="px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-[#F8FAFC] text-xs font-semibold text-[#2563EB] cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#2563EB]" />
                <span>Colar Edital Oficial para Estudos</span>
              </div>
              <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] px-1.5 py-0.5 rounded font-mono font-bold">Edital</span>
            </div>
          )}

          {onOpenStudentArea && (
            <div
              onClick={() => {
                onClose();
                onOpenStudentArea();
              }}
              className="px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-[#F8FAFC] text-xs font-semibold text-[#2563EB] cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>Área do Aluno (Login & Perfil de Estudos)</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-[#2563EB] px-1.5 py-0.5 rounded font-mono font-bold">Aluno</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
