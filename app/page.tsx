'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sidebar, 
  NavigationTab 
} from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { QuestionBankView } from '@/components/QuestionBankView';
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
  MOCK_DAILY_TASKS, 
  MOCK_SUBJECT_PERFORMANCES,
  STUDENT_PERFORMANCES_MAP,
  getInitialStudentPerformance,
  getZeroedPerformanceForCourse,
  STUDENT_TASKS_MAP,
  getInitialStudentTasks,
  STUDENT_CYCLES_MAP,
  getInitialStudentCycle,
  STUDENT_SYLLABI_MAP,
  getInitialStudentSyllabi,
  STUDENT_AUDIT_LOGS_MAP,
  getInitialStudentAuditLogs,
  MOCK_PDFS,
  PDF_SUBJECT_CLASSES,
  MOCK_SIMULADOS,
  DEFAULT_LEGAL_ITEMS_DATA,
  MOCK_MANAGED_USERS,
  MOCK_SIMULADO_RANKINGS,
  INITIAL_STUDENT_BOOKMARKS,
  INITIAL_STUDENT_MISTAKES
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
  SubjectPerformance,
  DailyTask,
  CycleDay,
  AuditEntry,
  MockExamRankingEntry
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
  GraduationCap,
  Timer
} from 'lucide-react';

const emptySubscribe = () => () => {};

