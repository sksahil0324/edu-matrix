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
      classes: classes.map(c => ({ _id: c._id, name: c.name, year: c.year, section: c.section })),
      students: students.map(s => ({ _id: s._id, name: s.name || "Unknown", email: s.email || "No email" })),
      teachers: teachers.map(t => ({ _id: t._id, name: t.name || "Unknown", email: t.email || "No email" })),
      predictions: predictions.map(p => ({ 
        _id: p._id,
        modelType: p.modelType, 
        riskLevel: p.riskLevel, 
        dropoutProbability: p.dropoutProbability 
      })),
      metrics: metrics.map(m => ({
        _id: m._id,
        modelType: m.modelType,
        weekNumber: m.weekNumber,
        accuracy: m.accuracy,
        f1Score: m.f1Score,
        rocAuc: m.rocAuc
      })),
      performances,
    };
  },
});
