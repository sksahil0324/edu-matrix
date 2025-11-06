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
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();

    const performances = await ctx.db
      .query("studentPerformance")
      .withIndex("by_class", (q) => q.eq("classId", classId))
      .collect();

    const predictions = await ctx.db
      .query("aiPredictions")
      .collect();

    return {
      teacher,
      subjects,
      students,
      performances,
      predictions,
    };
  },
});
