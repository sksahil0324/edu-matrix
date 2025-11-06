import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  // Mock data for demo
  const data = {
    teacher: { name: "Sonia Sharma", email: "teacher_sonia@edutrack.ai" },
    subjects: [
      { name: "Science", id: "1" },
      { name: "Computer Science", id: "2" },
    ],
    students: [
      { name: "Aryan Kumar", email: "aryan@edutrack.ai" },
      { name: "Priya Singh", email: "priya@edutrack.ai" },
      { name: "Rohan Patel", email: "rohan@edutrack.ai" },
    ],
    performances: [
      { grades: 85, subject: "Science" },
      { grades: 92, subject: "Computer Science" },
    ],
    predictions: [
      {
        studentId: "student_1",
        riskLevel: "low",
        dropoutProbability: 0.15,
        explanation: "Strong performance. No concerns.",
        modelType: "Holistic",
      },
      {
        studentId: "student_2",
        riskLevel: "medium",
        dropoutProbability: 0.45,
        explanation: "Declining engagement. Recommend intervention.",
        modelType: "Holistic",
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const { teacher, subjects, students, predictions } = data;

  const atRiskStudents = predictions.filter(p => p.riskLevel === "high" || p.riskLevel === "critical");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edu-Matrix – Teacher Portal</h1>
              <p className="text-sm text-gray-600">{teacher?.name || "Teacher"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-4xl font-bold text-blue-600">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subjects</p>
                    <p className="text-4xl font-bold text-purple-600">{subjects.length}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">At Risk</p>
                    <p className="text-4xl font-bold text-orange-600">{atRiskStudents.length}</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <CardTitle className="text-blue-600">STUDENT LIST</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student, idx) => (
                    <div key={idx} className="border border-blue-200 p-3 bg-blue-50 flex justify-between items-center">
                      <span className="text-gray-900">{student.name}</span>
                      <span className="text-xs text-gray-600">{student.email}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-red-200 bg-white">
              <CardHeader>
                <CardTitle className="text-red-600">AT-RISK ALERTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {atRiskStudents.length > 0 ? (
                    atRiskStudents.map((pred, idx) => (
                      <div key={idx} className="border border-red-200 p-3 bg-red-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-900">Student ID: {pred.studentId}</span>
                          <span className="text-xs font-bold text-red-600 uppercase">{pred.riskLevel}</span>
                        </div>
                        <p className="text-xs text-gray-600">{pred.explanation}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No at-risk students</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
