import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const seedInitialData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Create class
    const classId = await ctx.db.insert("classes", {
      name: "Class 11A",
      year: 11,
      section: "A",
    });

    // Create teacher
    const teacherId = await ctx.db.insert("users", {
      name: "Sonia Sharma",
      username: "teacher_sonia",
      email: "sonia@edutrack.ai",
      role: "teacher",
      classId,
      teacherSubjects: ["Science", "Computer Science"],
    });

    // Create subjects
    const subjects = [
      { name: "Science", teacherId },
      { name: "Mathematics", teacherId },
      { name: "English", teacherId },
      { name: "Social Studies", teacherId },
      { name: "Computer Science", teacherId },
    ];

    const subjectIds: Record<string, any> = {};
    for (const subject of subjects) {
      const id = await ctx.db.insert("subjects", {
        ...subject,
        classId,
      });
      subjectIds[subject.name] = id;
    }

    // Create student
    const studentId = await ctx.db.insert("users", {
      name: "Aryan Kumar",
      username: "student_aryan",
      email: "aryan@edutrack.ai",
      role: "student",
      classId,
    });

    // Create admin
    await ctx.db.insert("users", {
      name: "Kavita Patel",
      username: "admin_kavita",
      email: "kavita@edutrack.ai",
      role: "admin",
    });

    // Initialize gamification for student
    await ctx.db.insert("gamification", {
      studentId,
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      lastActivity: Date.now(),
    });

    // Create initial performance data for week 1
    const weekNumber = 1;
    for (const [subjectName, subjectId] of Object.entries(subjectIds)) {
      const basePerformance = {
        Science: { attendance: 85, grades: 72, engagement: 0.75 },
        Mathematics: { attendance: 90, grades: 68, engagement: 0.70 },
        English: { attendance: 88, grades: 80, engagement: 0.82 },
        "Social Studies": { attendance: 82, grades: 75, engagement: 0.68 },
        "Computer Science": { attendance: 92, grades: 85, engagement: 0.88 },
      }[subjectName] || { attendance: 85, grades: 75, engagement: 0.75 };

      await ctx.db.insert("studentPerformance", {
        studentId,
        subjectId,
        classId,
        attendance: basePerformance.attendance,
        grades: basePerformance.grades,
        engagement: basePerformance.engagement,
        assignmentsCompleted: Math.floor(Math.random() * 8) + 5,
        assignmentsTotal: 10,
        behaviorScore: 0.7 + Math.random() * 0.25,
        weekNumber,
      });
    }

    return { success: true, classId, studentId, teacherId };
  },
});
