import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Award, Brain, Flame, LogOut, Star, TrendingUp, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router";

interface StudentDashboardProps {
  userId: Id<"users">;
}

export default function StudentDashboard({ userId }: StudentDashboardProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const data = useQuery(api.students.getStudentDashboard, { studentId: userId });

  if (!data) {
    return (
      <div className="min-h-screen bg-black cyber-grid flex items-center justify-center">
        <div className="text-[#00ffff] text-xl cyber-glow">Loading dashboard...</div>
      </div>
    );
  }

  const { student, performances, predictions, gamification, recommendations, challenges } = data;
  const latestPrediction = predictions[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "#00ff00";
      case "medium": return "#ffff00";
      case "high": return "#ff8800";
      case "critical": return "#ff0080";
      default: return "#00ffff";
    }
  };

  return (
    <div className="min-h-screen bg-black cyber-grid">
      {/* Header */}
      <div className="border-b border-[#00ffff] bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="./logo.svg" alt="Logo" className="h-10 w-10 cursor-pointer" onClick={() => navigate("/")} />
            <div>
              <h1 className="text-2xl font-bold text-[#00ffff] cyber-glow">STUDENT PORTAL</h1>
              <p className="text-sm text-gray-400">{student?.name || "Student"}</p>
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
                <Card className="border-[#00ffff] bg-black/70">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Level</p>
                        <p className="text-3xl font-bold text-[#00ffff] cyber-glow">{gamification.level}</p>
                      </div>
                      <Star className="h-10 w-10 text-[#00ffff]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#ff0080] bg-black/70">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">XP</p>
                        <p className="text-3xl font-bold text-[#ff0080] cyber-glow-pink">{gamification.xp}</p>
                      </div>
                      <Zap className="h-10 w-10 text-[#ff0080]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#00ff00] bg-black/70">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Streak</p>
                        <p className="text-3xl font-bold text-[#00ff00] cyber-glow-green">{gamification.streak}</p>
                      </div>
                      <Flame className="h-10 w-10 text-[#00ff00]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#ffff00] bg-black/70">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Badges</p>
                        <p className="text-3xl font-bold text-[#ffff00]">{gamification.badges.length}</p>
                      </div>
                      <Trophy className="h-10 w-10 text-[#ffff00]" />
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
                <Card className="border-2 bg-black/70" style={{ borderColor: getRiskColor(latestPrediction.riskLevel) }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#00ffff]">
                      <Brain className="h-6 w-6" />
                      AI DROPOUT PREDICTION
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Risk Level</span>
                        <span className="font-bold uppercase" style={{ color: getRiskColor(latestPrediction.riskLevel) }}>
                          {latestPrediction.riskLevel}
                        </span>
                      </div>
                      <Progress 
                        value={latestPrediction.dropoutProbability * 100} 
                        className="h-3"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        {(latestPrediction.dropoutProbability * 100).toFixed(1)}% probability
                      </p>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-sm text-gray-300">{latestPrediction.explanation}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Model: {latestPrediction.modelType} | Confidence: {(latestPrediction.confidence * 100).toFixed(0)}%
                      </p>
                    </div>

                    {latestPrediction.lhi && (
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Learning Health Index</span>
                          <span className="text-2xl font-bold text-[#00ff00] cyber-glow-green">
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
              <Card className="border-[#00ffff] bg-black/70">
                <CardHeader>
                  <CardTitle className="text-[#00ffff]">PERFORMANCE METRICS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performances.slice(0, 5).map((perf, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Subject {idx + 1}</span>
                          <span className="text-[#00ffff]">{perf.grades}%</span>
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
              <Card className="border-[#ff0080] bg-black/70">
                <CardHeader>
                  <CardTitle className="text-[#ff0080] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    RECOMMENDATIONS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec, idx) => (
                        <div key={idx} className="border border-[#ff0080]/30 p-3 bg-black/50">
                          <p className="text-sm text-gray-300">{rec.message}</p>
                          <p className="text-xs text-gray-500 mt-1">Priority: {rec.priority}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No recommendations yet</p>
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
              <Card className="border-[#00ff00] bg-black/70">
                <CardHeader>
                  <CardTitle className="text-[#00ff00] flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    ACTIVE CHALLENGES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {challenges.length > 0 ? (
                      challenges.map((challenge, idx) => (
                        <div key={idx} className="border border-[#00ff00]/30 p-3 bg-black/50">
                          <p className="text-sm text-gray-300">{challenge.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">+{challenge.xpReward} XP</span>
                            <span className={`text-xs ${challenge.completed ? 'text-[#00ff00]' : 'text-gray-500'}`}>
                              {challenge.completed ? '✓ Complete' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No active challenges</p>
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
