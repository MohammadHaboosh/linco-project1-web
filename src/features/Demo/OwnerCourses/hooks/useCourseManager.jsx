import { useState, useEffect, useCallback } from "react";
import { courseManagerApi } from "../api/courseManagerApi";

export const useCourseManager = (demoId, assetId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [courseId, setCourseId] = useState(null);

  const [generalInfo, setGeneralInfo] = useState({
    title: "",
    description: "",
    visibility: "PUBLIC",
    imagePath: "",
    tagIds: [],
  });

  useEffect(() => {
    if (!demoId || !assetId) return;

    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const assetData = await courseManagerApi.getAsset(demoId, assetId);
        const course = assetData.course;

        setCourseId(course.id);

        setGeneralInfo({
          title: course.title || "",
          description: course.description || "",
          visibility: course.visibility || "PRIVATE",
          imagePath: course.imagePath || "",
          tagIds: course.tags?.map((t) => t.id) || [],
        });
      } catch (err) {
        setError(err.message || "Failed to load course details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [demoId, assetId]);

  const saveGeneralInfo = useCallback(async () => {
    if (!courseId) return;
    setIsSaving(true);
    try {
      await courseManagerApi.updateCourseGeneralInfo(courseId, generalInfo);
      alert("Course info updated successfully!");
    } catch (err) {
      alert("Error updating course: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [courseId, generalInfo]);

  return {
    isLoading,
    isSaving,
    error,
    generalInfo,
    setGeneralInfo,
    saveGeneralInfo,
  };
};
