import { 
  pgTable, 
  varchar, 
  text, 
  integer, 
  boolean, 
  timestamp, 
  uuid, 
  jsonb, 
  pgEnum, 
  index, 
  uniqueIndex 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS FOR POSTGRESQL 17
// ============================================================================
export const userRoleEnum = pgEnum('user_role', [
  'aluno', 
  'aluno_premium', 
  'professor', 
  'admin'
]);

export const userStatusEnum = pgEnum('user_status', [
  'ativo', 
  'pendente_aprovacao', 
  'restrito', 
  'suspenso', 
  'rejeitado'
]);

export const questionDifficultyEnum = pgEnum('question_difficulty', [
  'Fácil', 
  'Média', 
  'Difícil'
]);

export const simuladoStatusEnum = pgEnum('simulado_status', [
  'disponivel', 
  'em_andamento', 
  'concluido'
]);

export const simuladoDifficultyEnum = pgEnum('simulado_difficulty', [
  'Média', 
  'Difícil', 
  'Padrão Oficial'
]);

export const legalRelevanceEnum = pgEnum('legal_relevance', [
  'Alta Incidência', 
  'Tema Quente', 
  'Essencial', 
  'Inédito'
]);

// ============================================================================
// 1. USERS & STUDENTS (ALUNOS & ADMINISTRADORES)
// ============================================================================
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // e.g. 'usr-1' or uuid
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password'), // Senha vinculada ao e-mail específico (mínimo de 6 dígitos)
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').default('aluno').notNull(),
  status: userStatusEnum('status').default('pendente_aprovacao').notNull(),
  targetExam: varchar('target_exam', { length: 255 }).default('Receita Federal do Brasil (Curso Oficial)'),
  questionsAnswered: integer('questions_answered').default(0).notNull(),
  accuracyRate: integer('accuracy_rate').default(0).notNull(),
  restrictionReason: text('restriction_reason'),
  rejectionReason: text('rejection_reason'),
  avatarUrl: text('avatar_url'),
  documentPhotoUrl: text('document_photo_url'),
  photos: jsonb('photos').default([]).$type<string[]>(),
  phone: varchar('phone', { length: 50 }),
  cpf: varchar('cpf', { length: 20 }),
  registrationDate: varchar('registration_date', { length: 100 }).notNull(),
  approvedAt: varchar('approved_at', { length: 100 }),
  approvedBy: varchar('approved_by', { length: 255 }),
  lastActive: varchar('last_active', { length: 100 }).default('Hoje'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_email_idx').on(table.email),
  index('users_status_idx').on(table.status),
  index('users_role_idx').on(table.role),
  index('users_target_exam_idx').on(table.targetExam),
]);

