import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, LogOut, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const navigate = useNavigate();

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
    })),
    teachers: [
      { name: "Sonia Sharma", email: "sonia_sharma@edutrack.ai" },
      { name: "Rajesh Kumar", email: "rajesh_kumar@edutrack.ai" },
      { name: "Meera Iyer", email: "meera_iyer@edutrack.ai" },
      { name: "Priya Verma", email: "priya_verma@edutrack.ai" },
      { name: "Amit Singh", email: "amit_singh@edutrack.ai" },
    ],
    predictions: [
      { modelType: "Holistic", riskLevel: "low", dropoutProbability: 0.15 },
      { modelType: "Temporal", riskLevel: "medium", dropoutProbability: 0.45 },
      { modelType: "Hybrid", riskLevel: "high", dropoutProbability: 0.68 },
      { modelType: "ML-Random Forest", riskLevel: "low", dropoutProbability: 0.22 },
      { modelType: "Rule-Based", riskLevel: "medium", dropoutProbability: 0.38 },
      { modelType: "Holistic", riskLevel: "critical", dropoutProbability: 0.92 },
      { modelType: "Temporal", riskLevel: "low", dropoutProbability: 0.18 },
      { modelType: "Hybrid", riskLevel: "medium", dropoutProbability: 0.52 },
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
                      <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium">{teacher.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500">{teacher.email || "No email"}</span>
                        </div>
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
                      <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium">{student.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500">{student.email || "No email"}</span>
                        </div>
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
    </div>
  );
}