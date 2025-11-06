import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import TeacherDashboard from "@/components/dashboards/TeacherDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black cyber-grid">
        <Loader2 className="h-12 w-12 animate-spin text-[#00ffff] cyber-glow" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black cyber-grid">
        <div className="text-center">
          <p className="text-[#ff0080] text-xl mb-4">No user data found</p>
          <Button onClick={() => navigate("/auth")} className="bg-[#00ffff] text-black">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  if (user.role === "student") {
    return <StudentDashboard />;
  } else if (user.role === "teacher") {
    return <TeacherDashboard />;
  } else if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black cyber-grid">
      <div className="text-center">
        <p className="text-[#ff0080] text-xl mb-4">Role not assigned</p>
        <p className="text-gray-400 mb-4">Please contact an administrator</p>
        <Button onClick={() => navigate("/")} className="bg-[#00ffff] text-black">
          Go Home
        </Button>
      </div>
    </div>
  );
}