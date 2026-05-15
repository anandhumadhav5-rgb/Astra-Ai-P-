"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, BrainCircuit, Mic2, Play, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { fadeUp, scaleIn, staggerContainer } from "@/animations/motion";
import { ButtonLink } from "@/components/button";
import { NeuralCanvas } from "@/components/neural-canvas";
import { useMouseMovementTracking } from "@/hooks/use-mouse-movement-tracking";

const terminalLines = [
  "booting ASTRA conversational core...",
  "memory graph synced: 18,420 entities",
  "voice agent latency: 42ms",
  "automation routes armed: 312",
  "real-time intelligence online"
];

const dashboardCards = [
  { label: "Memory Depth", value: "98%", icon: BrainCircuit, className: "left-[5%] top-[18%]" },
  { label: "Voice Sync", value: "42ms", icon: Mic2, className: "right-[6%] top-[20%]" },
  { label: "Automations", value: "312", icon: Zap, className: "left-[8%] bottom-[18%]" },
  { label: "Trust Layer", value: "SOC2", icon: ShieldCheck, className: "right-[8%] bottom-[16%]" }
];

const signalCards = [
  { title: "Agent sentiment", value: "Human-like", tint: "from-plasma-cyan/70 to-plasma-mint/50" },
  { title: "Intent routing", value: "Live", tint: "from-plasma-violet/70 to-plasma-cyan/40" },
  { title: "Workflow state", value: "Autonomous", tint: "from-plasma-rose/60 to-plasma-amber/40" }
];

type MotionAxis = ReturnType<typeof useSpring>;

function useTypingEffect(lines: string[]) {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const line = lines[lineIndex];

    if (text.length < line.length) {
      const timeout = window.setTimeout(() => setText(line.slice(0, text.length + 1)), 28);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setLineIndex((current) => (current + 1) % lines.length);
      setText("");
    }, 1050);

    return () => window.clearTimeout(timeout);
  }, [lineIndex, lines, text]);

  return text;
}

function FloatingMetricCard({
  card,
  index,
  springX,
  springY
}: {
  card: (typeof dashboardCards)[number];
  index: number;
  springX: MotionAxis;
  springY: MotionAxis;
}) {
  const x = useTransform(springX, [-0.5, 0.5], [index % 2 ? -24 : 24, index % 2 ? 24 : -24]);
  const y = useTransform(springY, [-0.5, 0.5], [index > 1 ? -18 : 18, index > 1 ? 18 : -18]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.55 + index * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ x, y }}
      className={`holographic-card absolute z-20 hidden w-44 rounded-lg p-4 sm:block ${card.className}`}
    >
      <div className="flex items-center justify-between">
        <card.icon className="size-5 text-plasma-cyan" aria-hidden />
        <span className="font-mono text-xs text-plasma-mint">LIVE</span>
      </div>
      <p className="mt-5 text-sm text-slate-400">{card.label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-white">{card.value}</p>
    </motion.div>
  );
}

export function HeroSection() {
  const typedText = useTypingEffect(terminalLines);
  const { elementRef, x: springX, y: springY } = useMouseMovementTracking();
  const { scrollYProgress } = useScroll();
  const heroLift = useTransform(scrollYProgress, [0, 0.22], [0, -110]);
  const heroFade = useTransform(scrollYProgress, [0, 0.18], [1, 0.25]);
  const meshX = useTransform(springX, [-0.5, 0.5], [-36, 36]);
  const meshY = useTransform(springY, [-0.5, 0.5], [-26, 26]);
  const copyX = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const copyY = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const terminalX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const terminalY = useTransform(springY, [-0.5, 0.5], [-16, 16]);
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        id: index,
        left: `${(index * 29) % 100}%`,
        top: `${(index * 47) % 100}%`,
        delay: `${(index % 9) * 0.35}s`,
        duration: `${6.5 + (index % 7) * 0.55}s`
      })),
    []
  );

  return (
    <section
      ref={elementRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-ink pt-16"
    >
      <div className="hero-aurora absolute inset-0" aria-hidden />
      <motion.div
        className="hero-gradient-mesh absolute left-1/2 top-1/2 -ml-[31rem] -mt-[31rem] h-[62rem] w-[62rem]"
        style={{ x: meshX, y: meshY }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px] opacity-25 [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" aria-hidden />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="hero-particle absolute size-1 rounded-full bg-plasma-mint/80 shadow-[0_0_16px_rgba(94,234,212,0.9)]"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
          aria-hidden
        />
      ))}

      <motion.div style={{ y: heroLift, opacity: heroFade }} className="absolute inset-0">
        <NeuralCanvas />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-ink via-ink/80 to-transparent" aria-hidden />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container relative z-10 grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <motion.div
          variants={staggerContainer}
          style={{ x: copyX, y: copyY }}
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-md border border-plasma-cyan/25 bg-plasma-cyan/10 px-3 py-2 text-sm text-plasma-mint shadow-glow">
            <Sparkles className="size-4" aria-hidden />
            ASTRA AI conversational intelligence
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-5xl font-display text-5xl font-bold leading-[0.9] text-white sm:text-7xl lg:text-8xl"
          >
            The Future of Conversations Starts Here
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Human-like AI agents with memory, voice, automation, and real-time intelligence.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/chat" className="interactive-glow">
              <Play className="size-4 fill-current" aria-hidden />
              Start Chat
            </ButtonLink>
            <ButtonLink href="#platform" variant="secondary" className="interactive-glow">
              Explore Agents
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </motion.div>
        </motion.div>

        <motion.div variants={scaleIn} className="relative mx-auto h-[34rem] w-full max-w-[42rem] sm:h-[38rem]">
          {dashboardCards.map((card, index) => (
            <FloatingMetricCard
              key={card.label}
              card={card}
              index={index}
              springX={springX}
              springY={springY}
            />
          ))}

          <motion.div
            style={{ x: terminalX, y: terminalY }}
            className="absolute inset-x-4 bottom-8 z-30 rounded-lg border border-line bg-void/70 p-4 shadow-panel backdrop-blur-2xl sm:left-16 sm:right-16"
          >
            <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Bot className="size-4 text-plasma-mint" aria-hidden />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-slate-300">Chatbot Terminal</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-plasma-mint shadow-[0_0_14px_rgba(94,234,212,1)]" />
            </div>
            <div className="font-mono text-sm leading-7 text-slate-300">
              <p className="text-plasma-cyan">astra://agent-core</p>
              <p>
                <span className="text-plasma-mint">&gt;</span> {typedText}
                <span className="typing-caret ml-1 inline-block h-4 w-2 translate-y-0.5 bg-plasma-mint" />
              </p>
            </div>
          </motion.div>

          <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-plasma-cyan/20 bg-plasma-cyan/5 blur-[1px]" aria-hidden />

          <div className="absolute right-2 top-[42%] z-20 hidden w-52 space-y-3 xl:block">
            {signalCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + index * 0.1, duration: 0.65 }}
                className="holographic-card rounded-lg p-3"
              >
                <div className={`mb-3 h-1.5 rounded-full bg-gradient-to-r ${card.tint}`} />
                <p className="text-xs text-slate-400">{card.title}</p>
                <p className="font-display text-lg font-semibold text-white">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(3,7,13,0.72)_72%)]" aria-hidden />
        </motion.div>
      </motion.div>

      <motion.a
        href="#platform"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400"
      >
        Scroll
        <span className="relative h-10 w-6 rounded-full border border-line">
          <span className="scroll-dot absolute left-1/2 top-2 size-1.5 -translate-x-1/2 rounded-full bg-plasma-mint" />
        </span>
      </motion.a>
    </section>
  );
}
