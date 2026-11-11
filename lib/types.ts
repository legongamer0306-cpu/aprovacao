export interface SyllabusTopic {
  id: string;
  name: string;
  completed: boolean;
  notes?: string;
  weight?: 'Alto' | 'Médio' | 'Baixo';
}

export interface SyllabusSubject {
  id: string;
  subject: string;
  name?: string;
  totalTopics: number;
  completedTopics: number;
  topics: SyllabusTopic[];
}

export interface CustomSyllabus {
  id: string;
  targetId: string;
  title: string;
  pastedContent: string;
  createdAt: string;
  subjects: SyllabusSubject[];
}

export interface StudyPDF {
  id: string;
  title: string;
  subject: string; // Classe de matéria (ex: Direito Constitucional)
  topic?: string;
  courseId: string; // Vínculo obrigatório a um curso específico
  courseName?: string; // Nome legível do curso vinculado
  studentId: string; // Conta de usuário específica (isolamento total entre alunos)
  fileName: string;
  fileSize: string;
  totalPages: number;
  currentPage: number;
  uploadDate: string;
  notes?: string;
  favorite?: boolean;
  tagColor?: string;
  fileUrl?: string; // URL Blob do PDF carregado do dispositivo
  fileData?: string;
}

export interface ExamTarget {
  id: string;
  name: string;
  code: string;
  agency: string;
  role: string;
  totalSeats: number;
  salary: string;
  examDate: string;
  daysRemaining: number;
  progressPercent: number;
  isCustom?: boolean;
  syllabus?: CustomSyllabus;
  description?: string;
  workloadHours?: number;
  category?: 'Carreira Jurídica' | 'Fiscal & Controle' | 'Policial' | 'Tribunais' | 'Carreiras Gerais';
  instructor?: string;
  isOpenForEnrollment?: boolean;
  enrolledStudentsCount?: number;
  enrolledStudentIds?: string[];
  enrollmentDeadline?: string;
}

export interface QuestionOption {
  id: string;
  label: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
  explanation: string;
}

export interface ExamQuestion {
  id: string;
  code: string;
  year: number;
  board: string; // e.g. FGV, Cebraspe, FCC, Vunesp, IA Aprovação Total, Comunidade
  banca?: string; // Sinônimo / alias de board para filtros e buscas por banca
  agency: string; // e.g. Receita Federal, TJ-SP, TCU, Simulado Inédito
  role: string;
  subject: string; // e.g. Direito Constitucional, Direito Tributário
  topic: string; // e.g. Direitos e Garantias Fundamentais
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  statement: string;
  options: QuestionOption[];
  correctOptionId: string;
  legalBasis?: string; // Jurisprudência / Artigo de Lei
  tags: string[];
  points?: number; // Valor / pontuação atribuída no simulado (ex: 2 pontos, 3 pontos)
  origin?: 'oficial' | 'membros' | 'ia';
  author?: {
    name: string;
    avatar?: string;
    badge?: string;
  };
}

export interface Flashcard {
  id: string;
  subject: string;
  deckName: string;
  front: string;
  back: string;
  legalRef: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  nextReview: string;
  intervalDays: number;
  masteryPercent: number;
}

export interface CycleDay {
  day: string; // 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'
  block: string;
  status: 'concluido' | 'hoje' | 'pendente';
  hours?: number;
}

export interface DailyTask {
  id: string;
  title: string;
  subject: string;
  type: 'questoes' | 'teoria' | 'revisao' | 'simulado' | 'lei_seca';
  durationMinutes: number;
  completed: boolean;
  targetCount?: number;
  currentCount?: number;
}

export interface SubjectPerformance {
  subject: string;
  questionsAnswered: number;
  correctCount: number;
  accuracyRate: number;
  trend: 'up' | 'down' | 'neutral';
  delta: string;
  targetRate: number;
  status: 'Domínio' | 'Em Evolução' | 'Atenção Crítica';
}

