'use client';

import React, { useState, useRef } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  UserCheck,
  Users,
  Timer,
  Scale,
  BookOpenCheck,
  Trash2,
  Edit3,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  LogOut,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Activity,
  History,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  AlertOctagon,
  RefreshCw,
  Ban,
  Camera,
  Upload,
  UserPlus,
  Image as ImageIcon,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { 
  MockExam, 
  LegalItem, 
  LegalCategory, 
  ExamQuestion, 
  ManagedUser, 
  AdminSession,
  ExamTarget 
} from '@/lib/types';
import { PRESET_STUDENT_AVATARS } from '@/lib/mockData';
import { verifyAdminPassword } from '@/lib/authConfig';
import { StudentPhotoCapture } from './StudentPhotoCapture';
import { StudentCardBadge } from './StudentCardBadge';
import { SimuladoQuestionsEditorModal } from './SimuladoQuestionsEditorModal';

interface AdminPortalViewProps {
  // Data
  simulados: MockExam[];
  legalItems: LegalItem[];
  questions: ExamQuestion[];
  users: ManagedUser[];
  adminSession: AdminSession;
  courses?: ExamTarget[];

  // Actions
  onLoginAdmin: (email: string, name: string, role: 'super_admin' | 'gestor_conteudo') => void;
  onLogoutAdmin: () => void;
  onNavigateToStudentView?: () => void;

  // Course actions
  onCreateCourse?: (newCourse: ExamTarget) => void;
  onUpdateCourse?: (updated: ExamTarget) => void;
  onDeleteCourse?: (courseId: string) => void;
  onToggleCourseEnrollment?: (courseId: string) => void;
  onEnrollStudentInCourse?: (courseId: string, studentId: string) => void;
  onUnenrollStudentFromCourse?: (courseId: string, studentId: string) => void;

  // Simulado actions
  onUpdateSimulado: (updated: MockExam) => void;
  onDeleteSimulado: (simuladoId: string) => void;
  onCreateSimulado: (newSim: MockExam) => void;

  // Legal Items actions
  onUpdateLegalItem: (updated: LegalItem) => void;
  onDeleteLegalItem: (itemId: string) => void;
  onCreateLegalItem: (newItem: LegalItem) => void;

  // Users actions
  onDeleteUser: (userId: string) => void;
  onToggleRestrictUser: (userId: string, isRestricted: boolean, reason?: string) => void;
  onCreateUser?: (newUser: ManagedUser) => void;
  onUpdateUser?: (updated: ManagedUser) => void;
  onApproveUser?: (userId: string) => void;
  onRejectUser?: (userId: string, reason?: string) => void;

  // Questions actions
  onDeleteQuestion: (questionId: string) => void;
  onAddQuestion?: (question: ExamQuestion) => void;

  // External Navigation Sync
  initialAdminSubTab?: 'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes';
  onAdminSubTabChange?: (tab: 'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes') => void;
}

