'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpenCheck, 
  Layers, 
  CalendarCheck, 
  BarChart3, 
  Bookmark, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  Command,
  FileText,
  SlidersHorizontal,
  GraduationCap,
  Timer,
  Network,
  Scale,
  ShieldAlert,
  Lock,
  Clock,
  CheckCircle2,
  Users,
  LogOut,
  ChevronRight,
  X,
  FileSpreadsheet,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { ExamTarget, ManagedUser, AdminSession } from '@/lib/types';

export type NavigationTab = 
  | 'dashboard' 
  | 'questoes' 
  | 'simulados' 
  | 'flashcards' 
  | 'resumos'
  | 'mapas' 
  | 'cronograma' 
  | 'desempenho' 
  | 'jurisprudencia' 
  | 'pdfs' 
  | 'admin';

export type AdminSubTab = 'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentTarget: ExamTarget;
  onOpenTargetModal: () => void;
  onOpenPasteEdital?: () => void;
  onOpenStudentArea?: () => void;
  currentStudent?: ManagedUser | null;
  isAdminAuthenticated?: boolean;
  adminSession?: AdminSession;
  onLogoutAdmin?: () => void;
  pendingApprovalsCount?: number;
  activeAdminSubTab?: AdminSubTab;
  onSelectAdminSubTab?: (subTab: AdminSubTab) => void;
  onCloseMobile?: () => void;
  onNavigateToQuestions?: (subjectFilter?: string, mode?: 'all' | 'oficial' | 'membros' | 'marcadas' | 'erros') => void;
  bookmarkedQuestionsCount?: number;
  mistakesCount?: number;
  activeQuestionMode?: 'all' | 'oficial' | 'membros' | 'marcadas' | 'erros';
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  currentTarget,
  onOpenTargetModal,
  onOpenPasteEdital,
  onOpenStudentArea,
  currentStudent,
  isAdminAuthenticated = false,
  adminSession,
  onLogoutAdmin,
  pendingApprovalsCount = 0,
  activeAdminSubTab = 'dashboard',
  onSelectAdminSubTab,
  onCloseMobile,
  onNavigateToQuestions,
  bookmarkedQuestionsCount = 0,
  mistakesCount = 0,
  activeQuestionMode = 'all',
  isDarkMode = false,
  onToggleTheme,
}: SidebarProps) {
  // Navigation tabs for student study modules
  const studyNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'questoes', label: 'Banco de Questões', icon: <BookOpenCheck className="w-4 h-4" />, badge: '4 novas' },
    { id: 'simulados', label: 'Simulados & Provas', icon: <Timer className="w-4 h-4 text-emerald-600" />, badge: 'Novo' },
    { id: 'resumos', label: 'Criar Resumos', icon: <Sparkles className="w-4 h-4 text-purple-600" />, badge: 'Palavras-Chave' },
    { id: 'cronograma', label: 'Cronograma & Ciclo', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'pdfs', label: 'Meus PDFs', icon: <FileText className="w-4 h-4 text-[#2563EB]" />, badge: 'Classes' },
    { id: 'desempenho', label: 'Métricas & Auditoria', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'jurisprudencia', label: 'Súmulas & Lei Seca', icon: <Scale className="w-4 h-4 text-amber-600" /> },
  ];

  // Specific admin sub-navigation items
  const adminSubNavItems: { id: AdminSubTab; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Visão Geral do Admin', icon: <LayoutDashboard className="w-3.5 h-3.5 text-rose-600" /> },
    { 
      id: 'usuarios', 
      label: 'Alunos & Fotos', 
      icon: <Users className="w-3.5 h-3.5 text-blue-600" />, 
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pend.` : undefined,
      badgeColor: 'bg-amber-500 text-white' 
    },
    { id: 'cursos', label: 'Cursos & Inscrições', icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'simulados', label: 'Simulados Oficiais', icon: <Timer className="w-3.5 h-3.5 text-amber-600" /> },
    { id: 'sumulas', label: 'Súmulas & Leis', icon: <Scale className="w-3.5 h-3.5 text-purple-600" /> },
    { id: 'questoes', label: 'Banco de Questões (Admin)', icon: <BookOpenCheck className="w-3.5 h-3.5 text-cyan-600" /> },
  ];

  const isStudent = Boolean(currentStudent);
  const isActualAdmin = isAdminAuthenticated && !isStudent;

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-14 px-4 sm:px-5 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm ring-1 ring-black/10">
            AT
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-[#0F172A] leading-none">
              Aprovação Total
            </span>
            <span className="text-[10px] text-[#64748B] font-semibold tracking-wider uppercase mt-0.5">
              {isActualAdmin ? 'Portal Administrativo' : 'Precision SaaS'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Fechar menu lateral"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Target Exam Selector Chip */}
      <div className="p-3 border-b border-[#E2E8F0]">
        <button
          onClick={onOpenTargetModal}
          className="w-full text-left p-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white transition-all shadow-sm flex flex-col gap-1.5 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#94A3B8] flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-[#38BDF8]" /> Foco Alvo Ativo
            </span>
            <span className="text-[10px] bg-white/10 hover:bg-white/20 text-[#E2E8F0] px-1.5 py-0.5 rounded font-mono">
              ⌘K
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold truncate text-white max-w-[170px]">
              {currentTarget.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white transition-transform group-hover:translate-y-0.5" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-white/10">
            <span className="truncate max-w-[130px]">{currentTarget.role}</span>
            <span className="text-amber-400 font-bold tabular-nums">{currentTarget.daysRemaining}d</span>
          </div>
        </button>
      </div>

      {/* Scrollable Navigation Body */}
      <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto">
        {/* ========================================================
            ADMINISTRATOR SECTION (Visible ONLY when authenticated as Admin)
           ======================================================== */}
        {isActualAdmin && (
          <div className="bg-rose-50/60 rounded-xl p-2 border border-rose-200/80 space-y-1.5 shadow-2xs">
            <div className="px-2 pt-1 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                Painel do Administrador
              </span>
              <span className="text-[9px] bg-rose-600 text-white font-black px-1.5 py-0.5 rounded uppercase">
                Acesso Total
              </span>
            </div>

            {/* Direct Sub-tab Items for Administrator */}
            <div className="space-y-0.5">
              {adminSubNavItems.map((sub) => {
                const isSelected = currentTab === 'admin' && activeAdminSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSelectTab('admin');
                      onSelectAdminSubTab?.(sub.id);
                      onCloseMobile?.();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-all text-left ${
                      isSelected
                        ? 'bg-rose-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-rose-100/70 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={isSelected ? 'text-white' : ''}>{sub.icon}</span>
                      <span className="truncate">{sub.label}</span>
                    </div>
                    {sub.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isSelected ? 'bg-white text-rose-700' : sub.badgeColor || 'bg-rose-200 text-rose-800'
                      }`}>
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STUDY NAVIGATION LINKS (Full access for students and admins)
           ======================================================== */}
        <div>
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center justify-between">
            <span>{isActualAdmin ? 'Módulos (Visão de Aluno)' : 'Menu de Navegação'}</span>
            {isActualAdmin && (
              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded">
                Liberado
              </span>
            )}
          </div>
          <div className="space-y-1">
            {studyNavItems.map((item) => {
              const isActive = currentTab === item.id;
              // For students, check active status. For admin, it is NEVER locked!
              const isLockedForStudent = !isActualAdmin && (!currentStudent || currentStudent.status !== 'ativo');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-blue-50/80 text-[#2563EB] shadow-2xs font-bold'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}>
                      {item.icon}
                    </span>
                    <span className={`truncate ${isLockedForStudent && !isActive ? 'text-[#94A3B8]' : ''}`}>
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2563EB] rounded-r-full" />
                  )}

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isLockedForStudent && (
                      <span title="Requer cadastro com foto e aprovação pelo administrador">
                        <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                      </span>
                    )}
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                        isActive ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#475569]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools & Shortcuts */}
        <div className="pt-2 border-t border-[#E2E8F0]/70">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Ferramentas & Editais
          </div>
          <div className="space-y-1">
            {onOpenPasteEdital && (
              <div 
                onClick={() => {
                  onOpenPasteEdital();
                  onCloseMobile?.();
                }}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-[#2563EB] bg-[#EFF6FF]/60 hover:bg-[#EFF6FF] rounded-lg cursor-pointer transition-colors font-semibold"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  Colar Edital Oficial
                </span>
                <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.2 rounded font-mono font-bold">+</span>
              </div>
            )}
            <div 
              onClick={() => {
                if (onNavigateToQuestions) {
                  onNavigateToQuestions(undefined, 'marcadas');
                } else {
                  onSelectTab('questoes');
                }
                onCloseMobile?.();
              }}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-all ${
                currentTab === 'questoes' && activeQuestionMode === 'marcadas'
                  ? 'bg-amber-500/10 text-amber-700 font-black border border-amber-300/80 shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bookmark className={`w-3.5 h-3.5 text-amber-500 ${currentTab === 'questoes' && activeQuestionMode === 'marcadas' ? 'fill-amber-500' : ''}`} />
                <span>Questões Marcadas</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                currentTab === 'questoes' && activeQuestionMode === 'marcadas'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {bookmarkedQuestionsCount}
              </span>
            </div>
            <div 
              onClick={() => {
                if (onNavigateToQuestions) {
                  onNavigateToQuestions(undefined, 'erros');
                } else {
                  onSelectTab('questoes');
                }
                onCloseMobile?.();
              }}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer transition-all ${
                currentTab === 'questoes' && activeQuestionMode === 'erros'
                  ? 'bg-rose-500/10 text-rose-700 font-black border border-rose-300/80 shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertCircle className={`w-3.5 h-3.5 text-rose-500 ${currentTab === 'questoes' && activeQuestionMode === 'erros' ? 'text-rose-600' : ''}`} />
                <span>Erros Frequentes</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                currentTab === 'questoes' && activeQuestionMode === 'erros'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-100 text-rose-900'
              }`}>
                {mistakesCount}
              </span>
            </div>

            {/* Student Area Entry (Only visible for students) */}
            {!isActualAdmin && onOpenStudentArea && (
              <div 
                onClick={() => {
                  onOpenStudentArea();
                  onCloseMobile?.();
                }}
                className="flex items-center justify-between px-3 py-2 text-xs text-[#0F172A] bg-blue-50/70 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors font-bold border border-blue-200 mt-2 shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  {currentStudent?.avatarUrl ? (
                    <img
                      src={currentStudent.avatarUrl}
                      alt={currentStudent.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#2563EB]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                  )}
                  Área do Aluno
                </span>
                {currentStudent ? (
                  currentStudent.status === 'ativo' ? (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Aprovado
                    </span>
                  ) : currentStudent.status === 'pendente_aprovacao' ? (
                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-1 animate-pulse">
                      <Clock className="w-2.5 h-2.5 animate-spin" />
                      Pendente
                    </span>
                  ) : currentStudent.status === 'rejeitado' ? (
                    <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                      Rejeitado
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-bold">
                      Restrito
                    </span>
                  )
                ) : (
                  <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-medium">
                    Entrar
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ========================================================
          SIDEBAR FOOTER: ADMIN PROFILE OR STUDENT CYCLE PROGRESS
         ======================================================== */}
      {isActualAdmin ? (
        <div className="p-3 border-t border-[#E2E8F0] bg-slate-900 text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 ring-2 ring-rose-400/40">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-xs font-bold text-white truncate">
                  {adminSession?.adminName || 'Super Administrador'}
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  {adminSession?.adminEmail || 'admin@aprovacaototal.com'}
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40 animate-pulse shrink-0" title="Sessão ativa com acesso irrestrito" />
          </div>

          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Acesso Total Liberado
            </span>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="text-[10px] text-rose-300 hover:text-white hover:bg-rose-600/30 px-2 py-0.5 rounded transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                title="Encerrar sessão de administrador"
              >
                <LogOut className="w-3 h-3" />
                Sair
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#0F172A]">Edital Percorrido</span>
              <span className="font-bold text-[#2563EB] tabular-nums">{currentTarget.progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                style={{ width: `${currentTarget.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1.5">
              <span>Meta de ciclo</span>
              <span className="font-medium text-emerald-600">No ritmo</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
