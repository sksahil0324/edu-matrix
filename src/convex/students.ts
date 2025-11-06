import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getStudentDashboard = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.studentId);
    if (!student) return null;

    const performances = await ctx.db
      .query("studentPerformance")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    const predictions = await ctx.db
      .query("aiPredictions")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .take(5);

    const gamification = await ctx.db
      .query("gamification")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .first();

    const recommendations = await ctx.db
      .query("recommendations")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .take(5);

    const challenges = await ctx.db
      .query("challenges")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();

    return {
      student,
      performances,
      predictions,
      gamification,
      recommendations,
      challenges,
    };
  },
});

export const updateGamification = mutation({
  args: {
    studentId: v.id("users"),
    xpGain: v.number(),
    newBadge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const gamification = await ctx.db
      .query("gamification")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .first();

    if (!gamification) return null;

    const newXp = gamification.xp + args.xpGain;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const badges = args.newBadge ? [...gamification.badges, args.newBadge] : gamification.badges;

    await ctx.db.patch(gamification._id, {
      xp: newXp,
      level: newLevel,
      badges,
      lastActivity: Date.now(),
    });

    return { newXp, newLevel };
  },
});
