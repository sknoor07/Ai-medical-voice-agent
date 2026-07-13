"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Stethoscope,
  CalendarHeart,
  HeartPulse,
  FileText,
  Siren,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: Stethoscope,
    title: "Symptom Triage",
    description:
      "AI-powered symptom analysis with intelligent questioning to assess urgency and recommend appropriate care levels.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    hoverText: "group-hover:text-cyan-300",
  },
  {
    icon: CalendarHeart,
    title: "Smart Scheduling",
    description:
      "Voice-activated appointment booking with real-time availability, reminders, and calendar integration.",
    gradient: "from-violet-500/20 to-pink-500/20",
    border: "border-violet-500/20",
    text: "text-violet-400",
    hoverText: "group-hover:text-violet-300",
  },
  {
    icon: HeartPulse,
    title: "Empathetic Care",
    description:
      "Emotionally intelligent responses that provide comfort and understanding during stressful health concerns.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    hoverText: "group-hover:text-emerald-300",
  },
  {
    icon: FileText,
    title: "Health Records",
    description:
      "Secure voice-accessible health history, medication tracking, and personalized health insights.",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    text: "text-amber-400",
    hoverText: "group-hover:text-amber-300",
  },
  {
    icon: Siren,
    title: "Emergency Detection",
    description:
      "Real-time analysis of critical symptoms with instant emergency service recommendations and alerts.",
    gradient: "from-rose-500/20 to-red-500/20",
    border: "border-rose-500/20",
    text: "text-rose-400",
    hoverText: "group-hover:text-rose-300",
  },
  {
    icon: Languages,
    title: "Multi-Language",
    description:
      "Native-level support in 50+ languages with medical terminology accuracy across all dialects.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
    text: "text-blue-400",
    hoverText: "group-hover:text-blue-300",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative z-10 py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Intelligent Healthcare
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              At Your Voice Command
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Advanced AI capabilities designed to provide comprehensive medical
            assistance through natural voice conversations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl bg-[#111118]/80 border border-gray-800 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.text}`} />
                </div>
                <h3
                  className={`text-xl font-semibold mb-3 text-white ${feature.hoverText} transition-colors`}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}