import { query } from "./_generated/server";

export const getAdminDashboard = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    const students = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "student"))
      .collect();
    
    const teachers = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "teacher"))
      .collect();

    const predictions = await ctx.db
      .query("aiPredictions")
      .order("desc")
      .take(100);

    const metrics = await ctx.db
      .query("modelMetrics")
      .order("desc")
      .take(10);

    const performances = await ctx.db
      .query("studentPerformance")
      .collect();

    return {
      classes,
      students,
      teachers,
      predictions,
      metrics,
      performances,
    };
  },
});
