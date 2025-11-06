import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTeacherDashboard = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    const teacher = await ctx.db.get(args.teacherId);
    if (!teacher || !teacher.classId) return null;

    const classId = teacher.classId;

    const subjects = await ctx.db
      .query("subjects")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .collect();

    const students = await ctx.db
      .query("users")
      .withIndex("by_class", (q) => q.eq("classId", classId))
      .collect();

    const performances = await ctx.db
      .query("studentPerformance")
      .withIndex("by_class", (q) => q.eq("classId", classId))
      .collect();

    const predictions = await ctx.db
      .query("aiPredictions")
      .collect();

    return {
      teacher: { name: teacher.name || "Unknown", email: teacher.email || "No email" },
      subjects: subjects.map(s => ({ _id: s._id, name: s.name })),
      students: students.filter(s => s.role === "student").map(s => ({ _id: s._id, name: s.name || "Unknown", email: s.email || "No email" })),
      performances,
      predictions: predictions.map(p => ({
        _id: p._id,
        studentId: p.studentId,
        riskLevel: p.riskLevel,
        dropoutProbability: p.dropoutProbability,
        explanation: p.explanation,
        modelType: p.modelType
      })),
    };
  },
});

export const getAllTeachers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "teacher"))
      .collect();
  },
});
