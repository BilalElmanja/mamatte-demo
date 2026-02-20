"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function useCounterAnimation(
  target: number,
  suffix: string = "",
  duration: number = 1200
): { ref: React.RefObject<HTMLElement | null>; display: string } {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    if (!isInView) return;

    const isFloat = target % 1 !== 0;
    const steps = 40;
    const step = target / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current += step;
      if (frame >= steps) {
        current = target;
        clearInterval(timer);
      }
      setDisplay(
        (isFloat ? current.toFixed(1) : Math.round(current).toString()) + suffix
      );
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target, suffix, duration]);

  return { ref, display };
}
