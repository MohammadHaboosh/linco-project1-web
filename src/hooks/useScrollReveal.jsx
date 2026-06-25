import { useState, useCallback } from "react";

export const useScrollReveal = (threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);

  const ref = useCallback(
    (node) => {
      if (node !== null) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(node);
            }
          },
          { threshold },
        );
        observer.observe(node);
      }
    },
    [threshold],
  );

  return { ref, isVisible };
};
