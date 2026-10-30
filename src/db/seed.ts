import { pool, db } from './index';
import { 
  users, 
  courses, 
  questions, 
  mockExams, 
  flashcards, 
  legalItems, 
  studyPdfs, 
  dailyTasks 
} from './schema';
import { 
  MOCK_MANAGED_USERS, 
  TARGET_EXAMS, 
  MOCK_QUESTIONS, 
  MOCK_SIMULADOS, 
  MOCK_FLASHCARDS, 
  DEFAULT_LEGAL_ITEMS_DATA, 
  MOCK_PDFS, 
  MOCK_DAILY_TASKS 
} from '@/lib/mockData';

export async function seedDatabase() {
  console.log('🌱 Iniciando seed para PostgreSQL 17...');

  try {
    // 1. Seed Users
    console.log(`Inserindo ${MOCK_MANAGED_USERS.length} usuários...`);
    for (const u of MOCK_MANAGED_USERS) {
      await db.insert(users).values({
        id: u.id,
        name: u.name,
        email: u.email.toLowerCase(),
        role: u.role,
        status: u.status,
        targetExam: u.targetExam,
        questionsAnswered: u.questionsAnswered,
        accuracyRate: u.accuracyRate,
        avatarUrl: u.avatarUrl,
        documentPhotoUrl: u.documentPhotoUrl,
        photos: u.photos || [],
        phone: u.phone,
        cpf: u.cpf,
        registrationDate: u.registrationDate,
        approvedAt: u.approvedAt,
        approvedBy: u.approvedBy,
        lastActive: u.lastActive,
      }).onConflictDoNothing();
    }

    // 2. Seed Courses
    console.log(`Inserindo ${TARGET_EXAMS.length} cursos/editais...`);
    for (const c of TARGET_EXAMS) {
      await db.insert(courses).values({
        id: c.id,
        name: c.name,
        code: c.code,
        agency: c.agency,
        role: c.role,
        totalSeats: c.totalSeats,
        salary: c.salary,
        examDate: c.examDate,
        daysRemaining: c.daysRemaining,
        progressPercent: c.progressPercent,
        category: c.category || 'Carreira Jurídica',
        workloadHours: c.workloadHours || 0,
        instructor: c.instructor,
        isOpenForEnrollment: c.isOpenForEnrollment ?? true,
        enrolledStudentsCount: c.enrolledStudentsCount || 0,
        enrollmentDeadline: c.enrollmentDeadline,
        description: c.description,
        syllabus: c.syllabus ? (c.syllabus as any) : null,
      }).onConflictDoNothing();
    }

    // 3. Seed Questions
    console.log(`Inserindo ${MOCK_QUESTIONS.length} questões...`);
    for (const q of MOCK_QUESTIONS) {
      await db.insert(questions).values({
        id: q.id,
        code: q.code,
        year: q.year,
        board: q.board,
        agency: q.agency,
        role: q.role,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        statement: q.statement,
        options: q.options,
        correctOptionId: q.correctOptionId,
        legalBasis: q.legalBasis,
        tags: q.tags || [],
        origin: q.origin || 'oficial',
        author: q.author,
      }).onConflictDoNothing();
    }

    // 4. Seed Simulados
    console.log(`Inserindo ${MOCK_SIMULADOS.length} simulados...`);
    for (const s of MOCK_SIMULADOS) {
      await db.insert(mockExams).values({
        id: s.id,
        title: s.title,
        code: s.code,
        agency: s.agency,
        board: s.board,
        totalQuestions: s.totalQuestions,
        durationMinutes: s.durationMinutes,
        cutoffRate: s.cutoffRate,
        status: s.status,
        difficulty: s.difficulty,
        subjectsCovered: s.subjectsCovered || [],
        questions: s.questions || [],
      }).onConflictDoNothing();
    }

    // 5. Seed Flashcards
    console.log(`Inserindo ${MOCK_FLASHCARDS.length} flashcards...`);
    for (const f of MOCK_FLASHCARDS) {
      await db.insert(flashcards).values({
        id: f.id,
        subject: f.subject,
        deckName: f.deckName,
        front: f.front,
        back: f.back,
        legalRef: f.legalRef,
        difficulty: f.difficulty,
        nextReview: f.nextReview,
        intervalDays: f.intervalDays,
        masteryPercent: f.masteryPercent,
      }).onConflictDoNothing();
    }

    // 6. Seed Jurisprudência
    console.log(`Inserindo ${DEFAULT_LEGAL_ITEMS_DATA.length} itens de jurisprudência/súmulas...`);
    for (const l of DEFAULT_LEGAL_ITEMS_DATA) {
      await db.insert(legalItems).values({
        id: l.id,
        category: l.category,
        title: l.title,
        source: l.source,
        statement: l.statement,
        practicalContext: l.practicalContext,
        relevance: l.relevance,
        subject: l.subject,
        articleNumber: l.articleNumber,
        favorite: l.favorite ?? false,
        isCustom: l.isCustom ?? false,
      }).onConflictDoNothing();
    }

    console.log('✅ Seed finalizado com sucesso no PostgreSQL 17!');
  } catch (error) {
    console.error('❌ Erro durante a execução do seed:', error);
  } finally {
    await pool.end();
  }
}
