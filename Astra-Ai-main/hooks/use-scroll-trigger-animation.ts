"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollAnimationOptions = {
  selector: string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean;
  once?: boolean;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
};

export function useScrollTriggerAnimation<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    selector,
    start = "top 78%",
    end = "bottom 28%",
    scrub = false,
    pin = false,
    once = true,
    from = { autoAlpha: 0, y: 36, scale: 0.98 },
    to = { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }
  }: ScrollAnimationOptions
) {
  useEffect(() => {
    const element = ref.current;

    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(selector, { willChange: "transform, opacity, filter" });
      gsap.fromTo(selector, from, {
        ...to,
        force3D: true,
        overwrite: "auto",
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          pin,
          once,
          invalidateOnRefresh: true
        }
      });
    }, element);

    return () => context.revert();
  }, [end, from, once, pin, ref, scrub, selector, start, to]);
}
