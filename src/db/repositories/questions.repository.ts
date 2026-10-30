import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { questions, DbQuestion, DbNewQuestion } from '../schema';

export const QuestionsRepository = {
  async listAll(): Promise<DbQuestion[]> {
    return await db.select().from(questions).orderBy(desc(questions.createdAt));
  },

  async findById(id: string): Promise<DbQuestion | undefined> {
    const results = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
    return results[0];
  },

  async findBySubject(subject: string): Promise<DbQuestion[]> {
    return await db.select().from(questions).where(eq(questions.subject, subject)).orderBy(desc(questions.year));
  },

  async create(questionData: DbNewQuestion): Promise<DbQuestion> {
    const inserted = await db.insert(questions).values(questionData).returning();
    return inserted[0];
  },

  async delete(id: string): Promise<boolean> {
    const res = await db.delete(questions).where(eq(questions.id, id)).returning();
    return res.length > 0;
  },
};
