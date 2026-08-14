import { useState, useEffect, useCallback } from "react";
import { ownerCoursesApi } from "../api/ownerCoursesApi";

const mapAssetToCourse = (asset) => {
  const c = asset.course;

  return {
    assetId: asset.id,
    id: c.id,
    title: c.title,
    description: c.description,
    isPublished: c.isPublished,
    tags: c.tags ? c.tags.map((t) => t.name) : [],
    sectionsCount: c.sectionsCount || 0,
    lessonCount: c.lessonCount || 0,
    quizzes: 0,
    imagePath: c.imagePath,
    price: c.price || 0,
    visibility: c.visibility || "PUBLIC",
  };
};

export const useOwnerCourses = (demoId) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!demoId) return;

    const loadInitialData = async () => {
      try {
        const assetsData = await ownerCoursesApi.getDemoAssets(demoId);
        const formattedCourses = assetsData.map(mapAssetToCourse);

        if (isMounted) {
          setCourses(formattedCourses);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to fetch courses.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [demoId]);

  const refetch = useCallback(async () => {
    if (!demoId) return;
    setIsLoading(true);
    setError(null);

    try {
      const assetsData = await ownerCoursesApi.getDemoAssets(demoId);
      setCourses(assetsData.map(mapAssetToCourse));
    } catch (err) {
      setError(err.message || "An error occurred while fetching courses.");
    } finally {
      setIsLoading(false);
    }
  }, [demoId]);

  return {
    courses,
    isLoading,
    error,
    refetch,
  };
};
