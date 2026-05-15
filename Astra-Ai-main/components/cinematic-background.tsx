"use client";

import { useMemo } from "react";
import { motion, useTransform } from "framer-motion";
import { useMouseMovementTracking } from "@/hooks/use-mouse-movement-tracking";

export function CinematicBackground() {
  const { elementRef, x, y } = useMouseMovementTracking();
  const lightX = useTransform(x, [-0.5, 0.5], ["35%", "65%"]);
  const lightY = useTransform(y, [-0.5, 0.5], ["28%", "72%"]);
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 53) % 100}%`,
        delay: `${(index % 11) * 0.28}s`,
        duration: `${9 + (index % 6) * 0.85}s`
      })),
    []
  );

  return (
    <section ref={elementRef} className="cinematic-field pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div className="mouse-light absolute h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: lightX, top: lightY }} />
      <div className="depth-fog absolute inset-x-0 top-[38%] h-96" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="cinematic-particle absolute rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        />
      ))}
    </section>
  );
}
