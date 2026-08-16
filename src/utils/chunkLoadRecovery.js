const CHUNK_RELOAD_KEY = "linco:chunk-reload-attempt";
const CHUNK_RELOAD_COOLDOWN_MS = 5 * 60 * 1000;

const CHUNK_LOAD_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /failed to load module script/i,
  /importing a module script failed/i,
  /error loading dynamically imported module/i,
  /loading chunk [\d]+ failed/i,
  /chunkloaderror/i,
  /unable to preload css/i,
];

let reloadInProgress = false;

const getErrorMessage = (error) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return typeof error === "string" ? error : "";
};

export const isChunkLoadError = (error) =>
  CHUNK_LOAD_ERROR_PATTERNS.some((pattern) =>
    pattern.test(getErrorMessage(error)),
  );

export const tryRecoverFromChunkLoadError = (error) => {
  if (
    !isChunkLoadError(error) ||
    typeof window === "undefined" ||
    window.navigator.onLine === false
  ) {
    return false;
  }

  if (reloadInProgress) return true;

  try {
    const previousAttempt = Number(
      window.sessionStorage.getItem(CHUNK_RELOAD_KEY),
    );

    if (
      Number.isFinite(previousAttempt) &&
      Date.now() - previousAttempt < CHUNK_RELOAD_COOLDOWN_MS
    ) {
      return false;
    }

    window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    // Do not risk a reload loop when an attempt cannot be recorded.
    return false;
  }

  reloadInProgress = true;
  window.location.reload();
  return true;
};

export const registerChunkLoadRecovery = () => {
  if (typeof window === "undefined") return undefined;

  const handlePreloadError = (event) => {
    tryRecoverFromChunkLoadError(event.payload);
  };

  window.addEventListener("vite:preloadError", handlePreloadError);

  return () => {
    window.removeEventListener("vite:preloadError", handlePreloadError);
  };
};