// ============================================================================
// 2. COURSES & EXAM TARGETS (CURSOS & EDITAIS OFICIAIS)
// ============================================================================
export const courses = pgTable('courses', {
  id: varchar('id', { length: 255 }).primaryKey(), // e.g. 'rfb-auditor'
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  agency: varchar('agency', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  totalSeats: integer('total_seats').default(0).notNull(),
  salary: varchar('salary', { length: 100 }).default('A definir'),
  examDate: varchar('exam_date', { length: 100 }).notNull(),
  daysRemaining: integer('days_remaining').default(0).notNull(),
  progressPercent: integer('progress_percent').default(0).notNull(),
  category: varchar('category', { length: 100 }).default('Carreira Jurídica'),
  workloadHours: integer('workload_hours').default(0),
  instructor: varchar('instructor', { length: 255 }),
  isOpenForEnrollment: boolean('is_open_for_enrollment').default(true).notNull(),
  enrolledStudentsCount: integer('enrolled_students_count').default(0).notNull(),
  enrollmentDeadline: varchar('enrollment_deadline', { length: 100 }),
  description: text('description'),
  syllabus: jsonb('syllabus').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('courses_code_idx').on(table.code),
  index('courses_category_idx').on(table.category),
  index('courses_is_open_idx').on(table.isOpenForEnrollment),
]);

// ============================================================================
// 3. COURSE ENROLLMENTS (INSCRIÇÕES DE ALUNOS NOS CURSOS)
// ============================================================================
export const courseEnrollments = pgTable('course_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: varchar('course_id', { length: 255 }).notNull().references(() => courses.id, { onDelete: 'cascade' }),
  studentId: varchar('student_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).defaultNow().notNull(),
  status: varchar('status', { length: 50 }).default('ativo').notNull(),
}, (table) => [
  uniqueIndex('enrollment_student_course_idx').on(table.studentId, table.courseId),
  index('enrollment_course_idx').on(table.courseId),
  index('enrollment_student_idx').on(table.studentId),
]);

// ============================================================================
// 4. QUESTIONS BANK (BANCO DE QUESTÕES COMENTADAS)
// ============================================================================
export const questions = pgTable('questions', {
  id: varchar('id', { length: 255 }).primaryKey(), // e.g. 'q-101'
  code: varchar('code', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  board: varchar('board', { length: 100 }).notNull(), // FGV, Cebraspe, FCC, etc.
  agency: varchar('agency', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  difficulty: questionDifficultyEnum('difficulty').default('Média').notNull(),
  statement: text('statement').notNull(),
  options: jsonb('options').notNull().$type<Array<{
    id: string;
    label: string;
    text: string;
    explanation: string;
  }>>(),
  correctOptionId: varchar('correct_option_id', { length: 50 }).notNull(),
  legalBasis: text('legal_basis'),
  tags: jsonb('tags').default([]).$type<string[]>(),
  origin: varchar('origin', { length: 50 }).default('oficial'),
  author: jsonb('author').$type<{
    name: string;
    avatar?: string;
    badge?: string;
  }>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('questions_subject_idx').on(table.subject),
  index('questions_board_idx').on(table.board),
  index('questions_agency_idx').on(table.agency),
  index('questions_difficulty_idx').on(table.difficulty),
  index('questions_year_idx').on(table.year),
]);

// ============================================================================
// 5. MOCK EXAMS & SIMULADOS (PROVAS OFICIAIS & CRONOMETRADAS)
// ============================================================================
export const mockExams = pgTable('mock_exams', {
  id: varchar('id', { length: 255 }).primaryKey(), // e.g. 'sim-1'
  title: varchar('title', { length: 255 }).notNull(),
  code: varchar('code', { length: 100 }).notNull(),
  agency: varchar('agency', { length: 255 }).notNull(),
  board: varchar('board', { length: 100 }).notNull(),
  totalQuestions: integer('total_questions').default(0).notNull(),
  durationMinutes: integer('duration_minutes').default(240).notNull(),
  cutoffRate: integer('cutoff_rate').default(80).notNull(),
  status: simuladoStatusEnum('status').default('disponivel').notNull(),
  difficulty: simuladoDifficultyEnum('difficulty').default('Padrão Oficial').notNull(),
  subjectsCovered: jsonb('subjects_covered').default([]).$type<string[]>(),
  questions: jsonb('questions').default([]).$type<any[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('mock_exams_code_idx').on(table.code),
  index('mock_exams_status_idx').on(table.status),
  index('mock_exams_agency_idx').on(table.agency),
]);

// ============================================================================
// 6. SIMULADO SUBMISSIONS & RESULTS (HISTÓRICO DE RESPOSTAS & NOTAS)
// ============================================================================
export const mockExamSubmissions = pgTable('mock_exam_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  simuladoId: varchar('simulado_id', { length: 255 }).notNull().references(() => mockExams.id, { onDelete: 'cascade' }),
  studentId: varchar('student_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  userTimeSpentSeconds: integer('user_time_spent_seconds').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  answersData: jsonb('answers_data').$type<Record<string, string>>(),
}, (table) => [
  index('submissions_student_idx').on(table.studentId),
  index('submissions_simulado_idx').on(table.simuladoId),
]);

// ============================================================================
// 7. FLASHCARDS SRS (REPETIÇÃO ESPAÇADA)
// ============================================================================
export const flashcards = pgTable('flashcards', {
  id: varchar('id', { length: 255 }).primaryKey(),
  subject: varchar('subject', { length: 255 }).notNull(),
  deckName: varchar('deck_name', { length: 255 }).notNull(),
  front: text('front').notNull(),
  back: text('back').notNull(),
  legalRef: text('legal_ref'),
  difficulty: questionDifficultyEnum('difficulty').default('Média').notNull(),
  nextReview: varchar('next_review', { length: 100 }).notNull(),
  intervalDays: integer('interval_days').default(1).notNull(),
  masteryPercent: integer('mastery_percent').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('flashcards_subject_idx').on(table.subject),
  index('flashcards_deck_idx').on(table.deckName),
]);

// ============================================================================
// 8. MIND MAPS (MAPAS MENTAIS & RESUMOS VISUAIS)
// ============================================================================
export const mindMaps = pgTable('mind_maps', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  flashcardId: varchar('flashcard_id', { length: 255 }),
  summary: text('summary').notNull(),
  difficulty: questionDifficultyEnum('difficulty').default('Média').notNull(),
  viewsCount: integer('views_count').default(0),
  lastUpdated: varchar('last_updated', { length: 100 }),
  rootNode: jsonb('root_node').notNull(),
  tags: jsonb('tags').default([]).$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('mind_maps_subject_idx').on(table.subject),
  index('mind_maps_topic_idx').on(table.topic),
]);

// ============================================================================
// 9. JURISPRUDÊNCIA & SÚMULAS (SÚMULAS VINCULANTES, CNJ & LEI SECA)
// ============================================================================
export const legalItems = pgTable('legal_items', {
  id: varchar('id', { length: 255 }).primaryKey(),
  category: varchar('category', { length: 100 }).notNull(), // Súmula Vinculante, Súmula, Repercussão Geral, etc.
  title: varchar('title', { length: 255 }).notNull(),
  source: varchar('source', { length: 255 }).notNull(),
  statement: text('statement').notNull(),
  practicalContext: text('practical_context').notNull(),
  relevance: varchar('relevance', { length: 100 }).default('Essencial').notNull(),
  subject: varchar('subject', { length: 255 }),
  articleNumber: varchar('article_number', { length: 100 }),
  favorite: boolean('favorite').default(false),
  isCustom: boolean('is_custom').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('legal_items_category_idx').on(table.category),
  index('legal_items_subject_idx').on(table.subject),
  index('legal_items_relevance_idx').on(table.relevance),
]);

// ============================================================================
// 10. STUDY PDFS & CLASSES (CADERNOS & MATERIAIS DIDÁTICOS)
// ============================================================================
export const studyPdfs = pgTable('study_pdfs', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }),
  courseId: varchar('course_id', { length: 255 }).references(() => courses.id, { onDelete: 'cascade' }),
  courseName: varchar('course_name', { length: 255 }),
  studentId: varchar('student_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: varchar('file_size', { length: 50 }).notNull(),
  totalPages: integer('total_pages').default(1).notNull(),
  currentPage: integer('current_page').default(1).notNull(),
  uploadDate: varchar('upload_date', { length: 100 }),
  notes: text('notes'),
  favorite: boolean('favorite').default(false),
  tagColor: varchar('tag_color', { length: 50 }),
  fileUrl: text('file_url'),
  fileData: text('file_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('study_pdfs_subject_idx').on(table.subject),
  index('study_pdfs_course_idx').on(table.courseId),
  index('study_pdfs_student_idx').on(table.studentId),
]);

// ============================================================================
// 11. DAILY STUDY TASKS (CRONOGRAMA & TAREFAS DIÁRIAS)
// ============================================================================
export const dailyTasks = pgTable('daily_tasks', {
  id: varchar('id', { length: 255 }).primaryKey(),
  studentId: varchar('student_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // questoes, teoria, revisao, simulado, lei_seca
  durationMinutes: integer('duration_minutes').default(30).notNull(),
  completed: boolean('completed').default(false).notNull(),
  targetCount: integer('target_count'),
  currentCount: integer('current_count'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('daily_tasks_student_idx').on(table.studentId),
]);

// ============================================================================
// 12. AUDIT LOGS & ADMINISTRATIVE SECURITY (REGISTRO DE AUDITORIA)
// ============================================================================
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: varchar('action', { length: 100 }).notNull(), // APPROVE_USER, REJECT_USER, CREATE_COURSE, etc.
  actorEmail: varchar('actor_email', { length: 255 }).notNull(),
  targetType: varchar('target_type', { length: 100 }).notNull(),
  targetId: varchar('target_id', { length: 255 }),
  details: jsonb('details'),
  ipAddress: varchar('ip_address', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('audit_logs_actor_idx').on(table.actorEmail),
  index('audit_logs_action_idx').on(table.action),
  index('audit_logs_created_idx').on(table.createdAt),
]);

// ============================================================================
// 13. STUDENT QUESTION ANSWERS (HISTÓRICO INDIVIDUAL DE RESPOSTAS)
// ============================================================================
export const studentAnswers = pgTable('student_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: varchar('student_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: varchar('question_id', { length: 255 }).notNull().references(() => questions.id, { onDelete: 'cascade' }),
  selectedOptionId: varchar('selected_option_id', { length: 50 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  answeredAt: timestamp('answered_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('student_answers_student_idx').on(table.studentId),
  index('student_answers_question_idx').on(table.questionId),
  index('student_answers_subject_idx').on(table.subject),
]);

// ============================================================================
// RELATIONS DEFINITIONS
// ============================================================================
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(courseEnrollments),
  submissions: many(mockExamSubmissions),
  tasks: many(dailyTasks),
  answers: many(studentAnswers),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(courseEnrollments),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one }) => ({
  course: one(courses, {
    fields: [courseEnrollments.courseId],
    references: [courses.id],
  }),
  student: one(users, {
    fields: [courseEnrollments.studentId],
    references: [users.id],
  }),
}));

export const mockExamsRelations = relations(mockExams, ({ many }) => ({
  submissions: many(mockExamSubmissions),
}));

export const mockExamSubmissionsRelations = relations(mockExamSubmissions, ({ one }) => ({
  simulado: one(mockExams, {
    fields: [mockExamSubmissions.simuladoId],
    references: [mockExams.id],
  }),
  student: one(users, {
    fields: [mockExamSubmissions.studentId],
    references: [users.id],
  }),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  studentAnswers: many(studentAnswers),
}));

export const studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
  student: one(users, {
    fields: [studentAnswers.studentId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [studentAnswers.questionId],
    references: [questions.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type DbUser = typeof users.$inferSelect;
export type DbNewUser = typeof users.$inferInsert;

export type DbCourse = typeof courses.$inferSelect;
export type DbNewCourse = typeof courses.$inferInsert;

export type DbCourseEnrollment = typeof courseEnrollments.$inferSelect;
export type DbNewCourseEnrollment = typeof courseEnrollments.$inferInsert;

export type DbQuestion = typeof questions.$inferSelect;
export type DbNewQuestion = typeof questions.$inferInsert;

export type DbMockExam = typeof mockExams.$inferSelect;
export type DbNewMockExam = typeof mockExams.$inferInsert;

export type DbMockExamSubmission = typeof mockExamSubmissions.$inferSelect;
export type DbNewMockExamSubmission = typeof mockExamSubmissions.$inferInsert;

export type DbFlashcard = typeof flashcards.$inferSelect;
export type DbNewFlashcard = typeof flashcards.$inferInsert;

export type DbMindMap = typeof mindMaps.$inferSelect;
export type DbNewMindMap = typeof mindMaps.$inferInsert;

export type DbLegalItem = typeof legalItems.$inferSelect;
export type DbNewLegalItem = typeof legalItems.$inferInsert;

export type DbStudyPdf = typeof studyPdfs.$inferSelect;
export type DbNewStudyPdf = typeof studyPdfs.$inferInsert;

export type DbDailyTask = typeof dailyTasks.$inferSelect;
export type DbNewDailyTask = typeof dailyTasks.$inferInsert;

export type DbAuditLog = typeof auditLogs.$inferSelect;
export type DbNewAuditLog = typeof auditLogs.$inferInsert;

export type DbStudentAnswer = typeof studentAnswers.$inferSelect;
export type DbNewStudentAnswer = typeof studentAnswers.$inferInsert;
