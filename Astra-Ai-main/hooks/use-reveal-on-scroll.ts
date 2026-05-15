"use client";

import { useMemo, type RefObject } from "react";
import { useScrollTriggerAnimation } from "@/hooks/use-scroll-trigger-animation";

type RevealOptions = {
  selector?: string;
  y?: number;
  stagger?: number;
  amount?: string;
};

export function useRevealOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { selector = "[data-reveal]", y = 42, stagger = 0.1, amount = "78%" }: RevealOptions = {}
) {
  const from = useMemo(() => ({ autoAlpha: 0, y, filter: "blur(14px)" }), [y]);
  const to = useMemo(
    () => ({
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.95,
      ease: "power3.out",
      stagger
    }),
    [stagger]
  );

  useScrollTriggerAnimation(ref, {
    selector,
    start: `top ${amount}`,
    once: true,
    from,
    to
  });
}
