"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMouseMovementTracking() {
  const elementRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 110, damping: 28, mass: 0.35 });
  const smoothY = useSpring(y, { stiffness: 110, damping: 28, mass: 0.35 });

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const nextX = (event.clientX - rect.left) / rect.width;
        const nextY = (event.clientY - rect.top) / rect.height;

        x.set(nextX - 0.5);
        y.set(nextY - 0.5);
        element.style.setProperty("--mouse-x", `${nextX * 100}%`);
        element.style.setProperty("--mouse-y", `${nextY * 100}%`);
      });
    };

    element.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", handlePointerMove);
    };
  }, [x, y]);

  return { elementRef, x: smoothX, y: smoothY };
}
