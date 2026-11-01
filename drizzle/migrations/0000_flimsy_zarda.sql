-- ============================================================================
-- APROVAÇÃO TOTAL - BANCO DE DADOS POSTGRESQL 17
-- Migration Completa, Segura e Idempotente (Drizzle ORM)
-- Compatível com: Banco de dados virgem OU banco com a migration inicial (7 tabelas)
-- ============================================================================

-- 1. Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint

-- 2. Enums Oficiais (Padrão seguro DO $$ BEGIN ... EXCEPTION duplicate_object)
DO $$ BEGIN
  CREATE TYPE "public"."user_role" AS ENUM('aluno', 'aluno_premium', 'professor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."user_status" AS ENUM('ativo', 'pendente_aprovacao', 'restrito', 'suspenso', 'rejeitado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."question_difficulty" AS ENUM('Fácil', 'Média', 'Difícil');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."simulado_status" AS ENUM('disponivel', 'em_andamento', 'concluido');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."simulado_difficulty" AS ENUM('Média', 'Difícil', 'Padrão Oficial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."legal_relevance" AS ENUM('Alta Incidência', 'Tema Quente', 'Essencial', 'Inédito');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

-- 3. Tabelas Base (CREATE TABLE IF NOT EXISTS)

-- 3.1 users (Alunos, Professores e Administradores)
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"password_hash" text,
	"role" "user_role" DEFAULT 'aluno' NOT NULL,
	"status" "user_status" DEFAULT 'pendente_aprovacao' NOT NULL,
	"target_exam" varchar(255) DEFAULT 'Receita Federal do Brasil (Curso Oficial)',
	"questions_answered" integer DEFAULT 0 NOT NULL,
	"accuracy_rate" integer DEFAULT 0 NOT NULL,
	"restriction_reason" text,
	"rejection_reason" text,
	"avatar_url" text,
	"document_photo_url" text,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"phone" varchar(50),
	"cpf" varchar(20),
	"registration_date" varchar(100) NOT NULL,
	"approved_at" varchar(100),
	"approved_by" varchar(255),
	"last_active" varchar(100) DEFAULT 'Hoje',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint

-- Harmonização de Tipo da Coluna Password (VARCHAR(255) -> TEXT conforme schema.ts)
ALTER TABLE "users" ALTER COLUMN "password" TYPE text;
--> statement-breakpoint

-- 3.2 courses (Cursos e Editais)
CREATE TABLE IF NOT EXISTS "courses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(100) NOT NULL,
	"agency" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"total_seats" integer DEFAULT 0 NOT NULL,
	"salary" varchar(100) DEFAULT 'A definir',
	"exam_date" varchar(100) NOT NULL,
	"days_remaining" integer DEFAULT 0 NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"category" varchar(100) DEFAULT 'Carreira Jurídica',
	"workload_hours" integer DEFAULT 0,
	"instructor" varchar(255),
	"is_open_for_enrollment" boolean DEFAULT true NOT NULL,
	"enrolled_students_count" integer DEFAULT 0 NOT NULL,
	"enrollment_deadline" varchar(100),
	"description" text,
	"syllabus" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.3 course_enrollments (Matrículas em Cursos)
CREATE TABLE IF NOT EXISTS "course_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" varchar(255) NOT NULL,
	"student_id" varchar(255) NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'ativo' NOT NULL
);
--> statement-breakpoint

-- 3.4 questions (Banco de Questões)
CREATE TABLE IF NOT EXISTS "questions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"board" varchar(100) NOT NULL,
	"agency" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"difficulty" "question_difficulty" DEFAULT 'Média' NOT NULL,
	"statement" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_option_id" varchar(50) NOT NULL,
	"legal_basis" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"origin" varchar(50) DEFAULT 'oficial',
	"author" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.5 mock_exams (Simulados Oficiais)
CREATE TABLE IF NOT EXISTS "mock_exams" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"code" varchar(100) NOT NULL,
	"agency" varchar(255) NOT NULL,
	"board" varchar(100) NOT NULL,
	"total_questions" integer DEFAULT 0 NOT NULL,
	"duration_minutes" integer DEFAULT 240 NOT NULL,
	"cutoff_rate" integer DEFAULT 80 NOT NULL,
	"status" "simulado_status" DEFAULT 'disponivel' NOT NULL,
	"difficulty" "simulado_difficulty" DEFAULT 'Padrão Oficial' NOT NULL,
	"subjects_covered" jsonb DEFAULT '[]'::jsonb,
	"questions" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.6 mock_exam_submissions (Submissões de Simulados)
CREATE TABLE IF NOT EXISTS "mock_exam_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"simulado_id" varchar(255) NOT NULL,
	"student_id" varchar(255) NOT NULL,
	"score" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"user_time_spent_seconds" integer NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"answers_data" jsonb
);
--> statement-breakpoint

