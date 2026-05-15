"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ParallaxOptions = {
  selector?: string;
  scrub?: number | boolean;
  start?: string;
  end?: string;
  mobile?: boolean;
};

export function useParallaxScrolling<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { selector = "[data-depth]", scrub = 1.45, start = "top bottom", end = "bottom top", mobile = false }: ParallaxOptions = {}
) {
  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (reduceMotion || (!mobile && isMobile)) {
      return;
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 0.18);
        const blur = Math.min(Number(layer.dataset.blur ?? 0), 10);

        gsap.fromTo(
          layer,
          {
            yPercent: depth * -10,
            scale: 1 + Math.abs(depth) * 0.015,
            filter: blur ? `blur(${blur}px)` : "none"
          },
          {
            yPercent: depth * 14,
            scale: 1,
            filter: blur ? `blur(${Math.max(0, blur - 3)}px)` : "none",
            ease: "none",
            force3D: true,
            overwrite: "auto",
            scrollTrigger: {
              trigger: element,
              start,
              end,
              scrub,
              invalidateOnRefresh: true
            }
          }
        );
      });
    }, element);

    return () => context.revert();
  }, [end, mobile, ref, scrub, selector, start]);
}
