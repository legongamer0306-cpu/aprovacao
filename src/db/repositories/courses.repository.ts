import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { courses, courseEnrollments, DbCourse, DbNewCourse } from '../schema';

export const CoursesRepository = {
  async listAll(): Promise<DbCourse[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  },

  async findById(id: string): Promise<DbCourse | undefined> {
    const results = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return results[0];
  },

  async create(courseData: DbNewCourse): Promise<DbCourse> {
    const inserted = await db.insert(courses).values(courseData).returning();
    return inserted[0];
  },

  async update(id: string, updates: Partial<DbNewCourse>): Promise<DbCourse | undefined> {
    const updated = await db.update(courses)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning();
    return updated[0];
  },

  async delete(id: string): Promise<boolean> {
    const res = await db.delete(courses).where(eq(courses.id, id)).returning();
    return res.length > 0;
  },

  async enrollStudent(courseId: string, studentId: string): Promise<void> {
    await db.insert(courseEnrollments).values({
      courseId,
      studentId,
    }).onConflictDoNothing();

    // Increment count
    const course = await this.findById(courseId);
    if (course) {
      await db.update(courses)
        .set({ enrolledStudentsCount: course.enrolledStudentsCount + 1 })
        .where(eq(courses.id, courseId));
    }
  },

  async unenrollStudent(courseId: string, studentId: string): Promise<void> {
    await db.delete(courseEnrollments).where(
      eq(courseEnrollments.courseId, courseId) && eq(courseEnrollments.studentId, studentId)
    );

    const course = await this.findById(courseId);
    if (course && course.enrolledStudentsCount > 0) {
      await db.update(courses)
        .set({ enrolledStudentsCount: course.enrolledStudentsCount - 1 })
        .where(eq(courses.id, courseId));
    }
  },
};
