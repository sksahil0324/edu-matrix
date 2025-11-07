import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const initializeNewUser = mutation({
  args: {
    role: v.union(v.literal("student"), v.literal("teacher")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // If user already has demo data, return
    if (user.role) {
      return user;
    }

    // Update user with role
    await ctx.db.patch(userId, {
      role: args.role,
    });

    if (args.role === "student") {
      // Create a demo class
      const classId = await ctx.db.insert("classes", {
        name: "Class 10-A",
        year: 10,
        section: "A",
      });

      // Update user with class
      await ctx.db.patch(userId, {
        classId,
        name: `Student ${Math.floor(Math.random() * 1000)}`,
      });

      // Create demo subject
      const teacherId = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", "teacher"))
        .first();

      if (teacherId) {
        const subjectId = await ctx.db.insert("subjects", {
          name: "Mathematics",
          classId,
          teacherId: teacherId._id,
        });

        // Create demo performance data
        await ctx.db.insert("studentPerformance", {
          studentId: userId,
          subjectId,
          classId,
          attendance: Math.floor(Math.random() * 40) + 60,
          grades: Math.floor(Math.random() * 40) + 60,
          engagement: Math.floor(Math.random() * 40) + 60,
          assignmentsCompleted: Math.floor(Math.random() * 8) + 2,
          assignmentsTotal: 10,
          behaviorScore: Math.floor(Math.random() * 40) + 60,
          weekNumber: 1,
        });

        // Create demo prediction
        const grades = Math.floor(Math.random() * 40) + 60;
        const riskLevel = grades >= 85 ? "low" : grades >= 75 ? "medium" : grades >= 65 ? "high" : "critical";
        const dropoutProbability = grades >= 85 ? 0.05 : grades >= 75 ? 0.15 : grades >= 65 ? 0.35 : 0.65;

        await ctx.db.insert("aiPredictions", {
          studentId: userId,
          modelType: "Temporal",
          dropoutProbability,
          riskLevel,
          confidence: 0.92,
          explanation: `Student shows ${riskLevel} risk based on current performance metrics.`,
          weekNumber: 1,
          features: {
            attendance: Math.floor(Math.random() * 40) + 60,
            grades,
            engagement: Math.floor(Math.random() * 40) + 60,
            consistency: Math.floor(Math.random() * 40) + 60,
            improvement: Math.floor(Math.random() * 40) + 60,
          },
        });

        // Create demo gamification
        await ctx.db.insert("gamification", {
          studentId: userId,
          xp: Math.floor(Math.random() * 5000),
          level: Math.floor(Math.random() * 10) + 1,
          streak: Math.floor(Math.random() * 30),
          badges: ["First Login", "Quick Learner"],
          lastActivity: Date.now(),
        });
      }
    } else if (args.role === "teacher") {
      // Create a demo class
      const classId = await ctx.db.insert("classes", {
        name: "Class 10-A",
        year: 10,
        section: "A",
      });

      // Update user with class and name
      await ctx.db.patch(userId, {
        classId,
        name: `Teacher ${Math.floor(Math.random() * 1000)}`,
        teacherSubjects: ["Mathematics", "Science"],
      });

      // Create demo subjects
      await ctx.db.insert("subjects", {
        name: "Mathematics",
        classId,
        teacherId: userId,
      });

      await ctx.db.insert("subjects", {
        name: "Science",
        classId,
        teacherId: userId,
      });

      // Create demo students in the class
      for (let i = 0; i < 3; i++) {
        const studentId = await ctx.db.insert("users", {
          name: `Demo Student ${i + 1}`,
          email: `student${i + 1}@demo.com`,
          role: "student",
          classId,
        });

        // Create performance data for each student
        const subjectId = await ctx.db
          .query("subjects")
          .withIndex("by_teacher", (q) => q.eq("teacherId", userId))
          .first();

        if (subjectId) {
          await ctx.db.insert("studentPerformance", {
            studentId,
            subjectId: subjectId._id,
            classId,
            attendance: Math.floor(Math.random() * 40) + 60,
            grades: Math.floor(Math.random() * 40) + 60,
            engagement: Math.floor(Math.random() * 40) + 60,
            assignmentsCompleted: Math.floor(Math.random() * 8) + 2,
            assignmentsTotal: 10,
            behaviorScore: Math.floor(Math.random() * 40) + 60,
            weekNumber: 1,
          });

          // Create prediction for each student
          const grades = Math.floor(Math.random() * 40) + 60;
          const riskLevel = grades >= 85 ? "low" : grades >= 75 ? "medium" : grades >= 65 ? "high" : "critical";
          const dropoutProbability = grades >= 85 ? 0.05 : grades >= 75 ? 0.15 : grades >= 65 ? 0.35 : 0.65;

          await ctx.db.insert("aiPredictions", {
            studentId,
            modelType: "Temporal",
            dropoutProbability,
            riskLevel,
            confidence: 0.92,
            explanation: `Student shows ${riskLevel} risk based on current performance metrics.`,
            weekNumber: 1,
            features: {
              attendance: Math.floor(Math.random() * 40) + 60,
              grades,
              engagement: Math.floor(Math.random() * 40) + 60,
              consistency: Math.floor(Math.random() * 40) + 60,
              improvement: Math.floor(Math.random() * 40) + 60,
            },
          });
        }
      }
    }

    return await ctx.db.get(userId);
  },
});
