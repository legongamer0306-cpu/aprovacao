import { desc } from 'drizzle-orm';
import { db } from '../index';
import { auditLogs, DbAuditLog, DbNewAuditLog } from '../schema';

export const AuditRepository = {
  async log(entry: DbNewAuditLog): Promise<DbAuditLog> {
    const inserted = await db.insert(auditLogs).values(entry).returning();
    return inserted[0];
  },

  async listRecent(limit = 50): Promise<DbAuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
  },
};
