-- ============================================================================
-- APROVAÇÃO TOTAL - BANCO DE DADOS POSTGRESQL 17
-- Arquitetura e DDL Oficial (Sem migrations automáticas)
-- Compatível com: PostgreSQL 17.x
-- ============================================================================

-- Habilitar extensões necessárias para UUID e buscas textuais
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS OFICIAIS
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('aluno', 'aluno_premium', 'professor', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ativo', 'pendente_aprovacao', 'restrito', 'suspenso', 'rejeitado');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE question_difficulty AS ENUM ('Fácil', 'Média', 'Difícil');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE simulado_status AS ENUM ('disponivel', 'em_andamento', 'concluido');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE simulado_difficulty AS ENUM ('Média', 'Difícil', 'Padrão Oficial');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE legal_relevance AS ENUM ('Alta Incidência', 'Tema Quente', 'Essencial', 'Inédito');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 2. TABELA: USUÁRIOS & ALUNOS COM FOTOS (users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  password_hash TEXT,
  role user_role NOT NULL DEFAULT 'aluno',
  status user_status NOT NULL DEFAULT 'pendente_aprovacao',
  target_exam VARCHAR(255) DEFAULT 'Receita Federal do Brasil (Curso Oficial)',
  questions_answered INTEGER NOT NULL DEFAULT 0,
  accuracy_rate INTEGER NOT NULL DEFAULT 0,
  restriction_reason TEXT,
  rejection_reason TEXT,
  avatar_url TEXT,
  document_photo_url TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  phone VARCHAR(50),
  cpf VARCHAR(20),
  registration_date VARCHAR(100) NOT NULL,
  approved_at VARCHAR(100),
  approved_by VARCHAR(255),
  last_active VARCHAR(100) DEFAULT 'Hoje',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_target_exam ON users(target_exam);

-- ============================================================================
-- 3. TABELA: CURSOS & EDITAIS (courses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  agency VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 0,
  salary VARCHAR(100) DEFAULT 'A definir',
  exam_date VARCHAR(100) NOT NULL,
  days_remaining INTEGER NOT NULL DEFAULT 0,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100) DEFAULT 'Carreira Jurídica',
  workload_hours INTEGER DEFAULT 0,
  instructor VARCHAR(255),
  is_open_for_enrollment BOOLEAN NOT NULL DEFAULT TRUE,
  enrolled_students_count INTEGER NOT NULL DEFAULT 0,
  enrollment_deadline VARCHAR(100),
  description TEXT,
  syllabus JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_open ON courses(is_open_for_enrollment);

-- ============================================================================
-- 4. TABELA: INSCRIÇÕES EM CURSOS (course_enrollments)
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR(255) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'ativo',
  CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);

-- ============================================================================
-- 5. TABELA: BANCO DE QUESTÕES (questions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  board VARCHAR(100) NOT NULL,
  agency VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  difficulty question_difficulty NOT NULL DEFAULT 'Média',
  statement TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_id VARCHAR(50) NOT NULL,
  legal_basis TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  origin VARCHAR(50) DEFAULT 'oficial',
  author JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_board ON questions(board);
CREATE INDEX IF NOT EXISTS idx_questions_agency ON questions(agency);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_year ON questions(year);

-- ============================================================================
-- 6. TABELA: SIMULADOS OFICIAIS (mock_exams)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mock_exams (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  agency VARCHAR(255) NOT NULL,
  board VARCHAR(100) NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 240,
  cutoff_rate INTEGER NOT NULL DEFAULT 80,
  status simulado_status NOT NULL DEFAULT 'disponivel',
  difficulty simulado_difficulty NOT NULL DEFAULT 'Padrão Oficial',
  subjects_covered JSONB DEFAULT '[]'::jsonb,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mock_exams_status ON mock_exams(status);
CREATE INDEX IF NOT EXISTS idx_mock_exams_agency ON mock_exams(agency);

-- ============================================================================
-- 7. TABELA: SUBMISSÕES DE SIMULADOS (mock_exam_submissions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mock_exam_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulado_id VARCHAR(255) NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
  student_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  user_time_spent_seconds INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answers_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_submissions_student ON mock_exam_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_simulado ON mock_exam_submissions(simulado_id);

-- ============================================================================
-- 8. TABELA: FLASHCARDS SRS (flashcards)
-- ============================================================================
CREATE TABLE IF NOT EXISTS flashcards (
  id VARCHAR(255) PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  deck_name VARCHAR(255) NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  legal_ref TEXT,
  difficulty question_difficulty NOT NULL DEFAULT 'Média',
  next_review VARCHAR(100) NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 1,
  mastery_percent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flashcards_subject ON flashcards(subject);
CREATE INDEX IF NOT EXISTS idx_flashcards_deck ON flashcards(deck_name);

-- ============================================================================
-- 9. TABELA: MAPAS MENTAIS (mind_maps)
-- ============================================================================
CREATE TABLE IF NOT EXISTS mind_maps (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  flashcard_id VARCHAR(255),
  summary TEXT NOT NULL,
  difficulty question_difficulty NOT NULL DEFAULT 'Média',
  views_count INTEGER DEFAULT 0,
  last_updated VARCHAR(100),
  root_node JSONB NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mind_maps_subject ON mind_maps(subject);

-- ============================================================================
-- 10. TABELA: JURISPRUDÊNCIA & SÚMULAS (legal_items)
-- ============================================================================
CREATE TABLE IF NOT EXISTS legal_items (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  statement TEXT NOT NULL,
  practical_context TEXT NOT NULL,
  relevance VARCHAR(100) NOT NULL DEFAULT 'Essencial',
  subject VARCHAR(255),
  article_number VARCHAR(100),
  favorite BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_items_category ON legal_items(category);
CREATE INDEX IF NOT EXISTS idx_legal_items_subject ON legal_items(subject);

-- ============================================================================
-- 11. TABELA: MATERIAIS & MEUS PDFS (study_pdfs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS study_pdfs (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  topic VARCHAR(255),
  course_id VARCHAR(255) REFERENCES courses(id) ON DELETE CASCADE,
  course_name VARCHAR(255),
  student_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  total_pages INTEGER NOT NULL DEFAULT 1,
  current_page INTEGER NOT NULL DEFAULT 1,
  upload_date VARCHAR(100),
  notes TEXT,
  favorite BOOLEAN DEFAULT FALSE,
  tag_color VARCHAR(50),
  file_url TEXT,
  file_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_pdfs_subject ON study_pdfs(subject);
CREATE INDEX IF NOT EXISTS idx_study_pdfs_course ON study_pdfs(course_id);
CREATE INDEX IF NOT EXISTS idx_study_pdfs_student ON study_pdfs(student_id);

-- ============================================================================
-- 12. TABELA: CRONOGRAMA & TAREFAS DIÁRIAS (daily_tasks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_tasks (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  target_count INTEGER,
  current_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_tasks_student ON daily_tasks(student_id);

-- ============================================================================
-- 13. TABELA: LOGS DE AUDITORIA ADMINISTRATIVA (audit_logs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  target_type VARCHAR(100) NOT NULL,
  target_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================================
-- 14. TABELA: HISTÓRICO DE RESPOSTAS DO ALUNO (student_answers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id VARCHAR(255) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id VARCHAR(50) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  subject VARCHAR(255) NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_answers_student ON student_answers(student_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_question ON student_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_subject ON student_answers(subject);
