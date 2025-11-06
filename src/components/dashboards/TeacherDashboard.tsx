import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router";

interface TeacherDashboardProps {
  userId: Id<"users">;
}

export default function TeacherDashboard({ userId }: TeacherDashboardProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const data = useQuery(api.teachers.getTeacherDashboard, { teacherId: userId });

  if (!data) {
    return (
      <div className="min-h-screen bg-black cyber-grid flex items-center justify-center">
        <div className="text-[#00ffff] text-xl cyber-glow">Loading dashboard...</div>
      </div>
    );
  }

  const { teacher, subjects, students, performances, predictions } = data;

  const atRiskStudents = predictions.filter(p => p.riskLevel === "high" || p.riskLevel === "critical");

  return (
    <div className="min-h-screen bg-black cyber-grid">
      {/* Header */}
      <div className="border-b border-[#00ffff] bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
            <div>
              <h1 className="text-2xl font-bold text-[#00ffff] cyber-glow">TEACHER PORTAL</h1>
              <p className="text-sm text-gray-400">{teacher?.name || "Teacher"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut().then(() => navigate("/"))}
            className="border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080]/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-[#00ffff] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Students</p>
                    <p className="text-4xl font-bold text-[#00ffff] cyber-glow">{students.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-[#00ffff]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-[#ff0080] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Subjects</p>
                    <p className="text-4xl font-bold text-[#ff0080] cyber-glow-pink">{subjects.length}</p>
                  </div>
                  <BookOpen className="h-12 w-12 text-[#ff0080]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-[#ff8800] bg-black/70">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">At Risk</p>
                    <p className="text-4xl font-bold text-[#ff8800]">{atRiskStudents.length}</p>
                  </div>
                  <AlertTriangle className="h-12 w-12 text-[#ff8800]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-[#00ffff] bg-black/70">
              <CardHeader>
                <CardTitle className="text-[#00ffff]">STUDENT LIST</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student, idx) => (
                    <div key={idx} className="border border-[#00ffff]/30 p-3 bg-black/50 flex justify-between items-center">
                      <span className="text-gray-300">{student.name}</span>
                      <span className="text-xs text-gray-500">{student.email}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-[#ff0080] bg-black/70">
              <CardHeader>
                <CardTitle className="text-[#ff0080]">AT-RISK ALERTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {atRiskStudents.length > 0 ? (
                    atRiskStudents.map((pred, idx) => (
                      <div key={idx} className="border border-[#ff0080]/30 p-3 bg-black/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-300">Student ID: {pred.studentId}</span>
                          <span className="text-xs font-bold text-[#ff0080] uppercase">{pred.riskLevel}</span>
                        </div>
                        <p className="text-xs text-gray-400">{pred.explanation}</p>
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
