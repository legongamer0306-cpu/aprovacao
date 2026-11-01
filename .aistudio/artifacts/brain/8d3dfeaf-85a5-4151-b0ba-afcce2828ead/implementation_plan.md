# Plano de Implementação (Revisado): Migration Completa e Idempotente (PostgreSQL 17 & Drizzle ORM)

## Ajustes Aprovados Incorporados
1. **Índices Otimizados**: Não recriar índices das 7 tabelas já existentes que já possuem equivalentes nomeados como `idx_*` na migration anterior. Criar índices apenas para as 6 tabelas novas (`mind_maps`, `legal_items`, `study_pdfs`, `daily_tasks`, `audit_logs` e `student_answers`).
2. **Harmonização da Coluna Password**: Adicionar `ALTER TABLE users ALTER COLUMN password TYPE TEXT;` para alinhar com o `schema.ts`, corrigindo o `VARCHAR(255)` da migration inicial sem perda de dados.
3. **Preservação e Metadados do Drizzle Kit**: Manter o arquivo `20261030120000_create_schema.sql` intacto e gerar a migration com o diretório `meta/` e `_journal.json` compatíveis com o Drizzle ORM para garantir suporte total ao `npx drizzle-kit migrate`.

---

## 1. Mapeamento Comparativo das Tabelas

| Tabela | Status na Migration Anterior | Status no `schema.ts` | Ação na Migration Drizzle |
| :--- | :--- | :--- | :--- |
| **users** | Presente (`password` VARCHAR(255)) | Presente (`password` TEXT) | `CREATE TABLE IF NOT EXISTS` + `ALTER COLUMN password TYPE TEXT` |
| **courses** | Presente | Presente | `CREATE TABLE IF NOT EXISTS` (reaproveita `idx_*`) |
| **course_enrollments** | Presente | Presente | `CREATE TABLE IF NOT EXISTS` + FKs idempotentes |
| **questions** | Presente | Presente | `CREATE TABLE IF NOT EXISTS` (reaproveita `idx_*`) |
| **mock_exams** | Presente | Presente | `CREATE TABLE IF NOT EXISTS` (reaproveita `idx_*`) |
| **mock_exam_submissions**| Presente | Presente | `CREATE TABLE IF NOT EXISTS` + FKs idempotentes |
| **flashcards** | Presente | Presente | `CREATE TABLE IF NOT EXISTS` (reaproveita `idx_*`) |
| **mind_maps** | ❌ Ausente | ✅ Definido | `CREATE TABLE IF NOT EXISTS` + índices `subject` e `topic` |
| **legal_items** | ❌ Ausente | ✅ Definido | `CREATE TABLE IF NOT EXISTS` + índices `category`, `subject` e `relevance` |
| **study_pdfs** | ❌ Ausente | ✅ Definido | `CREATE TABLE IF NOT EXISTS` + índices `subject`, `course_id` e `student_id` |
| **daily_tasks** | ❌ Ausente | ✅ Definido | `CREATE TABLE IF NOT EXISTS` + índice `student_id` |
| **audit_logs** | ❌ Ausente | ✅ Definido | `CREATE TABLE IF NOT EXISTS` + índices `actor_email`, `action` e `created_at` |
| **student_answers** | ❌ Ausente | ✅ Definido | `CREATE TABLE IF NOT EXISTS` + índices `student_id`, `question_id` e `subject` |

---

## 2. Enums Protegidos (DO $$ BEGIN ... EXCEPTION)
- `user_role`
- `user_status`
- `question_difficulty`
- `simulado_status`
- `simulado_difficulty`
- `legal_relevance`

---

## 3. Roteiro de Execução
1. Atualizar o arquivo SQL oficial de migration (`drizzle/migrations/0000_initial_schema.sql` ou tag correspondente) com as 13 tabelas, enums seguros, ajuste de tipo de coluna e os índices estritos das 6 novas tabelas.
2. Atualizar o `_journal.json` e snapshot correspondente em `drizzle/migrations/meta/`.
3. Executar validações com `npx drizzle-kit check`.
4. Validar o script SQL para execução em banco virgem e em banco com a migration inicial aplicada.
