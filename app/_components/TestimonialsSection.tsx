"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "MedVoice AI detected my symptoms accurately and urged me to seek immediate care. It literally saved my life during a midnight asthma attack.",
    name: "Dr. Sarah Chen",
    role: "Cardiologist, Johns Hopkins",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote:
      "The voice interface is incredibly natural. My elderly patients who struggle with apps can finally access healthcare technology with ease.",
    name: "Dr. Michael Rodriguez",
    role: "Family Physician, Mayo Clinic",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote:
      "Booking appointments used to take 20 minutes on hold. Now I just speak to MedVoice and it's done in seconds. Absolutely revolutionary.",
    name: "Emily Watson",
    role: "Patient, San Francisco",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative z-10 py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Trusted by Patients
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-8 rounded-3xl bg-[#111118]/80 border border-gray-800 hover:border-cyan-500/20 transition-all hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}