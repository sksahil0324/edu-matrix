import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Award, Brain, Flame, LogOut, Star, TrendingUp, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const data = {
    student: { name: "Aryan Kumar - 1st Year", email: "aryan_kumar@edutrack.ai" },
    performances: [
      { grades: 85, subject: "Data Structures & Algorithms" },
      { grades: 78, subject: "Operating Systems" },
      { grades: 92, subject: "Database Management Systems" },
      { grades: 88, subject: "Computer Networks" },
      { grades: 95, subject: "Software Engineering" },
    ],
    predictions: [
      {
        riskLevel: "low",
        dropoutProbability: 0.15,
        explanation: "Strong performance across all subjects. Keep up the good work!",
        modelType: "Temporal",
        confidence: 0.96,
        lhi: 0.85,
      },
    ],
    gamification: {
      level: 12,
      xp: 11500,
      streak: 28,
      badges: ["Perfect Attendance", "Math Master", "Consistent Performer"],
    },
    recommendations: [
      { message: "Focus on improving Science grades", priority: 2 },
      { message: "Maintain your current study streak", priority: 1 },
    ],
    challenges: [
      { description: "Complete 5 assignments this week", xpReward: 100, completed: false },
      { description: "Achieve 90% in next quiz", xpReward: 150, completed: false },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const { student, performances, predictions, gamification, recommendations, challenges } = data;
  const latestPrediction = predictions[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-emerald-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-orange-600";
      case "critical": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
              <p className="text-sm text-slate-600">{student?.name || "Student"}</p>
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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gamification Stats */}
            {gamification && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-4 gap-4"
              >
                <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Level</p>
                        <p className="text-3xl font-bold text-blue-600">{gamification.level}</p>
                      </div>
                      <Star className="h-10 w-10 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100 card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">XP</p>
                        <p className="text-3xl font-bold text-emerald-600">{gamification.xp}</p>
                      </div>
                      <Zap className="h-10 w-10 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100 card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Streak</p>
                        <p className="text-3xl font-bold text-orange-600">{gamification.streak}</p>
                      </div>
                      <Flame className="h-10 w-10 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-indigo-100 card-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Badges</p>
                        <p className="text-3xl font-bold text-indigo-600">{gamification.badges.length}</p>
                      </div>
                      <Trophy className="h-10 w-10 text-indigo-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Prediction */}
            {latestPrediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-slate-200 bg-white card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Brain className="h-6 w-6" />
                      AI Dropout Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600 font-semibold">Risk Level</span>
                        <span className={`font-bold uppercase ${getRiskColor(latestPrediction.riskLevel)}`}>
                          {latestPrediction.riskLevel}
                        </span>
                      </div>
                      <Progress 
                        value={latestPrediction.dropoutProbability * 100} 
                        className="h-3"
                      />
                      <p className="text-sm text-slate-600 mt-1">
                        {(latestPrediction.dropoutProbability * 100).toFixed(1)}% probability
                      </p>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-sm text-slate-700">{latestPrediction.explanation}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Model: {latestPrediction.modelType} | Confidence: {(latestPrediction.confidence * 100).toFixed(0)}%
                      </p>
                    </div>

                    {latestPrediction.lhi && (
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-semibold">Learning Health Index</span>
                          <span className="text-2xl font-bold text-emerald-600">
                            {(latestPrediction.lhi * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-slate-200 bg-white card-shadow">
                <CardHeader>
                  <CardTitle className="text-blue-600">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performances.slice(0, 5).map((perf, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-semibold">{perf.subject}</span>
                          <span className="text-blue-600 font-bold">{perf.grades}%</span>
                        </div>
                        <Progress value={perf.grades} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Recommendations & Challenges */}
          <div className="space-y-6">
            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-slate-200 bg-white card-shadow">
                <CardHeader>
                  <CardTitle className="text-emerald-600 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec, idx) => (
                        <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-700">{rec.message}</p>
                          <p className="text-xs text-slate-500 mt-1">Priority: {rec.priority}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">No recommendations yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-slate-200 bg-white card-shadow">
                <CardHeader>
                  <CardTitle className="text-indigo-600 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Active Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {challenges.length > 0 ? (
                      challenges.map((challenge, idx) => (
                        <div key={idx} className="border border-slate-200 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-700">{challenge.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500">+{challenge.xpReward} XP</span>
                            <span className={`text-xs font-semibold ${challenge.completed ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {challenge.completed ? '✓ Complete' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">No active challenges</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}