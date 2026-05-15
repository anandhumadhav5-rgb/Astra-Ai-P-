"use client";

import { useRef } from "react";
import { Activity, Brain, DatabaseZap, GitBranch, LockKeyhole, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/motion";
import { useParallaxScrolling } from "@/hooks/use-parallax-scrolling";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const features = [
  {
    icon: Brain,
    title: "Cognitive routing",
    body: "Classify intent, retrieve context, and route tasks to the right model, agent, or workflow."
  },
  {
    icon: Workflow,
    title: "Workflow autonomy",
    body: "Trigger multi-step automations with approvals, audit trails, retries, and human handoff."
  },
  {
    icon: DatabaseZap,
    title: "Knowledge fusion",
    body: "Connect product docs, tickets, CRM data, and warehouse events into one living memory layer."
  },
  {
    icon: LockKeyhole,
    title: "Policy guardrails",
    body: "Enforce tenant isolation, data boundaries, tool permissions, and response compliance."
  },
  {
    icon: Activity,
    title: "Signal observability",
    body: "Inspect model cost, latency, quality, action traces, and intervention points in real time."
  },
  {
    icon: GitBranch,
    title: "Composable agents",
    body: "Build specialized agents that share memory, tools, and governance without locking teams in."
  }
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  useParallaxScrolling(ref, { scrub: 1.65 });
  useRevealOnScroll(ref, { selector: "[data-feature-reveal]" });

  return (
    <section id="platform" ref={ref} className="section-shell cinematic-section relative overflow-hidden">
      <div data-depth="0.42" data-blur="10" className="parallax-halo left-[-12rem] top-20 bg-plasma-cyan/20" aria-hidden />
      <div data-depth="-0.28" data-blur="16" className="parallax-halo bottom-8 right-[-10rem] bg-plasma-violet/16" aria-hidden />
      <div data-depth="0.16" className="cinematic-kicker absolute right-4 top-16 hidden font-display text-[9rem] font-bold leading-none text-white/[0.025] lg:block" aria-hidden>
        SYSTEM
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p variants={fadeUp} data-feature-reveal className="eyebrow">
          Platform
        </motion.p>
        <motion.div variants={fadeUp} data-feature-reveal className="mt-4 max-w-4xl">
          <h2 className="cinematic-title font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            A complete operating system for AI-native work.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            ASTRA AI gives product, support, operations, and engineering teams one secure layer for building and
            governing high-impact AI workflows.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              data-feature-reveal
              data-depth={index % 2 ? "-0.08" : "0.12"}
              className="glass-panel depth-card rounded-lg p-6"
            >
              <feature.icon className="size-7 text-plasma-cyan" aria-hidden />
              <h3 className="mt-5 font-display text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{feature.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
