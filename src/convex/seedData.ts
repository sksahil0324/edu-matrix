import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const STUDENT_NAMES = [
  "Aryan Kumar", "Priya Singh", "Rohan Patel", "Ananya Sharma", "Vikram Reddy",
  "Neha Gupta", "Aditya Verma", "Divya Nair", "Sanjay Iyer", "Pooja Desai",
  "Rahul Chopra", "Sneha Bhat", "Karan Malhotra", "Isha Kapoor", "Nikhil Joshi",
  "Riya Saxena", "Arjun Singh", "Zara Khan", "Varun Mishra", "Anjali Patel",
  "Harsh Sharma", "Meera Reddy", "Akshay Kumar", "Diya Verma", "Siddharth Nair",
  "Kavya Iyer", "Abhishek Gupta", "Nisha Desai", "Rishabh Chopra", "Shreya Bhat",
  "Yash Malhotra", "Tanvi Kapoor", "Arun Joshi", "Sakshi Saxena", "Vihaan Singh",
  "Aarav Khan", "Navya Mishra", "Arjun Patel", "Isha Sharma", "Rohan Reddy",
  "Aditi Verma", "Siddharth Nair", "Pooja Iyer", "Nikhil Desai", "Ravi Chopra",
  "Sneha Bhat", "Karan Malhotra", "Isha Kapoor", "Vikram Joshi", "Riya Saxena"
];

const SUBJECTS = [
  "Data Structures & Algorithms",
  "Operating Systems",
  "Database Management Systems",
  "Computer Networks",
  "Software Engineering",
  "Object-Oriented Programming",
  "Web Development",
  "Machine Learning",
  "Computer Architecture",
  "Theory of Computation"
];

const CLASSES = [
  { name: "1st Year", year: 1, section: "A" },
  { name: "2nd Year", year: 2, section: "A" },
  { name: "3rd Year", year: 3, section: "A" },
  { name: "4th Year", year: 4, section: "A" }
];

const TEACHER_NAMES = [
  "Sonia Sharma", "Rajesh Kumar", "Meera Iyer", "Priya Verma", "Amit Singh"
];

