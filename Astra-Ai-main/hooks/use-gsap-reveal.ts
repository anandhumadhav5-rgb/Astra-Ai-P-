"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-gsap-reveal]",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 76%",
            once: true
          }
        }
      );
    }, ref);

    return () => context.revert();
  }, [ref]);
}
