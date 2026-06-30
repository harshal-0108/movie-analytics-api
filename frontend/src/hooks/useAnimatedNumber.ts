import { useEffect, useState } from "react";

export const useAnimatedNumber = (value: number, duration = 700) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayValue(value * progress);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [duration, value]);

  return displayValue;
};