export const seedInitialData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Create classes
    const classIds: Record<string, any> = {};
    for (const classData of CLASSES) {
      const classId = await ctx.db.insert("classes", classData);
      classIds[classData.name] = classId;
    }

    // Create teachers
    const teacherIds: Record<string, any> = {};
    for (let i = 0; i < TEACHER_NAMES.length; i++) {
      const teacherId = await ctx.db.insert("users", {
        name: TEACHER_NAMES[i],
        username: `teacher_${TEACHER_NAMES[i].toLowerCase().replace(/\\s+/g, "_")}`,
        email: `${TEACHER_NAMES[i].toLowerCase().replace(/\\s+/g, "_")}@edutrack.ai`,
        role: "teacher",
        classId: Object.values(classIds)[i % CLASSES.length],
        teacherSubjects: SUBJECTS.slice(0, 3),
      });
      teacherIds[TEACHER_NAMES[i]] = teacherId;
    }

    // Create subjects for each class
    const subjectIds: Record<string, Record<string, any>> = {};
    for (const [className, classId] of Object.entries(classIds)) {
      subjectIds[className] = {};
      for (const subject of SUBJECTS) {
        const subjectId = await ctx.db.insert("subjects", {
          name: subject,
          classId,
          teacherId: Object.values(teacherIds)[Math.floor(Math.random() * TEACHER_NAMES.length)],
        });
        subjectIds[className][subject] = subjectId;
      }
    }

    // Create 150 students (37-38 per class)
    const studentsPerClass = Math.floor(150 / CLASSES.length);
    const studentIds: any[] = [];

    for (let classIdx = 0; classIdx < CLASSES.length; classIdx++) {
      const className = CLASSES[classIdx].name;
      const classId = classIds[className];
      const classSubjects = subjectIds[className];

      for (let i = 0; i < studentsPerClass; i++) {
        const nameIdx = (classIdx * studentsPerClass + i) % STUDENT_NAMES.length;
        const studentName = `${STUDENT_NAMES[nameIdx]} - ${className}`;
        const studentId = await ctx.db.insert("users", {
          name: studentName,
          username: `student_${studentName.toLowerCase().replace(/\\s+/g, "_")}`,
          email: `${studentName.toLowerCase().replace(/\\s+/g, "_")}@edutrack.ai`,
          role: "student",
          classId,
        });
        studentIds.push({ studentId, classId, className });

        // Initialize gamification
        await ctx.db.insert("gamification", {
          studentId,
          xp: Math.floor(Math.random() * 15000),
          level: Math.floor(Math.random() * 20) + 1,
          streak: Math.floor(Math.random() * 30),
          badges: ["Active Learner", "Consistent Performer"].slice(0, Math.floor(Math.random() * 3)),
          lastActivity: Date.now(),
        });

        // Create performance data for each subject
        for (const [subject, subjectId] of Object.entries(classSubjects)) {
          const attendance = Math.floor(Math.random() * 30) + 70;
          const grades = Math.floor(Math.random() * 40) + 60;
          const engagement = Math.random() * 0.4 + 0.5;

          await ctx.db.insert("studentPerformance", {
            studentId,
            subjectId,
            classId,
            attendance,
            grades,
            engagement,
            assignmentsCompleted: Math.floor(Math.random() * 8) + 2,
            assignmentsTotal: 10,
            behaviorScore: Math.random() * 0.3 + 0.6,
            weekNumber: 1,
          });
        }

        // Create AI predictions
        const dropoutProbability = Math.random();
        let riskLevel: "low" | "medium" | "high" | "critical";
        if (dropoutProbability < 0.3) riskLevel = "low";
        else if (dropoutProbability < 0.6) riskLevel = "medium";
        else if (dropoutProbability < 0.85) riskLevel = "high";
        else riskLevel = "critical";

        await ctx.db.insert("aiPredictions", {
          studentId,
          modelType: "Holistic",
          dropoutProbability,
          riskLevel,
          confidence: Math.random() * 0.2 + 0.8,
          explanation: `Student showing ${riskLevel} risk level based on performance metrics.`,
          weekNumber: 1,
          lhi: Math.random() * 0.4 + 0.6,
          features: {
            attendance: Math.random(),
            grades: Math.random(),
            engagement: Math.random(),
            consistency: Math.random(),
            improvement: Math.random() * 0.5 - 0.25,
          },
        });

        // Create recommendations
        if (riskLevel === "high" || riskLevel === "critical") {
          await ctx.db.insert("recommendations", {
            studentId,
            type: "intervention",
            message: `Immediate attention required. Student needs support in academics.`,
            priority: riskLevel === "critical" ? 1 : 2,
            weekNumber: 1,
          });
        }

        // Create challenges
        await ctx.db.insert("challenges", {
          studentId,
          subjectId: Object.values(classSubjects)[0],
          description: `Complete assignments in ${Object.keys(classSubjects)[0]}`,
          targetImprovement: Math.random() * 0.2 + 0.1,
          xpReward: Math.floor(Math.random() * 100) + 50,
          weekNumber: 1,
          completed: Math.random() > 0.7,
        });
      }
    }

    // Create admin user
    await ctx.db.insert("users", {
      name: "Kavita Patel",
      username: "admin_kavita",
      email: "kavita@edutrack.ai",
      role: "admin",
    });

    // Create model metrics
    const models = ["Holistic", "Temporal", "Hybrid", "ML-Random Forest", "Rule-Based"];
    for (const model of models) {
      await ctx.db.insert("modelMetrics", {
        modelType: model,
        accuracy: Math.random() * 0.15 + 0.85,
        precision: Math.random() * 0.15 + 0.85,
        recall: Math.random() * 0.15 + 0.85,
        f1Score: Math.random() * 0.15 + 0.85,
        rocAuc: Math.random() * 0.1 + 0.9,
        weekNumber: 1,
      });
    }

    return {
      success: true,
      classesCreated: CLASSES.length,
      studentsCreated: studentIds.length,
      teachersCreated: TEACHER_NAMES.length,
    };
  },
});