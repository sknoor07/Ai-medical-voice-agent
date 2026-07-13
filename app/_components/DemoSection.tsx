"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, Check, Zap } from "lucide-react";

export function DemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    "Instant symptom assessment",
    "Real-time voice interaction",
    "Personalized health insights",
  ];

  return (
    <section className="relative z-10 py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-gray-800 p-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-cyan-500/10 animate-pulse" />
          <div className="relative bg-[#0a0a0f] rounded-[22px] p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  Experience the Future
                  <br />
                  of Healthcare
                </h3>
                <p className="text-gray-400 mb-8">
                  Try our voice assistant demo and see how AI can transform your
                  healthcare experience. No signup required.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Launch Demo
                </button>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-full blur-3xl" />
                <div className="relative bg-[#111118] rounded-2xl p-6 border border-gray-800">
                  <div className="flex items-center justify-center h-48">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center animate-pulse shadow-lg shadow-cyan-500/30">
                        <Mic className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-cyan-400/30 animate-ping" />
                      <div className="absolute -inset-4 w-32 h-32 rounded-full border border-cyan-400/10 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Tap the microphone to start
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}