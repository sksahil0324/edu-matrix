import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Rule-based model
export const runRuleBasedModel = internalMutation({
  args: {
    studentId: v.id("users"),
    weekNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const performances = await ctx.db
      .query("studentPerformance")
      .withIndex("by_student_and_subject", (q) => q.eq("studentId", args.studentId))
      .collect();

    const avgAttendance = performances.reduce((sum, p) => sum + p.attendance, 0) / performances.length;
    const avgGrades = performances.reduce((sum, p) => sum + p.grades, 0) / performances.length;
    const avgEngagement = performances.reduce((sum, p) => sum + p.engagement, 0) / performances.length;

    let dropoutProbability = 0;
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    let explanation = "";

    if (avgAttendance < 70) {
      dropoutProbability += 0.4;
      explanation += "Attendance below 70%. ";
    }
    if (avgGrades < 50) {
      dropoutProbability += 0.4;
      explanation += "Grades below 50%. ";
    }
    if (avgEngagement < 0.6) {
      dropoutProbability += 0.2;
      explanation += "Low engagement detected. ";
    }

    dropoutProbability = Math.min(dropoutProbability, 1);

    if (dropoutProbability >= 0.7) riskLevel = "critical";
    else if (dropoutProbability >= 0.5) riskLevel = "high";
    else if (dropoutProbability >= 0.3) riskLevel = "medium";

    if (!explanation) explanation = "All metrics within acceptable range.";

    await ctx.db.insert("aiPredictions", {
      studentId: args.studentId,
      modelType: "rule-based",
      dropoutProbability,
      riskLevel,
      confidence: 0.75,
      explanation,
      weekNumber: args.weekNumber,
      features: {
        attendance: avgAttendance,
        grades: avgGrades,
        engagement: avgEngagement,
        consistency: 0.7,
        improvement: 0,
      },
    });

    return { dropoutProbability, riskLevel, explanation };
  },
});

// ML-based model (simulated)
export const runMLModel = internalMutation({
  args: {
    studentId: v.id("users"),
    weekNumber: v.number(),
    modelName: v.string(),
  },
  handler: async (ctx, args) => {
    const performances = await ctx.db
      .query("studentPerformance")
      .withIndex("by_student_and_subject", (q) => q.eq("studentId", args.studentId))
      .collect();

    const avgAttendance = performances.reduce((sum, p) => sum + p.attendance, 0) / performances.length;
    const avgGrades = performances.reduce((sum, p) => sum + p.grades, 0) / performances.length;
    const avgEngagement = performances.reduce((sum, p) => sum + p.engagement, 0) / performances.length;
    const avgBehavior = performances.reduce((sum, p) => sum + p.behaviorScore, 0) / performances.length;

    // Simulated ML prediction with weighted features
    const dropoutProbability = Math.max(0, Math.min(1,
      (100 - avgAttendance) / 100 * 0.3 +
      (100 - avgGrades) / 100 * 0.35 +
      (1 - avgEngagement) * 0.25 +
      (1 - avgBehavior) * 0.1
    ));

    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    if (dropoutProbability >= 0.7) riskLevel = "critical";
    else if (dropoutProbability >= 0.5) riskLevel = "high";
    else if (dropoutProbability >= 0.3) riskLevel = "medium";

    const explanation = `${args.modelName} analysis: Attendance ${avgAttendance.toFixed(1)}%, Grades ${avgGrades.toFixed(1)}%, Engagement ${(avgEngagement * 100).toFixed(1)}%`;

    await ctx.db.insert("aiPredictions", {
      studentId: args.studentId,
      modelType: args.modelName,
      dropoutProbability,
      riskLevel,
      confidence: 0.88,
      explanation,
      weekNumber: args.weekNumber,
      features: {
        attendance: avgAttendance,
        grades: avgGrades,
        engagement: avgEngagement,
        consistency: avgBehavior,
        improvement: 0,
      },
    });

    return { dropoutProbability, riskLevel };
  },
});

// Hybrid model
export const runHybridModel = internalMutation({
  args: {
    studentId: v.id("users"),
    weekNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const predictions = await ctx.db
      .query("aiPredictions")
      .withIndex("by_student_and_week", (q) => 
        q.eq("studentId", args.studentId).eq("weekNumber", args.weekNumber))
      .collect();

    const ruleBased = predictions.find(p => p.modelType === "rule-based");
    const mlModel = predictions.find(p => p.modelType === "random-forest");

    if (!ruleBased || !mlModel) return null;

    const dropoutProbability = (ruleBased.dropoutProbability * 0.4 + mlModel.dropoutProbability * 0.6);
    
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    if (dropoutProbability >= 0.7) riskLevel = "critical";
    else if (dropoutProbability >= 0.5) riskLevel = "high";
    else if (dropoutProbability >= 0.3) riskLevel = "medium";

    await ctx.db.insert("aiPredictions", {
      studentId: args.studentId,
      modelType: "hybrid",
      dropoutProbability,
      riskLevel,
      confidence: 0.91,
      explanation: "Hybrid model combining rule-based and ML predictions with weighted confidence.",
      weekNumber: args.weekNumber,
      features: ruleBased.features,
    });

    return { dropoutProbability, riskLevel };
  },
});

// Holistic model with LHI
export const runHolisticModel = internalMutation({
  args: {
    studentId: v.id("users"),
    weekNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const performances = await ctx.db
      .query("studentPerformance")
      .withIndex("by_student_and_subject", (q) => q.eq("studentId", args.studentId))
      .collect();

    const gamification = await ctx.db
      .query("gamification")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .first();

    const avgAttendance = performances.reduce((sum, p) => sum + p.attendance, 0) / performances.length;
    const avgGrades = performances.reduce((sum, p) => sum + p.grades, 0) / performances.length;
    const avgEngagement = performances.reduce((sum, p) => sum + p.engagement, 0) / performances.length;
    const avgBehavior = performances.reduce((sum, p) => sum + p.behaviorScore, 0) / performances.length;

    const streakBonus = gamification ? Math.min(gamification.streak / 30, 0.1) : 0;
    const lhi = (avgAttendance / 100 * 0.25 + avgGrades / 100 * 0.35 + avgEngagement * 0.25 + avgBehavior * 0.15) + streakBonus;

    const dropoutProbability = Math.max(0, 1 - lhi);

    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    if (dropoutProbability >= 0.7) riskLevel = "critical";
    else if (dropoutProbability >= 0.5) riskLevel = "high";
    else if (dropoutProbability >= 0.3) riskLevel = "medium";

    await ctx.db.insert("aiPredictions", {
      studentId: args.studentId,
      modelType: "holistic",
      dropoutProbability,
      riskLevel,
      confidence: 0.93,
      explanation: `Learning Health Index: ${(lhi * 100).toFixed(1)}%. Holistic analysis including behavioral and motivational factors.`,
      weekNumber: args.weekNumber,
      lhi,
      features: {
        attendance: avgAttendance,
        grades: avgGrades,
        engagement: avgEngagement,
        consistency: avgBehavior,
        improvement: streakBonus,
      },
    });

    return { dropoutProbability, riskLevel, lhi };
  },
});

// Get predictions for student
export const getStudentPredictions = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, args) => {
    const predictions = await ctx.db
      .query("aiPredictions")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .take(20);

    return predictions;
  },
});

// Get model comparison metrics
export const getModelMetrics = query({
  args: {},
  handler: async (ctx) => {
    const metrics = await ctx.db
      .query("modelMetrics")
      .order("desc")
      .take(10);

    return metrics;
  },
});
