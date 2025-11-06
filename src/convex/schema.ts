import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// User roles
export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.TEACHER),
  v.literal(ROLES.STUDENT),
);
export type Role = Infer<typeof roleValidator>;

// Risk levels
export const riskLevelValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high"),
  v.literal("critical"),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      username: v.optional(v.string()),
      classId: v.optional(v.id("classes")),
      teacherSubjects: v.optional(v.array(v.string())),
    }).index("email", ["email"])
      .index("by_username", ["username"])
      .index("by_class", ["classId"])
      .index("by_role", ["role"]),

    classes: defineTable({
      name: v.string(),
      year: v.number(),
      section: v.string(),
    }).index("by_name", ["name"]),

    subjects: defineTable({
      name: v.string(),
      classId: v.id("classes"),
      teacherId: v.id("users"),
    }).index("by_class", ["classId"])
      .index("by_teacher", ["teacherId"]),

    studentPerformance: defineTable({
      studentId: v.id("users"),
      subjectId: v.id("subjects"),
      classId: v.id("classes"),
      attendance: v.number(),
      grades: v.number(),
      engagement: v.number(),
      assignmentsCompleted: v.number(),
      assignmentsTotal: v.number(),
      behaviorScore: v.number(),
      weekNumber: v.number(),
    }).index("by_student", ["studentId"])
      .index("by_subject", ["subjectId"])
      .index("by_class", ["classId"])
      .index("by_student_and_subject", ["studentId", "subjectId"])
      .index("by_week", ["weekNumber"]),

    aiPredictions: defineTable({
      studentId: v.id("users"),
      modelType: v.string(),
      dropoutProbability: v.number(),
      riskLevel: riskLevelValidator,
      confidence: v.number(),
      explanation: v.string(),
      weekNumber: v.number(),
      lhi: v.optional(v.number()),
      features: v.object({
        attendance: v.number(),
        grades: v.number(),
        engagement: v.number(),
        consistency: v.number(),
        improvement: v.number(),
      }),
    }).index("by_student", ["studentId"])
      .index("by_model", ["modelType"])
      .index("by_week", ["weekNumber"])
      .index("by_student_and_week", ["studentId", "weekNumber"]),

    gamification: defineTable({
      studentId: v.id("users"),
      xp: v.number(),
      level: v.number(),
      streak: v.number(),
      badges: v.array(v.string()),
      lastActivity: v.number(),
    }).index("by_student", ["studentId"])
      .index("by_xp", ["xp"]),

    challenges: defineTable({
      studentId: v.id("users"),
      subjectId: v.id("subjects"),
      description: v.string(),
      targetImprovement: v.number(),
      xpReward: v.number(),
      weekNumber: v.number(),
      completed: v.boolean(),
    }).index("by_student", ["studentId"])
      .index("by_week", ["weekNumber"])
      .index("by_student_and_week", ["studentId", "weekNumber"]),

    recommendations: defineTable({
      studentId: v.id("users"),
      subjectId: v.optional(v.id("subjects")),
      type: v.string(),
      message: v.string(),
      priority: v.number(),
      weekNumber: v.number(),
    }).index("by_student", ["studentId"])
      .index("by_week", ["weekNumber"]),

    modelMetrics: defineTable({
      modelType: v.string(),
      accuracy: v.number(),
      precision: v.number(),
      recall: v.number(),
      f1Score: v.number(),
      rocAuc: v.number(),
      weekNumber: v.number(),
    }).index("by_model", ["modelType"])
      .index("by_week", ["weekNumber"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;