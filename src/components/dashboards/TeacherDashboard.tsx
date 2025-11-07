import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, Eye, LogOut, Users, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<any>(null);

  // Mock data for demo - represents dataset from Convex
  const data = {
    teacher: { name: "Sonia Sharma", email: "sonia_sharma@edutrack.ai" },
    subjects: [
      { name: "Data Structures & Algorithms", id: "1" },
      { name: "Operating Systems", id: "2" },
      { name: "Database Management Systems", id: "3" },
      { name: "Computer Networks", id: "4" },
      { name: "Software Engineering", id: "5" },
    ],
    students: Array.from({ length: 38 }, (_, i) => {
      const attendance = Math.floor(Math.random() * 30) + 70;
      const performances = [
        { subject: "Data Structures & Algorithms", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Operating Systems", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Database Management Systems", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Computer Networks", grade: Math.floor(Math.random() * 40) + 60 },
        { subject: "Software Engineering", grade: Math.floor(Math.random() * 40) + 60 },
      ];
      const overallGrade = Math.floor(performances.reduce((sum, p) => sum + p.grade, 0) / performances.length);
      
      // Calculate risk based on actual data
      const attendanceScore = attendance / 100;
      const gradeScore = overallGrade / 100;
      const performanceScore = (attendanceScore + gradeScore) / 2;
      
      let riskLevel: "low" | "medium" | "high" | "critical";
      let dropoutProbability: number;
      
      if (performanceScore >= 0.85) {
        riskLevel = "low";
        dropoutProbability = 0.05 + Math.random() * 0.15; // 5-20%
      } else if (performanceScore >= 0.75) {
        riskLevel = "medium";
        dropoutProbability = 0.25 + Math.random() * 0.20; // 25-45%
      } else if (performanceScore >= 0.65) {
        riskLevel = "high";
        dropoutProbability = 0.50 + Math.random() * 0.25; // 50-75%
      } else {
        riskLevel = "critical";
        dropoutProbability = 0.75 + Math.random() * 0.20; // 75-95%
      }
      
      return {
        id: `student_${i + 1}`,
        name: `Student ${i + 1} - 1st Year`,
        email: `student${i + 1}@edutrack.ai`,
        attendance,
        overallGrade,
        riskLevel,
        dropoutProbability,
        performances,
        gamification: {
          level: Math.floor(Math.random() * 20) + 1,
          xp: Math.floor(Math.random() * 15000),
          streak: Math.floor(Math.random() * 30),
        },
      };
    }),
    performances: [
      { grades: 85, subject: "Data Structures & Algorithms" },
      { grades: 92, subject: "Operating Systems" },
      { grades: 88, subject: "Database Management Systems" },
      { grades: 78, subject: "Computer Networks" },
      { grades: 95, subject: "Software Engineering" },
    ],
    predictions: data.students.slice(0, 10).map((student) => ({
      studentId: student.id,
      riskLevel: student.riskLevel,
      dropoutProbability: student.dropoutProbability,
      explanation: `Temporal model (96% accuracy) analysis: ${student.riskLevel} risk detected. Attendance: ${student.attendance}%, Overall Grade: ${student.overallGrade}%. ${
        student.riskLevel === "critical" ? "Immediate intervention required - student showing multiple risk factors." :
        student.riskLevel === "high" ? "Close monitoring needed - performance below expected thresholds." :
        student.riskLevel === "medium" ? "Some concerns identified - targeted support recommended." :
        "Student performing well with consistent engagement and strong academic results."
      }`,
      modelType: "Temporal",
    })),
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setEditedStudent({ ...selectedStudent });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedStudent(null);
  };

  const handleSaveEdit = () => {
    // Update the student data
    if (editedStudent) {
      // In a real app, this would call a mutation to update the database
      setSelectedStudent(editedStudent);
      setIsEditMode(false);
      toast.success("Student details updated successfully!");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedStudent((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePerformanceChange = (index: number, value: number) => {
    setEditedStudent((prev: any) => ({
      ...prev,
      performances: prev.performances.map((perf: any, idx: number) =>
        idx === index ? { ...perf, grade: value } : perf
      ),
    }));
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

  const { teacher, subjects, students, predictions } = data;

  const atRiskStudents = predictions.filter(p => p.riskLevel === "high" || p.riskLevel === "critical");

  const displayStudent = isEditMode ? editedStudent : selectedStudent;

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
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium">{student.name}</span>
                        <span className="text-xs text-gray-600 ml-2">{student.email}</span>
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

      {/* Student Details Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => {
        setSelectedStudent(null);
        setIsEditMode(false);
        setEditedStudent(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-blue-600">
                {isEditMode ? "Edit Student Details" : "Student Details"}
              </DialogTitle>
              <div className="flex gap-2">
                {!isEditMode ? (
                  <Button
                    size="sm"
                    onClick={handleEditClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>
          
          {displayStudent && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className={`border rounded-lg p-4 ${getRiskBgColor(displayStudent.riskLevel)}`}>
                {isEditMode ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                      <Input
                        id="name"
                        value={editedStudent.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedStudent.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="attendance" className="text-sm font-semibold">Attendance (%)</Label>
                        <Input
                          id="attendance"
                          type="number"
                          min="0"
                          max="100"
                          value={editedStudent.attendance}
                          onChange={(e) => handleInputChange("attendance", parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="overallGrade" className="text-sm font-semibold">Overall Grade (%)</Label>
                        <Input
                          id="overallGrade"
                          type="number"
                          min="0"
                          max="100"
                          value={editedStudent.overallGrade}
                          onChange={(e) => handleInputChange("overallGrade", parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg mb-2">{displayStudent.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{displayStudent.email}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Attendance</p>
                        <p className="text-2xl font-bold text-blue-600">{displayStudent.attendance}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Overall Grade</p>
                        <p className="text-2xl font-bold text-emerald-600">{displayStudent.overallGrade}%</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Risk Assessment */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Dropout Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`font-bold uppercase text-sm ${getRiskColor(displayStudent.riskLevel)}`}>
                      {displayStudent.riskLevel}
                    </span>
                  </div>
                  <Progress value={displayStudent.dropoutProbability * 100} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {(displayStudent.dropoutProbability * 100).toFixed(1)}% dropout probability
                  </p>
                </div>
              </div>

              {/* Subject Performance */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold mb-3 text-slate-900">Subject Performance</h4>
                <div className="space-y-3">
                  {displayStudent.performances.map((perf: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{perf.subject}</span>
                        {isEditMode ? (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={perf.grade}
                            onChange={(e) => handlePerformanceChange(idx, parseInt(e.target.value))}
                            className="w-20 h-6 text-right"
                          />
                        ) : (
                          <span className="font-bold text-blue-600">{perf.grade}%</span>
                        )}
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
                    <p className="text-2xl font-bold text-blue-600">{displayStudent.gamification.level}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">XP</p>
                    <p className="text-2xl font-bold text-emerald-600">{displayStudent.gamification.xp}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{displayStudent.gamification.streak}</p>
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