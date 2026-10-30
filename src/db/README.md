# Arquitetura de Banco de Dados: PostgreSQL 17 (Aprovação Total)

Esta estrutura foi desenhada e tipada especificamente para o **PostgreSQL 17**, sem a criação prévia de nenhuma migration (conforme solicitado). As migrations ficam reservadas para o momento em que o sistema estiver 100% finalizado e você der o comando.

---

## 📁 Estrutura de Arquivos

```
src/db/
├── schema.ts            # Definição das tabelas, enums e relações em TypeScript via Drizzle ORM
├── schema.sql           # Script DDL SQL puro para PostgreSQL 17 (compatível com psql/pgAdmin)
├── index.ts             # Connection Pool (pg) e instância singleton do cliente Drizzle
├── seed.ts              # Script para popular o banco inicial com os dados oficiais
└── repositories/        # Camada de Acesso a Dados (Data Access Layer / DAO)
    ├── users.repository.ts       # Gestão de alunos, fotos e homologações
    ├── courses.repository.ts     # Cursos, editais e matrículas
    ├── questions.repository.ts   # Banco de questões comentadas
    └── audit.repository.ts       # Logs de segurança administrativa
```

---

## 🗄️ Tabelas Mapeadas no PostgreSQL 17

1. **`users`**: Cadastro de alunos e administradores com fotos de perfil, fotos de documento e selfie biométrica, status (`ativo`, `pendente_aprovacao`, `restrito`, `rejeitado`), data de aprovação e auditor.
2. **`courses`**: Cursos preparatórios e editais (RFB, OAB, TCU, Magistratura TJSP, DPF Delegado, etc.), vagas, remuneração, prazo de inscrição e status.
3. **`course_enrollments`**: Inscrições de alunos em cada curso com integridade referencial (`ON DELETE CASCADE`).
4. **`questions`**: Banco de questões comentadas com banca (FGV, Cebraspe, FCC), órgão, ano, opções em `JSONB`, gabarito e fundamentação jurídica.
5. **`mock_exams`**: Simulados oficiais cronometrados com nota de corte e estatísticas.
6. **`mock_exam_submissions`**: Histórico detalhado de submissões e notas dos alunos.
7. **`flashcards`**: Flashcards com repetição espaçada (SRS), intervalos e índice de retenção.
8. **`mind_maps`**: Mapas mentais estruturados com nó raiz hierárquico em `JSONB`.
9. **`legal_items`**: Súmulas vinculantes, súmulas ordinárias, jurisprudência do STF/STJ e resoluções do CNJ.
10. **`study_pdfs`**: Meus PDFs com controle de páginas lidas, matérias e favoritos.
11. **`daily_tasks`**: Ciclo de estudos e metas diárias.
12. **`audit_logs`**: Logs administrativos à prova de adulteração com IP, ator e ação executada.
13. **`student_answers`**: Histórico individual de cada resolução de questão para métricas de desempenho.

---

## ⚙️ Variáveis de Ambiente Necessárias (`.env`)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/aprovacao_total?sslmode=disable"
```

---

## 🚀 Como Executar no Futuro (Quando Autorizar Migrations)

Quando você solicitar a criação das migrations, os seguintes comandos estarão prontos para serem executados:

```bash
# 1. Gerar os arquivos de migration SQL com base no schema.ts:
npx drizzle-kit generate

# 2. Aplicar as migrations no PostgreSQL 17 conectado:
npx drizzle-kit migrate

# 3. Executar o script de carga inicial (seed):
npx tsx src/db/seed.ts
```