-- 3.7 flashcards (Flashcards SRS)
CREATE TABLE IF NOT EXISTS "flashcards" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"subject" varchar(255) NOT NULL,
	"deck_name" varchar(255) NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"legal_ref" text,
	"difficulty" "question_difficulty" DEFAULT 'Média' NOT NULL,
	"next_review" varchar(100) NOT NULL,
	"interval_days" integer DEFAULT 1 NOT NULL,
	"mastery_percent" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.8 mind_maps (Mapas Mentais & Esquemas Visuais)
CREATE TABLE IF NOT EXISTS "mind_maps" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"flashcard_id" varchar(255),
	"summary" text NOT NULL,
	"difficulty" "question_difficulty" DEFAULT 'Média' NOT NULL,
	"views_count" integer DEFAULT 0,
	"last_updated" varchar(100),
	"root_node" jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.9 legal_items (Súmulas, Lei Seca & Jurisprudência)
CREATE TABLE IF NOT EXISTS "legal_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"category" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"source" varchar(255) NOT NULL,
	"statement" text NOT NULL,
	"practical_context" text NOT NULL,
	"relevance" varchar(100) DEFAULT 'Essencial' NOT NULL,
	"subject" varchar(255),
	"article_number" varchar(100),
	"favorite" boolean DEFAULT false,
	"is_custom" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.10 study_pdfs (Cadernos e Materiais em PDF)
CREATE TABLE IF NOT EXISTS "study_pdfs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"topic" varchar(255),
	"course_id" varchar(255),
	"course_name" varchar(255),
	"student_id" varchar(255),
	"file_name" varchar(255) NOT NULL,
	"file_size" varchar(50) NOT NULL,
	"total_pages" integer DEFAULT 1 NOT NULL,
	"current_page" integer DEFAULT 1 NOT NULL,
	"upload_date" varchar(100),
	"notes" text,
	"favorite" boolean DEFAULT false,
	"tag_color" varchar(50),
	"file_url" text,
	"file_data" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.11 daily_tasks (Cronograma e Tarefas Diárias)
CREATE TABLE IF NOT EXISTS "daily_tasks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"student_id" varchar(255),
	"title" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"target_count" integer,
	"current_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.12 audit_logs (Logs de Auditoria e Segurança Administrativa)
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(100) NOT NULL,
	"actor_email" varchar(255) NOT NULL,
	"target_type" varchar(100) NOT NULL,
	"target_id" varchar(255),
	"details" jsonb,
	"ip_address" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 3.13 student_answers (Histórico de Resoluções de Questões por Aluno)
CREATE TABLE IF NOT EXISTS "student_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" varchar(255) NOT NULL,
	"question_id" varchar(255) NOT NULL,
	"selected_option_id" varchar(50) NOT NULL,
	"is_correct" boolean NOT NULL,
	"subject" varchar(255) NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- 4. Foreign Keys Idempotentes (DO $$ BEGIN ... EXCEPTION duplicate_object)
DO $$ BEGIN
  ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "mock_exam_submissions" ADD CONSTRAINT "mock_exam_submissions_simulado_id_mock_exams_id_fk" FOREIGN KEY ("simulado_id") REFERENCES "public"."mock_exams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "mock_exam_submissions" ADD CONSTRAINT "mock_exam_submissions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "daily_tasks" ADD CONSTRAINT "daily_tasks_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "study_pdfs" ADD CONSTRAINT "study_pdfs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "study_pdfs" ADD CONSTRAINT "study_pdfs_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

-- 5. Índices das 6 Novas Tabelas (Conforme Ajuste 1 do usuário, índices das 7 tabelas existentes que já têm idx_* são preservados)
CREATE INDEX IF NOT EXISTS "mind_maps_subject_idx" ON "mind_maps" USING btree ("subject");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mind_maps_topic_idx" ON "mind_maps" USING btree ("topic");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "legal_items_category_idx" ON "legal_items" USING btree ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "legal_items_subject_idx" ON "legal_items" USING btree ("subject");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "legal_items_relevance_idx" ON "legal_items" USING btree ("relevance");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "study_pdfs_subject_idx" ON "study_pdfs" USING btree ("subject");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "study_pdfs_course_idx" ON "study_pdfs" USING btree ("course_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "study_pdfs_student_idx" ON "study_pdfs" USING btree ("student_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "daily_tasks_student_idx" ON "daily_tasks" USING btree ("student_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_idx" ON "audit_logs" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_answers_student_idx" ON "student_answers" USING btree ("student_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_answers_question_idx" ON "student_answers" USING btree ("question_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_answers_subject_idx" ON "student_answers" USING btree ("subject");