export default function HomePage() {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [targets, setTargets] = useState<ExamTarget[]>(TARGET_EXAMS);
  const [currentTarget, setCurrentTarget] = useState<ExamTarget>(TARGET_EXAMS[0]);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isPasteEditalOpen, setIsPasteEditalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStudentAreaOpen, setIsStudentAreaOpen] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>(MOCK_QUESTIONS);
  const [subjectFilterForQuestions, setSubjectFilterForQuestions] = useState<string | undefined>(undefined);
  const [streakDays, setStreakDays] = useState(18);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStudent, setCurrentStudent] = useState<ManagedUser | null>(null);
  const [studentPerformances, setStudentPerformances] = useState<Record<string, SubjectPerformance[]>>(STUDENT_PERFORMANCES_MAP);
  const [studentTasks, setStudentTasks] = useState<Record<string, DailyTask[]>>(STUDENT_TASKS_MAP);
  const [studentCycles, setStudentCycles] = useState<Record<string, CycleDay[]>>(STUDENT_CYCLES_MAP);
  const [studentSyllabi, setStudentSyllabi] = useState<Record<string, Record<string, CustomSyllabus>>>(STUDENT_SYLLABI_MAP);
  const [studentAuditLogs, setStudentAuditLogs] = useState<Record<string, AuditEntry[]>>(STUDENT_AUDIT_LOGS_MAP);
  const [simulados, setSimulados] = useState<MockExam[]>(MOCK_SIMULADOS);
  const [activeRunningExam, setActiveRunningExam] = useState<MockExam | null>(null);
  const [mockRankings, setMockRankings] = useState<MockExamRankingEntry[]>(MOCK_SIMULADO_RANKINGS);
  const [legalItems, setLegalItems] = useState<LegalItem[]>(DEFAULT_LEGAL_ITEMS_DATA);
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_MANAGED_USERS);
  const [adminSession, setAdminSession] = useState<AdminSession>({
    isAuthenticated: false,
    adminEmail: '',
    adminName: '',
    role: 'super_admin',
  });
  const [pdfs, setPdfs] = useState<StudyPDF[]>(MOCK_PDFS);
  const [subjectClasses, setSubjectClasses] = useState<string[]>(PDF_SUBJECT_CLASSES);
  const [questionFilterMode, setQuestionFilterMode] = useState<'all' | 'oficial' | 'membros' | 'marcadas' | 'erros'>('all');
  const [studentBookmarkedQuestions, setStudentBookmarkedQuestions] = useState<Record<string, string[]>>(INITIAL_STUDENT_BOOKMARKS);
  const [studentMistakes, setStudentMistakes] = useState<Record<string, Record<string, { count: number; lastMissedAt: string }>>>(INITIAL_STUDENT_MISTAKES);
  const [studentScratchedQuestions, setStudentScratchedQuestions] = useState<Record<string, string[]>>({});

  // Safe client hydration from localStorage on mount (eliminates all SSR hydration mismatches)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTab = localStorage.getItem('aprovacao_total_current_tab');
        if (savedTab) setCurrentTab(savedTab as NavigationTab);

        const savedAdminSub = localStorage.getItem('aprovacao_total_admin_sub_tab');
        if (savedAdminSub) setAdminSubTab(savedAdminSub as any);

        const savedTargets = localStorage.getItem('aprovacao_total_courses_targets');
        if (savedTargets) {
          const parsed = JSON.parse(savedTargets);
          if (Array.isArray(parsed) && parsed.length > 0) setTargets(parsed);
        }

        const savedSelected = localStorage.getItem('aprovacao_total_selected_target');
        if (savedSelected) {
          const parsedTarget = JSON.parse(savedSelected);
          if (parsedTarget && parsedTarget.id) setCurrentTarget(parsedTarget);
        }

        const allSaved = localStorage.getItem('aprovacao_total_all_questions');
        if (allSaved) {
          const parsedAll = JSON.parse(allSaved);
          if (Array.isArray(parsedAll) && parsedAll.length > 0) setQuestions(parsedAll);
        } else {
          const customSaved = localStorage.getItem('aprovacao_total_custom_questions');
          if (customSaved) {
            const parsed = JSON.parse(customSaved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const existingIds = new Set(MOCK_QUESTIONS.map((q) => q.id));
              const newOnes = parsed.filter((q) => !existingIds.has(q.id));
              setQuestions([...newOnes, ...MOCK_QUESTIONS]);
            }
          }
        }

        const savedStudent = localStorage.getItem('aprovacao_total_current_student');
        if (savedStudent) {
          const parsed = JSON.parse(savedStudent);
          if (parsed && parsed.id) setCurrentStudent(parsed);
        }

        const savedPerf = localStorage.getItem('aprovacao_total_student_performances');
        if (savedPerf) {
          const parsed = JSON.parse(savedPerf);
          if (parsed && typeof parsed === 'object') setStudentPerformances(parsed);
        }

        const savedTasks = localStorage.getItem('aprovacao_total_student_tasks');
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          if (parsed && typeof parsed === 'object') setStudentTasks(parsed);
        }

        const savedCycles = localStorage.getItem('aprovacao_total_student_cycles');
        if (savedCycles) {
          const parsed = JSON.parse(savedCycles);
          if (parsed && typeof parsed === 'object') setStudentCycles(parsed);
        }

        const savedSyllabi = localStorage.getItem('aprovacao_total_student_syllabi');
        if (savedSyllabi) {
          const parsed = JSON.parse(savedSyllabi);
          if (parsed && typeof parsed === 'object') setStudentSyllabi(parsed);
        }

        const savedAudit = localStorage.getItem('aprovacao_total_student_audit_logs');
        if (savedAudit) {
          const parsed = JSON.parse(savedAudit);
          if (parsed && typeof parsed === 'object') setStudentAuditLogs(parsed);
        }

        const savedSimulados = localStorage.getItem('aprovacao_total_simulados');
        if (savedSimulados) {
          const parsed = JSON.parse(savedSimulados);
          if (Array.isArray(parsed) && parsed.length > 0) setSimulados(parsed);
        }

        const savedRankings = localStorage.getItem('aprovacao_total_mock_rankings');
        if (savedRankings) {
          const parsed = JSON.parse(savedRankings);
          if (Array.isArray(parsed) && parsed.length > 0) setMockRankings(parsed);
        }

        const savedLegal = localStorage.getItem('aprovacao_total_legal_items');
        if (savedLegal) {
          const parsed = JSON.parse(savedLegal);
          if (Array.isArray(parsed) && parsed.length > 0) setLegalItems(parsed);
        }

        const savedUsers = localStorage.getItem('aprovacao_total_users');
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) setUsers(parsed);
        }

        const savedAdmin = localStorage.getItem('aprovacao_total_admin_session');
        if (savedAdmin) {
          const parsed = JSON.parse(savedAdmin);
          if (parsed && typeof parsed === 'object') setAdminSession(parsed);
        }

        const savedPdfs = localStorage.getItem('aprovacao_total_pdfs');
        if (savedPdfs) {
          const parsed = JSON.parse(savedPdfs);
          if (Array.isArray(parsed) && parsed.length > 0) setPdfs(parsed);
        }

        const savedClasses = localStorage.getItem('aprovacao_total_pdf_subject_classes');
        if (savedClasses) {
          const parsed = JSON.parse(savedClasses);
          if (Array.isArray(parsed) && parsed.length > 0) setSubjectClasses(parsed);
        }

        const savedBookmarks = localStorage.getItem('aprovacao_total_student_bookmarked_questions');
        if (savedBookmarks) {
          const parsed = JSON.parse(savedBookmarks);
          if (parsed && typeof parsed === 'object') setStudentBookmarkedQuestions(parsed);
        }

        const savedMistakes = localStorage.getItem('aprovacao_total_student_mistakes');
        if (savedMistakes) {
          const parsed = JSON.parse(savedMistakes);
          if (parsed && typeof parsed === 'object') setStudentMistakes(parsed);
        }

        const savedScratched = localStorage.getItem('aprovacao_total_student_scratched_questions');
        if (savedScratched) {
          const parsed = JSON.parse(savedScratched);
          if (parsed && typeof parsed === 'object') setStudentScratchedQuestions(parsed);
        }
      } catch (err) {
        console.error('Falha ao restaurar dados persistidos no cliente:', err);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Safe localStorage synchronization only after client mount
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_current_tab', currentTab);
    } catch {}
  }, [currentTab, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_admin_sub_tab', adminSubTab);
    } catch {}
  }, [adminSubTab, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      if (currentTarget) {
        localStorage.setItem('aprovacao_total_selected_target', JSON.stringify(currentTarget));
      }
    } catch {}
  }, [currentTarget, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      if (currentStudent) {
        localStorage.setItem('aprovacao_total_current_student', JSON.stringify(currentStudent));
      } else {
        localStorage.removeItem('aprovacao_total_current_student');
      }
    } catch {}
  }, [currentStudent, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_courses_targets', JSON.stringify(targets));
    } catch {}
  }, [targets, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_performances', JSON.stringify(studentPerformances));
    } catch {}
  }, [studentPerformances, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_tasks', JSON.stringify(studentTasks));
    } catch {}
  }, [studentTasks, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_cycles', JSON.stringify(studentCycles));
    } catch {}
  }, [studentCycles, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_syllabi', JSON.stringify(studentSyllabi));
    } catch {}
  }, [studentSyllabi, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_audit_logs', JSON.stringify(studentAuditLogs));
    } catch {}
  }, [studentAuditLogs, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_all_questions', JSON.stringify(questions));
    } catch {}
  }, [questions, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_simulados', JSON.stringify(simulados));
    } catch {}
  }, [simulados, isMounted]);

  const handleRecordRankingEntry = (newEntry: MockExamRankingEntry) => {
    setMockRankings((prev) => {
      const targetId = newEntry.examId || newEntry.mockExamId;
      const filtered = prev.filter(
        (r) => !((r.examId || r.mockExamId) === targetId && r.studentId === newEntry.studentId)
      );
      const updated = [newEntry, ...filtered];
      try {
        localStorage.setItem('aprovacao_total_mock_rankings', JSON.stringify(updated));
      } catch (err) {
        console.error('Erro ao salvar ranking no localStorage:', err);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_legal_items', JSON.stringify(legalItems));
    } catch {}
  }, [legalItems, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_users', JSON.stringify(users));
    } catch (err) {
      console.error('Erro ao sincronizar usuários no localStorage:', err);
    }
  }, [users, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_admin_session', JSON.stringify(adminSession));
    } catch {}
  }, [adminSession, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_pdfs', JSON.stringify(pdfs));
    } catch {}
  }, [pdfs, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_pdf_subject_classes', JSON.stringify(subjectClasses));
    } catch {}
  }, [subjectClasses, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_bookmarked_questions', JSON.stringify(studentBookmarkedQuestions));
    } catch {}
  }, [studentBookmarkedQuestions, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_mistakes', JSON.stringify(studentMistakes));
    } catch {}
  }, [studentMistakes, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('aprovacao_total_student_scratched_questions', JSON.stringify(studentScratchedQuestions));
    } catch {}
  }, [studentScratchedQuestions, isMounted]);

  // Question Handlers - Salva automaticamente no banco de questões permanente (localStorage e state)
  const handleAddQuestion = (newQuestion: ExamQuestion) => {
    setQuestions((prev) => {
      const updated = [newQuestion, ...prev];
      try {
        const customToPersist = updated.filter(
          (q) => q.origin === 'membros' || q.origin === 'ia' || q.id.startsWith('q-mem-')
        );
        localStorage.setItem('aprovacao_total_custom_questions', JSON.stringify(customToPersist));
      } catch (err) {
        console.error('Erro ao salvar questão no banco persistente:', err);
      }
      return updated;
    });

    // Se houver aluno logado, registra na trilha de auditoria do aluno
    if (currentStudent) {
      const auditItem: AuditEntry = {
        id: `aud-qadd-${Date.now()}`,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        action: 'resolucao_questao',
        description: `Nova questão criada e salva automaticamente no banco (${newQuestion.subject})`,
        subject: newQuestion.subject,
        result: 'concluido',
        timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        details: `Questão ${newQuestion.code} adicionada ao acervo permanente da comunidade.`,
      };
      setStudentAuditLogs((prev) => ({
        ...prev,
        [currentStudent.id]: [auditItem, ...(prev[currentStudent.id] || [])],
      }));
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== questionId);
      try {
        const customToPersist = filtered.filter(
          (q) => q.origin === 'membros' || q.origin === 'ia' || q.id.startsWith('q-mem-')
        );
        localStorage.setItem('aprovacao_total_custom_questions', JSON.stringify(customToPersist));
      } catch (err) {
        console.error('Erro ao atualizar banco persistente após exclusão:', err);
      }
      return filtered;
    });
  };

  // Simulado Handlers (Persisted to localStorage)
  const handleUpdateSimulado = (updated: MockExam) => {
    setSimulados((prev) => {
      const updatedList = prev.map((s) => (s.id === updated.id ? updated : s));
      try {
        localStorage.setItem('aprovacao_total_simulados', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Erro ao salvar simulados no localStorage:', err);
      }
      return updatedList;
    });
  };

  const handleDeleteSimulado = (simId: string) => {
    setSimulados((prev) => {
      const updatedList = prev.filter((s) => s.id !== simId);
      try {
        localStorage.setItem('aprovacao_total_simulados', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Erro ao salvar simulados no localStorage:', err);
      }
      return updatedList;
    });
  };

  const handleCreateSimulado = (newSim: MockExam) => {
    if (!isAdminLoggedIn) {
      console.warn('Apenas administradores possuem permissão para criar novos simulados.');
      return;
    }
    setSimulados((prev) => {
      const updatedList = [newSim, ...prev];
      try {
        localStorage.setItem('aprovacao_total_simulados', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Erro ao salvar simulados no localStorage:', err);
      }
      return updatedList;
    });
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
    const target = users.find((u) => u.id === userId);
    if (target && (target.email === 'admin@aprovacaototal.com' || target.email === 'legongamer0306@gmail.com' || target.role === 'admin')) {
      console.warn('Contas com papel de Administrador Master não podem ser excluídas.');
      return;
    }
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

    // Ensure all per-student data stores exist so nothing is lost upon login
    setStudentPerformances((prev) => {
      if (prev[student.id]) return prev;
      return {
        ...prev,
        [student.id]: getInitialStudentPerformance(student.id, student.targetExam || 'Receita Federal'),
      };
    });
    setStudentTasks((prev) => {
      if (prev[student.id]) return prev;
      return {
        ...prev,
        [student.id]: getInitialStudentTasks(student.id, student.targetExam || 'Receita Federal'),
      };
    });
    setStudentCycles((prev) => {
      if (prev[student.id]) return prev;
      return {
        ...prev,
        [student.id]: getInitialStudentCycle(student.id, student.targetExam || 'Receita Federal'),
      };
    });
    setStudentAuditLogs((prev) => {
      if (prev[student.id]) return prev;
      return {
        ...prev,
        [student.id]: getInitialStudentAuditLogs(student.id),
      };
    });
    setStudentSyllabi((prev) => {
      if (prev[student.id]) return prev;
      return {
        ...prev,
        [student.id]: getInitialStudentSyllabi(student.id),
      };
    });

    const studentTarget = (student.targetExam || '').toLowerCase();
    const matching = targets.find((t) => 
      (t.enrolledStudentIds || []).includes(student.id) ||
      (studentTarget && (t.name || '').toLowerCase().includes(studentTarget)) || 
      (studentTarget && (t.code || '').toLowerCase() && studentTarget.includes((t.code || '').toLowerCase()))
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

    const activeCourseId = currentTarget?.id || 'tgt-rfb';
    const zeroPerf = getZeroedPerformanceForCourse(currentTarget);

    // Inicializar métricas exclusivas e estritamente ZERADAS para este novo aluno
    setStudentPerformances((prev) => ({
      ...prev,
      [newStudent.id]: zeroPerf,
      [`${newStudent.id}__${activeCourseId}`]: zeroPerf,
    }));
    // Inicializar cronograma/tarefas isoladas para o novo aluno
    setStudentTasks((prev) => ({
      ...prev,
      [newStudent.id]: getInitialStudentTasks(newStudent.id, newStudent.targetExam),
    }));
    // Inicializar ciclo de estudos isolado para o novo aluno
    setStudentCycles((prev) => ({
      ...prev,
      [newStudent.id]: getInitialStudentCycle(newStudent.id, newStudent.targetExam),
    }));
    // Inicializar trilha de auditoria isolada para o novo aluno
    setStudentAuditLogs((prev) => ({
      ...prev,
      [newStudent.id]: getInitialStudentAuditLogs(newStudent.id),
    }));
    // Inicializar repositório de editais do novo aluno
    setStudentSyllabi((prev) => ({
      ...prev,
      [newStudent.id]: getInitialStudentSyllabi(newStudent.id),
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

  // Course / Exam Target Management Handlers (Persisted to localStorage)
  const saveTargetsToStorage = (updated: ExamTarget[]) => {
    try {
      localStorage.setItem('aprovacao_total_courses_targets', JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao salvar cursos no localStorage:', err);
    }
  };

  const handleCreateCourse = (newCourse: ExamTarget) => {
    setTargets((prev) => {
      const updated = [newCourse, ...prev];
      saveTargetsToStorage(updated);
      return updated;
    });
  };

  const handleUpdateCourse = (updatedCourse: ExamTarget) => {
    setTargets((prev) => {
      const updated = prev.map((t) => (t.id === updatedCourse.id ? updatedCourse : t));
      saveTargetsToStorage(updated);
      return updated;
    });
    if (currentTarget.id === updatedCourse.id) {
      setCurrentTarget(updatedCourse);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setTargets((prev) => {
      const filtered = prev.filter((t) => t.id !== courseId);
      saveTargetsToStorage(filtered);
      if (currentTarget.id === courseId && filtered.length > 0) {
        setCurrentTarget(filtered[0]);
      }
      return filtered;
    });
  };

  const handleToggleCourseEnrollment = (courseId: string) => {
    setTargets((prev) => {
      const updated = prev.map((t) =>
        t.id === courseId
          ? { ...t, isOpenForEnrollment: !(t.isOpenForEnrollment !== false) }
          : t
      );
      saveTargetsToStorage(updated);
      return updated;
    });
  };

  const handleEnrollStudentInCourse = (courseId: string, studentId: string) => {
    setTargets((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== courseId) return t;
        const currentList = t.enrolledStudentIds || [];
        if (currentList.includes(studentId)) return t;
        const newList = [...currentList, studentId];
        return {
          ...t,
          enrolledStudentIds: newList,
          enrolledStudentsCount: (t.enrolledStudentsCount || 0) + 1,
        };
      });
      saveTargetsToStorage(updated);
      return updated;
    });

    // Also update student's targetExam in users state
    setUsers((prev) => {
      const targetCourse = targets.find((t) => t.id === courseId);
      if (!targetCourse) return prev;
      return prev.map((u) =>
        u.id === studentId ? { ...u, targetExam: targetCourse.name } : u
      );
    });

    // Inicializa métricas limpas e zeradas para este aluno neste curso específico
    const targetCourse = targets.find((t) => t.id === courseId);
    setStudentPerformances((prev) => {
      const key = `${studentId}__${courseId}`;
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: getZeroedPerformanceForCourse(targetCourse),
      };
    });
  };

  const handleUnenrollStudentFromCourse = (courseId: string, studentId: string) => {
    setTargets((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== courseId) return t;
        const currentList = t.enrolledStudentIds || [];
        const newList = currentList.filter((id) => id !== studentId);
        return {
          ...t,
          enrolledStudentIds: newList,
          enrolledStudentsCount: Math.max(0, (t.enrolledStudentsCount || 1) - 1),
        };
      });
      saveTargetsToStorage(updated);
      return updated;
    });
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

  // Admin user creation: does NOT log out the administrator or reset admin session!
  const handleAdminCreateUser = (newUser: ManagedUser) => {
    setUsers((prev) => [newUser, ...prev]);
    const activeCourseId = currentTarget?.id || 'tgt-rfb';
    const zeroPerf = getZeroedPerformanceForCourse(currentTarget);

    setStudentPerformances((prev) => ({
      ...prev,
      [newUser.id]: zeroPerf,
      [`${newUser.id}__${activeCourseId}`]: zeroPerf,
    }));
    setStudentTasks((prev) => ({
      ...prev,
      [newUser.id]: getInitialStudentTasks(newUser.id, newUser.targetExam),
    }));
    setStudentCycles((prev) => ({
      ...prev,
      [newUser.id]: getInitialStudentCycle(newUser.id, newUser.targetExam),
    }));
    setStudentAuditLogs((prev) => ({
      ...prev,
      [newUser.id]: getInitialStudentAuditLogs(newUser.id),
    }));
    setStudentSyllabi((prev) => ({
      ...prev,
      [newUser.id]: getInitialStudentSyllabi(newUser.id),
    }));
  };

  // PDF Handlers

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

  // Target handlers: Add & Delete (Persisted in localStorage)
  const handleAddTarget = (newTarget: ExamTarget) => {
    setTargets((prev) => {
      const updated = [newTarget, ...prev];
      saveTargetsToStorage(updated);
      return updated;
    });
    setCurrentTarget(newTarget);
  };

  const handleDeleteTarget = (targetId: string) => {
    setTargets((prev) => {
      const filtered = prev.filter((t) => t.id !== targetId);
      saveTargetsToStorage(filtered);
      if (currentTarget.id === targetId && filtered.length > 0) {
        setCurrentTarget(filtered[0]);
      }
      return filtered;
    });
  };

  // Identificador do perfil ativo para isolamento total
  const activeStudentId = currentStudent?.id || 'usr-1';

  // 1. Isolamento do Edital Colado: Cada perfil possui seu próprio mapeamento de editais colados
  const activeSyllabus = currentStudent
    ? (studentSyllabi[currentStudent.id]?.[currentTarget.id] || currentTarget.syllabus)
    : (studentSyllabi['usr-1']?.[currentTarget.id] || currentTarget.syllabus);

  const targetWithStudentSyllabus: ExamTarget = {
    ...currentTarget,
    name: currentTarget?.name || 'Curso Preparatório Oficial',
    code: currentTarget?.code || 'CURSO',
    agency: currentTarget?.agency || 'Comissão Oficial',
    role: currentTarget?.role || 'Cargo',
    category: currentTarget?.category || 'Carreiras Gerais',
    syllabus: activeSyllabus
      ? {
          ...activeSyllabus,
          subjects: Array.isArray(activeSyllabus.subjects) ? activeSyllabus.subjects : [],
        }
      : currentTarget?.syllabus
      ? {
          ...currentTarget.syllabus,
          subjects: Array.isArray(currentTarget.syllabus.subjects) ? currentTarget.syllabus.subjects : [],
        }
      : undefined,
  };

  // Syllabus handler: Salva edital colado vinculado exclusivamente ao perfil ativo
  const handleSaveSyllabus = (targetId: string, syllabus: CustomSyllabus) => {
    setStudentSyllabi((prev) => ({
      ...prev,
      [activeStudentId]: {
        ...(prev[activeStudentId] || {}),
        [targetId]: syllabus,
      },
    }));

    // Atualiza também no target local para renderização reativa
    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, syllabus } : t))
    );
    if (currentTarget.id === targetId) {
      setCurrentTarget((prev) => ({ ...prev, syllabus }));
    }

    // Registra evento na trilha de auditoria do perfil do aluno
    if (currentStudent) {
      const auditItem: AuditEntry = {
        id: `aud-syl-${Date.now()}`,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        action: 'edital_colado',
        description: `Edital verticalizado colado e vinculado exclusivamente ao perfil (${syllabus.title})`,
        subject: 'Edital Verticalizado',
        result: 'concluido',
        timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        details: `${syllabus.subjects.length} disciplinas mapeadas com tópicos e pesos estratégicos.`,
      };
      setStudentAuditLogs((prev) => ({
        ...prev,
        [currentStudent.id]: [auditItem, ...(prev[currentStudent.id] || [])],
      }));
    }
  };

  // 2. Isolamento de Tarefas / Cronograma: cada aluno tem seu cronograma diário
  const activeTasks = currentStudent
    ? (studentTasks[currentStudent.id] || getInitialStudentTasks(currentStudent.id, currentStudent.targetExam))
    : (studentTasks['usr-1'] || MOCK_DAILY_TASKS);

  const handleToggleTask = (taskId: string) => {
    setStudentTasks((prev) => {
      const list = prev[activeStudentId] || activeTasks;
      const updated = list.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      return { ...prev, [activeStudentId]: updated };
    });
  };

  const handleUpdateTasks = (newTasks: DailyTask[]) => {
    setStudentTasks((prev) => ({
      ...prev,
      [activeStudentId]: newTasks,
    }));
  };

  // 3. Isolamento de Ciclo de Estudos: cada aluno tem seu ciclo semanal
  const activeCycle = currentStudent
    ? (studentCycles[currentStudent.id] || getInitialStudentCycle(currentStudent.id, currentStudent.targetExam))
    : (studentCycles['usr-1'] || getInitialStudentCycle('usr-1', 'RFB 2026'));

  const handleUpdateCycleDays = (newDays: CycleDay[]) => {
    setStudentCycles((prev) => ({
      ...prev,
      [activeStudentId]: newDays,
    }));
    if (currentStudent) {
      const auditItem: AuditEntry = {
        id: `aud-cycle-${Date.now()}`,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        action: 'ciclo_ajustado',
        description: 'Ciclo semanal de estudos reconfigurado pelo aluno',
        subject: 'Ciclo de Estudos',
        result: 'concluido',
        timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setStudentAuditLogs((prev) => ({
        ...prev,
        [currentStudent.id]: [auditItem, ...(prev[currentStudent.id] || [])],
      }));
    }
  };

  // 4. Isolamento de Auditoria e Histórico
  const activeAuditLogs = currentStudent
    ? (studentAuditLogs[currentStudent.id] || getInitialStudentAuditLogs(currentStudent.id))
    : (studentAuditLogs['usr-1'] || []);

  // Isolamento de Questões Marcadas, Riscadas e Caderno de Erros por Aluno
  const activeBookmarkedQuestionIds = studentBookmarkedQuestions[activeStudentId] || [];
  const activeScratchedQuestionIds = studentScratchedQuestions[activeStudentId] || [];
  const activeMistakesMap = studentMistakes[activeStudentId] || {};
  const activeBookmarkedCount = activeBookmarkedQuestionIds.length;
  const activeScratchedCount = activeScratchedQuestionIds.length;
  const activeMistakesCount = Object.keys(activeMistakesMap).length;

  const handleToggleBookmark = (questionId: string) => {
    const studentId = currentStudent?.id || 'usr-1';
    setStudentBookmarkedQuestions((prev) => {
      const currentList = prev[studentId] || [];
      const exists = currentList.includes(questionId);
      const updatedList = exists
        ? currentList.filter((id) => id !== questionId)
        : [...currentList, questionId];
      return { ...prev, [studentId]: updatedList };
    });
  };

  const handleToggleScratchQuestion = (questionId: string) => {
    const studentId = currentStudent?.id || 'usr-1';
    setStudentScratchedQuestions((prev) => {
      const currentList = prev[studentId] || [];
      const exists = currentList.includes(questionId);
      const updatedList = exists
        ? currentList.filter((id) => id !== questionId)
        : [...currentList, questionId];
      return { ...prev, [studentId]: updatedList };
    });
  };

  const handleRecordMistake = (questionId: string) => {
    const studentId = currentStudent?.id || 'usr-1';
    const nowStr = 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setStudentMistakes((prev) => {
      const studentDict = prev[studentId] || {};
      const currentItem = studentDict[questionId];
      const newCount = (currentItem?.count || 0) + 1;
      return {
        ...prev,
        [studentId]: {
          ...studentDict,
          [questionId]: { count: newCount, lastMissedAt: nowStr },
        },
      };
    });
  };

  const handleRemoveMistake = (questionId: string) => {
    const studentId = currentStudent?.id || 'usr-1';
    setStudentMistakes((prev) => {
      const studentDict = { ...(prev[studentId] || {}) };
      delete studentDict[questionId];
      return { ...prev, [studentId]: studentDict };
    });
  };

  const handleNavigateToQuestions = (
    subjectFilter?: string, 
    mode?: 'all' | 'oficial' | 'membros' | 'marcadas' | 'erros'
  ) => {
    setSubjectFilterForQuestions(subjectFilter);
    setQuestionFilterMode(mode || 'all');
    setCurrentTab('questoes');
  };

  // Session checks: student vs admin isolation
  const isStudentLoggedIn = Boolean(currentStudent && currentStudent.status === 'ativo');
  const isAdminLoggedIn = Boolean(adminSession.isAuthenticated);
  const isUserLoggedIn = Boolean(isStudentLoggedIn || isAdminLoggedIn);
  const pendingApprovalsCount = users.filter((u) => u.status === 'pendente_aprovacao').length;

  // Isolamento de Métricas por Aluno e por Curso:
  // Um aluno novo (ou matrícula nova num curso) começa com indicadores estritamente em zero.
  const activeCourseId = currentTarget?.id || 'tgt-rfb';
  const studentCoursePerfKey = `${activeStudentId}__${activeCourseId}`;

  const activePerformances = currentStudent
    ? (studentPerformances[studentCoursePerfKey] ||
       (activeCourseId === 'tgt-rfb' ? studentPerformances[currentStudent.id] : undefined) ||
       getInitialStudentPerformance(currentStudent.id, currentTarget?.name, activeCourseId))
    : (studentPerformances[`usr-1__${activeCourseId}`] ||
       (activeCourseId === 'tgt-rfb' ? MOCK_SUBJECT_PERFORMANCES : getZeroedPerformanceForCourse(currentTarget)));

  // Isolamento de PDFs: Alunos visualizam exclusivamente os seus próprios PDFs (um não vê o material do outro)
  const activePdfs = isAdminLoggedIn 
    ? pdfs 
    : currentStudent 
      ? pdfs.filter((p) => p.studentId === currentStudent.id) 
      : [];

  // SSR Hydration Shield: server and initial client render return the exact same loading screen
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black text-xl shadow-md ring-1 ring-black/10 animate-pulse">
            AT
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Carregando plataforma Aprovação Total...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Persistent Sidebar - only released after logged in */}
      {isUserLoggedIn && (
        <div className="hidden md:block h-full">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'questoes') {
                setSubjectFilterForQuestions(undefined);
                setQuestionFilterMode('all');
              }
            }}
            onNavigateToQuestions={handleNavigateToQuestions}
            bookmarkedQuestionsCount={activeBookmarkedCount}
            mistakesCount={activeMistakesCount}
            activeQuestionMode={questionFilterMode}
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
                if (tab !== 'questoes') {
                  setSubjectFilterForQuestions(undefined);
                  setQuestionFilterMode('all');
                }
                setIsMobileSidebarOpen(false);
              }}
              onNavigateToQuestions={handleNavigateToQuestions}
              bookmarkedQuestionsCount={activeBookmarkedCount}
              mistakesCount={activeMistakesCount}
              activeQuestionMode={questionFilterMode}
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
                onCreateUser={handleAdminCreateUser}
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
                    currentTarget={targetWithStudentSyllabus}
                    tasks={activeTasks}
                    onToggleTask={handleToggleTask}
                    performances={activePerformances}
                    onNavigateToQuestions={handleNavigateToQuestions}
                    onNavigateToSimulados={() => setCurrentTab('simulados')}
                    onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
                  />
                )}

                {currentTab === 'questoes' && (
                  <QuestionBankView
                    questions={questions}
                    initialSubjectFilter={subjectFilterForQuestions}
                    initialMode={questionFilterMode}
                    bookmarkedQuestionIds={activeBookmarkedQuestionIds}
                    scratchedQuestionIds={activeScratchedQuestionIds}
                    onToggleScratchQuestion={handleToggleScratchQuestion}
                    mistakesMap={activeMistakesMap}
                    onBookmarkToggle={handleToggleBookmark}
                    onRemoveMistake={handleRemoveMistake}
                    onRecordAnswer={(questionId, isCorrect) => {
                      if (!isCorrect) {
                        handleRecordMistake(questionId);
                      }
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

                      // Registrar na trilha cronológica de auditoria do aluno
                      const auditEntry: AuditEntry = {
                        id: `aud-ans-${Date.now()}`,
                        studentId: currentStudent.id,
                        studentName: currentStudent.name,
                        action: 'resolucao_questao',
                        description: `${isCorrect ? 'Acerto' : 'Erro'} em questão de ${subjectName} (${targetQ?.code || 'Q-Treino'})`,
                        subject: subjectName,
                        result: isCorrect ? 'correto' : 'incorreto',
                        timestamp: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        details: `Banca: ${targetQ?.board || 'FGV'} • Dificuldade: ${targetQ?.difficulty || 'Média'}.`,
                      };
                      setStudentAuditLogs((prev) => ({
                        ...prev,
                        [currentStudent.id]: [auditEntry, ...(prev[currentStudent.id] || [])],
                      }));

                      // Atualizar métricas isoladas por matéria do aluno logado e por curso (um não afeta o outro)
                      const courseId = currentTarget?.id || 'tgt-rfb';
                      const compositeKey = `${currentStudent.id}__${courseId}`;

                      setStudentPerformances((prev) => {
                        const studentId = currentStudent.id;
                        const list = prev[compositeKey] || prev[studentId] || getInitialStudentPerformance(studentId, currentTarget?.name, courseId);
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

                        return { 
                          ...prev, 
                          [compositeKey]: updatedList,
                          [studentId]: updatedList 
                        };
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
                    isAdmin={isAdminLoggedIn}
                    onUpdateSimulado={handleUpdateSimulado}
                    allQuestions={questions}
                    rankings={mockRankings}
                    currentStudent={currentStudent}
                  />
                )}

                {currentTab === 'mapas' && (
                  <MapasMentaisView
                    onNavigateToQuestions={handleNavigateToQuestions}
                  />
                )}

                {currentTab === 'cronograma' && (
                  <StudyScheduleView
                    tasks={activeTasks}
                    onToggleTask={handleToggleTask}
                    currentTarget={targetWithStudentSyllabus}
                    onOpenPasteEdital={() => setIsPasteEditalOpen(true)}
                    onUpdateTasks={handleUpdateTasks}
                    cycleDays={activeCycle}
                    onUpdateCycleDays={handleUpdateCycleDays}
                    currentStudent={currentStudent}
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
                    currentStudent={currentStudent}
                    auditLogs={activeAuditLogs}
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
              onClick={() => setCurrentTab('simulados')}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
                currentTab === 'simulados' ? 'text-[#2563EB]' : 'text-[#64748B]'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Simulados</span>
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
          currentStudent={currentStudent}
          rankings={mockRankings}
          scratchedQuestionIds={activeScratchedQuestionIds}
          onToggleScratchQuestion={handleToggleScratchQuestion}
          onRecordRankingEntry={handleRecordRankingEntry}
          onRecordMistake={handleRecordMistake}
          onFinishExam={(examId, score, correctCount, timeSpentSec) => {
            setSimulados((prev) => {
              const updated = prev.map((s) =>
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
              );
              try {
                localStorage.setItem('aprovacao_total_simulados', JSON.stringify(updated));
              } catch (e) {
                console.error('Erro ao persistir simulados:', e);
              }
              return updated;
            });
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
        currentTarget={targetWithStudentSyllabus}
        onSaveSyllabus={handleSaveSyllabus}
        currentStudent={currentStudent}
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
        onNavigateToQuestions={handleNavigateToQuestions}
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