export function AdminPortalView({
  simulados,
  legalItems,
  questions,
  users,
  adminSession,
  courses = [],
  onLoginAdmin,
  onLogoutAdmin,
  onNavigateToStudentView,
  onCreateCourse,
  onUpdateCourse,
  onDeleteCourse,
  onToggleCourseEnrollment,
  onEnrollStudentInCourse,
  onUnenrollStudentFromCourse,
  onUpdateSimulado,
  onDeleteSimulado,
  onCreateSimulado,
  onUpdateLegalItem,
  onDeleteLegalItem,
  onCreateLegalItem,
  onDeleteUser,
  onToggleRestrictUser,
  onCreateUser,
  onUpdateUser,
  onApproveUser,
  onRejectUser,
  onDeleteQuestion,
  onAddQuestion,
  initialAdminSubTab,
  onAdminSubTabChange,
}: AdminPortalViewProps) {
  // Admin Internal Navigation (controlled by initialAdminSubTab if provided, fallback to internal state)
  const [internalAdminTab, setInternalAdminTab] = useState<'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes'>('dashboard');
  const activeAdminTab = initialAdminSubTab ?? internalAdminTab;

  const setActiveAdminTab = (tab: 'dashboard' | 'cursos' | 'simulados' | 'sumulas' | 'usuarios' | 'questoes') => {
    setInternalAdminTab(tab);
    onAdminSubTabChange?.(tab);
  };

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('admin@aprovacaototal.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Hidden Credentials Vault Security State (Only revealed after entering administrator password)
  const [isCredentialsRevealed, setIsCredentialsRevealed] = useState(false);
  const [vaultPasswordInput, setVaultPasswordInput] = useState('');
  const [vaultError, setVaultError] = useState('');
  const [vaultSuccess, setVaultSuccess] = useState('');

  // Toast / Feedback State
  const [adminToast, setAdminToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => setAdminToast(null), 4000);
  };

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; time: string; text: string; type: 'delete' | 'edit' | 'security' | 'create' }>>([
    { id: '1', time: '10:40', text: 'Auditoria de integridade do Banco de Questões executada.', type: 'security' },
    { id: '2', time: '10:15', text: 'Simulado Nacional RFB 2026 atualizado com nova nota de corte (82%).', type: 'edit' },
  ]);

  const addLog = (text: string, type: 'delete' | 'edit' | 'security' | 'create') => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setActivityLogs((prev) => [{ id: String(Date.now()), time, text, type }, ...prev.slice(0, 19)]);
  };

  // ==========================================
  // MODALS & EDIT STATES
  // ==========================================
  
  // 1. Simulado Modals
  const [editingSimulado, setEditingSimulado] = useState<MockExam | null>(null);
  const [editingSimuladoQuestions, setEditingSimuladoQuestions] = useState<MockExam | null>(null);
  const [isNewSimuladoModalOpen, setIsNewSimuladoModalOpen] = useState(false);
  const [simuladoDeleteConfirmId, setSimuladoDeleteConfirmId] = useState<string | null>(null);
  const [simSearch, setSimSearch] = useState('');

  // Form states for Simulado
  const [simTitle, setSimTitle] = useState('');
  const [simCode, setSimCode] = useState('');
  const [simAgency, setSimAgency] = useState('');
  const [simBoard, setSimBoard] = useState('');
  const [simQuestionsCount, setSimQuestionsCount] = useState(60);
  const [simDuration, setSimDuration] = useState(180);
  const [simCutoff, setSimCutoff] = useState(80);
  const [simDifficulty, setSimDifficulty] = useState<'Média' | 'Difícil' | 'Padrão Oficial'>('Padrão Oficial');
  const [simStatus, setSimStatus] = useState<'disponivel' | 'em_andamento' | 'concluido'>('disponivel');

  // 2. Legal Items Modals
  const [editingLegalItem, setEditingLegalItem] = useState<LegalItem | null>(null);
  const [isNewLegalItemModalOpen, setIsNewLegalItemModalOpen] = useState(false);
  const [legalDeleteConfirmId, setLegalDeleteConfirmId] = useState<string | null>(null);
  const [legalSearch, setLegalSearch] = useState('');
  const [legalCategoryFilter, setLegalCategoryFilter] = useState<string>('all');

  // Form states for Legal Item
  const [legCategory, setLegCategory] = useState<LegalCategory>('Súmula Vinculante');
  const [legTitle, setLegTitle] = useState('');
  const [legSource, setLegSource] = useState('Supremo Tribunal Federal');
  const [legSubject, setLegSubject] = useState('Direito Constitucional');
  const [legArticle, setLegArticle] = useState('');
  const [legStatement, setLegStatement] = useState('');
  const [legPracticalContext, setLegPracticalContext] = useState('');
  const [legRelevance, setLegRelevance] = useState<'Alta Incidência' | 'Tema Quente' | 'Essencial' | 'Inédito'>('Alta Incidência');

  // 3. User Modals & Creation
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [userViewMode, setUserViewMode] = useState<'tabela_emails' | 'cards'>('tabela_emails');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);
  const [userToRestrict, setUserToRestrict] = useState<ManagedUser | null>(null);
  const [restrictionReason, setRestrictionReason] = useState('Violação das diretrizes de acesso e compartilhamento simultâneo.');

  const handleCopyEmail = (email: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2500);
    }
  };
  
  // Registration of new user by admin
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123456');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'aluno' | 'aluno_premium'>('aluno_premium');
  const [newUserTarget, setNewUserTarget] = useState('OAB 43º Exame Unificado');
  const [newUserAvatar, setNewUserAvatar] = useState('https://picsum.photos/seed/student-lucas/240/240');
  const [newUserDocPhoto, setNewUserDocPhoto] = useState('');
  const [showAdminDocUpload, setShowAdminDocUpload] = useState(false);
  const [userToViewDossier, setUserToViewDossier] = useState<ManagedUser | null>(null);
  const [isEditingDossierPhoto, setIsEditingDossierPhoto] = useState(false);

  // 4. Question Modals
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState<string>('all');
  const [questionToDelete, setQuestionToDelete] = useState<ExamQuestion | null>(null);
  const [questionToView, setQuestionToView] = useState<ExamQuestion | null>(null);

  // 5. Course Modals & Form States
  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('all');
  const [editingCourse, setEditingCourse] = useState<ExamTarget | null>(null);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState<string | null>(null);
  const [courseToViewStudents, setCourseToViewStudents] = useState<ExamTarget | null>(null);
  const [studentToEnrollId, setStudentToEnrollId] = useState<string>('');

  // Course Form Fields
  const [crsName, setCrsName] = useState('');
  const [crsCode, setCrsCode] = useState('');
  const [crsAgency, setCrsAgency] = useState('');
  const [crsRole, setCrsRole] = useState('');
  const [crsCategory, setCrsCategory] = useState<'Carreira Jurídica' | 'Fiscal & Controle' | 'Policial' | 'Tribunais' | 'Carreiras Gerais'>('Fiscal & Controle');
  const [crsSeats, setCrsSeats] = useState(100);
  const [crsSalary, setCrsSalary] = useState('');
  const [crsExamDate, setCrsExamDate] = useState('');
  const [crsDaysRemaining, setCrsDaysRemaining] = useState(60);
  const [crsWorkload, setCrsWorkload] = useState(360);
  const [crsInstructor, setCrsInstructor] = useState('');
  const [crsIsOpen, setCrsIsOpen] = useState(true);
  const [crsDescription, setCrsDescription] = useState('');

  const handleOpenNewCourseModal = () => {
    setEditingCourse(null);
    setCrsName('');
    setCrsCode(`CUR-${Math.floor(100 + Math.random() * 900)}`);
    setCrsAgency('');
    setCrsRole('');
    setCrsCategory('Fiscal & Controle');
    setCrsSeats(100);
    setCrsSalary('R$ 18.500,00');
    setCrsExamDate('A definir');
    setCrsDaysRemaining(60);
    setCrsWorkload(360);
    setCrsInstructor('Coordenação Pedagógica');
    setCrsIsOpen(true);
    setCrsDescription('');
    setIsNewCourseModalOpen(true);
  };

  const handleOpenEditCourseModal = (course: ExamTarget) => {
    setEditingCourse(course);
    setCrsName(course.name);
    setCrsCode(course.code);
    setCrsAgency(course.agency);
    setCrsRole(course.role);
    setCrsCategory(course.category || 'Fiscal & Controle');
    setCrsSeats(course.totalSeats || 0);
    setCrsSalary(course.salary || '');
    setCrsExamDate(course.examDate || '');
    setCrsDaysRemaining(course.daysRemaining || 60);
    setCrsWorkload(course.workloadHours || 360);
    setCrsInstructor(course.instructor || '');
    setCrsIsOpen(course.isOpenForEnrollment !== false);
    setCrsDescription(course.description || '');
    setIsNewCourseModalOpen(true);
  };

  const handleSaveCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crsName.trim() || !crsRole.trim()) {
      showToast('Por favor, informe o nome do curso e o cargo pretendido.', 'danger');
      return;
    }

    if (editingCourse) {
      const updated: ExamTarget = {
        ...editingCourse,
        name: crsName.trim(),
        code: crsCode.trim() || editingCourse.code || `CUR-${Date.now().toString().slice(-4)}`,
        agency: crsAgency.trim() || editingCourse.agency || 'Comissão Oficial',
        role: crsRole.trim(),
        category: crsCategory || editingCourse.category || 'Carreiras Gerais',
        totalSeats: Number(crsSeats) || 0,
        salary: crsSalary.trim() || 'A definir',
        examDate: crsExamDate.trim() || 'A definir',
        daysRemaining: Number(crsDaysRemaining) || 60,
        workloadHours: Number(crsWorkload) || 300,
        instructor: crsInstructor.trim() || 'Equipe Docente',
        isOpenForEnrollment: crsIsOpen,
        description: crsDescription.trim(),
        enrolledStudentIds: editingCourse.enrolledStudentIds || [],
        enrolledStudentsCount: (editingCourse.enrolledStudentIds || []).length || editingCourse.enrolledStudentsCount || 0,
        syllabus: editingCourse.syllabus || {
          id: `syl-${editingCourse.id}`,
          targetId: editingCourse.id,
          title: `Edital ${crsName.trim()}`,
          pastedContent: '',
          createdAt: new Date().toLocaleDateString('pt-BR'),
          subjects: [],
        },
      };
      onUpdateCourse?.(updated);
      addLog(`Curso "${updated.name}" atualizado pelo Administrador.`, 'edit');
      showToast(`Curso "${updated.name}" atualizado com sucesso!`);
      setEditingCourse(null);
      setIsNewCourseModalOpen(false);
    } else {
      const newCourseId = `course-${Date.now()}`;
      const created: ExamTarget = {
        id: newCourseId,
        name: crsName.trim(),
        code: crsCode.trim() || `CUR-${Date.now().toString().slice(-4)}`,
        agency: crsAgency.trim() || 'Comissão Oficial',
        role: crsRole.trim(),
        category: crsCategory || 'Carreiras Gerais',
        totalSeats: Number(crsSeats) || 0,
        salary: crsSalary.trim() || 'A definir',
        examDate: crsExamDate.trim() || 'A definir',
        daysRemaining: Number(crsDaysRemaining) || 60,
        progressPercent: 0,
        workloadHours: Number(crsWorkload) || 300,
        instructor: crsInstructor.trim() || 'Equipe Docente',
        isOpenForEnrollment: crsIsOpen,
        enrolledStudentsCount: 0,
        enrolledStudentIds: [],
        description: crsDescription.trim(),
        isCustom: false,
        syllabus: {
          id: `syl-${newCourseId}`,
          targetId: newCourseId,
          title: `Edital ${crsName.trim()}`,
          pastedContent: '',
          createdAt: new Date().toLocaleDateString('pt-BR'),
          subjects: [],
        },
      };
      onCreateCourse?.(created);
      addLog(`Novo curso oficial aberto para inscrições: "${created.name}".`, 'create');
      showToast(`Curso "${created.name}" publicado com sucesso! Alunos já podem se inscrever.`);
      setIsNewCourseModalOpen(false);
    }
  };

  const handleConfirmDeleteCourse = () => {
    if (!courseToDeleteId) return;
    const targetCourse = courses.find((c) => c.id === courseToDeleteId);
    onDeleteCourse?.(courseToDeleteId);
    addLog(`Curso excluído do catálogo oficial: ${targetCourse?.name || courseToDeleteId}`, 'delete');
    showToast(`Curso removido do catálogo.`, 'danger');
    setCourseToDeleteId(null);
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  // Unlock Credentials Handler (Credentials only appear after entering administrator password)
  const handleUnlockCredentials = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVaultError('');
    setVaultSuccess('');

    const pass = vaultPasswordInput.trim();
    if (!pass) {
      setVaultError('Informe a senha do administrador para desbloquear as credenciais.');
      return;
    }

    if (verifyAdminPassword(pass)) {
      setIsCredentialsRevealed(true);
      setVaultSuccess('Senha master confirmada! Credenciais de administrador desbloqueadas.');
      setVaultPasswordInput('');
      setLoginPassword(pass);
    } else {
      setVaultError('Senha de administrador incorreta. Acesso negado.');
    }
  };

  const handleLockCredentials = () => {
    setIsCredentialsRevealed(false);
    setVaultPasswordInput('');
    setVaultError('');
    setVaultSuccess('');
  };

  // Auth Submit with Strict Admin Password Validation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const emailTrim = loginEmail.trim().toLowerCase();
    const passTrim = loginPassword.trim();

    if (!emailTrim || !passTrim) {
      setLoginError('Informe o e-mail institucional e a senha do administrador.');
      return;
    }

    // VALIDAÇÃO RIGOROSA DA SENHA MASTER DO ADMINISTRADOR (admin03061983)
    if (!verifyAdminPassword(passTrim)) {
      setLoginError('Senha de administrador incorreta. Acesso restrito e negado.');
      return;
    }

    const isPedagogico = emailTrim.includes('pedagogico');
    const name = isPedagogico ? 'Gestor Pedagógico' : 'Super Administrador Geral (Acesso Total)';
    const role = isPedagogico ? 'gestor_conteudo' : 'super_admin';

    onLoginAdmin(emailTrim, name, role);
    addLog(`Administrador ${name} autenticou-se com sucesso com senha master verificada.`, 'security');
    showToast(`Bem-vindo, ${name}! Painel liberado com sucesso.`, 'success');
  };

  // Master Unblock All Restricted Users
  const handleUnblockAllRestricted = () => {
    const restricted = users.filter((u) => u.status === 'restrito' || u.status === 'suspenso');
    if (restricted.length === 0) {
      showToast('Nenhum usuário restrito ou suspenso no momento.', 'info');
      return;
    }
    restricted.forEach((u) => {
      onToggleRestrictUser(u.id, false);
    });
    addLog(`Acesso Total: ${restricted.length} usuários restritos foram desbloqueados.`, 'security');
    showToast(`${restricted.length} usuários desbloqueados com sucesso!`, 'success');
  };

  // Master Role Management
  const handleChangeUserRole = (user: ManagedUser, newRole: ManagedUser['role']) => {
    if (onUpdateUser) {
      onUpdateUser({ ...user, role: newRole });
      addLog(`Cargo de "${user.name}" alterado para "${newRole}".`, 'edit');
      showToast(`Cargo de ${user.name} alterado para ${newRole}.`);
    }
  };

  // Simulado Form Openers
  const openEditSimulado = (sim: MockExam) => {
    setEditingSimulado(sim);
    setSimTitle(sim.title);
    setSimCode(sim.code);
    setSimAgency(sim.agency);
    setSimBoard(sim.board);
    setSimQuestionsCount(sim.totalQuestions);
    setSimDuration(sim.durationMinutes);
    setSimCutoff(sim.cutoffRate);
    setSimDifficulty(sim.difficulty);
    setSimStatus(sim.status);
  };

  const handleSaveSimulado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle.trim()) return;

    if (editingSimulado) {
      const updated: MockExam = {
        ...editingSimulado,
        title: simTitle.trim(),
        code: simCode.trim() || editingSimulado.code,
        agency: simAgency.trim() || editingSimulado.agency,
        board: simBoard.trim() || editingSimulado.board,
        totalQuestions: Number(simQuestionsCount) || 50,
        durationMinutes: Number(simDuration) || 180,
        cutoffRate: Number(simCutoff) || 80,
        difficulty: simDifficulty,
        status: simStatus,
      };
      onUpdateSimulado(updated);
      addLog(`Simulado "${updated.title}" editado e salvo.`, 'edit');
      showToast(`Simulado "${updated.title}" atualizado com sucesso!`);
      setEditingSimulado(null);
    } else {
      const created: MockExam = {
        id: `sim-${Date.now()}`,
        title: simTitle.trim(),
        code: simCode.trim() || `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
        agency: simAgency.trim() || 'Órgão Nacional / Prova Oficial',
        board: simBoard.trim() || 'FGV',
        totalQuestions: Number(simQuestionsCount) || 60,
        durationMinutes: Number(simDuration) || 180,
        cutoffRate: Number(simCutoff) || 80,
        difficulty: simDifficulty,
        status: simStatus,
        questions: questions.slice(0, 5),
        subjectsCovered: ['Direito Constitucional', 'Direito Tributário', 'Direito Administrativo'],
      };
      onCreateSimulado(created);
      addLog(`Novo simulado oficial criado: "${created.title}".`, 'create');
      showToast(`Simulado "${created.title}" criado e publicado!`);
      setIsNewSimuladoModalOpen(false);
    }
  };

  const handleConfirmDeleteSimulado = () => {
    if (!simuladoDeleteConfirmId) return;
    const simToDelete = simulados.find((s) => s.id === simuladoDeleteConfirmId);
    onDeleteSimulado(simuladoDeleteConfirmId);
    addLog(`Simulado excluído: ${simToDelete?.title || simuladoDeleteConfirmId}`, 'delete');
    showToast(`Simulado removido do banco de provas.`, 'danger');
    setSimuladoDeleteConfirmId(null);
  };

  // Legal Item Form Openers
  const openEditLegalItem = (item: LegalItem) => {
    setEditingLegalItem(item);
    setLegCategory(item.category);
    setLegTitle(item.title);
    setLegSource(item.source);
    setLegSubject(item.subject || 'Direito Constitucional');
    setLegArticle(item.articleNumber || '');
    setLegStatement(item.statement);
    setLegPracticalContext(item.practicalContext);
    setLegRelevance(item.relevance);
  };

  const handleSaveLegalItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legTitle.trim() || !legStatement.trim()) return;

    if (editingLegalItem) {
      const updated: LegalItem = {
        ...editingLegalItem,
        category: legCategory,
        title: legTitle.trim(),
        source: legSource.trim(),
        subject: legSubject.trim(),
        articleNumber: legArticle.trim(),
        statement: legStatement.trim(),
        practicalContext: legPracticalContext.trim(),
        relevance: legRelevance,
      };
      onUpdateLegalItem(updated);
      addLog(`Item de Legislação/Súmula "${updated.title}" editado.`, 'edit');
      showToast(`Item "${updated.title}" atualizado com sucesso!`);
      setEditingLegalItem(null);
    } else {
      const created: LegalItem = {
        id: `leg-custom-${Date.now()}`,
        category: legCategory,
        title: legTitle.trim(),
        source: legSource.trim(),
        subject: legSubject.trim(),
        articleNumber: legArticle.trim(),
        statement: legStatement.trim(),
        practicalContext: legPracticalContext.trim(),
        relevance: legRelevance,
        isCustom: true,
        createdAt: 'Hoje',
      };
      onCreateLegalItem(created);
      addLog(`Nova súmula/lei adicionada ao acervo: "${created.title}".`, 'create');
      showToast(`Item "${created.title}" cadastrado com sucesso!`);
      setIsNewLegalItemModalOpen(false);
    }
  };

  const handleConfirmDeleteLegal = () => {
    if (!legalDeleteConfirmId) return;
    const itemToDelete = legalItems.find((i) => i.id === legalDeleteConfirmId);
    onDeleteLegalItem(legalDeleteConfirmId);
    addLog(`Súmula/Lei excluída: ${itemToDelete?.title || legalDeleteConfirmId}`, 'delete');
    showToast(`Item removido de Súmulas & Lei Seca.`, 'danger');
    setLegalDeleteConfirmId(null);
  };

  // User Deletion & Restriction
  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    if (userToDelete.email === 'admin@aprovacaototal.com' || userToDelete.email === 'legongamer0306@gmail.com' || userToDelete.role === 'admin') {
      showToast('Esta conta master de administrador está protegida e não pode ser excluída.', 'danger');
      setUserToDelete(null);
      return;
    }
    const deletedEmail = userToDelete.email;
    const deletedName = userToDelete.name;
    onDeleteUser(userToDelete.id);
    addLog(`E-mail e conta excluídos definitivamente: ${deletedEmail} (${deletedName})`, 'delete');
    showToast(`O e-mail ${deletedEmail} e todos os dados associados foram excluídos com sucesso.`, 'danger');
    setUserToDelete(null);
  };

  const handleConfirmRestrictUser = () => {
    if (!userToRestrict) return;
    const willRestrict = userToRestrict.status === 'ativo';
    onToggleRestrictUser(userToRestrict.id, willRestrict, willRestrict ? restrictionReason : undefined);
    addLog(
      willRestrict 
        ? `Acesso do usuário restrito: ${userToRestrict.name}. Motivo: ${restrictionReason}` 
        : `Acesso do usuário restabelecido: ${userToRestrict.name}`,
      'security'
    );
    showToast(
      willRestrict
        ? `Acesso de ${userToRestrict.name} restringido com sucesso.`
        : `Acesso de ${userToRestrict.name} reativado e liberado.`,
      willRestrict ? 'danger' : 'success'
    );
    setUserToRestrict(null);
  };

  // Student Approval Handlers (Homologação e Liberação de Matrícula)
  const handleApproveStudent = (userId: string) => {
    const student = users.find((u) => u.id === userId);
    if (onApproveUser) {
      onApproveUser(userId);
    }
    addLog(`Matrícula de aluno APROVADA: ${student?.name || userId} (${student?.email || ''})`, 'create');
    showToast(`Matrícula de ${student?.name || 'aluno'} aprovada com sucesso! Acesso liberado.`, 'success');
  };

  const handleRejectStudent = (userId: string, reason?: string) => {
    const student = users.find((u) => u.id === userId);
    if (onRejectUser) {
      onRejectUser(userId, reason);
    }
    addLog(`Matrícula de aluno REJEITADA: ${student?.name || userId}. Motivo: ${reason || 'Documentação pendente'}`, 'delete');
    showToast(`Cadastro de ${student?.name || 'aluno'} rejeitado.`, 'danger');
  };

  const handleApproveAllPending = () => {
    const pending = users.filter((u) => u.status === 'pendente_aprovacao');
    pending.forEach((st) => {
      if (onApproveUser) onApproveUser(st.id);
    });
    addLog(`${pending.length} matrículas pendentes foram aprovadas em lote pelo administrador.`, 'create');
    showToast(`Todas as ${pending.length} matrículas pendentes foram aprovadas com sucesso!`, 'success');
  };

  // Admin New Student with Photo
  const handleAdminUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewUserAvatar(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewUserByAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const trimmedPass = newUserPassword.trim();
    if (!trimmedPass || trimmedPass.length < 6) {
      showToast('A senha do aluno é obrigatória e deve ter no mínimo 6 dígitos.', 'danger');
      return;
    }

    const created: ManagedUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      password: trimmedPass, // Senha obrigatória (mínimo de 6 dígitos)
      phone: newUserPhone.trim() || undefined,
      role: newUserRole,
      targetExam: newUserTarget,
      questionsAnswered: 0,
      accuracyRate: 0,
      status: 'ativo',
      avatarUrl: newUserAvatar || undefined,
      documentPhotoUrl: newUserDocPhoto || undefined,
      registrationDate: new Date().toLocaleDateString('pt-BR'),
      lastActive: 'Agora',
    };

    if (onCreateUser) {
      onCreateUser(created);
    }
    addLog(`Novo aluno cadastrado com foto: "${created.name}" (${created.email}).`, 'create');
    showToast(`Aluno "${created.name}" cadastrado com sucesso!`);
    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('123456');
    setNewUserPhone('');
    setNewUserAvatar('https://picsum.photos/seed/student-lucas/240/240');
    setNewUserDocPhoto('');
    setShowAdminDocUpload(false);
  };

  // Question Deletion
  const handleConfirmDeleteQuestion = () => {
    if (!questionToDelete) return;
    onDeleteQuestion(questionToDelete.id);
    addLog(`Questão ${questionToDelete.code} (${questionToDelete.subject}) excluída do banco de questões.`, 'delete');
    showToast(`Questão ${questionToDelete.code} excluída permanentemente.`, 'danger');
    setQuestionToDelete(null);
  };

  // ==========================================
  // VIEW: IF NOT LOGGED IN -> LOGIN SCREEN
  // ==========================================
  if (!adminSession.isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#CBD5E1] shadow-xl p-8 relative overflow-hidden">
          {/* Top Banner Accent */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500" />

          {/* Master Access Badge & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-600/30">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-rose-700 bg-rose-100 px-3.5 py-1 rounded-full mb-2 flex items-center gap-1.5 border border-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Acesso Total do Administrador</span>
            </span>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Painel de Gestão & Controle Master
            </h1>
            <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed max-w-sm">
              Acesso total habilitado para aprovação de alunos cadastrados, criação e publicação de cursos, simulados e moderação de conteúdo.
            </p>
          </div>

          {/* SECURITY WARNING & INSTRUCTIONS */}
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 shadow-2xs">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-snug">
              <strong className="block font-bold text-amber-950">Acesso Restrito & Protegido</strong>
              <span>
                Para acessar o painel de controle é obrigatório informar o e-mail institucional e a <strong>senha master do administrador</strong>.
              </span>
            </div>
          </div>

          {/* ERROR ALERT */}
          {loginError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-start gap-2.5 animate-shake shadow-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold leading-relaxed">
                {loginError}
              </div>
            </div>
          )}

          {/* STRICT AUTHENTICATION FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                E-mail Institucional do Administrador
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="admin@aprovacaototal.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none pl-9 bg-white"
                />
                <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#334155]">
                  Senha Master do Administrador *
                </label>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                  Mínimo 6 dígitos
                </span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Digite a senha master"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none pl-9 pr-10 bg-white"
                />
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1.5 leading-snug">
                Senha master atual: <code className="font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">admin03061983</code> (poderá ser alterada na publicação).
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Autenticar & Desbloquear Painel Master</span>
            </button>
          </form>

          {onNavigateToStudentView && (
            <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={onNavigateToStudentView}
                className="w-full text-center text-xs text-[#64748B] hover:text-[#0F172A] font-semibold block transition-colors cursor-pointer"
              >
                ← Voltar para Área de Aluno / Matrícula
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOGGED IN ADMIN DASHBOARD
  // ==========================================
  const totalRestrictedUsers = users.filter((u) => u.status !== 'ativo').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {adminToast && (
        <div 
          className={`fixed top-18 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-top-4 ${
            adminToast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : adminToast.type === 'danger'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-blue-50 border-blue-300 text-blue-800'
          }`}
        >
          {adminToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : adminToast.type === 'danger' ? (
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span>{adminToast.message}</span>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] text-white rounded-2xl p-6 shadow-md border border-slate-700/60 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/25 text-rose-200 border border-rose-400/50 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                ⚡ Modo Master: Acesso Total Ativo
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Super Administrador Geral
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Painel de Controle do Administrador (Acesso Total)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Você possui privilégios irrestritos de gestão: aprove matrículas de alunos em lote, altere cargos e permissões, crie e publique cursos oficiais e simulados de concurso.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onNavigateToStudentView && (
              <button
                onClick={onNavigateToStudentView}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>Modo Aluno</span>
              </button>
            )}

            <button
              onClick={() => {
                onLogoutAdmin();
                showToast('Sessão de administrador encerrada com sucesso.', 'info');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center gap-1.5 shadow-sm shadow-rose-950/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do Admin</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-700/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'dashboard'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Visão Geral & Métricas</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('cursos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'cursos'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
            <span>Cursos & Inscrições</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">
              {courses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('simulados')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'simulados'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Simulados de Prova</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">
              {simulados.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('sumulas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'sumulas'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Súmulas & Lei Seca</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">
              {legalItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('usuarios')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'usuarios'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-300" />
            <span>E-mails & Contas Cadastradas</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">
              {users.length}
            </span>
            {totalRestrictedUsers > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                {totalRestrictedUsers} restrito{totalRestrictedUsers > 1 ? 's' : ''}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('questoes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeAdminTab === 'questoes'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Banco de Questões</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">
              {questions.length}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VISÃO GERAL & MÉTRICAS (DASHBOARD ADMIN) */}
      {/* ======================================================== */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span className="font-semibold">Cursos & Editais</span>
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {courses.length}
              </div>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                {courses.filter((c) => c.isOpenForEnrollment !== false).length} inscrições abertas
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span className="font-semibold">Simulados Ativos</span>
                <Timer className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {simulados.length}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Prontos para aplicação
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span className="font-semibold">Súmulas & Leis</span>
                <Scale className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {legalItems.length}
              </div>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                STF, STJ, CNJ e Leis
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span className="font-semibold">Questões no Banco</span>
                <BookOpenCheck className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {questions.length}
              </div>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                Gabaritadas e comentadas
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span className="font-semibold">Alunos Registrados</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-[#0F172A] tabular-nums">
                {users.length}
              </div>
              <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">
                Perfis gerenciados
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                <span className="font-semibold">Usuários Restritos</span>
                <Ban className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-700 tabular-nums">
                {totalRestrictedUsers}
              </div>
              <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                {totalRestrictedUsers === 0 ? 'Nenhuma restrição' : 'Acesso bloqueado'}
              </span>
            </div>
          </div>

          {/* MASTER ACCESS SUPERPOWERS & BATCH ACTIONS */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-slate-900 text-white shadow-lg border border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-600 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      Ações Rápidas do Administrador Master (Acesso Total)
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      Irrestrito
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Comandos de 1 clique para gerenciar o ecossistema completo de alunos, cursos e provas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 font-mono">
                  Sessão: {adminSession.adminEmail || 'admin@aprovacaototal.com'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              {/* Batch Approve Pending */}
              <button
                type="button"
                onClick={handleApproveAllPending}
                disabled={users.filter((u) => u.status === 'pendente_aprovacao').length === 0}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  users.some((u) => u.status === 'pendente_aprovacao')
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-900/60 text-emerald-100'
                    : 'bg-white/5 border-white/10 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold bg-emerald-500/30 px-2 py-0.5 rounded-md text-emerald-200">
                    {users.filter((u) => u.status === 'pendente_aprovacao').length} pendentes
                  </span>
                </div>
                <div>
                  <strong className="text-xs block text-white font-black">Aprovar Todos os Alunos</strong>
                  <span className="text-[11px] text-slate-300">Homologar cadastros em 1 clique</span>
                </div>
              </button>

              {/* Unblock All Restricted */}
              <button
                type="button"
                onClick={handleUnblockAllRestricted}
                disabled={totalRestrictedUsers === 0}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  totalRestrictedUsers > 0
                    ? 'bg-rose-950/40 border-rose-500/50 hover:bg-rose-900/60 text-rose-100'
                    : 'bg-white/5 border-white/10 text-slate-400 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Ban className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-bold bg-rose-500/30 px-2 py-0.5 rounded-md text-rose-200">
                    {totalRestrictedUsers} restritos
                  </span>
                </div>
                <div>
                  <strong className="text-xs block text-white font-black">Desbloquear Usuários</strong>
                  <span className="text-[11px] text-slate-300">Liberar todos os bloqueios</span>
                </div>
              </button>

              {/* Create Course */}
              <button
                type="button"
                onClick={handleOpenNewCourseModal}
                className="p-3 rounded-xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/60 text-blue-100 text-left transition-all cursor-pointer flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <Plus className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <strong className="text-xs block text-white font-black">Criar Curso / Edital</strong>
                  <span className="text-[11px] text-slate-300">Novo edital para matrículas</span>
                </div>
              </button>

              {/* Create Simulado */}
              <button
                type="button"
                onClick={() => {
                  setEditingSimulado(null);
                  setSimTitle('');
                  setSimCode(`SIM-${Math.floor(1000 + Math.random() * 9000)}`);
                  setSimAgency('');
                  setSimBoard('FGV');
                  setSimQuestionsCount(60);
                  setSimDuration(180);
                  setSimCutoff(80);
                  setSimDifficulty('Padrão Oficial');
                  setSimStatus('disponivel');
                  setIsNewSimuladoModalOpen(true);
                }}
                className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 text-amber-100 text-left transition-all cursor-pointer flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <Plus className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <strong className="text-xs block text-white font-black">Novo Simulado de Prova</strong>
                  <span className="text-[11px] text-slate-300">Publicar prova com ranking</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setActiveAdminTab('simulados')}
              className="bg-white p-5 rounded-xl border border-[#CBD5E1] hover:border-emerald-400 hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Timer className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">
                Editar & Publicar Simulados
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Ajuste pontuação de corte, tempo de duração, banca examinadora ou crie novas provas simuladas para o edital.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mt-3">
                <span>Gerenciar simulados</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => setActiveAdminTab('sumulas')}
              className="bg-white p-5 rounded-xl border border-[#CBD5E1] hover:border-amber-400 hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">
                Curadoria de Súmulas & Leis
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Altere redações, artigos da CF/88, contexto prático de incidência e exclua itens obsoletos da jurisprudência.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-3">
                <span>Gerenciar súmulas</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => setActiveAdminTab('usuarios')}
              className="bg-white p-5 rounded-xl border border-[#CBD5E1] hover:border-rose-400 hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#0F172A]">
                Controle de Usuários & Perfis
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Bloqueie acessos indevidos com restrições formais ou exclua definitivamente cadastros e dados de alunos.
              </p>
              <div className="flex items-center gap-1 text-xs font-bold text-rose-700 mt-3">
                <span>Gerenciar alunos</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Activity Audit Log */}
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#64748B]" />
                <h3 className="font-extrabold text-sm text-[#0F172A]">
                  Log de Atividades e Auditoria Administrativa
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#64748B]">
                Últimas ações registradas nesta sessão
              </span>
            </div>

            <div className="divide-y divide-[#F1F5F9] max-h-60 overflow-y-auto">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${
                      log.type === 'delete' ? 'bg-rose-500' :
                      log.type === 'create' ? 'bg-emerald-500' :
                      log.type === 'edit' ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    <span className="text-[#334155] font-medium">{log.text}</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] font-mono tabular-nums shrink-0 ml-4">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: GESTÃO DE CURSOS & INSCRIÇÕES CRIADOS PELO ADMIN */}
      {/* ======================================================== */}
      {activeAdminTab === 'cursos' && (
        <div className="space-y-4">
          {/* Top Control Bar: Search, Category Filters, and New Course CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#CBD5E1]">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar curso por título, cargo, órgão ou sigla..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenNewCourseModal}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Novo Curso para Inscrição</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['all', 'Fiscal & Controle', 'Carreira Jurídica', 'Policial', 'Tribunais'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCourseCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                  courseCategoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {cat === 'all' ? 'Todos os Cursos' : cat}
              </button>
            ))}
          </div>

          {/* List of Courses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses
              .filter((c) => {
                const search = (courseSearch || '').toLowerCase();
                const matchesSearch =
                  (c.name || '').toLowerCase().includes(search) ||
                  (c.code || '').toLowerCase().includes(search) ||
                  (c.agency || '').toLowerCase().includes(search) ||
                  (c.role || '').toLowerCase().includes(search);
                const matchesCategory =
                  courseCategoryFilter === 'all' || c.category === courseCategoryFilter;
                return matchesSearch && matchesCategory;
              })
              .map((course) => {
                const isOpen = course.isOpenForEnrollment !== false;
                const enrolledCount = course.enrolledStudentIds?.length || course.enrolledStudentsCount || 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border border-[#CBD5E1] p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Header with Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0F172A] text-white">
                              {course.code}
                            </span>
                            {course.category && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                {course.category}
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-base text-[#0F172A] leading-snug">
                            {course.name}
                          </h3>
                        </div>

                        {/* Inscrições Abertas / Encerradas Toggle Badge */}
                        <button
                          type="button"
                          onClick={() => {
                            onToggleCourseEnrollment?.(course.id);
                            showToast(
                              isOpen
                                ? `Inscrições para "${course.name}" foram encerradas.`
                                : `Inscrições para "${course.name}" foram abertas com sucesso!`
                            );
                          }}
                          title="Clique para alternar status de inscrição dos alunos"
                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isOpen
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{isOpen ? 'Inscrições Abertas' : 'Inscrições Encerradas'}</span>
                        </button>
                      </div>

                      {/* Course Description */}
                      {course.description && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      )}

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Cargo & Órgão</span>
                          <span className="font-bold text-[#0F172A] truncate block">{course.role}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Banca Oficial</span>
                          <span className="font-bold text-[#0F172A] truncate block">{course.agency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Carga Horária</span>
                          <span className="font-bold text-[#0F172A]">{course.workloadHours || 320}h aula</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Vagas do Concurso</span>
                          <span className="font-bold text-[#0F172A]">{course.totalSeats || 0} vagas</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Remuneração</span>
                          <span className="font-bold text-emerald-700">{course.salary}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Data da Prova</span>
                          <span className="font-bold text-blue-700">{course.examDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: View Enrolled Students & Course Admin CRUD */}
                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setCourseToViewStudents(course)}
                        className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>Alunos Inscritos ({enrolledCount})</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCourseModal(course)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCourseToDeleteId(course.id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Excluir Curso"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {courses.length === 0 && (
              <div className="col-span-2 p-12 text-center bg-white rounded-2xl border border-dashed border-[#CBD5E1] space-y-3">
                <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">Nenhum curso cadastrado ainda</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Como administrador, você pode criar cursos com editais completos, vagas e definir se as inscrições estão abertas para os alunos.
                </p>
                <button
                  type="button"
                  onClick={handleOpenNewCourseModal}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  + Criar Primeiro Curso Oficial
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GESTÃO DE SIMULADOS (EDITAR, CRIAR, EXCLUIR) */}
      {/* ======================================================== */}
      {activeAdminTab === 'simulados' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#CBD5E1]">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar simulado por título, banca, código..."
                  value={simSearch}
                  onChange={(e) => setSimSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setEditingSimulado(null);
                setSimTitle('');
                setSimCode(`SIM-${Math.floor(1000 + Math.random() * 9000)}`);
                setSimAgency('Receita Federal / TCU');
                setSimBoard('FGV Conhecimento');
                setSimQuestionsCount(60);
                setSimDuration(240);
                setSimCutoff(80);
                setSimDifficulty('Padrão Oficial');
                setSimStatus('disponivel');
                setIsNewSimuladoModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Simulado Oficial</span>
            </button>
          </div>

          {/* List of Simulados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulados
              .filter((s) => {
                const search = (simSearch || '').toLowerCase();
                return (
                  (s.title || '').toLowerCase().includes(search) ||
                  (s.agency || '').toLowerCase().includes(search) ||
                  (s.board || '').toLowerCase().includes(search) ||
                  (s.code || '').toLowerCase().includes(search)
                );
              })
              .map((sim) => (
                <div
                  key={sim.id}
                  className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sim.code}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        sim.status === 'concluido'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {sim.status === 'concluido' ? 'Concluído' : 'Disponível para Alunos'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-[#0F172A] leading-snug">
                      {sim.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#64748B] mt-3 pt-3 border-t border-[#F1F5F9]">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Banca / Órgão:</span>
                        <span className="font-medium text-[#0F172A]">{sim.board} • {sim.agency}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Questões & Duração:</span>
                        <span className="font-medium text-[#0F172A]">{sim.totalQuestions} questões • {sim.durationMinutes} min</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Nota de Corte:</span>
                        <span className="font-bold text-amber-600">{sim.cutoffRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Dificuldade Oficial:</span>
                        <span className="font-medium text-[#0F172A]">{sim.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => setEditingSimuladoQuestions(sim)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Editar Questões ({sim.questions?.length || sim.totalQuestions})</span>
                    </button>

                    <button
                      onClick={() => openEditSimulado(sim)}
                      className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-slate-50 text-xs font-bold text-[#334155] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Editar Dados</span>
                    </button>

                    <button
                      onClick={() => setSimuladoDeleteConfirmId(sim.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: GESTÃO DE SÚMULAS & LEI SECA (EDITAR, EXCLUIR) */}
      {/* ======================================================== */}
      {activeAdminTab === 'sumulas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#CBD5E1]">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar enunciado, súmula, lei..."
                  value={legalSearch}
                  onChange={(e) => setLegalSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] outline-none focus:border-rose-600"
                />
              </div>

              <select
                value={legalCategoryFilter}
                onChange={(e) => setLegalCategoryFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] outline-none"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Súmula Vinculante">Súmula Vinculante</option>
                <option value="Súmula">Súmula</option>
                <option value="Repercussão Geral">Repercussão Geral</option>
                <option value="Lei Seca">Lei Seca</option>
                <option value="Resoluções do CNJ">Resoluções do CNJ</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingLegalItem(null);
                setLegCategory('Súmula Vinculante');
                setLegTitle('');
                setLegSource('Supremo Tribunal Federal');
                setLegSubject('Direito Constitucional');
                setLegArticle('');
                setLegStatement('');
                setLegPracticalContext('');
                setLegRelevance('Alta Incidência');
                setIsNewLegalItemModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Inserir Nova Súmula / Lei</span>
            </button>
          </div>

          {/* Legal Items List */}
          <div className="space-y-3">
            {legalItems
              .filter((item) => {
                if (legalCategoryFilter !== 'all' && item.category !== legalCategoryFilter) return false;
                if (!legalSearch) return true;
                const q = legalSearch.toLowerCase();
                return (
                  item.title.toLowerCase().includes(q) ||
                  item.statement.toLowerCase().includes(q) ||
                  item.practicalContext.toLowerCase().includes(q) ||
                  (item.articleNumber && item.articleNumber.toLowerCase().includes(q))
                );
              })
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs hover:border-slate-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                        <span className="text-xs font-semibold text-[#64748B]">
                          {item.source}
                        </span>
                        {item.articleNumber && (
                          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                            {item.articleNumber}
                          </span>
                        )}
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                          {item.relevance}
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-[#0F172A]">
                        {item.title}
                      </h4>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => openEditLegalItem(item)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-slate-50 text-xs font-bold text-[#334155] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setLegalDeleteConfirmId(item.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#334155] mt-2 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
                    <strong className="text-[#0F172A] block mb-0.5 font-bold">Enunciado Oficial:</strong>
                    {item.statement}
                  </p>

                  {item.practicalContext && (
                    <div className="text-[11px] text-[#64748B] mt-2 flex items-start gap-1.5">
                      <span className="font-bold text-amber-700">Aplicação em Prova:</span>
                      <span>{item.practicalContext}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: GESTÃO DE USUÁRIOS (EXCLUIR PERFIL, RESTRINGIR) */}
      {/* ======================================================== */}
      {activeAdminTab === 'usuarios' && (
        <div className="space-y-4">
          {/* Top Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#CBD5E1]">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar aluno por nome, e-mail, cargo alvo..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] outline-none focus:border-rose-600"
                />
              </div>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] outline-none font-medium"
              >
                <option value="all">Todos os Status ({users.length})</option>
                <option value="pendente_aprovacao">
                  ⏳ Aguardando Aprovação ({users.filter((u) => u.status === 'pendente_aprovacao').length})
                </option>
                <option value="ativo">
                  ✅ Aprovados / Ativos ({users.filter((u) => u.status === 'ativo').length})
                </option>
                <option value="restrito">
                  Restritos ({users.filter((u) => u.status === 'restrito').length})
                </option>
                <option value="suspenso">
                  Suspensos ({users.filter((u) => u.status === 'suspenso').length})
                </option>
                <option value="rejeitado">
                  Rejeitados ({users.filter((u) => u.status === 'rejeitado').length})
                </option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* View Switcher: Tabela de E-mails vs Dossiê */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200">
                <button
                  type="button"
                  onClick={() => setUserViewMode('tabela_emails')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    userViewMode === 'tabela_emails'
                      ? 'bg-white text-rose-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Tabela de E-mails ({users.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserViewMode('cards')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    userViewMode === 'cards'
                      ? 'bg-white text-rose-700 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Dossiê & Fotos</span>
                </button>
              </div>

              {totalRestrictedUsers > 0 && (
                <button
                  type="button"
                  onClick={handleUnblockAllRestricted}
                  className="px-3 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 border border-rose-300"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>Desbloquear ({totalRestrictedUsers})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setNewUserName('');
                  setNewUserEmail('');
                  setNewUserAvatar('https://picsum.photos/seed/student-lucas/240/240');
                  setIsNewUserModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Aluno</span>
              </button>
            </div>
          </div>

          {/* PENDING APPROVALS QUEUE BANNER */}
          {users.some((u) => u.status === 'pendente_aprovacao') && (
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/90 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                    <Clock className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-amber-950 flex items-center gap-2">
                      <span>Fila de Homologação: Alunos Aguardando Aprovação</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black">
                        {users.filter((u) => u.status === 'pendente_aprovacao').length} pendente(s)
                      </span>
                    </h3>
                    <p className="text-xs text-amber-800">
                      O acesso ao sistema de simulados está bloqueado para estes alunos até que você aprove suas matrículas.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApproveAllPending}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprovar Todos os Pendentes</span>
                </button>
              </div>

              {/* Quick Horizontal Cards of Pending Students */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                {users
                  .filter((u) => u.status === 'pendente_aprovacao')
                  .map((st) => (
                    <div
                      key={st.id}
                      className="bg-white p-3 rounded-xl border border-amber-300 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          onClick={() => setUserToViewDossier(st)}
                          title="Clique para ver fotos em alta resolução"
                          className="w-11 h-11 rounded-lg bg-slate-900 border border-amber-300 overflow-hidden shrink-0 cursor-pointer shadow-xs"
                        >
                          {st.avatarUrl ? (
                            <img
                              src={st.avatarUrl}
                              alt={st.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold flex items-center justify-center h-full">
                              {st.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setUserToViewDossier(st)}
                            className="font-black text-xs text-[#0F172A] hover:text-[#2563EB] truncate block text-left"
                          >
                            {st.name}
                          </button>
                          <div className="text-[10px] text-[#64748B] truncate">
                            {st.targetExam} • {st.email}
                          </div>
                          {st.documentPhotoUrl && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 rounded inline-block mt-0.5">
                              Doc com foto anexado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApproveStudent(st.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Aprovar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectStudent(st.id)}
                          className="px-2 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer"
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* User Cards / Table */}
          {(() => {
            const filteredUserList = users.filter((u) => {
              if (userStatusFilter !== 'all' && u.status !== userStatusFilter) return false;
              if (!userSearch) return true;
              const q = userSearch.toLowerCase();
              return (
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.targetExam.toLowerCase().includes(q)
              );
            });

            if (userViewMode === 'tabela_emails') {
              return (
                <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xs overflow-hidden">
                  {/* Table Header with Quick Copy Tool */}
                  <div className="p-4 bg-slate-50 border-b border-[#CBD5E1] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>Relação Oficial de Todos os E-mails Cadastrados ({filteredUserList.length})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Visualize todos os e-mails registrados no sistema, copie endereços e realize exclusões imediatas com segurança.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const allEmails = filteredUserList.map((u) => u.email).join(', ');
                        handleCopyEmail(allEmails);
                        showToast(`${filteredUserList.length} e-mails copiados para a área de transferência!`, 'info');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Todos os E-mails</span>
                    </button>
                  </div>

                  {filteredUserList.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <Mail className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">Nenhum e-mail encontrado com os filtros atuais.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8FAFC] text-slate-600 font-bold uppercase text-[10px] border-b border-[#E2E8F0]">
                          <tr>
                            <th className="py-3 px-4">Aluno / Usuário</th>
                            <th className="py-3 px-4">E-mail Cadastrado</th>
                            <th className="py-3 px-4">Papel / Acesso</th>
                            <th className="py-3 px-4">Concurso-Alvo</th>
                            <th className="py-3 px-4">Cadastro & Acesso</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Ação / Excluir</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          {filteredUserList.map((u) => {
                            const isMasterAdmin =
                              u.email === 'admin@aprovacaototal.com' ||
                              u.email === 'legongamer0306@gmail.com' ||
                              u.role === 'admin';
                            const isCopied = copiedEmail === u.email;

                            return (
                              <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div 
                                      onClick={() => setUserToViewDossier(u)}
                                      className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden cursor-pointer border border-slate-200"
                                    >
                                      {u.avatarUrl ? (
                                        <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      ) : (
                                        u.name.slice(0, 2).toUpperCase()
                                      )}
                                    </div>
                                    <span className="font-bold text-slate-900">{u.name}</span>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {u.email}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyEmail(u.email)}
                                      title="Copiar este e-mail"
                                      className={`p-1 rounded transition-colors cursor-pointer ${
                                        isCopied ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                                      }`}
                                    >
                                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <select
                                    value={u.role}
                                    onChange={(e) => handleChangeUserRole(u, e.target.value as ManagedUser['role'])}
                                    className="text-[11px] font-bold bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 outline-none cursor-pointer"
                                  >
                                    <option value="aluno">Aluno</option>
                                    <option value="aluno_premium">Aluno Premium</option>
                                    <option value="professor">Professor</option>
                                    <option value="admin">Administrador</option>
                                  </select>
                                </td>

                                <td className="py-3 px-4 text-slate-600 font-medium">
                                  {u.targetExam}
                                </td>

                                <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                                  <div>Cad: {u.registrationDate}</div>
                                  <div>Último: {u.lastActive}</div>
                                </td>

                                <td className="py-3 px-4">
                                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                    u.status === 'ativo'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : u.status === 'pendente_aprovacao'
                                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                      : u.status === 'restrito'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                                  }`}>
                                    {u.status === 'pendente_aprovacao' ? '⏳ Pendente' : u.status}
                                  </span>
                                </td>

                                <td className="py-3 px-4 text-right">
                                  {isMasterAdmin ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-500 font-bold text-[10px] border border-slate-200">
                                      <Lock className="w-3 h-3 text-slate-400" />
                                      <span>Admin Master</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setUserToDelete(u)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Excluir E-mail</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            }

            // Cards view
            return (
              <div className="grid grid-cols-1 gap-3">
                {filteredUserList.map((u) => {
                  const isMasterAdmin =
                    u.email === 'admin@aprovacaototal.com' ||
                    u.email === 'legongamer0306@gmail.com' ||
                    u.role === 'admin';

                  return (
                    <div
                      key={u.id}
                      className={`bg-white rounded-xl border p-4 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        u.status === 'restrito' 
                          ? 'border-amber-300 bg-amber-50/20' 
                          : u.status === 'suspenso'
                          ? 'border-rose-300 bg-rose-50/20'
                          : 'border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          onClick={() => setUserToViewDossier(u)}
                          title="Clique para ver fotos e carteirinha"
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#CBD5E1] shadow-2xs bg-[#0F172A] text-white cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        >
                          {u.avatarUrl ? (
                            <img 
                              src={u.avatarUrl} 
                              alt={u.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setUserToViewDossier(u)}
                              className="font-extrabold text-sm text-[#0F172A] hover:text-[#2563EB] text-left transition-colors cursor-pointer"
                            >
                              {u.name}
                            </button>
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              u.status === 'ativo'
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.status === 'pendente_aprovacao'
                                ? 'bg-amber-100 text-amber-950 border border-amber-300 animate-pulse'
                                : u.status === 'restrito'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {u.status === 'pendente_aprovacao' ? '⏳ Aguardando Aprovação' : u.status}
                            </span>
                            <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 transition-colors">
                              <Shield className="w-3 h-3 text-slate-500" />
                              <select
                                value={u.role}
                                onChange={(e) => handleChangeUserRole(u, e.target.value as ManagedUser['role'])}
                                className="text-[10px] font-bold bg-transparent text-slate-800 outline-none cursor-pointer"
                                title="Alterar cargo do usuário com Acesso Total"
                              >
                                <option value="aluno">Aluno</option>
                                <option value="aluno_premium">Aluno Premium</option>
                                <option value="professor">Professor</option>
                                <option value="admin">Administrador</option>
                              </select>
                            </div>
                            {u.documentPhotoUrl && (
                              <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                                Doc Anexado
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-[#64748B] flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{u.email}</span>
                            <span>•</span>
                            <span className="font-medium text-[#334155]">Foco: {u.targetExam}</span>
                          </div>

                          {u.restrictionReason && (
                            <div className="text-xs text-rose-700 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200 mt-1.5 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                              <span><strong>Motivo da restrição:</strong> {u.restrictionReason}</span>
                            </div>
                          )}

                          <div className="text-[11px] text-[#94A3B8] pt-1 flex items-center gap-4">
                            <span>Cadastrado em: {u.registrationDate}</span>
                            <span>Último acesso: {u.lastActive}</span>
                            <span className="font-bold text-slate-700 tabular-nums">
                              {u.questionsAnswered} questões ({u.accuracyRate}% acerto)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions: Approve/Reject (if pending), View Photos & ID Card, Restrict Access & Delete */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                        {u.status === 'pendente_aprovacao' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveStudent(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aprovar Matrícula</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectStudent(u.id)}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <span>Rejeitar</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setUserToViewDossier(u)}
                          className="px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 text-xs font-bold text-[#2563EB] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Ver Fotos & Carteirinha</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserToRestrict(u);
                            setRestrictionReason(u.restrictionReason || 'Compartilhamento indevido de acesso ou comportamento inadequado.');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                            u.status === 'ativo'
                              ? 'border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                              : 'border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'ativo' ? (
                            <>
                              <Ban className="w-3.5 h-3.5 text-amber-700" />
                              <span>Restringir Acesso</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Liberar Acesso</span>
                            </>
                          )}
                        </button>

                        {isMasterAdmin ? (
                          <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center gap-1 border border-slate-200">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Master</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir E-mail</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: BANCO DE QUESTÕES (MODERAÇÃO & EXCLUSÃO) */}
      {/* ======================================================== */}
      {activeAdminTab === 'questoes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#CBD5E1]">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar texto da questão, código, assunto..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] outline-none focus:border-rose-600"
                />
              </div>

              <select
                value={questionSubjectFilter}
                onChange={(e) => setQuestionSubjectFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] outline-none"
              >
                <option value="all">Todas as Disciplinas</option>
                <option value="Direito Constitucional">Direito Constitucional</option>
                <option value="Direito Tributário">Direito Tributário</option>
                <option value="Direito Administrativo">Direito Administrativo</option>
                <option value="Contabilidade Geral">Contabilidade Geral</option>
              </select>
            </div>

            <div className="text-xs text-[#64748B] font-medium shrink-0">
              Total de questões ativas: <strong className="text-[#0F172A]">{questions.length}</strong>
            </div>
          </div>

          {/* Question Items List */}
          <div className="space-y-3">
            {questions
              .filter((q) => {
                if (questionSubjectFilter !== 'all' && q.subject !== questionSubjectFilter) return false;
                if (!questionSearch) return true;
                const searchLow = questionSearch.toLowerCase();
                return (
                  q.statement.toLowerCase().includes(searchLow) ||
                  q.code.toLowerCase().includes(searchLow) ||
                  q.topic.toLowerCase().includes(searchLow) ||
                  q.board.toLowerCase().includes(searchLow) ||
                  (q.author?.name || '').toLowerCase().includes(searchLow)
                );
              })
              .map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs hover:border-slate-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {q.code}
                        </span>
                        <span className="text-xs font-bold text-[#0F172A]">
                          {q.subject}
                        </span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-xs text-[#64748B]">{q.topic}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                          {q.board} • {q.year}
                        </span>
                        {q.author?.name && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                            Autor: {q.author.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions: View details & Delete */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => setQuestionToView(q)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-slate-50 text-xs font-bold text-[#334155] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver Detalhes</span>
                      </button>

                      <button
                        onClick={() => setQuestionToDelete(q)}
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir do Banco</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#334155] mt-2 line-clamp-3 leading-relaxed">
                    {q.statement}
                  </p>

                  <div className="text-[11px] text-[#94A3B8] mt-2 flex items-center gap-3">
                    <span>
                      Gabarito Oficial: <strong className="text-emerald-600">
                        {q.options.find((o) => o.id === q.correctOptionId)?.label || q.correctOptionId}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{q.options.length} alternativas</span>
                    {q.legalBasis && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-xs">{q.legalBasis}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT / CREATE SIMULADO */}
      {/* ======================================================== */}
      {(editingSimulado || isNewSimuladoModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-[#0F172A]">
                  {editingSimulado ? 'Editar Simulado de Prova' : 'Criar Novo Simulado Oficial'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingSimulado(null);
                  setIsNewSimuladoModalOpen(false);
                }}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSimulado} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Título do Simulado
                </label>
                <input
                  type="text"
                  required
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  placeholder="Ex: Simulado Nacional Oficial RFB 2026 - Prova 1"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Código Identificador
                  </label>
                  <input
                    type="text"
                    value={simCode}
                    onChange={(e) => setSimCode(e.target.value)}
                    placeholder="SIM-RFB-01"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Banca Examinadora
                  </label>
                  <input
                    type="text"
                    value={simBoard}
                    onChange={(e) => setSimBoard(e.target.value)}
                    placeholder="FGV Conhecimento"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Órgão Alvo
                  </label>
                  <input
                    type="text"
                    value={simAgency}
                    onChange={(e) => setSimAgency(e.target.value)}
                    placeholder="Receita Federal do Brasil"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Dificuldade
                  </label>
                  <select
                    value={simDifficulty}
                    onChange={(e) => setSimDifficulty(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none"
                  >
                    <option value="Média">Média</option>
                    <option value="Difícil">Difícil</option>
                    <option value="Padrão Oficial">Padrão Oficial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Qtd Questões
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={simQuestionsCount}
                    onChange={(e) => setSimQuestionsCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={360}
                    value={simDuration}
                    onChange={(e) => setSimDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Corte Mínimo (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={simCutoff}
                    onChange={(e) => setSimCutoff(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Status de Aplicação
                </label>
                <select
                  value={simStatus}
                  onChange={(e) => setSimStatus(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none"
                >
                  <option value="disponivel">Disponível para os alunos iniciarem</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Arquivado / Concluído</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSimulado(null);
                    setIsNewSimuladoModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT / CREATE SÚMULA & LEI SECA */}
      {/* ======================================================== */}
      {(editingLegalItem || isNewLegalItemModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base text-[#0F172A]">
                  {editingLegalItem ? 'Editar Item Jurídico' : 'Cadastrar Súmula ou Artigo'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingLegalItem(null);
                  setIsNewLegalItemModalOpen(false);
                }}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLegalItem} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Categoria Jurídica
                  </label>
                  <select
                    value={legCategory}
                    onChange={(e) => setLegCategory(e.target.value as LegalCategory)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none"
                  >
                    <option value="Súmula Vinculante">Súmula Vinculante</option>
                    <option value="Súmula">Súmula</option>
                    <option value="Repercussão Geral">Repercussão Geral</option>
                    <option value="Lei Seca">Lei Seca</option>
                    <option value="Resoluções do CNJ">Resoluções do CNJ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Tribunal / Fonte
                  </label>
                  <input
                    type="text"
                    required
                    value={legSource}
                    onChange={(e) => setLegSource(e.target.value)}
                    placeholder="Supremo Tribunal Federal"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Título de Identificação
                </label>
                <input
                  type="text"
                  required
                  value={legTitle}
                  onChange={(e) => setLegTitle(e.target.value)}
                  placeholder="Ex: Súmula Vinculante nº 58 (STF)"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Disciplina / Assunto
                  </label>
                  <input
                    type="text"
                    value={legSubject}
                    onChange={(e) => setLegSubject(e.target.value)}
                    placeholder="Direito Tributário"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Artigo de Lei Relacionado
                  </label>
                  <input
                    type="text"
                    value={legArticle}
                    onChange={(e) => setLegArticle(e.target.value)}
                    placeholder="Art. 150, VI, 'c' da CF/88"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Enunciado Oficial / Texto Legal
                </label>
                <textarea
                  required
                  rows={3}
                  value={legStatement}
                  onChange={(e) => setLegStatement(e.target.value)}
                  placeholder="Texto literal da súmula ou dispositivo legal..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Contexto Prático & Pegadinhas de Prova
                </label>
                <textarea
                  rows={2}
                  value={legPracticalContext}
                  onChange={(e) => setLegPracticalContext(e.target.value)}
                  placeholder="Explicação prática de como as bancas cobram em provas objetivas..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLegalItem(null);
                    setIsNewLegalItemModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CONFIRM DELETE SIMULADO */}
      {/* ======================================================== */}
      {simuladoDeleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Excluir Simulado de Prova?
            </h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Tem certeza de que deseja excluir este simulado? Esta ação removerá a prova e o histórico correspondente para todos os alunos.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setSimuladoDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteSimulado}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Sim, Excluir Simulado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CONFIRM DELETE LEGAL ITEM */}
      {/* ======================================================== */}
      {legalDeleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Excluir Súmula ou Dispositivo?
            </h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              O item será removido permanentemente da base de consulta e flashcards jurídicos dos alunos.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setLegalDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteLegal}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Sim, Excluir Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CONFIRM DELETE USER PROFILE */}
      {/* ======================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-300">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Excluir E-mail e Conta Cadastrada
            </h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Você está prestes a excluir definitivamente o e-mail <strong className="text-rose-600 font-mono font-bold">{userToDelete.email}</strong> vinculado ao estudante <strong className="text-[#0F172A]">{userToDelete.name}</strong>.
              O acesso à plataforma será revogado imediatamente e todos os registros associados serão apagados.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Sim, Excluir E-mail e Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RESTRICT USER ACCESS */}
      {/* ======================================================== */}
      {userToRestrict && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-300">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Ban className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">
              {userToRestrict.status === 'ativo' ? 'Restringir Acesso do Usuário' : 'Restabelecer Acesso do Usuário'}
            </h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              {userToRestrict.status === 'ativo' ? (
                <>O usuário <strong className="text-[#0F172A]">{userToRestrict.name}</strong> perderá o acesso imediato à plataforma, simulados e resolução de questões.</>
              ) : (
                <>Deseja reativar a conta de <strong className="text-[#0F172A]">{userToRestrict.name}</strong> e liberar o acesso novamente?</>
              )}
            </p>

            {userToRestrict.status === 'ativo' && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Motivo da Restrição / Notificação Administrativa
                </label>
                <textarea
                  rows={3}
                  value={restrictionReason}
                  onChange={(e) => setRestrictionReason(e.target.value)}
                  placeholder="Descreva o motivo formal da restrição..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setUserToRestrict(null)}
                className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRestrictUser}
                className={`px-4 py-2 rounded-lg text-white text-xs font-bold shadow-sm ${
                  userToRestrict.status === 'ativo'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {userToRestrict.status === 'ativo' ? 'Confirmar Restrição' : 'Liberar Acesso Agora'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CONFIRM DELETE QUESTION */}
      {/* ======================================================== */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-300">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#0F172A]">
              Excluir Questão do Banco?
            </h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Você está prestes a excluir permanentemente a questão <strong className="text-[#0F172A]">{questionToDelete.code}</strong> ({questionToDelete.subject} - {questionToDelete.topic}).
              Ela não aparecerá mais nos cadernos de questões nem nos simulados.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setQuestionToDelete(null)}
                className="px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#64748B]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteQuestion}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Sim, Excluir Questão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW QUESTION DETAILS */}
      {/* ======================================================== */}
      {questionToView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-[#0F172A]">
                  Detalhes da Questão ({questionToView.code})
                </h3>
              </div>
              <button
                onClick={() => setQuestionToView(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#0F172A]">{questionToView.subject}</span>
                <span>•</span>
                <span className="text-[#64748B]">{questionToView.topic}</span>
                <span>•</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{questionToView.board} / {questionToView.year}</span>
              </div>

              <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] text-[#1E293B] leading-relaxed">
                {questionToView.statement}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#0F172A] block">Alternativas de Resposta:</span>
                {questionToView.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                      opt.id === questionToView.correctOptionId
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-[#E2E8F0] bg-white text-[#475569]'
                    }`}
                  >
                    <span className="font-black">{opt.label})</span>
                    <div className="flex-1">
                      <span>{opt.text}</span>
                      {opt.explanation && (
                        <div className="text-[11px] text-slate-500 mt-1 italic font-normal">
                          {opt.explanation}
                        </div>
                      )}
                    </div>
                    {opt.id === questionToView.correctOptionId && (
                      <span className="ml-auto text-[10px] bg-emerald-600 text-white px-2 py-0.2 rounded font-bold shrink-0">
                        Gabarito Oficial
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {questionToView.legalBasis && (
                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-amber-900">
                  <strong className="block mb-1">Fundamentação Legal & Súmulas:</strong>
                  <p>{questionToView.legalBasis}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] mt-5">
              <button
                onClick={() => {
                  const q = questionToView;
                  setQuestionToView(null);
                  setQuestionToDelete(q);
                }}
                className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Esta Questão</span>
              </button>

              <button
                onClick={() => setQuestionToView(null)}
                className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: CADASTRAR NOVO ALUNO COM FOTO (ADMIN) */}
      {/* ======================================================== */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0F172A]">
                    Cadastrar Novo Aluno com Foto
                  </h3>
                  <span className="text-[10px] text-[#64748B]">
                    Registro administrativo com foto de perfil e permissões
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUserByAdmin} className="space-y-4">
              {/* Photo Upload with Webcam, Device Upload and Presets */}
              <StudentPhotoCapture
                label="Foto de Perfil do Aluno (3x4)"
                sublabel="Use a webcam para tirar foto na hora, faça upload do arquivo ou selecione um avatar."
                photoUrl={newUserAvatar}
                onChangePhoto={(url) => setNewUserAvatar(url)}
                allowCamera={true}
                aspectRatio="square"
                placeholderText="Sem foto"
              />

              {/* Optional Document Photo */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Foto do Documento do Aluno (Opcional)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdminDocUpload(!showAdminDocUpload)}
                    className="text-xs text-[#2563EB] hover:underline font-bold cursor-pointer"
                  >
                    {showAdminDocUpload ? 'Ocultar' : newUserDocPhoto ? 'Alterar Documento' : '+ Anexar'}
                  </button>
                </div>

                {showAdminDocUpload && (
                  <StudentPhotoCapture
                    label="Foto do Documento (RG / CNH)"
                    sublabel="Carregue ou capture a foto do documento comprobatório."
                    photoUrl={newUserDocPhoto}
                    onChangePhoto={(url) => setNewUserDocPhoto(url)}
                    allowCamera={true}
                    aspectRatio="document"
                    placeholderText="Sem documento"
                  />
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Gabriela Castro"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    E-mail do Aluno *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="gabriela.castro@concursos.com"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Senha de Acesso do Aluno (Mínimo de 6 dígitos) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Defina uma senha com no mínimo 6 dígitos"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Role & Target */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Tipo de Plano / Perfil
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="aluno_premium">Aluno Premium (Plano Elite)</option>
                    <option value="aluno">Aluno Regular (Padrão)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Concurso ou Exame Alvo
                  </label>
                  <select
                    value={newUserTarget}
                    onChange={(e) => setNewUserTarget(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="OAB 43º Exame Unificado">OAB 43º Exame Unificado</option>
                    <option value="RFB 2026 (Auditor-Fiscal)">RFB 2026 (Auditor-Fiscal)</option>
                    <option value="Magistratura Estadual">Magistratura Estadual</option>
                    <option value="Ministério Público Federal">Ministério Público Federal</option>
                    <option value="TCU 2026 (Auditor Federal)">TCU 2026 (Auditor Federal)</option>
                    <option value="Polícia Federal (Agente)">Polícia Federal (Agente)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Salvar Cadastro com Foto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VER DOSSIÊ & CARTEIRINHA DO ALUNO (COM FOTOS) */}
      {/* ======================================================== */}
      {userToViewDossier && (
        <div 
          onClick={() => setUserToViewDossier(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0F172A]">
                    Dossiê do Estudante & Fotos
                  </h3>
                  <span className="text-[10px] text-[#64748B]">
                    Carteirinha digital oficial e fotos cadastradas no sistema
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUserToViewDossier(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Official ID Card Badge */}
            <StudentCardBadge user={userToViewDossier} />

            {/* Student Profile Photos Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Profile Photo */}
              <div className="p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
                <span className="text-xs font-bold text-[#0F172A] block flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Foto de Rosto (3x4)</span>
                </span>
                <div className="w-full h-36 rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center border border-white">
                  {userToViewDossier.avatarUrl ? (
                    <img
                      src={userToViewDossier.avatarUrl}
                      alt={userToViewDossier.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs text-white/60 font-bold">Sem foto de perfil</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingDossierPhoto(!isEditingDossierPhoto)}
                  className="w-full py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEditingDossierPhoto ? 'Fechar Editor de Foto' : 'Alterar Foto do Aluno'}
                </button>
              </div>

              {/* Document Photo */}
              <div className="p-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
                <span className="text-xs font-bold text-[#0F172A] block flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Foto do Documento Oficial</span>
                </span>
                <div className="w-full h-36 rounded-lg bg-slate-900 overflow-hidden flex items-center justify-center border border-white">
                  {userToViewDossier.documentPhotoUrl ? (
                    <img
                      src={userToViewDossier.documentPhotoUrl}
                      alt="Documento do Aluno"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center p-3 text-white/60">
                      <FileCheck2 className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                      <span className="text-[11px]">Nenhum documento anexado</span>
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-center text-[#64748B] pt-0.5">
                  {userToViewDossier.documentPhotoUrl ? 'Documento anexado no cadastro' : 'Foto pendente'}
                </div>
              </div>
            </div>

            {/* Quick Photo Editor Drawer in Dossier */}
            {isEditingDossierPhoto && (
              <div className="animate-in fade-in duration-150">
                <StudentPhotoCapture
                  label={`Atualizar Foto de ${userToViewDossier.name}`}
                  sublabel="Selecione um arquivo, tire foto com webcam ou escolha um avatar."
                  photoUrl={userToViewDossier.avatarUrl || ''}
                  onChangePhoto={(newUrl) => {
                    const updated = {
                      ...userToViewDossier,
                      avatarUrl: newUrl,
                    };
                    setUserToViewDossier(updated);
                    if (onUpdateUser) {
                      onUpdateUser(updated);
                    }
                    showToast(`Foto de ${updated.name} atualizada com sucesso!`);
                    setIsEditingDossierPhoto(false);
                  }}
                />
              </div>
            )}

            {/* Student Stats Summary */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Status</span>
                <span className={`font-black uppercase text-[11px] ${
                  userToViewDossier.status === 'ativo' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {userToViewDossier.status}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Questões</span>
                <span className="font-black text-[#0F172A]">{userToViewDossier.questionsAnswered}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Acerto</span>
                <span className="font-black text-emerald-600">{userToViewDossier.accuracyRate}%</span>
              </div>
            </div>

            {/* Pending Approval Callout in Dossier */}
            {userToViewDossier.status === 'pendente_aprovacao' && (
              <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="text-xs">
                  <strong className="block font-black text-amber-950">Aguardando Sua Aprovação</strong>
                  <span className="text-amber-800">Este aluno enviou o cadastro e fotos e está bloqueado até ser homologado.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      handleApproveStudent(userToViewDossier.id);
                      setUserToViewDossier({ ...userToViewDossier, status: 'ativo' });
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovar Matrícula Agora</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRejectStudent(userToViewDossier.id);
                      setUserToViewDossier({ ...userToViewDossier, status: 'rejeitado' });
                    }}
                    className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setUserToViewDossier(null)}
                className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold"
              >
                Fechar Dossiê
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* MODAL: CRIAR / EDITAR CURSO OFICIAL PARA INSCRIÇÃO */}
      {/* ======================================================== */}
      {isNewCourseModalOpen && (
        <div 
          onClick={() => setIsNewCourseModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">
                    {editingCourse ? 'Editar Curso Oficial' : 'Publicar Novo Curso para Inscrição'}
                  </h3>
                  <span className="text-[10px] text-[#64748B]">
                    Configure as informações do concurso e disponibilize para os alunos
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCourseModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#334155] mb-1">Nome do Curso / Preparatório *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Receita Federal do Brasil (Auditor-Fiscal - Turma Elite)"
                    value={crsName}
                    onChange={(e) => setCrsName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Sigla / Código Curto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: RFB 2026"
                    value={crsCode}
                    onChange={(e) => setCrsCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Categoria / Carreira *</label>
                  <select
                    value={crsCategory}
                    onChange={(e) => setCrsCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  >
                    <option value="Fiscal & Controle">Fiscal & Controle</option>
                    <option value="Carreira Jurídica">Carreira Jurídica</option>
                    <option value="Policial">Policial</option>
                    <option value="Tribunais">Tribunais</option>
                    <option value="Carreiras Gerais">Carreiras Gerais</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Cargo Pretendido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Auditor-Fiscal da Receita"
                    value={crsRole}
                    onChange={(e) => setCrsRole(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Órgão / Banca Oficial</label>
                  <input
                    type="text"
                    placeholder="Ex: Receita Federal / FGV"
                    value={crsAgency}
                    onChange={(e) => setCrsAgency(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Remuneração Inicial</label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 22.921,71"
                    value={crsSalary}
                    onChange={(e) => setCrsSalary(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Total de Vagas</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Ex: 699"
                    value={crsSeats}
                    onChange={(e) => setCrsSeats(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Data da Prova</label>
                  <input
                    type="text"
                    placeholder="Ex: 15 de Novembro de 2026"
                    value={crsExamDate}
                    onChange={(e) => setCrsExamDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#334155] mb-1">Carga Horária (horas)</label>
                  <input
                    type="number"
                    min={10}
                    placeholder="Ex: 380"
                    value={crsWorkload}
                    onChange={(e) => setCrsWorkload(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#334155] mb-1">Instrutor / Coordenação Pedagógica</label>
                  <input
                    type="text"
                    placeholder="Ex: Prof. Alexandre Meirelles & Equipe de Auditores"
                    value={crsInstructor}
                    onChange={(e) => setCrsInstructor(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#334155] mb-1">Descrição do Curso & Conteúdo Programático</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva a metodologia, disciplinas abordadas, módulos e diferenciais do curso..."
                    value={crsDescription}
                    onChange={(e) => setCrsDescription(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#CBD5E1] bg-white outline-none focus:border-blue-600"
                  />
                </div>

                {/* Enrollment Open Checkbox */}
                <div className="sm:col-span-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                  <div>
                    <strong className="block text-blue-950 font-bold">Inscrições Abertas para Alunos</strong>
                    <span className="text-[11px] text-blue-800">Se desmarcado, os alunos verão o curso como &quot;Inscrições Encerradas&quot;.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={crsIsOpen}
                    onChange={(e) => setCrsIsOpen(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{editingCourse ? 'Salvar Alterações' : 'Publicar Curso'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VER E GERENCIAR ALUNOS MATRICULADOS NO CURSO */}
      {/* ======================================================== */}
      {courseToViewStudents && (
        <div 
          onClick={() => setCourseToViewStudents(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">
                    Alunos Inscritos: {courseToViewStudents.name}
                  </h3>
                  <span className="text-[10px] text-[#64748B]">
                    {courseToViewStudents.code} • {courseToViewStudents.enrolledStudentIds?.length || 0} alunos matriculados
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCourseToViewStudents(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Manual Enrollment Bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">
                Matricular Aluno:
              </span>
              <select
                value={studentToEnrollId}
                onChange={(e) => setStudentToEnrollId(e.target.value)}
                className="flex-1 text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white outline-none"
              >
                <option value="">Selecione um aluno da plataforma...</option>
                {users
                  .filter((u) => u.role !== 'admin' && !courseToViewStudents.enrolledStudentIds?.includes(u.id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) - {u.status === 'ativo' ? 'Aprovado' : 'Pendente'}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                disabled={!studentToEnrollId}
                onClick={() => {
                  if (!studentToEnrollId) return;
                  onEnrollStudentInCourse?.(courseToViewStudents.id, studentToEnrollId);
                  const enrolledUser = users.find((u) => u.id === studentToEnrollId);
                  showToast(`Aluno ${enrolledUser?.name || ''} matriculado no curso!`);
                  setCourseToViewStudents((prev) =>
                    prev
                      ? {
                          ...prev,
                          enrolledStudentIds: [...(prev.enrolledStudentIds || []), studentToEnrollId],
                          enrolledStudentsCount: (prev.enrolledStudentsCount || 0) + 1,
                        }
                      : null
                  );
                  setStudentToEnrollId('');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold text-white shrink-0 ${
                  studentToEnrollId ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer' : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                + Adicionar ao Curso
              </button>
            </div>

            {/* List of Enrolled Students */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                Relação de Matrículas Ativas:
              </span>

              {users
                .filter((u) => courseToViewStudents.enrolledStudentIds?.includes(u.id))
                .map((student) => (
                  <div
                    key={student.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#CBD5E1]">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          student.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0F172A] truncate">{student.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            student.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {student.status === 'ativo' ? 'Aprovado' : 'Pendente'}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px] block truncate">{student.email} • {student.phone || 'Sem telefone'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onUnenrollStudentFromCourse?.(courseToViewStudents.id, student.id);
                        showToast(`Matrícula de ${student.name} cancelada no curso.`);
                        setCourseToViewStudents((prev) =>
                          prev
                            ? {
                                ...prev,
                                enrolledStudentIds: (prev.enrolledStudentIds || []).filter((id) => id !== student.id),
                                enrolledStudentsCount: Math.max(0, (prev.enrolledStudentsCount || 1) - 1),
                              }
                            : null
                        );
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer shrink-0"
                    >
                      Remover Matrícula
                    </button>
                  </div>
                ))}

              {(!courseToViewStudents.enrolledStudentIds || courseToViewStudents.enrolledStudentIds.length === 0) && (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  Nenhum aluno matriculado neste curso ainda. Use o campo acima para matricular manualmente ou aguarde inscrições de alunos.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setCourseToViewStudents(null)}
                className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-bold cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CONFIRMAÇÃO DE EXCLUSÃO DE CURSO */}
      {/* ======================================================== */}
      {courseToDeleteId && (
        <div 
          onClick={() => setCourseToDeleteId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0F172A]">
                  Excluir Curso do Catálogo Oficial?
                </h3>
                <p className="text-xs text-[#64748B]">
                  Esta ação removerá o curso e as inscrições vinculadas a ele.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-slate-100">
              <button
                type="button"
                onClick={() => setCourseToDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCourse}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN EDIT QUESTIONS OF SIMULADO */}
      {editingSimuladoQuestions && (
        <SimuladoQuestionsEditorModal
          isOpen={!!editingSimuladoQuestions}
          onClose={() => setEditingSimuladoQuestions(null)}
          exam={editingSimuladoQuestions}
          allAvailableQuestions={questions}
          onSaveExam={(updated) => {
            onUpdateSimulado(updated);
            addLog(`Questões do simulado "${updated.title}" foram atualizadas pelo administrador.`, 'edit');
            showToast(`Questões do simulado "${updated.title}" atualizadas com sucesso!`, 'success');
            setEditingSimuladoQuestions(null);
          }}
        />
      )}
    </div>
  );
}
