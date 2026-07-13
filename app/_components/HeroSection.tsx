"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, Play, Star } from "lucide-react";

// Pre-defined random values to avoid re-computation
const waveBars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  delay: `${(i * 0.05).toFixed(2)}s`,
  duration: `${(0.4 + Math.random() * 0.4).toFixed(2)}s`,
  height: `${(15 + Math.random() * 60).toFixed(0)}%`,
}));

export function HeroSection() {
  const router = useRouter();

  const titleWords = "Your Personal Medical AI Agent".split(" ");

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI-Powered Medical Voice Assistant
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <motion.span
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block text-white"
            >
              Your Personal
            </motion.span>
            <span className="block">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="inline-block mr-3 bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg text-gray-400 max-w-lg leading-relaxed"
          >
            24/7 intelligent voice assistance for symptom triage, appointment
            scheduling, and empathetic healthcare support. Speak naturally, get
            instant medical guidance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105 flex items-center gap-2 will-change-transform"
            >
              <Mic className="w-5 h-5" />
              Start Voice Chat
            </button>
            <button className="px-8 py-4 rounded-2xl border border-gray-700 text-gray-300 font-semibold hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center gap-2 backdrop-blur-sm will-change-transform">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Trusted by 10,000+ patients
              </p>
            </div>
          </motion.div>
        </div>

        {/* Interactive Voice Chat Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-3xl blur opacity-30" />
          <div className="relative bg-[#111118]/90 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online
              </div>
            </div>

            {/* CSS-only voice wave animation - zero JS overhead */}
            <div className="flex items-center justify-center h-48 gap-[3px]">
              {waveBars.map((bar) => (
                <div
                  key={bar.id}
                  className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-violet-400 voice-bar"
                  style={{
                    animationDelay: bar.delay,
                    animationDuration: bar.duration,
                    height: bar.height,
                  }}
                />
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex gap-3 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="bg-gray-800/50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                  <p className="text-sm text-gray-300">
                    Hello! I'm your AI medical assistant. How are you feeling
                    today?
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 }}
                className="flex gap-3 items-start justify-end"
              >
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs border border-cyan-500/20">
                  <p className="text-sm text-cyan-100">
                    I've been having headaches and a slight fever for the past
                    two days.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3 }}
                className="flex gap-3 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 mt-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="bg-gray-800/50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                  <p className="text-sm text-gray-300">
                    I understand. Let me ask a few questions to better assess
                    your symptoms...
                  </p>
                  <div className="flex gap-1 mt-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-gray-900/50 border border-gray-800">
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center hover:scale-110 transition-transform will-change-transform">
                <Mic className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm text-gray-500 flex-1">
                Tap to speak...
              </span>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}