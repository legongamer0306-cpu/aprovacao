import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { users, DbUser, DbNewUser } from '../schema';

export const UsersRepository = {
  async findById(id: string): Promise<DbUser | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results[0];
  },

  async findByEmail(email: string): Promise<DbUser | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return results[0];
  },

  async listAll(): Promise<DbUser[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  },

  async listPendingApprovals(): Promise<DbUser[]> {
    return await db.select().from(users).where(eq(users.status, 'pendente_aprovacao')).orderBy(desc(users.createdAt));
  },

  async create(userData: DbNewUser): Promise<DbUser> {
    const inserted = await db.insert(users).values({
      ...userData,
      email: userData.email.toLowerCase(),
    }).returning();
    return inserted[0];
  },

  async approveUser(userId: string, approvedBy: string): Promise<DbUser | undefined> {
    const timeString = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const updated = await db.update(users)
      .set({
        status: 'ativo',
        approvedAt: timeString,
        approvedBy,
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updated[0];
  },

  async rejectUser(userId: string, reason: string): Promise<DbUser | undefined> {
    const updated = await db.update(users)
      .set({
        status: 'rejeitado',
        rejectionReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updated[0];
  },

  async toggleRestrict(userId: string, isRestricted: boolean, reason?: string): Promise<DbUser | undefined> {
    const updated = await db.update(users)
      .set({
        status: isRestricted ? 'restrito' : 'ativo',
        restrictionReason: isRestricted ? reason : null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updated[0];
  },

  async delete(userId: string): Promise<boolean> {
    const res = await db.delete(users).where(eq(users.id, userId)).returning();
    return res.length > 0;
  },
};
