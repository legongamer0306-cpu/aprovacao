'use client';

import React, { useState } from 'react';
import { 
  Sidebar, 
  NavigationTab 
} from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { QuestionBankView } from '@/components/QuestionBankView';
import { FlashcardsSRSView } from '@/components/FlashcardsSRSView';
import { StudyScheduleView } from '@/components/StudyScheduleView';
import { PerformanceAuditView } from '@/components/PerformanceAuditView';
import { JurisprudenceView } from '@/components/JurisprudenceView';
import { TargetExamModal } from '@/components/TargetExamModal';
import { CommandPalette } from '@/components/CommandPalette';
import { PasteEditalModal } from '@/components/PasteEditalModal';
import { PDFLibraryView } from '@/components/PDFLibraryView';
import { MapasMentaisView } from '@/components/MapasMentaisView';
import { SimuladosView } from '@/components/SimuladosView';
import { ExamRunnerModal } from '@/components/ExamRunnerModal';
import { AdminPortalView } from '@/components/AdminPortalView';
import { StudentAreaModal } from '@/components/StudentAreaModal';
import { StudentAccessGate } from '@/components/StudentAccessGate';
import { 
  TARGET_EXAMS, 
  MOCK_QUESTIONS, 
  MOCK_FLASHCARDS, 
  MOCK_DAILY_TASKS, 
  MOCK_SUBJECT_PERFORMANCES,
  STUDENT_PERFORMANCES_MAP,
  getInitialStudentPerformance,
  MOCK_PDFS,
  PDF_SUBJECT_CLASSES,
  MOCK_SIMULADOS,
  DEFAULT_LEGAL_ITEMS_DATA,
  MOCK_MANAGED_USERS
} from '@/lib/mockData';
import { 
  ExamTarget, 
  CustomSyllabus, 
  StudyPDF, 
  ExamQuestion,
  MockExam,
  LegalItem,
  ManagedUser,
  AdminSession,
  SubjectPerformance
} from '@/lib/types';
import { 
  LayoutDashboard, 
  BookOpenCheck, 
  Layers, 
  CalendarCheck, 
  BarChart3, 
  FileText,
  Network,
  ShieldAlert,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [targets, setTargets] = useState<ExamTarget[]>(TARGET_EXAMS);
  const [currentTarget, setCurrentTarget] = useState<ExamTarget>(TARGET_EXAMS[0]);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isPasteEditalOpen, setIsPasteEditalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStudentAreaOpen, setIsStudentAreaOpen] = useState(false);
  const [tasks, setTasks] = useState(MOCK_DAILY_TASKS);
  const [questions, setQuestions] = useState<ExamQuestion[]>(MOCK_QUESTIONS);
  const [subjectFilterForQuestions, setSubjectFilterForQuestions] = useState<string | undefined>(undefined);
  const [streakDays, setStreakDays] = useState(18);
  const [searchQuery, setSearchQuery] = useState('');

  // Student Session State (Active logged-in student)
  const [currentStudent, setCurrentStudent] = useState<ManagedUser | null>(null);

  // Per-student isolated performance metrics (Multi-tenancy isolation)
  const [studentPerformances, setStudentPerformances] = useState<Record<string, SubjectPerformance[]>>(STUDENT_PERFORMANCES_MAP);

  // Simulados State & Active Exam
  const [simulados, setSimulados] = useState<MockExam[]>(MOCK_SIMULADOS);
  const [activeRunningExam, setActiveRunningExam] = useState<MockExam | null>(null);

  // Legal Items State (Súmulas, Lei Seca, CNJ, Repercussão Geral)
  const [legalItems, setLegalItems] = useState<LegalItem[]>(DEFAULT_LEGAL_ITEMS_DATA);

  // Users State (Alunos, Permissões, Restrições)
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_MANAGED_USERS);

  // Admin Session State
  const [adminSession, setAdminSession] = useState<AdminSession>({
    isAuthenticated: false,
    adminEmail: '',
    adminName: '',
    role: 'super_admin',
  });

  // Question Handlers
  const handleAddQuestion = (newQuestion: ExamQuestion) => {
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  // Simulado Handlers
  const handleUpdateSimulado = (updated: MockExam) => {
    setSimulados((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSimulado = (simId: string) => {
    setSimulados((prev) => prev.filter((s) => s.id !== simId));
  };

  const handleCreateSimulado = (newSim: MockExam) => {
    setSimulados((prev) => [newSim, ...prev]);
  };

  // Legal Items Handlers
  const handleUpdateLegalItem = (updated: LegalItem) => {
    setLegalItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteLegalItem = (itemId: string) => {
    setLegalItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleCreateLegalItem = (newItem: LegalItem) => {
    setLegalItems((prev) => [newItem, ...prev]);
  };

  // User Management Handlers (Excluir perfil e restringir acesso)
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentStudent?.id === userId) {
      setCurrentStudent(null);
    }
  };

  const handleToggleRestrictUser = (userId: string, isRestricted: boolean, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: isRestricted ? 'restrito' : 'ativo',
              restrictionReason: isRestricted ? (reason || 'Acesso restrito administrativamente') : undefined,
            }
          : u
      )
    );
    if (currentStudent?.id === userId) {
      setCurrentStudent((prev) =>
        prev
          ? {
              ...prev,
              status: isRestricted ? 'restrito' : 'ativo',
              restrictionReason: isRestricted ? (reason || 'Acesso restrito administrativamente') : undefined,
            }
          : null
      );
    }
  };

  // Student Session Handlers
  const handleSelectStudent = (student: ManagedUser) => {
    // When logging in as student: strictly ensure admin session is inactive and admin tab is never open
    setAdminSession({
      isAuthenticated: false,
      adminEmail: '',
      adminName: '',
      role: 'super_admin',
    });
    setCurrentStudent(student);
    if (currentTab === 'admin') {
      setCurrentTab('dashboard');
    }
    const matching = targets.find((t) => 
      t.enrolledStudentIds?.includes(student.id) ||
      t.name.toLowerCase().includes(student.targetExam.toLowerCase()) || 
      student.targetExam.toLowerCase().includes(t.code.toLowerCase())
    );
    if (matching) {
      setCurrentTarget(matching);
    }
  };

  const handleLogoutStudent = () => {
    setCurrentStudent(null);
  };

  const handleRegisterStudent = (newStudent: ManagedUser) => {
    // New registered student: reset admin session
    setAdminSession({
      isAuthenticated: false,
      adminEmail: '',
      adminName: '',
      role: 'super_admin',
    });
    setUsers((prev) => [newStudent, ...prev]);
    // Inicializar métricas exclusivas e isoladas para este novo aluno
    setStudentPerformances((prev) => ({
      ...prev,
      [newStudent.id]: getInitialStudentPerformance(newStudent.id, newStudent.targetExam),
    }));
    setCurrentStudent(newStudent);
    if (currentTab === 'admin') {
      setCurrentTab('dashboard');
    }
  };

  const handleUpdateStudent = (updated: ManagedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentStudent?.id === updated.id) {
      setCurrentStudent(updated);
    }
  };

  const handleApproveUser = (userId: string) => {
    const timeString = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'ativo',
              approvedAt: timeString,
              approvedBy: adminSession.adminName || 'Super Administrador',
            }
          : u
      )
    );
    if (currentStudent?.id === userId) {
      setCurrentStudent((prev) =>
        prev
          ? {
              ...prev,
              status: 'ativo',
              approvedAt: timeString,
              approvedBy: adminSession.adminName || 'Super Administrador',
            }
          : null
      );
    }
  };

  const handleRejectUser = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'rejeitado',
              rejectionReason: reason || 'Documentação não compatível ou fotos ilegíveis.',
            }
          : u
      )
    );
    if (currentStudent?.id === userId) {
      setCurrentStudent((prev) =>
        prev
          ? {
              ...prev,
              status: 'rejeitado',
              rejectionReason: reason || 'Documentação não compatível ou fotos ilegíveis.',
            }
          : null
      );
    }
  };

  // Admin Authentication Handlers
  const handleLoginAdmin = (email: string, name: string, role: 'super_admin' | 'gestor_conteudo') => {
    // When logging into admin mode: clear active student session so admin has full managerial scope
    setCurrentStudent(null);
    setAdminSession({
      isAuthenticated: true,
      adminEmail: email,
      adminName: name,
      role,
      loginTime: new Date().toLocaleTimeString('pt-BR'),
    });
    setCurrentTab('admin');
  };

  const handleLogoutAdmin = () => {
    setAdminSession({
      isAuthenticated: false,
      adminEmail: '',
      adminName: '',
      role: 'super_admin',
    });
    setCurrentTab('dashboard');
  };

  // Course / Exam Target Management Handlers
  const handleCreateCourse = (newCourse: ExamTarget) => {
    setTargets((prev) => [newCourse, ...prev]);
  };

  const handleUpdateCourse = (updatedCourse: ExamTarget) => {
    setTargets((prev) => prev.map((t) => (t.id === updatedCourse.id ? updatedCourse : t)));
    if (currentTarget.id === updatedCourse.id) {
      setCurrentTarget(updatedCourse);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setTargets((prev) => {
      const filtered = prev.filter((t) => t.id !== courseId);
      if (currentTarget.id === courseId && filtered.length > 0) {
        setCurrentTarget(filtered[0]);
      }
      return filtered;
    });
  };

  const handleToggleCourseEnrollment = (courseId: string) => {
    setTargets((prev) =>
      prev.map((t) =>
        t.id === courseId
          ? { ...t, isOpenForEnrollment: !(t.isOpenForEnrollment !== false) }
          : t
      )
    );
  };

  const handleEnrollStudentInCourse = (courseId: string, studentId: string) => {
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id !== courseId) return t;
        const currentList = t.enrolledStudentIds || [];
        if (currentList.includes(studentId)) return t;
        const newList = [...currentList, studentId];
        return {
          ...t,
          enrolledStudentIds: newList,
          enrolledStudentsCount: (t.enrolledStudentsCount || 0) + 1,
        };
      })
    );
  };

  const handleUnenrollStudentFromCourse = (courseId: string, studentId: string) => {
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id !== courseId) return t;
        const currentList = t.enrolledStudentIds || [];
        const newList = currentList.filter((id) => id !== studentId);
        return {
          ...t,
          enrolledStudentIds: newList,
          enrolledStudentsCount: Math.max(0, (t.enrolledStudentsCount || 1) - 1),
        };
      })
    );
  };

  const handleStudentSelfEnroll = (courseId: string) => {
    if (!currentStudent) return;
    handleEnrollStudentInCourse(courseId, currentStudent.id);
    const targetCourse = targets.find((t) => t.id === courseId);
    if (targetCourse) {
      setCurrentTarget(targetCourse);
      handleUpdateStudent({
        ...currentStudent,
        targetExam: targetCourse.name,
      });
    }
  };

  // PDF Management State
  const [pdfs, setPdfs] = useState<StudyPDF[]>(MOCK_PDFS);
  const [subjectClasses, setSubjectClasses] = useState<string[]>(PDF_SUBJECT_CLASSES);

  const handleAddPdf = (newPdf: StudyPDF) => {
    const stamped: StudyPDF = {
      ...newPdf,
      courseId: newPdf.courseId || currentTarget.id,
      courseName: newPdf.courseName || currentTarget.name,
      studentId: newPdf.studentId || currentStudent?.id || 'usr-1',
    };
    setPdfs((prev) => [stamped, ...prev]);
  };

  const handleDeletePdf = (pdfId: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== pdfId));
  };

  const handleUpdatePdfPage = (pdfId: string, newPage: number) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === pdfId ? { ...p, currentPage: newPage } : p))
    );
  };

  const handleToggleFavoritePdf = (pdfId: string) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === pdfId ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const handleAddSubjectClass = (newClass: string) => {
    if (!subjectClasses.includes(newClass)) {
      setSubjectClasses((prev) => [...prev, newClass]);
    }
  };

  // Target handlers: Add & Delete
  const handleAddTarget = (newTarget: ExamTarget) => {
    setTargets((prev) => [newTarget, ...prev]);
    setCurrentTarget(newTarget);
  };

  const handleDeleteTarget = (targetId: string) => {
    setTargets((prev) => {
      const filtered = prev.filter((t) => t.id !== targetId);
      if (currentTarget.id === targetId && filtered.length > 0) {
        setCurrentTarget(filtered[0]);
      }
      return filtered;
    });
  };

  // Syllabus handler: Save parsed edital to target
  const handleSaveSyllabus = (targetId: string, syllabus: CustomSyllabus) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, syllabus } : t))
    );
    if (currentTarget.id === targetId) {
      setCurrentTarget((prev) => ({ ...prev, syllabus }));
    }
  };

  // Handle task toggling
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleNavigateToQuestions = (subjectFilter?: string) => {
    setSubjectFilterForQuestions(subjectFilter);
    setCurrentTab('questoes');
  };

  const handleNavigateToFlashcards = () => {
    setCurrentTab('flashcards');
  };

  // Session checks: student vs admin isolation
  const isStudentLoggedIn = Boolean(currentStudent && currentStudent.status === 'ativo');
  const isAdminLoggedIn = Boolean(adminSession.isAuthenticated && !currentStudent);
  const isUserLoggedIn = Boolean(isStudentLoggedIn || isAdminLoggedIn);
  const pendingApprovalsCount = users.filter((u) => u.status === 'pendente_aprovacao').length;

  // Isolamento de Métricas: Cada conta de aluno visualiza exclusivamente suas próprias estatísticas (Multi-tenancy restrito)
  const activePerformances = currentStudent
    ? (studentPerformances[currentStudent.id] || getInitialStudentPerformance(currentStudent.id, currentStudent.targetExam))
    : MOCK_SUBJECT_PERFORMANCES;

  // Isolamento de PDFs: Alunos visualizam exclusivamente os seus próprios PDFs (um não vê o material do outro)
  const activePdfs = isAdminLoggedIn 
    ? pdfs 
    : currentStudent 
      ? pdfs.filter((p) => p.studentId === currentStudent.id) 
      : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Persistent Sidebar - only released after logged in */}
      {isUserLoggedIn && (
        <div className="hidden md:block h-full">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'questoes') setSubjectFilterForQuestions(undefined);
            }}
            currentTarget={currentTarget}
            onOpenTargetModal={() => setIsTargetModalOpen(true)}
            onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
            onOpenStudentArea={() => setIsStudentAreaOpen(true)}
            currentStudent={currentStudent}
            isAdminAuthenticated={isAdminLoggedIn}
            adminSession={adminSession}
            onLogoutAdmin={handleLogoutAdmin}
            pendingApprovalsCount={pendingApprovalsCount}
            activeAdminSubTab={adminSubTab}
            onSelectAdminSubTab={(subTab) => {
              setAdminSubTab(subTab);
              setCurrentTab('admin');
            }}
          />
        </div>
      )}

      {/* Mobile Drawer Sidebar */}
      {isUserLoggedIn && isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileSidebarOpen(false)} 
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                if (tab !== 'questoes') setSubjectFilterForQuestions(undefined);
                setIsMobileSidebarOpen(false);
              }}
              currentTarget={currentTarget}
              onOpenTargetModal={() => {
                setIsTargetModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              onOpenPasteEdital={() => {
                setIsPasteEditalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              onOpenStudentArea={() => {
                setIsStudentAreaOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              currentStudent={currentStudent}
              isAdminAuthenticated={isAdminLoggedIn}
              adminSession={adminSession}
              onLogoutAdmin={handleLogoutAdmin}
              pendingApprovalsCount={pendingApprovalsCount}
              activeAdminSubTab={adminSubTab}
              onSelectAdminSubTab={(subTab) => {
                setAdminSubTab(subTab);
                setCurrentTab('admin');
                setIsMobileSidebarOpen(false);
              }}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          currentTarget={currentTarget}
          streakDays={streakDays}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateToAdmin={() => {
            setCurrentTab('admin');
            setAdminSubTab('dashboard');
          }}
          isAdminAuthenticated={isAdminLoggedIn}
          currentStudent={currentStudent}
          onOpenStudentArea={() => setIsStudentAreaOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-20 md:pb-8">
          <div className="max-w-[1440px] mx-auto">
            {/* If neither active student nor admin: display Unified Access Gate */}
            {!isAdminLoggedIn && (!currentStudent || currentStudent.status !== 'ativo') ? (
              /* UNIFIED ACCESS GATE: Students and Admins log in at the EXACT same place */
              <StudentAccessGate
                currentStudent={currentStudent}
                users={users}
                onSelectStudent={handleSelectStudent}
                onRegisterStudent={handleRegisterStudent}
                onLogoutStudent={handleLogoutStudent}
                onLoginAdmin={handleLoginAdmin}
              />
            ) : currentTab === 'admin' && isAdminLoggedIn ? (
              /* ADMIN PORTAL TAB (Accessible ONLY when authenticated as administrator) */
              <AdminPortalView
                courses={targets}
                onCreateCourse={handleCreateCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
                onToggleCourseEnrollment={handleToggleCourseEnrollment}
                onEnrollStudentInCourse={handleEnrollStudentInCourse}
                onUnenrollStudentFromCourse={handleUnenrollStudentFromCourse}
                simulados={simulados}
                legalItems={legalItems}
                questions={questions}
                users={users}
                adminSession={adminSession}
                onLoginAdmin={handleLoginAdmin}
                onLogoutAdmin={handleLogoutAdmin}
                onNavigateToStudentView={() => setCurrentTab('dashboard')}
                onUpdateSimulado={handleUpdateSimulado}
                onDeleteSimulado={handleDeleteSimulado}
                onCreateSimulado={handleCreateSimulado}
                onUpdateLegalItem={handleUpdateLegalItem}
                onDeleteLegalItem={handleDeleteLegalItem}
                onCreateLegalItem={handleCreateLegalItem}
                onDeleteUser={handleDeleteUser}
                onToggleRestrictUser={handleToggleRestrictUser}
                onCreateUser={handleRegisterStudent}
                onUpdateUser={handleUpdateStudent}
                onApproveUser={handleApproveUser}
                onRejectUser={handleRejectUser}
                onDeleteQuestion={handleDeleteQuestion}
                onAddQuestion={handleAddQuestion}
                initialAdminSubTab={adminSubTab}
                onAdminSubTabChange={setAdminSubTab}
              />
            ) : (
              /* FULL STUDY SYSTEM (ACCESSIBLE TO APPROVED STUDENTS AND ADMINISTRATORS) */
              <>
                {/* Admin Audit & Master Mode Notification Banner */}
                {isAdminLoggedIn && (
                  <div className="mb-5 p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl shadow-xs border border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>Modo Administrador Master Ativo</span>
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                            Acesso Total Liberado
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Você está navegando pelo sistema em modo irrestrito com privilégios de auditoria ({adminSession.adminEmail || 'admin'}).
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentTab('admin');
                          setAdminSubTab('dashboard');
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Painel do Administrador
                      </button>
                    </div>
                  </div>
                )}
                {currentTab === 'dashboard' && (
                  <DashboardView
                    currentTarget={currentTarget}
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    performances={activePerformances}
                    onNavigateToQuestions={handleNavigateToQuestions}
                    onNavigateToFlashcards={handleNavigateToFlashcards}
                    onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
                  />
                )}

                {currentTab === 'questoes' && (
                  <QuestionBankView
                    questions={questions}
                    initialSubjectFilter={subjectFilterForQuestions}
                    onRecordAnswer={(questionId, isCorrect) => {
                      if (isCorrect) {
                        setStreakDays((prev) => prev);
                      }
                      if (!currentStudent) return;

                      const targetQ = questions.find((q) => q.id === questionId);
                      const subjectName = targetQ?.subject || 'Direito Constitucional';

                      // Atualizar total de resoluções e taxa de acerto do aluno ativo
                      const updatedTotal = (currentStudent.questionsAnswered || 0) + 1;
                      const prevAcc = currentStudent.accuracyRate || 0;
                      const prevCorrect = Math.round((prevAcc / 100) * (currentStudent.questionsAnswered || 0));
                      const newCorrect = prevCorrect + (isCorrect ? 1 : 0);
                      const newAcc = Math.round((newCorrect / updatedTotal) * 1000) / 10;

                      handleUpdateStudent({
                        ...currentStudent,
                        questionsAnswered: updatedTotal,
                        accuracyRate: newAcc,
                        lastActive: 'Agora',
                      });

                      // Atualizar métricas isoladas por matéria do aluno logado (um não afeta o outro)
                      setStudentPerformances((prev) => {
                        const studentId = currentStudent.id;
                        const list = prev[studentId] || getInitialStudentPerformance(studentId, currentStudent.targetExam);
                        let matched = false;
                        const updatedList = list.map((item) => {
                          const isMatch =
                            item.subject.toLowerCase() === subjectName.toLowerCase() ||
                            subjectName.toLowerCase().includes(item.subject.toLowerCase()) ||
                            item.subject.toLowerCase().includes(subjectName.toLowerCase());
                          if (isMatch) {
                            matched = true;
                            const newQ = item.questionsAnswered + 1;
                            const newC = item.correctCount + (isCorrect ? 1 : 0);
                            const rate = Math.round((newC / newQ) * 1000) / 10;
                            return {
                              ...item,
                              questionsAnswered: newQ,
                              correctCount: newC,
                              accuracyRate: rate,
                              trend: isCorrect ? ('up' as const) : ('down' as const),
                              delta: isCorrect ? '+0.6%' : '-0.4%',
                              status: rate >= 80 ? ('Domínio' as const) : rate >= 65 ? ('Em Evolução' as const) : ('Atenção Crítica' as const),
                            };
                          }
                          return item;
                        });

                        if (!matched) {
                          updatedList.push({
                            subject: subjectName,
                            questionsAnswered: 1,
                            correctCount: isCorrect ? 1 : 0,
                            accuracyRate: isCorrect ? 100 : 0,
                            trend: isCorrect ? 'up' : 'down',
                            delta: isCorrect ? '+1.0%' : '-1.0%',
                            targetRate: 80.0,
                            status: isCorrect ? 'Domínio' : 'Atenção Crítica',
                          });
                        }

                        return { ...prev, [studentId]: updatedList };
                      });
                    }}
                    onAddQuestion={handleAddQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                )}

                {currentTab === 'simulados' && (
                  <SimuladosView
                    simulados={simulados}
                    onStartExam={(exam) => setActiveRunningExam(exam)}
                    onCreateCustomSimulado={handleCreateSimulado}
                  />
                )}

                {currentTab === 'flashcards' && (
                  <FlashcardsSRSView 
                    flashcards={MOCK_FLASHCARDS}
                    onNavigateToMapas={() => setCurrentTab('mapas')}
                    onNavigateToQuestions={handleNavigateToQuestions}
                  />
                )}

                {currentTab === 'mapas' && (
                  <MapasMentaisView
                    onNavigateToFlashcards={() => setCurrentTab('flashcards')}
                    onNavigateToQuestions={handleNavigateToQuestions}
                  />
                )}

                {currentTab === 'cronograma' && (
                  <StudyScheduleView
                    tasks={tasks}
                    onToggleTask={handleToggleTask}
                    currentTarget={currentTarget}
                    onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
                    onUpdateTasks={setTasks}
                  />
                )}

                {currentTab === 'pdfs' && (
                  <PDFLibraryView
                    pdfs={activePdfs}
                    onAddPdf={handleAddPdf}
                    onDeletePdf={handleDeletePdf}
                    onUpdatePdfPage={handleUpdatePdfPage}
                    onToggleFavorite={handleToggleFavoritePdf}
                    subjectClasses={subjectClasses}
                    onAddSubjectClass={handleAddSubjectClass}
                    currentTarget={currentTarget}
                    courses={targets}
                    currentStudent={currentStudent}
                    isAdmin={isAdminLoggedIn}
                  />
                )}

                {currentTab === 'desempenho' && (
                  <PerformanceAuditView
                    performances={activePerformances}
                    onFocusSubject={(subject) => handleNavigateToQuestions(subject)}
                  />
                )}

                {currentTab === 'jurisprudencia' && (
                  <JurisprudenceView 
                    onNavigateToQuestions={handleNavigateToQuestions}
                    items={legalItems}
                    onDeleteItem={handleDeleteLegalItem}
                    onAddItem={handleCreateLegalItem}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* Mobile Persistent Bottom Nav Bar (< 768px) - only after logged in */}
        {isUserLoggedIn && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-2 flex items-center justify-around z-30">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                currentTab === 'dashboard' ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Painel</span>
            </button>
            <button
              onClick={() => setCurrentTab('questoes')}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                currentTab === 'questoes' ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Questões</span>
            </button>
            <button
              onClick={() => setCurrentTab('flashcards')}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                currentTab === 'flashcards' ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setCurrentTab('cronograma')}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                currentTab === 'cronograma' ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Ciclo</span>
            </button>
            <button
              onClick={() => setCurrentTab('desempenho')}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                currentTab === 'desempenho' ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Auditoria</span>
            </button>
            <button
              onClick={() => setIsStudentAreaOpen(true)}
              className="flex flex-col items-center gap-1 p-1 text-[10px] font-bold text-[#2563EB]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Aluno</span>
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                  currentTab === 'admin' ? 'text-rose-600' : 'text-[#64748B]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exam Runner Modal for Simulados */}
      {activeRunningExam && (
        <ExamRunnerModal
          isOpen={!!activeRunningExam}
          onClose={() => setActiveRunningExam(null)}
          exam={activeRunningExam}
          onFinishExam={(examId, score, correctCount, timeSpentSec) => {
            setSimulados((prev) =>
              prev.map((s) =>
                s.id === examId
                  ? {
                      ...s,
                      completed: true,
                      score,
                      correctAnswers: correctCount,
                      userTimeSpentSeconds: timeSpentSec,
                      status: 'concluido' as const,
                      submittedAt: 'Hoje',
                    }
                  : s
              )
            );
            setActiveRunningExam(null);
          }}
        />
      )}

      {/* Target Selection & Course Catalog Modal (Official Admin Courses & Student Enrollment) */}
      <TargetExamModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={currentTarget}
        targets={targets}
        onSelectTarget={(target) => setCurrentTarget(target)}
        onAddTarget={handleAddTarget}
        onDeleteTarget={handleDeleteTarget}
        onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
        currentStudent={currentStudent}
        onEnrollCourse={handleStudentSelfEnroll}
      />

      {/* Paste Edital Modal */}
      <PasteEditalModal
        isOpen={isPasteEditalOpen}
        onClose={() => setIsPasteEditalOpen(false)}
        currentTarget={currentTarget}
        onSaveSyllabus={handleSaveSyllabus}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenTargetModal={() => setIsTargetModalOpen(true)}
        onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
        onOpenStudentArea={() => setIsStudentAreaOpen(true)}
        isAdminAuthenticated={isAdminLoggedIn}
        currentStudent={currentStudent}
      />

      {/* Student Area & Authentication Modal */}
      <StudentAreaModal
        isOpen={isStudentAreaOpen}
        onClose={() => setIsStudentAreaOpen(false)}
        currentStudent={currentStudent}
        users={users}
        onSelectStudent={handleSelectStudent}
        onLogoutStudent={handleLogoutStudent}
        onRegisterStudent={handleRegisterStudent}
        onUpdateStudent={handleUpdateStudent}
        streakDays={streakDays}
        onNavigateToAdmin={() => {
          handleLoginAdmin('admin@aprovacaototal.com', 'Super Administrador Geral (Acesso Total)', 'super_admin');
          setIsStudentAreaOpen(false);
        }}
      />
    </div>
  );
}
