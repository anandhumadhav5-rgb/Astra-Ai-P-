"use client";

import { useRef } from "react";
import { ArrowRight, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/button";
import { fadeUp, staggerContainer } from "@/animations/motion";
import { useParallaxScrolling } from "@/hooks/use-parallax-scrolling";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  useParallaxScrolling(ref, { scrub: 1.55 });
  useRevealOnScroll(ref, { selector: "[data-cta-reveal]" });

  return (
    <section id="launch" ref={ref} className="section-shell cinematic-section relative overflow-hidden pt-10">
      <div data-depth="0.22" data-blur="18" className="parallax-halo left-1/2 top-4 -translate-x-1/2 bg-plasma-cyan/20" aria-hidden />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        data-depth="-0.08"
        className="depth-card relative overflow-hidden rounded-lg border border-line bg-white/[0.045] p-8 shadow-glow sm:p-12"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-signal-line" aria-hidden />
        <motion.div variants={fadeUp} data-cta-reveal className="flex items-center gap-3 text-plasma-mint">
          <Cpu className="size-5" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-[0.24em]">Launch sequence</span>
        </motion.div>
        <motion.h2 variants={fadeUp} data-cta-reveal className="cinematic-title mt-5 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-6xl">
          Build the AI operating layer your team will actually trust.
        </motion.h2>
        <motion.div variants={fadeUp} data-cta-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="mailto:hello@astra-ai.example">
            Request Access
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="#platform" variant="secondary">
            Review Capabilities
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
