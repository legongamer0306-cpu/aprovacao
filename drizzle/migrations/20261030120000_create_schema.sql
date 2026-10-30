-- 2026-10-30 12:00:00 - Criação da estrutura de banco de dados do Aprovação Total
-- ----------------------------------------------------------------------
-- 1️⃣ Habilitar extensão pgcrypto para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2️⃣ ENUMS oficiais
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('aluno', 'aluno_premium', 'professor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ativo', 'pendente_aprovacao', 'restrito', 'suspenso', 'rejeitado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE question_difficulty AS ENUM ('Fácil', 'Média', 'Difícil');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE simulado_status AS ENUM ('disponivel', 'em_andamento', 'concluido');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE simulado_difficulty AS ENUM ('Média', 'Difícil', 'Padrão Oficial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE legal_relevance AS ENUM ('Alta Incidência', 'Tema Quente', 'Essencial', 'Inédito');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3️⃣ TABELAS
-- 3.1 Users
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

-- 3.2 courses
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

-- 3.3 course_enrollments
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

-- 3.4 questions
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

-- 3.5 mock_exams
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

-- 3.6 mock_exam_submissions
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

-- 3.7 flashcards
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

-- Contra-frase: nota final bcd --
COMMIT;
