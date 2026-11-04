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
  MOCK_SIMULADO_RANKINGS
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

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    try {
      const saved = localStorage.getItem('aprovacao_total_current_tab');
      if (saved) return saved as NavigationTab;
    } catch {}
    return 'dashboard';
  });

  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes'>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    try {
      const saved = localStorage.getItem('aprovacao_total_admin_sub_tab');
      if (saved) return saved as 'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes';
    } catch {}
    return 'dashboard';
  });

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [targets, setTargets] = useState<ExamTarget[]>(() => {
    if (typeof window === 'undefined') return TARGET_EXAMS;
    try {
      const saved = localStorage.getItem('aprovacao_total_courses_targets');
      if (saved) {
        const parsed: ExamTarget[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Falha ao restaurar cursos persistidos:', err);
    }
    return TARGET_EXAMS;
  });
  const [currentTarget, setCurrentTarget] = useState<ExamTarget>(() => {
    if (typeof window === 'undefined') return TARGET_EXAMS[0];
    try {
      const savedSelected = localStorage.getItem('aprovacao_total_selected_target');
      if (savedSelected) {
        const parsedTarget: ExamTarget = JSON.parse(savedSelected);
        if (parsedTarget && parsedTarget.id) return parsedTarget;
      }
      const saved = localStorage.getItem('aprovacao_total_courses_targets');
      if (saved) {
        const parsed: ExamTarget[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch {
      // fallback
    }
    return TARGET_EXAMS[0];
  });
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isPasteEditalOpen, setIsPasteEditalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isStudentAreaOpen, setIsStudentAreaOpen] = useState(false);

  // Question bank state (persisted automatically to localStorage)
  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    if (typeof window === 'undefined') return MOCK_QUESTIONS;
    try {
      const allSaved = localStorage.getItem('aprovacao_total_all_questions');
      if (allSaved) {
        const parsedAll: ExamQuestion[] = JSON.parse(allSaved);
        if (Array.isArray(parsedAll) && parsedAll.length > 0) {
          return parsedAll;
        }
      }
      const saved = localStorage.getItem('aprovacao_total_custom_questions');
      if (saved) {
        const parsed: ExamQuestion[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(MOCK_QUESTIONS.map((q) => q.id));
          const newOnes = parsed.filter((q) => !existingIds.has(q.id));
          return [...newOnes, ...MOCK_QUESTIONS];
        }
      }
    } catch (err) {
      console.error('Falha ao restaurar questões persistidas:', err);
    }
    return MOCK_QUESTIONS;
  });
  const [subjectFilterForQuestions, setSubjectFilterForQuestions] = useState<string | undefined>(undefined);
  const [streakDays, setStreakDays] = useState(18);
  const [searchQuery, setSearchQuery] = useState('');

  // Student Session State (Active logged-in student - Persisted to prevent session resets)
  const [currentStudent, setCurrentStudent] = useState<ManagedUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('aprovacao_total_current_student');
      if (saved) {
        const parsed: ManagedUser = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (err) {
      console.error('Falha ao restaurar aluno logado:', err);
    }
    return null;
  });

  // 1. Isolamento de Métricas por Aluno (Persisted)
  const [studentPerformances, setStudentPerformances] = useState<Record<string, SubjectPerformance[]>>(() => {
    if (typeof window === 'undefined') return STUDENT_PERFORMANCES_MAP;
    try {
      const saved = localStorage.getItem('aprovacao_total_student_performances');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return STUDENT_PERFORMANCES_MAP;
  });

  // 2. Isolamento de Tarefas / Cronograma por Aluno (Persisted)
  const [studentTasks, setStudentTasks] = useState<Record<string, DailyTask[]>>(() => {
    if (typeof window === 'undefined') return STUDENT_TASKS_MAP;
    try {
      const saved = localStorage.getItem('aprovacao_total_student_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return STUDENT_TASKS_MAP;
  });

  // 3. Isolamento de Ciclo de Estudos por Aluno (Persisted)
  const [studentCycles, setStudentCycles] = useState<Record<string, CycleDay[]>>(() => {
    if (typeof window === 'undefined') return STUDENT_CYCLES_MAP;
    try {
      const saved = localStorage.getItem('aprovacao_total_student_cycles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return STUDENT_CYCLES_MAP;
  });

  // 4. Isolamento de Editais Colados e Verticalizados por Aluno (Persisted)
  const [studentSyllabi, setStudentSyllabi] = useState<Record<string, Record<string, CustomSyllabus>>>(() => {
    if (typeof window === 'undefined') return STUDENT_SYLLABI_MAP;
    try {
      const saved = localStorage.getItem('aprovacao_total_student_syllabi');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return STUDENT_SYLLABI_MAP;
  });

  // 5. Isolamento de Histórico de Auditoria por Aluno (Persisted)
  const [studentAuditLogs, setStudentAuditLogs] = useState<Record<string, AuditEntry[]>>(() => {
    if (typeof window === 'undefined') return STUDENT_AUDIT_LOGS_MAP;
    try {
      const saved = localStorage.getItem('aprovacao_total_student_audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return STUDENT_AUDIT_LOGS_MAP;
  });

  // Auto-sync persistent states across page refresh
  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_current_tab', currentTab);
    } catch {}
  }, [currentTab]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_admin_sub_tab', adminSubTab);
    } catch {}
  }, [adminSubTab]);

  useEffect(() => {
    try {
      if (currentTarget) {
        localStorage.setItem('aprovacao_total_selected_target', JSON.stringify(currentTarget));
      }
    } catch {}
  }, [currentTarget]);

  useEffect(() => {
    try {
      if (currentStudent) {
        localStorage.setItem('aprovacao_total_current_student', JSON.stringify(currentStudent));
      } else {
        localStorage.removeItem('aprovacao_total_current_student');
      }
    } catch {}
  }, [currentStudent]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_student_performances', JSON.stringify(studentPerformances));
    } catch {}
  }, [studentPerformances]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_student_tasks', JSON.stringify(studentTasks));
    } catch {}
  }, [studentTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_student_cycles', JSON.stringify(studentCycles));
    } catch {}
  }, [studentCycles]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_student_syllabi', JSON.stringify(studentSyllabi));
    } catch {}
  }, [studentSyllabi]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_student_audit_logs', JSON.stringify(studentAuditLogs));
    } catch {}
  }, [studentAuditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_all_questions', JSON.stringify(questions));
    } catch {}
  }, [questions]);

  // Simulados State & Active Exam (Persisted automatically to localStorage)
  const [simulados, setSimulados] = useState<MockExam[]>(() => {
    if (typeof window === 'undefined') return MOCK_SIMULADOS;
    try {
      const saved = localStorage.getItem('aprovacao_total_simulados');
      if (saved) {
        const parsed: MockExam[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Falha ao restaurar simulados persistidos:', err);
    }
    return MOCK_SIMULADOS;
  });
  const [activeRunningExam, setActiveRunningExam] = useState<MockExam | null>(null);

  // Ranking de Simulados (Persisted automatically to localStorage)
  const [mockRankings, setMockRankings] = useState<MockExamRankingEntry[]>(() => {
    if (typeof window === 'undefined') return MOCK_SIMULADO_RANKINGS;
    try {
      const saved = localStorage.getItem('aprovacao_total_mock_rankings');
      if (saved) {
        const parsed: MockExamRankingEntry[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Falha ao restaurar rankings persistidos:', err);
    }
    return MOCK_SIMULADO_RANKINGS;
  });

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

  // Legal Items State (Súmulas, Lei Seca, CNJ, Repercussão Geral - Persistido)
  const [legalItems, setLegalItems] = useState<LegalItem[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_LEGAL_ITEMS_DATA;
    try {
      const saved = localStorage.getItem('aprovacao_total_legal_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_LEGAL_ITEMS_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_legal_items', JSON.stringify(legalItems));
    } catch {}
  }, [legalItems]);

  // Users State (Alunos, Permissões, Restrições - Persistido automaticamente)
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    if (typeof window === 'undefined') return MOCK_MANAGED_USERS;
    try {
      const saved = localStorage.getItem('aprovacao_total_users');
      if (saved) {
        const parsed: ManagedUser[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Falha ao restaurar usuários persistidos:', err);
    }
    return MOCK_MANAGED_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_users', JSON.stringify(users));
    } catch (err) {
      console.error('Erro ao sincronizar usuários no localStorage:', err);
    }
  }, [users]);

  // Admin Session State (Persisted)
  const [adminSession, setAdminSession] = useState<AdminSession>(() => {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, adminEmail: '', adminName: '', role: 'super_admin' };
    }
    try {
      const saved = localStorage.getItem('aprovacao_total_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return { isAuthenticated: false, adminEmail: '', adminName: '', role: 'super_admin' };
  });

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_admin_session', JSON.stringify(adminSession));
    } catch {}
  }, [adminSession]);

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
    // Inicializar métricas exclusivas e isoladas para este novo aluno
    setStudentPerformances((prev) => ({
      ...prev,
      [newStudent.id]: getInitialStudentPerformance(newStudent.id, newStudent.targetExam),
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
    setStudentPerformances((prev) => ({
      ...prev,
      [newUser.id]: getInitialStudentPerformance(newUser.id, newUser.targetExam),
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

  // PDF Management State (Persisted in localStorage)
  const [pdfs, setPdfs] = useState<StudyPDF[]>(() => {
    if (typeof window === 'undefined') return MOCK_PDFS;
    try {
      const saved = localStorage.getItem('aprovacao_total_pdfs');
      if (saved) {
        const parsed: StudyPDF[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return MOCK_PDFS;
  });

  const [subjectClasses, setSubjectClasses] = useState<string[]>(() => {
    if (typeof window === 'undefined') return PDF_SUBJECT_CLASSES;
    try {
      const saved = localStorage.getItem('aprovacao_total_pdf_subject_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return PDF_SUBJECT_CLASSES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_pdfs', JSON.stringify(pdfs));
    } catch {}
  }, [pdfs]);

  useEffect(() => {
    try {
      localStorage.setItem('aprovacao_total_pdf_subject_classes', JSON.stringify(subjectClasses));
    } catch {}
  }, [subjectClasses]);

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

  const handleNavigateToQuestions = (subjectFilter?: string) => {
    setSubjectFilterForQuestions(subjectFilter);
    setCurrentTab('questoes');
  };

  // Session checks: student vs admin isolation
  const isStudentLoggedIn = Boolean(currentStudent && currentStudent.status === 'ativo');
  const isAdminLoggedIn = Boolean(adminSession.isAuthenticated);
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
          onRecordRankingEntry={handleRecordRankingEntry}
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
