"use client";

import { useEffect, useState } from "react";

/** Animates a number from 0 to `target`. */
export function useCountUp(target: number | null, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === null) {
      setValue(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}
