import { useState, useEffect } from "react";
import { apiFetch } from "../../../../api/apiFetch";

export const useAvailableTags = () => {
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    queueMicrotask(() => {
      if (isMounted) setIsLoadingTags(true);
    });

    const fetchTags = async () => {
      try {
        const response = await apiFetch("/tags", {
          method: "GET",
          signal: controller.signal,
        });
        const payload = await response.json();

        if (response.ok && payload.success && isMounted) {
          setAvailableTags(payload.data || []);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch available tags:", error);
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
  }, []);

  return { availableTags, isLoadingTags };
};
