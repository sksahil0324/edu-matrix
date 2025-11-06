import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Activity, Brain, ChevronRight, Gamepad2, LineChart, Shield, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "5 advanced models predict dropout risk with 96% accuracy",
      color: "text-[#00ffff]"
    },
    {
      icon: LineChart,
      title: "Real-Time Analytics",
      description: "Track performance, engagement, and learning health index",
      color: "text-[#ff0080]"
    },
    {
      icon: Gamepad2,
      title: "Gamification Engine",
      description: "XP, badges, streaks, and challenges to boost motivation",
      color: "text-[#00ff00]"
    },
    {
      icon: Activity,
      title: "Holistic Monitoring",
      description: "Academic, behavioral, and emotional metrics combined",
      color: "text-[#00ffff]"
    },
    {
      icon: TrendingUp,
      title: "Temporal Analysis",
      description: "Week-by-week evolution tracking and trend forecasting",
      color: "text-[#ff0080]"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure dashboards for students, teachers, and admins",
      color: "text-[#00ff00]"
    }
  ];

  const models = [
    { name: "Rule-Based", accuracy: "75%", color: "#00ffff" },
    { name: "ML Models", accuracy: "88-90%", color: "#ff0080" },
    { name: "Hybrid", accuracy: "91%", color: "#00ff00" },
    { name: "Holistic", accuracy: "93%", color: "#00ffff" },
    { name: "Temporal", accuracy: "96%", color: "#ff0080" }
  ];

  return (
    <div className="min-h-screen bg-black cyber-grid scanline">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#00ffff] bg-black/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/")}
            >
              <img src="./logo.svg" alt="EduTrack AI – AI Based Student Performance Predictor" className="h-10 w-10" />
              <span className="text-2xl font-bold cyber-glow">EDUTRACK.AI</span>
            </motion.div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80 font-bold cyber-glow"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <Sparkles className="h-16 w-16 text-[#ff0080] cyber-glow-pink" />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 cyber-glow">
              EDUTRACK.AI
            </h1>
            
            <p className="text-xl md:text-2xl text-[#00ffff] mb-4 cyber-glow">
              AI Based Student Performance Predictor
            </p>
            
            <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
              AI Based Student Performance Predictor – Harness the power of 5 AI models to predict student dropout risk, 
              monitor learning health, and gamify education with real-time analytics.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80 font-bold text-lg px-8 cyber-glow"
            >
              Launch Platform
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow"
          >
            CORE <span className="text-[#ff0080]">FEATURES</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="border border-[#00ffff] bg-black/50 p-6 backdrop-blur-sm hover:bg-black/70 transition-all"
              >
                <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                <h3 className="text-xl font-bold mb-2 text-[#00ffff]">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Showcase */}
      <section className="py-20 px-4 bg-black/50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow-pink"
          >
            5 AI <span className="text-[#00ffff]">MODELS</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-5 gap-4">
            {models.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="border-2 bg-black/70 p-6 text-center"
                style={{ borderColor: model.color }}
              >
                <div className="text-3xl font-bold mb-2" style={{ color: model.color }}>
                  {model.accuracy}
                </div>
                <div className="text-sm text-gray-400">{model.name}</div>
              </motion.div>
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-[#00ff00] text-lg"
          >
            From rule-based to temporal composite — achieving 96% prediction accuracy
          </motion.p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-2 border-[#ff0080] bg-black/70 p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 cyber-glow-pink">
              READY TO TRANSFORM EDUCATION?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of academic analytics with AI-powered insights
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-[#ff0080] text-white hover:bg-[#ff0080]/80 font-bold text-lg px-12 cyber-glow-pink"
            >
              Start Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00ffff] py-8 px-4 bg-black/80">
        <div className="container mx-auto text-center text-gray-500">
          <p>© 2024 EduTrack AI – AI Based Student Performance Predictor — Powered by Advanced Machine Learning</p>
        </div>
      </footer>
    </div>
  );
}