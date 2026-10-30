'use client';

import React from 'react';
import { 
  Flame, 
  Search, 
  Command, 
  Bell, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  User,
  AlertTriangle,
  Menu
} from 'lucide-react';
import { ExamTarget, ManagedUser } from '@/lib/types';

interface HeaderProps {
  currentTarget: ExamTarget;
  streakDays: number;
  onOpenTargetModal: () => void;
  onOpenCommandPalette: () => void;
  onSearchChange?: (val: string) => void;
  searchQuery?: string;
  onNavigateToAdmin?: () => void;
  isAdminAuthenticated?: boolean;
  currentStudent: ManagedUser | null;
  onOpenStudentArea: () => void;
  onToggleMobileSidebar?: () => void;
}

export function Header({
  currentTarget,
  streakDays,
  onOpenTargetModal,
  onOpenCommandPalette,
  searchQuery = '',
  onSearchChange,
  onNavigateToAdmin,
  isAdminAuthenticated = false,
  currentStudent,
  onOpenStudentArea,
  onToggleMobileSidebar,
}: HeaderProps) {
  const isPending = currentStudent?.status === 'pendente_aprovacao';
  const isRestricted = Boolean(currentStudent && currentStudent.status !== 'ativo' && !isPending);
  const isActualAdmin = Boolean(isAdminAuthenticated && !currentStudent);
  const isUserLoggedIn = Boolean((currentStudent && currentStudent.status === 'ativo') || isActualAdmin);

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between gap-3">
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Toggle Button */}
        {isUserLoggedIn && onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Abrir Menu de Navegação Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {!isUserLoggedIn ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm ring-1 ring-black/10">
              AT
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-[#0F172A] leading-none">
                Aprovação Total
              </span>
              <span className="text-[10px] text-[#64748B] font-semibold tracking-wider uppercase mt-0.5">
                Precision SaaS
              </span>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onOpenTargetModal}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-md transition-colors truncate"
            >
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="truncate max-w-[130px]">{currentTarget.code}</span>
            </button>

            {/* Search input styled with Cmd+K hint */}
            <div 
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:border-[#94A3B8] transition-all cursor-pointer w-60 md:w-72 lg:w-80 shadow-2xs group"
            >
              <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#64748B] transition-colors" />
              <input
                type="text"
                placeholder="Buscar leis, questões, cadernos..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-xs text-[#0F172A] placeholder-[#94A3B8] bg-transparent outline-none cursor-pointer"
              />
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] uppercase font-bold text-[#64748B] bg-[#F1F5F9] border border-[#CBD5E1] px-1.5 py-0.5 rounded">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </div>
          </>
        )}
      </div>

      {/* Right Tools & Student / Admin Indicators */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {isUserLoggedIn && (
          <>
            {/* Streak Pill */}
            <div 
              title="Sequência de estudos contínua"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs font-bold transition-transform hover:scale-105 select-none shadow-2xs"
            >
              <Flame className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D97706] fill-[#F59E0B] animate-pulse" />
              <span className="tabular-nums">{streakDays}d</span>
              <span className="hidden xl:inline text-[11px] font-medium text-[#B45309]/80">• Fogo</span>
            </div>

            {/* Daily Target Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Meta: 35/40 q</span>
            </div>
          </>
        )}

        {/* Admin Shortcut Button - ONLY appears after logged in as administrator */}
        {isActualAdmin && onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            title="Acessar Painel do Administrador (Acesso Total)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer bg-rose-600 hover:bg-rose-500 text-white shadow-2xs ring-1 ring-rose-400"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Painel Admin</span>
            <span className="text-[10px] bg-white text-rose-700 px-1 py-0.2 rounded font-bold uppercase">Total</span>
          </button>
        )}

        {/* Student Area Button (Only for students) */}
        {!isActualAdmin && (
          <button
            onClick={onOpenStudentArea}
            title="Acessar Área do Aluno & Login de Estudante"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 shadow-2xs cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">Área do Aluno</span>
          </button>
        )}

        {/* Notifications */}
        <button 
          title="Notificações e Avisos de Banca"
          className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white" />
        </button>

        {/* Profile Pill: Admin Badge or Student Avatar */}
        {isActualAdmin ? (
          <div 
            onClick={onNavigateToAdmin}
            title="Painel do Super Administrador (Acesso Total)"
            className="flex items-center gap-2 pl-1 border-l border-[#E2E8F0] cursor-pointer group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-rose-400 flex items-center justify-center font-bold text-xs shadow-2xs transition-transform group-hover:scale-105">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-2 border-white rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="hidden xl:block text-left leading-tight">
              <div className="text-xs font-extrabold text-[#0F172A] group-hover:text-rose-600 transition-colors flex items-center gap-1 truncate max-w-[130px]">
                Administrador
                <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1 rounded">MASTER</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-bold truncate">
                Acesso Total Liberado
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={onOpenStudentArea}
            title="Ver perfil do aluno / Alternar estudante"
            className="flex items-center gap-2 pl-1 border-l border-[#E2E8F0] cursor-pointer group"
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ring-2 ring-white transition-transform group-hover:scale-105 overflow-hidden ${
                isRestricted
                  ? 'bg-gradient-to-tr from-rose-700 to-amber-600 text-white'
                  : 'bg-gradient-to-tr from-[#0F172A] to-[#2563EB] text-white'
              }`}>
                {currentStudent?.avatarUrl ? (
                  <img
                    src={currentStudent.avatarUrl}
                    alt={currentStudent.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  currentStudent ? currentStudent.name.slice(0, 2).toUpperCase() : 'AL'
                )}
              </div>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                isRestricted ? 'bg-rose-600 animate-ping' : isPending ? 'bg-amber-500 animate-pulse' : currentStudent ? 'bg-[#10B981]' : 'bg-slate-400'
              }`} />
            </div>

            <div className="hidden xl:block text-left leading-tight">
              <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors flex items-center gap-1 truncate max-w-[120px]">
                {currentStudent ? currentStudent.name : 'Área do Aluno'}
                {isRestricted && (
                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                )}
              </div>
              <div className="text-[11px] text-[#64748B] font-medium truncate">
                {currentStudent ? (
                  isPending ? (
                    <span className="text-amber-600 font-bold">Aguardando Aprovação</span>
                  ) : isRestricted ? (
                    <span className="text-rose-600 font-bold">Acesso Restrito</span>
                  ) : (
                    currentStudent.role === 'aluno_premium' ? 'Plano Elite' : 'Aluno Regular'
                  )
                ) : (
                  'Matrícula / Login'
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