export interface AuditEntry {
  id: string;
  studentId: string;
  studentName?: string;
  action: 'resolucao_questao' | 'revisao_lei_seca' | 'simulado' | 'edital_colado' | 'ciclo_ajustado';
  description: string;
  subject?: string;
  result?: 'correto' | 'incorreto' | 'concluido';
  timestamp: string;
  details?: string;
}

export interface MockExam {
  id: string;
  title: string;
  code: string;
  agency: string;
  board: string;
  totalQuestions: number;
  durationMinutes: number; // e.g. 240 min (4 hours)
  cutoffRate: number; // e.g. 80%
  completed?: boolean;
  score?: number; // e.g. 84%
  correctAnswers?: number;
  totalPoints?: number; // Pontuação máxima do simulado (soma dos pesos das questões)
  pointsEarned?: number; // Pontos obtidos pelo aluno com base nos pesos das questões acertadas
  userTimeSpentSeconds?: number;
  submittedAt?: string;
  status: 'disponivel' | 'em_andamento' | 'concluido';
  difficulty: 'Média' | 'Difícil' | 'Padrão Oficial';
  questions: ExamQuestion[];
  subjectsCovered: string[];
}

export interface MindMapNode {
  id: string;
  label: string;
  badge?: string;
  description?: string;
  legalArticle?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo' | 'slate';
  mnemonic?: string;
  children?: MindMapNode[];
}

export interface MindMap {
  id: string;
  title: string;
  subject: string;
  topic: string;
  flashcardId?: string;
  summary: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  viewsCount?: number;
  lastUpdated: string;
  rootNode: MindMapNode;
  tags: string[];
}

export interface StudySummary {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  topic?: string;
  rawText: string;
  summaryPoints: string[];
  keyTerms: {
    term: string;
    definition: string;
    relevance: 'Alta' | 'Média' | 'Essencial';
  }[];
  mnemonics?: string[];
  examTips?: string[];
  legalRef?: string;
  createdAt: string;
  readingTimeMinutes: number;
}


export type LegalCategory = 
  | 'Súmula Vinculante' 
  | 'Súmula' 
  | 'Repercussão Geral' 
  | 'Lei Seca' 
  | 'Resoluções do CNJ';

export interface LegalItem {
  id: string;
  category: LegalCategory;
  title: string;
  source: string;
  statement: string;
  practicalContext: string;
  relevance: 'Alta Incidência' | 'Tema Quente' | 'Essencial' | 'Inédito';
  subject?: string;
  articleNumber?: string;
  favorite?: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  password?: string; // Senha vinculada ao e-mail específico (mínimo de 6 dígitos)
  role: 'aluno' | 'aluno_premium' | 'professor' | 'admin';
  targetExam: string;
  questionsAnswered: number;
  accuracyRate: number;
  status: 'ativo' | 'pendente_aprovacao' | 'restrito' | 'suspenso' | 'rejeitado';
  restrictionReason?: string;
  rejectionReason?: string;
  avatarUrl?: string;
  documentPhotoUrl?: string;
  photos?: string[];
  phone?: string;
  cpf?: string;
  registrationDate: string;
  approvedAt?: string;
  approvedBy?: string;
  lastActive: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  adminEmail: string;
  adminName: string;
  role: 'super_admin' | 'gestor_conteudo';
  loginTime?: string;
}

export interface MockExamRankingEntry {
  id: string;
  mockExamId?: string;
  mockExamTitle?: string;
  examId?: string;
  examTitle?: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  correctAnswers: number;
  totalQuestions: number;
  scorePercent?: number;
  percentage?: number;
  pointsEarned: number;
  totalPointsPossible: number;
  completedAt: string;
  timeSpentSeconds: number;
}

export type NotificationCategory = 'edital' | 'banca' | 'meta' | 'streak' | 'simulado' | 'sistema';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  badge?: string;
  studentId?: string; // se undefined, aviso global
}

export interface StudentStreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // YYYY-MM-DD
  activityDates: string[]; // List of YYYY-MM-DD days with study activity
}

export interface StudentDailyGoal {
  targetQuestions: number; // e.g. 15, 30, 40, 50, 100
  answeredToday: number;
  lastResetDate: string; // YYYY-MM-DD
}

