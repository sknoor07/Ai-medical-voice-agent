"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "1",
    title: "Speak Naturally",
    description:
      "Simply describe your symptoms or health concerns in your own words. No medical jargon needed.",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/25",
  },
  {
    num: "2",
    title: "AI Analysis",
    description:
      "Our advanced AI processes your voice, analyzes symptoms, and cross-references medical databases instantly.",
    gradient: "from-violet-500 to-pink-600",
    shadow: "shadow-violet-500/25",
  },
  {
    num: "3",
    title: "Get Guidance",
    description:
      "Receive personalized care recommendations, appointment bookings, or emergency alerts as needed.",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative z-10 py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Three Steps to
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Better Health
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-emerald-500/50" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative text-center group"
            >
              <div
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-3xl font-bold ${step.shadow} shadow-lg group-hover:scale-110 transition-transform relative z-10`}
              >
                {step.num}
              </div>
              <h3 className="text-xl font-semibold mt-6 mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}