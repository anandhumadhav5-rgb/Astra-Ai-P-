"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useParallaxScrolling } from "@/hooks/use-parallax-scrolling";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { useScrollTriggerAnimation } from "@/hooks/use-scroll-trigger-animation";

const layers = [
  {
    step: "01",
    title: "Observe",
    body: "Every chat, call, ticket, and product event becomes a live signal stream."
  },
  {
    step: "02",
    title: "Reason",
    body: "ASTRA AI fuses context, memory, sentiment, and policy into one decision layer."
  },
  {
    step: "03",
    title: "Act",
    body: "Agents launch automations, route tasks, create summaries, and ask for approval when needed."
  },
  {
    step: "04",
    title: "Learn",
    body: "Outcomes feed the memory graph so every future conversation feels sharper."
  }
];

export function IntelligenceSection() {
  const ref = useRef<HTMLElement>(null);
  useParallaxScrolling(ref, { scrub: 1.75, mobile: true });
  useRevealOnScroll(ref, { selector: "[data-story-reveal]", y: 54, stagger: 0.12 });
  useScrollTriggerAnimation(ref, {
    selector: "[data-story-line]",
    start: "top 55%",
    end: "bottom 40%",
    scrub: 1.45,
    once: false,
    from: { scaleX: 0, transformOrigin: "left center" },
    to: { scaleX: 1, ease: "none" }
  });

  return (
    <section id="signals" ref={ref} className="cinematic-section relative min-h-[235vh] border-y border-line bg-void">
      <div className="absolute inset-x-0 top-0 h-px bg-signal-line" aria-hidden />
      <div data-depth="0.34" data-blur="14" className="parallax-halo left-[-8rem] top-[18%] bg-plasma-mint/16" aria-hidden />
      <div data-depth="-0.22" data-blur="18" className="parallax-halo bottom-[18%] right-[-12rem] bg-plasma-rose/12" aria-hidden />

      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-20">
        <div className="container grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <div data-depth="0.1" className="relative z-10">
            <p data-story-reveal className="eyebrow">Sticky Intelligence</p>
            <h2 data-story-reveal className="cinematic-title mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              A conversation engine with cinematic depth.
            </h2>
            <p data-story-reveal className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Scroll through the intelligence stack as the interface separates into depth planes, revealing how
              ASTRA AI turns raw signals into action.
            </p>
            <div data-story-reveal className="mt-8 h-px overflow-hidden rounded-full bg-white/10">
              <div data-story-line className="h-full w-full origin-left bg-gradient-to-r from-plasma-cyan via-plasma-mint to-plasma-violet" />
            </div>
          </div>

          <div className="relative min-h-[34rem]">
            <div data-depth="-0.16" className="absolute inset-8 rounded-full border border-plasma-cyan/10 bg-plasma-cyan/5 blur-sm" aria-hidden />
            <div data-depth="0.24" className="absolute inset-x-10 top-8 h-48 rounded-full bg-plasma-violet/10 blur-3xl" aria-hidden />

            <div className="relative z-10 grid gap-4">
              {layers.map((layer, index) => (
                <motion.article
                  key={layer.title}
                  data-story-reveal
                  data-depth={index % 2 ? "-0.1" : "0.16"}
                  whileHover={{ x: 10, scale: 1.01 }}
                  className="holographic-card depth-card relative overflow-hidden rounded-lg p-5"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-plasma-cyan via-plasma-mint to-plasma-violet" />
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-slate-500">LAYER {layer.step}</p>
                      <h3 className="mt-1 font-display text-2xl font-semibold">{layer.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{layer.body}</p>
                    </div>
                    <div className="h-16 w-36 overflow-hidden rounded-md border border-line bg-ink">
                      <div className="h-full w-1/2 animate-scan bg-gradient-to-r from-transparent via-plasma-mint/50 to-transparent" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
