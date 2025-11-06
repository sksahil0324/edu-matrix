import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, LogOut, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dashboardData = useQuery(api.admin.getAdminDashboard);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-black cyber-grid flex items-center justify-center">
        <p className="text-[#00ffff] cyber-glow">Loading dashboard...</p>
      </div>
    );
  }

  const { classes, students, teachers, predictions, metrics, performances } = dashboardData;

  return (
    <div className="min-h-screen bg-black cyber-grid">
      {/* Header */}
      <div className="border-b border-[#00ffff] bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
            <div>
              <h1 className="text-2xl font-bold text-[#00ffff] cyber-glow">EduTrack AI – AI Based Student Performance Predictor – ADMIN PORTAL</h1>
              <p className="text-sm text-gray-400">System Overview</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080]/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-[#00ffff] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Classes</p>
                    <p className="text-4xl font-bold text-[#00ffff]">{classes.length}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-[#00ffff]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-[#ff0080] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Students</p>
                    <p className="text-4xl font-bold text-[#ff0080]">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-[#ff0080]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-[#00ff00] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Teachers</p>
                    <p className="text-4xl font-bold text-[#00ff00]">{teachers.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-[#00ff00]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-[#ffff00] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Predictions</p>
                    <p className="text-4xl font-bold text-[#ffff00]">{predictions.length}</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-[#ffff00]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-[#00ffff] bg-black/70">
              <CardHeader>
                <CardTitle className="text-[#00ffff] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  MODEL METRICS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.length > 0 ? (
                    metrics.map((metric, idx) => (
                      <div key={idx} className="border border-[#00ffff]/30 p-3 bg-black/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-[#00ffff]">{metric.modelType}</span>
                          <span className="text-xs text-gray-500">Week {metric.weekNumber}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Accuracy:</span>
                            <span className="text-[#00ff00] ml-1">{(metric.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">F1:</span>
                            <span className="text-[#ff0080] ml-1">{metric.f1Score.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">ROC:</span>
                            <span className="text-[#ffff00] ml-1">{metric.rocAuc.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No metrics available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-[#ff0080] bg-black/70">
              <CardHeader>
                <CardTitle className="text-[#ff0080]">RECENT PREDICTIONS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {predictions.slice(0, 10).map((pred, idx) => (
                    <div key={idx} className="border border-[#ff0080]/30 p-3 bg-black/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500">{pred.modelType}</span>
                        <span className={`text-xs font-bold uppercase ${
                          pred.riskLevel === 'critical' ? 'text-[#ff0080]' :
                          pred.riskLevel === 'high' ? 'text-[#ff8800]' :
                          pred.riskLevel === 'medium' ? 'text-[#ffff00]' :
                          'text-[#00ff00]'
                        }`}>
                          {pred.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{(pred.dropoutProbability * 100).toFixed(1)}% dropout probability</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
          <Card className="border-[#00ff00] bg-black/70">
            <CardHeader>
              <CardTitle className="text-[#00ff00]">STUDENT LIST</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.length > 0 ? (
                  students.map((student, idx) => (
                    <div key={idx} className="border border-[#00ff00]/30 p-3 bg-black/50">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">{student.name || "Unknown"}</span>
                        <span className="text-xs text-gray-500">{student.email || "No email"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No students found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}