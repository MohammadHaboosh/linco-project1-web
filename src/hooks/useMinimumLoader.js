import { useEffect, useRef, useState } from "react";

const useMinimumLoader = (isLoading, minimumDurationMs = 2000) => {
  const [shouldShowLoader, setShouldShowLoader] = useState(isLoading);
  const loadingStartRef = useRef(isLoading ? Date.now() : null);

  useEffect(() => {
    if (isLoading) {
      if (loadingStartRef.current === null) {
        loadingStartRef.current = Date.now();
      }

      setShouldShowLoader(true);
      return;
    }

    if (loadingStartRef.current === null) {
      setShouldShowLoader(false);
      return;
    }

    const elapsed = Date.now() - loadingStartRef.current;
    const remaining = Math.max(0, minimumDurationMs - elapsed);

    const timer = window.setTimeout(() => {
      setShouldShowLoader(false);
      loadingStartRef.current = null;
    }, remaining);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoading, minimumDurationMs]);

  return shouldShowLoader;
};

export default useMinimumLoader;