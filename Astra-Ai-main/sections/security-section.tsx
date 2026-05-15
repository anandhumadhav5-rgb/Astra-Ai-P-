"use client";

import { useRef } from "react";
import { CheckCircle2, Fingerprint, KeyRound, Radar } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/motion";
import { useParallaxScrolling } from "@/hooks/use-parallax-scrolling";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

const controls = ["SOC 2-ready controls", "Private tool permissions", "PII-aware memory", "Full action ledger"];

export function SecuritySection() {
  const ref = useRef<HTMLElement>(null);
  useParallaxScrolling(ref, { scrub: 1.6 });
  useRevealOnScroll(ref, { selector: "[data-security-reveal]" });

  return (
    <section id="security" ref={ref} className="section-shell cinematic-section relative overflow-hidden">
      <div data-depth="0.26" data-blur="12" className="parallax-halo left-[-9rem] bottom-8 bg-plasma-violet/16" aria-hidden />
      <div data-depth="-0.2" className="cinematic-kicker absolute right-4 top-12 hidden font-display text-[8rem] font-bold leading-none text-white/[0.025] lg:block" aria-hidden>
        TRUST
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-10 lg:grid-cols-[1fr_0.9fr]"
      >
        <motion.div variants={fadeUp} data-security-reveal data-depth="0.08">
          <p className="eyebrow">Security</p>
          <h2 className="cinematic-title mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
            Enterprise-grade trust without slowing teams down.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            ASTRA AI keeps model decisions observable, data access explicit, and every autonomous action tied to
            policy.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {controls.map((control) => (
              <div key={control} data-security-reveal className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="size-5 text-plasma-mint" aria-hidden />
                {control}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} data-security-reveal data-depth="-0.14" className="glass-panel depth-card rounded-lg p-6">
          <div className="grid grid-cols-3 gap-3">
            {[Fingerprint, KeyRound, Radar].map((Icon, index) => (
              <div key={index} className="grid aspect-square place-items-center rounded-md border border-line bg-white/[0.035]">
                <Icon className="size-8 text-plasma-cyan" aria-hidden />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md border border-line bg-ink p-4 font-mono text-sm text-slate-300">
            <p className="text-plasma-mint">policy.scan.complete</p>
            <p className="mt-3">risk: low</p>
            <p>memory_scope: tenant_only</p>
            <p>tool_access: approved</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
