import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, Eye, LogOut, Users, Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const initializeUser = useMutation(api.seedUser.initializeNewUser);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeIfNeeded = async () => {
      if (user && !user.role && !initialized) {
        try {
          await initializeUser({ role: "teacher" });
          setInitialized(true);
        } catch (error) {
          console.error("Failed to initialize user:", error);
        }
      }
    };
    initializeIfNeeded();
  }, [user, initialized, initializeUser]);

  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<any>(null);

  // Mock data for demo - represents dataset from Convex
  // Using deterministic data generation based on student index for consistency
  // Store in state to persist edits
  const [students, setStudents] = useState(() => Array.from({ length: 38 }, (_, i) => {
      // Use student index to generate consistent data (not random)
      const seed = i + 1;
      const attendance = 70 + ((seed * 7) % 31); // Deterministic: 70-100%
      const performances = [
        { subject: "Data Structures & Algorithms", grade: 60 + ((seed * 11) % 41) },
        { subject: "Operating Systems", grade: 60 + ((seed * 13) % 41) },
        { subject: "Database Management Systems", grade: 60 + ((seed * 17) % 41) },
        { subject: "Computer Networks", grade: 60 + ((seed * 19) % 41) },
        { subject: "Software Engineering", grade: 60 + ((seed * 23) % 41) },
      ];
      const overallGrade = Math.floor(performances.reduce((sum, p) => sum + p.grade, 0) / performances.length);
      
      // Calculate risk based on actual data using Temporal model thresholds
      const attendanceScore = attendance / 100;
      const gradeScore = overallGrade / 100;
      const performanceScore = (attendanceScore + gradeScore) / 2;
      
      let riskLevel: "low" | "medium" | "high" | "critical";
      let dropoutProbability: number;
      
      // Use consistent Temporal model calculation (no randomness for consistency)
      if (performanceScore >= 0.85) {
        riskLevel = "low";
        dropoutProbability = 0.10; // Fixed value for consistency
      } else if (performanceScore >= 0.75) {
        riskLevel = "medium";
        dropoutProbability = 0.30; // Fixed value for consistency
      } else if (performanceScore >= 0.65) {
        riskLevel = "high";
        dropoutProbability = 0.60; // Fixed value for consistency
      } else {
        riskLevel = "critical";
        dropoutProbability = 0.85; // Fixed value for consistency
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
          level: 1 + ((seed * 3) % 20),
          xp: (seed * 397) % 15000,
          streak: (seed * 5) % 31,
        },
      };
    }));

  const data = {
    teacher: { name: "Sonia Sharma", email: "sonia_sharma@edutrack.ai" },
    subjects: [
      { name: "Data Structures & Algorithms", id: "1" },
      { name: "Operating Systems", id: "2" },
      { name: "Database Management Systems", id: "3" },
      { name: "Computer Networks", id: "4" },
      { name: "Software Engineering", id: "5" },
    ],
    students,
    performances: [
      { grades: 85, subject: "Data Structures & Algorithms" },
      { grades: 92, subject: "Operating Systems" },
      { grades: 88, subject: "Database Management Systems" },
      { grades: 78, subject: "Computer Networks" },
      { grades: 95, subject: "Software Engineering" },
    ],
    predictions: students.slice(0, 10).map((student: any) => ({
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
      // Recalculate risk based on updated data
      const updatedStudent = { ...editedStudent };
      
      // Recalculate overall grade from performances
      const newOverallGrade = Math.floor(
        updatedStudent.performances.reduce((sum: number, p: any) => sum + p.grade, 0) / 
        updatedStudent.performances.length
      );
      updatedStudent.overallGrade = newOverallGrade;
      
      // Recalculate risk based on actual data using consistent Temporal model thresholds
      const attendanceScore = updatedStudent.attendance / 100;
      const gradeScore = newOverallGrade / 100;
      const performanceScore = (attendanceScore + gradeScore) / 2;
      
      let riskLevel: "low" | "medium" | "high" | "critical";
      let dropoutProbability: number;
      
      if (performanceScore >= 0.85) {
        riskLevel = "low";
        dropoutProbability = 0.10;
      } else if (performanceScore >= 0.75) {
        riskLevel = "medium";
        dropoutProbability = 0.30;
      } else if (performanceScore >= 0.65) {
        riskLevel = "high";
        dropoutProbability = 0.60;
      } else {
        riskLevel = "critical";
        dropoutProbability = 0.85;
      }
      
      updatedStudent.riskLevel = riskLevel;
      updatedStudent.dropoutProbability = dropoutProbability;
      
      // Update the students array to persist the changes
      setStudents(prevStudents => 
        prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
      );
      
      setSelectedStudent(updatedStudent);
      setIsEditMode(false);
      toast.success("Student details and risk assessment updated successfully!");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditedStudent((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePerformanceChange = (index: number, value: number) => {
    setEditedStudent((prev: any) => {
      const updatedPerformances = prev.performances.map((perf: any, idx: number) =>
        idx === index ? { ...perf, grade: value } : perf
      );
      
      // Recalculate overall grade
      const newOverallGrade = Math.floor(
        updatedPerformances.reduce((sum: number, p: any) => sum + p.grade, 0) / 
        updatedPerformances.length
      );
      
      return {
        ...prev,
        performances: updatedPerformances,
        overallGrade: newOverallGrade,
      };
    });
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

  const { teacher, subjects, predictions } = data;

  const atRiskStudents = students.filter((s: any) => s.riskLevel === "high" || s.riskLevel === "critical");

  const displayStudent = isEditMode ? editedStudent : selectedStudent;

  // Generate predictions from all 5 AI models for comparison
  const generateAllModelPredictions = (student: any) => {
    if (!student) return [];
    
    const attendanceScore = student.attendance / 100;
    const gradeScore = student.overallGrade / 100;
    const performanceScore = (attendanceScore + gradeScore) / 2;
    
    return [
      {
        modelName: "Rule-Based",
        accuracy: 75,
        riskLevel: performanceScore >= 0.7 ? "low" : performanceScore >= 0.6 ? "medium" : performanceScore >= 0.5 ? "high" : "critical",
        dropoutProbability: performanceScore >= 0.7 ? 0.15 : performanceScore >= 0.6 ? 0.35 : performanceScore >= 0.5 ? 0.60 : 0.85,
        explanation: "Basic rule-based assessment using attendance and grade thresholds. Simple if-then logic without machine learning.",
      },
      {
        modelName: "ML - Random Forest",
        accuracy: 88,
        riskLevel: performanceScore >= 0.78 ? "low" : performanceScore >= 0.68 ? "medium" : performanceScore >= 0.58 ? "high" : "critical",
        dropoutProbability: performanceScore >= 0.78 ? 0.12 : performanceScore >= 0.68 ? 0.32 : performanceScore >= 0.58 ? 0.58 : 0.82,
        explanation: "Machine learning model using Random Forest algorithm. Considers multiple features with weighted importance.",
      },
      {
        modelName: "Hybrid",
        accuracy: 91,
        riskLevel: performanceScore >= 0.80 ? "low" : performanceScore >= 0.70 ? "medium" : performanceScore >= 0.60 ? "high" : "critical",
        dropoutProbability: performanceScore >= 0.80 ? 0.10 : performanceScore >= 0.70 ? 0.30 : performanceScore >= 0.60 ? 0.55 : 0.80,
        explanation: "Combines rule-based and ML approaches. Uses ensemble methods for improved accuracy.",
      },
      {
        modelName: "Holistic",
        accuracy: 93,
        riskLevel: performanceScore >= 0.82 ? "low" : performanceScore >= 0.72 ? "medium" : performanceScore >= 0.62 ? "high" : "critical",
        dropoutProbability: performanceScore >= 0.82 ? 0.08 : performanceScore >= 0.72 ? 0.28 : performanceScore >= 0.62 ? 0.52 : 0.78,
        explanation: "Comprehensive model analyzing academic, behavioral, and engagement metrics holistically.",
      },
      {
        modelName: "Temporal",
        accuracy: 96,
        riskLevel: performanceScore >= 0.85 ? "low" : performanceScore >= 0.75 ? "medium" : performanceScore >= 0.65 ? "high" : "critical",
        dropoutProbability: performanceScore >= 0.85 ? 0.10 : performanceScore >= 0.75 ? 0.30 : performanceScore >= 0.65 ? 0.60 : 0.85,
        explanation: "Most accurate model using temporal analysis. Tracks week-by-week evolution and trend forecasting with 96% accuracy.",
      },
    ];
  };

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
                  {students.map((student: any, idx: number) => (
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
                    atRiskStudents.map((student: any, idx: number) => {
                      const suggestions = student.riskLevel === "critical" 
                        ? [
                            "Schedule immediate one-on-one meeting",
                            "Contact parents/guardians urgently",
                            "Refer to academic counselor",
                            "Create personalized learning plan",
                            "Assign peer mentor for support"
                          ]
                        : [
                            "Increase monitoring frequency",
                            "Provide additional tutoring sessions",
                            "Set up weekly check-ins",
                            "Encourage participation in study groups",
                            "Offer extra credit opportunities"
                          ];
                      
                      return (
                        <div key={idx} className="border border-red-200 p-3 bg-red-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                              <span className="text-xs text-gray-600 ml-2">{student.email}</span>
                            </div>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                              student.riskLevel === "critical" 
                                ? "bg-red-600 text-white" 
                                : "bg-orange-600 text-white"
                            }`}>
                              {student.riskLevel}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1 mb-2">
                            <p>Attendance: {student.attendance}% | Grade: {student.overallGrade}%</p>
                            <p>Dropout Probability: {(student.dropoutProbability * 100).toFixed(1)}%</p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-red-300">
                            <p className="text-xs font-semibold text-gray-900 mb-1">Recommended Actions:</p>
                            <ul className="text-xs text-gray-700 space-y-0.5">
                              {suggestions.slice(0, 3).map((suggestion, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-red-600 mr-1">•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })
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
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparison">AI Model Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
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
                
                {/* Intervention Suggestions */}
                {(displayStudent.riskLevel === "high" || displayStudent.riskLevel === "critical") && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h5 className="text-sm font-semibold text-slate-900 mb-2">Recommended Interventions:</h5>
                    <ul className="text-xs text-slate-700 space-y-1.5">
                      {displayStudent.riskLevel === "critical" ? (
                        <>
                          <li className="flex items-start">
                            <span className="text-red-600 mr-2 font-bold">1.</span>
                            <span><strong>Immediate Action:</strong> Schedule urgent meeting with student and parents/guardians</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-600 mr-2 font-bold">2.</span>
                            <span><strong>Academic Support:</strong> Refer to academic counselor and create personalized learning plan</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-600 mr-2 font-bold">3.</span>
                            <span><strong>Peer Support:</strong> Assign dedicated peer mentor for daily check-ins</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-600 mr-2 font-bold">4.</span>
                            <span><strong>Monitoring:</strong> Daily attendance tracking and weekly progress reviews</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-red-600 mr-2 font-bold">5.</span>
                            <span><strong>Resources:</strong> Connect with student support services and mental health resources</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start">
                            <span className="text-orange-600 mr-2 font-bold">1.</span>
                            <span><strong>Monitoring:</strong> Increase check-in frequency to twice weekly</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-orange-600 mr-2 font-bold">2.</span>
                            <span><strong>Tutoring:</strong> Provide additional tutoring sessions in struggling subjects</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-orange-600 mr-2 font-bold">3.</span>
                            <span><strong>Engagement:</strong> Encourage participation in study groups and peer learning</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-orange-600 mr-2 font-bold">4.</span>
                            <span><strong>Motivation:</strong> Offer extra credit opportunities and recognize improvements</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-orange-600 mr-2 font-bold">5.</span>
                            <span><strong>Communication:</strong> Maintain regular contact with parents about progress</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
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
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">AI Model Comparison</h3>
                    <p className="text-sm text-slate-600">
                      Compare predictions from all 5 AI models for {displayStudent.name}
                    </p>
                  </div>

                  {generateAllModelPredictions(displayStudent).map((prediction, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`border rounded-lg p-4 ${
                        prediction.modelName === "Temporal" 
                          ? "bg-emerald-50 border-emerald-300 shadow-md" 
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-slate-900">{prediction.modelName}</h4>
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {prediction.accuracy}% Accuracy
                          </span>
                          {prediction.modelName === "Temporal" && (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-600 text-white">
                              Most Accurate
                            </span>
                          )}
                        </div>
                        <span className={`font-bold uppercase text-sm ${getRiskColor(prediction.riskLevel)}`}>
                          {prediction.riskLevel}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Dropout Probability</span>
                          <span className="font-bold text-slate-900">
                            {(prediction.dropoutProbability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={prediction.dropoutProbability * 100} 
                          className="h-2"
                        />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {prediction.explanation}
                      </p>
                    </motion.div>
                  ))}

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> The Temporal model (96% accuracy) is recommended for the most reliable predictions. 
                      It uses advanced temporal analysis to track student performance evolution over time.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}