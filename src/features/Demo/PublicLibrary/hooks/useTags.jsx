import { useState, useEffect, useCallback } from "react";
import { libraryApi } from "../api/libraryApi";

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [tagsError, setTagsError] = useState(null);

  const fetchTags = useCallback(async () => {
    setIsLoadingTags(true);
    setTagsError(null);
    try {
      const data = await libraryApi.getAllTags();
      setTags(data || []);
    } catch (err) {
      setTagsError(err.message || "Failed to fetch tags");
    } finally {
      setIsLoadingTags(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTags = async () => {
      setIsLoadingTags(true);
      setTagsError(null);
      try {
        const data = await libraryApi.getAllTags();
        if (isMounted) {
          setTags(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setTagsError(err.message || "Failed to fetch tags");
        }
      } finally {
        if (isMounted) {
          setIsLoadingTags(false);
        }
      }
    };

    loadTags();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    tags,
    isLoadingTags,
    tagsError,
    refetchTags: fetchTags,
  };
};
