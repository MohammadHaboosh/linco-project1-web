import { useState, useEffect } from "react";
import { apiFetch } from "../../../../api/apiFetch";

export const useAvailableTags = (enabled = true) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(enabled);
  const [tagsError, setTagsError] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    let isMounted = true;
    const controller = new AbortController();

    queueMicrotask(() => {
      if (isMounted) setIsLoadingTags(true);
    });

    const fetchTags = async () => {
      try {
        setTagsError(false);
        const response = await apiFetch("/tags", {
          method: "GET",
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error("Tags request failed");
        }

        if (isMounted) {
          setAvailableTags(payload.data || []);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch available tags:", error);
          if (isMounted) setTagsError(true);
        }
      } finally {
        if (isMounted) setIsLoadingTags(false);
      }
    };

    fetchTags();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [enabled, requestVersion]);

  return {
    availableTags,
    isLoadingTags,
    tagsError,
    retryTags: () => setRequestVersion((version) => version + 1),
  };
};
