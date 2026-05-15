"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/motion";
import { useParallaxScrolling } from "@/hooks/use-parallax-scrolling";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const metrics = [
  { value: "42ms", label: "median routing latency" },
  { value: "8.4x", label: "faster operational loops" },
  { value: "2.1B", label: "context tokens orchestrated" },
  { value: "24/7", label: "autonomous monitoring" }
];

export function MetricsSection() {
  const ref = useRef<HTMLElement>(null);
  useParallaxScrolling(ref, { scrub: 1.35, mobile: true });
  useRevealOnScroll(ref, { selector: "[data-metric-reveal]", y: 28, stagger: 0.08 });

  return (
    <motion.section
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      className="cinematic-section relative overflow-hidden border-y border-line bg-void/80"
    >
      <div data-depth="0.2" className="absolute inset-x-0 top-0 h-px bg-signal-line opacity-70" aria-hidden />
      <div className="container grid grid-cols-2 gap-px py-6 sm:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            variants={fadeUp}
            data-metric-reveal
            data-depth={index % 2 ? "-0.08" : "0.1"}
            className="px-3 py-6 text-center"
          >
            <div className="font-display text-3xl font-bold text-white sm:text-5xl">{metric.value}</div>
            <p className="mt-2 text-sm text-slate-400">{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
