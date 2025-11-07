import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Eye, LogOut, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const dashboardData = {
    classes: [
      { name: "1st Year", year: 1, section: "A" },
      { name: "2nd Year", year: 2, section: "A" },
      { name: "3rd Year", year: 3, section: "A" },
      { name: "4th Year", year: 4, section: "A" },
    ],
    students: Array.from({ length: 150 }, (_, i) => ({
      name: `Student ${i + 1}`,
      email: `student${i + 1}@edutrack.ai`,
      attendance: Math.floor(Math.random() * 30) + 70,
      overallGrade: Math.floor(Math.random() * 40) + 60,
      riskLevel: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as "low" | "medium" | "high" | "critical",
      dropoutProbability: Math.random(),
      performances: [
        { subject: "Data Structures & Algorithms", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Operating Systems", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Database Management Systems", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Computer Networks", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Software Engineering", grade: Math.floor(Math.random() * 40) + 60 },
      ],
      gamification: {
        level: Math.floor(Math.random() * 20) + 1,
        xp: Math.floor(Math.random() * 15000),
        streak: Math.floor(Math.random() * 30),
      },
    })),
    teachers: Array.from({ length: 60 }, (_, i) => ({
      name: `Teacher ${i + 1}`,
      email: `teacher${i + 1}@edutrack.ai`,
      subjects: ["Data Structures & Algorithms", "Operating Systems", "Database Management Systems"].slice(0, Math.floor(Math.random() * 3) + 1),
      studentsCount: Math.floor(Math.random() * 40) + 30,
      experience: Math.floor(Math.random() * 15) + 1,
    })),
    predictions: [
      { modelType: "Temporal", riskLevel: "low", dropoutProbability: 0.15 },
      { modelType: "Temporal", riskLevel: "medium", dropoutProbability: 0.45 },
      { modelType: "Temporal", riskLevel: "high", dropoutProbability: 0.68 },
      { modelType: "Temporal", riskLevel: "low", dropoutProbability: 0.22 },
      { modelType: "Temporal", riskLevel: "medium", dropoutProbability: 0.38 },
      { modelType: "Temporal", riskLevel: "critical", dropoutProbability: 0.92 },
      { modelType: "Temporal", riskLevel: "low", dropoutProbability: 0.18 },
      { modelType: "Temporal", riskLevel: "medium", dropoutProbability: 0.52 },
    ],
    metrics: [
      { modelType: "Temporal", weekNumber: 12, accuracy: 0.96, f1Score: 0.94, rocAuc: 0.97 },
      { modelType: "Holistic", weekNumber: 12, accuracy: 0.93, f1Score: 0.91, rocAuc: 0.94 },
      { modelType: "Hybrid", weekNumber: 12, accuracy: 0.91, f1Score: 0.89, rocAuc: 0.92 },
      { modelType: "ML-Random Forest", weekNumber: 12, accuracy: 0.88, f1Score: 0.86, rocAuc: 0.90 },
      { modelType: "Rule-Based", weekNumber: 12, accuracy: 0.75, f1Score: 0.72, rocAuc: 0.78 },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-orange-600";
      case "critical": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low": return "bg-emerald-50 border-emerald-200";
      case "medium": return "bg-yellow-50 border-yellow-200";
      case "high": return "bg-orange-50 border-orange-200";
      case "critical": return "bg-red-50 border-red-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  const { classes, students, teachers, predictions, metrics } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">System Overview</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Classes</p>
                    <p className="text-4xl font-bold text-blue-600">{classes.length}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Students</p>
                    <p className="text-4xl font-bold text-emerald-600">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-indigo-100 card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Teachers</p>
                    <p className="text-4xl font-bold text-indigo-600">{teachers.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100 card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Predictions</p>
                    <p className="text-4xl font-bold text-orange-600">{predictions.length}</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-slate-200 bg-white card-shadow">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Model Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.length > 0 ? (
                    metrics.map((metric, idx) => (
                      <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-blue-600">{metric.modelType}</span>
                          <span className="text-xs text-slate-500">Week {metric.weekNumber}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-slate-600">Accuracy:</span>
                            <span className="text-emerald-600 ml-1 font-semibold">{(metric.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-slate-600">F1:</span>
                            <span className="text-indigo-600 ml-1 font-semibold">{metric.f1Score.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">ROC:</span>
                            <span className="text-orange-600 ml-1 font-semibold">{metric.rocAuc.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No metrics available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-slate-200 bg-white card-shadow">
              <CardHeader>
                <CardTitle className="text-emerald-600">Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {predictions.slice(0, 10).map((pred, idx) => (
                    <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-slate-600">{pred.modelType}</span>
                        <span className={`text-xs font-bold uppercase ${
                          pred.riskLevel === 'critical' ? 'text-red-600' :
                          pred.riskLevel === 'high' ? 'text-orange-600' :
                          pred.riskLevel === 'medium' ? 'text-yellow-600' :
                          'text-emerald-600'
                        }`}>
                          {pred.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{(pred.dropoutProbability * 100).toFixed(1)}% dropout probability</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="border-slate-200 bg-white card-shadow">
              <CardHeader>
                <CardTitle className="text-indigo-600">Teacher List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {teachers.length > 0 ? (
                    teachers.map((teacher, idx) => (
                      <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-slate-700 font-medium">{teacher.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500 ml-2">{teacher.email || "No email"}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTeacher(teacher)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No teachers found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="border-slate-200 bg-white card-shadow">
              <CardHeader>
                <CardTitle className="text-indigo-600">Student List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.length > 0 ? (
                    students.map((student, idx) => (
                      <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-slate-700 font-medium">{student.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500 ml-2">{student.email || "No email"}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudent(student)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No students found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">Student Details</DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className={`border rounded-lg p-4 ${getRiskBgColor(selectedStudent.riskLevel)}`}>
                <h3 className="font-bold text-lg mb-2">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedStudent.email}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStudent.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Overall Grade</p>
                    <p className="text-2xl font-bold text-emerald-600">{selectedStudent.overallGrade}%</p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Dropout Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`font-bold uppercase text-sm ${getRiskColor(selectedStudent.riskLevel)}`}>
                      {selectedStudent.riskLevel}
                    </span>
                  </div>
                  <Progress value={selectedStudent.dropoutProbability * 100} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {(selectedStudent.dropoutProbability * 100).toFixed(1)}% dropout probability
                  </p>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Subject Performance</h4>
                <div className="space-y-3">
                  {selectedStudent.performances.map((perf: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{perf.subject}</span>
                        <span className="font-bold text-blue-600">{perf.grade}%</span>
                      </div>
                      <Progress value={perf.grade} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gamification Stats */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Engagement & Progress</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Level</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedStudent.gamification.level}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">XP</p>
                    <p className="text-2xl font-bold text-emerald-600">{selectedStudent.gamification.xp}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedStudent.gamification.streak}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher Details Dialog */}
      <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-600">Teacher Details</DialogTitle>
          </DialogHeader>
          
          {selectedTeacher && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                <h3 className="font-bold text-lg mb-2">{selectedTeacher.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedTeacher.email}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-indigo-600">{selectedTeacher.studentsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Experience</p>
                    <p className="text-2xl font-bold text-emerald-600">{selectedTeacher.experience} years</p>
                  </div>
                </div>
              </div>

              {/* Subjects Taught */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Subjects Taught</h4>
                <div className="space-y-2">
                  {selectedTeacher.subjects.map((subject: string, idx: number) => (
                    <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700 font-medium">{subject}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Teaching Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Subjects</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedTeacher.subjects.length}</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Active Students</p>
                    <p className="text-2xl font-bold text-emerald-600">{selectedTeacher.studentsCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}