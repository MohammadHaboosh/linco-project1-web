import { useEffect } from "react";
import {
  preloadAuthenticatedCommonRoutes,
  preloadPublicCommonRoutes,
  preloadRoute,
} from "../routes/routeModules.js";

const scheduleIdleWork = (callback) => {
  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(timeoutId);
};

export const useRoutePreloading = (isAuthenticated) => {
  useEffect(() => {
    const preloadLinkDestination = (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      void preloadRoute(destination.pathname);
    };

    document.addEventListener("pointerover", preloadLinkDestination, {
      passive: true,
    });
    document.addEventListener("focusin", preloadLinkDestination);
    document.addEventListener("touchstart", preloadLinkDestination, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerover", preloadLinkDestination);
      document.removeEventListener("focusin", preloadLinkDestination);
      document.removeEventListener("touchstart", preloadLinkDestination);
    };
  }, []);

  useEffect(
    () =>
      scheduleIdleWork(() => {
        if (isAuthenticated) {
          void preloadAuthenticatedCommonRoutes();
        } else {
          void preloadPublicCommonRoutes();
        }
      }),
    [isAuthenticated],
  );
};
