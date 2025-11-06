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
      color: "text-blue-600"
    },
    {
      icon: LineChart,
      title: "Real-Time Analytics",
      description: "Track performance, engagement, and learning health index",
      color: "text-emerald-600"
    },
    {
      icon: Gamepad2,
      title: "Gamification Engine",
      description: "XP, badges, streaks, and challenges to boost motivation",
      color: "text-indigo-600"
    },
    {
      icon: Activity,
      title: "Holistic Monitoring",
      description: "Academic, behavioral, and emotional metrics combined",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Temporal Analysis",
      description: "Week-by-week evolution tracking and trend forecasting",
      color: "text-emerald-600"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure dashboards for students, teachers, and admins",
      color: "text-indigo-600"
    }
  ];

  const models = [
    { name: "Rule-Based", accuracy: "75%", color: "bg-blue-50", textColor: "text-blue-600" },
    { name: "ML Models", accuracy: "88-90%", color: "bg-emerald-50", textColor: "text-emerald-600" },
    { name: "Hybrid", accuracy: "91%", color: "bg-indigo-50", textColor: "text-indigo-600" },
    { name: "Holistic", accuracy: "93%", color: "bg-blue-50", textColor: "text-blue-600" },
    { name: "Temporal", accuracy: "96%", color: "bg-emerald-50", textColor: "text-emerald-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
          >
            <img src="./logo.svg" alt="EduTrack AI" className="h-10 w-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              EduTrack AI
            </span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 smooth-transition"
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
              <Sparkles className="h-16 w-16 text-emerald-600" />
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
              EduTrack AI
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-4 font-semibold">
              AI Based Student Performance Predictor
            </p>
            
            <p className="text-lg text-slate-500 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of 5 AI models to predict student dropout risk, monitor learning health, and gamify education with real-time analytics.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 rounded-lg smooth-transition"
              >
                Launch Platform
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900"
          >
            Core <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Features</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white border border-slate-200 rounded-xl p-8 card-shadow card-hover"
              >
                <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Showcase */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-900"
          >
            5 AI <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Models</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-5 gap-6">
            {models.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className={`${model.color} border border-slate-200 rounded-xl p-8 text-center card-shadow card-hover`}
              >
                <div className={`text-3xl font-bold mb-2 ${model.textColor}`}>
                  {model.accuracy}
                </div>
                <div className="text-sm text-slate-600 font-semibold">{model.name}</div>
              </motion.div>
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-emerald-600 text-lg font-semibold"
          >
            From rule-based to temporal composite — achieving 96% prediction accuracy
          </motion.p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-200 rounded-2xl p-12 card-shadow"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Ready to Transform Education?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join the future of academic analytics with AI-powered insights
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 rounded-lg smooth-transition"
            >
              Start Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 bg-white">
        <div className="container mx-auto text-center text-slate-500">
          <p>© 2024 EduTrack AI – AI Based Student Performance Predictor — Powered by Advanced Machine Learning</p>
        </div>
      </footer>
    </div>
  );
}