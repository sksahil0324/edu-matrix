import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Credentials {
  username: string;
  password: string;
  role: "student" | "teacher" | "admin";
  redirect: string;
}

const DEMO_CREDENTIALS: Record<string, Credentials> = {
  student: {
    username: "student_aryan",
    password: "learn@123",
    role: "student",
    redirect: "/student/dashboard",
  },
  teacher: {
    username: "teacher_sonia",
    password: "teach@123",
    role: "teacher",
    redirect: "/teacher/dashboard",
  },
  admin: {
    username: "admin_kavita",
    password: "admin@123",
    role: "admin",
    redirect: "/admin/dashboard",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const credentials = DEMO_CREDENTIALS[selectedRole];

  const handleRoleChange = (role: "student" | "teacher" | "admin") => {
    setSelectedRole(role);
    setUsername(credentials.username);
    setPassword(credentials.password);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validate credentials
    if (username !== credentials.username || password !== credentials.password) {
      setError("Invalid username or password");
      setIsLoading(false);
      return;
    }

    // Store role in localStorage
    localStorage.setItem("userRole", selectedRole);
    localStorage.setItem("username", username);

    // Redirect to appropriate dashboard
    navigate(credentials.redirect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.img
            src="./logo.svg"
            alt="EduTrack AI"
            className="h-16 w-16 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">EduTrack AI – AI Based Student Performance Predictor</h1>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Demo Login</CardTitle>
            <CardDescription className="text-slate-400">
              Select a role to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Select Role</label>
              <div className="grid grid-cols-3 gap-3">
                {(["student", "teacher", "admin"] as const).map((role) => (
                  <motion.button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                      selectedRole === role
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/50"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Demo Hint */}
              <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-300 text-xs">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Username: {credentials.username}</p>
                <p>Password: {credentials.password}</p>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Back to Home */}
            <div className="text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>© 2024 EduTrack AI – AI Based Student Performance Predictor</p>
        </div>
      </motion.div>
    </div>
  );
}
