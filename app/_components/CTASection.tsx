"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Mail } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative z-10 py-24 px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="relative rounded-3xl overflow-hidden p-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500">
          <div className="bg-[#0a0a0f] rounded-[22px] px-8 py-16 md:px-16 md:py-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform
              <br />
              Your Healthcare?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10">
              Join thousands of patients and healthcare providers already using
              MedVoice AI for intelligent, voice-first medical assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Get Started Free
              </button>
              <button className="px-8 py-4 rounded-2xl border border-gray-700 text-gray-300 font-semibold hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}