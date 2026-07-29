import { useState, useEffect, useCallback } from "react";
import { courseManagerApi } from "../api/courseManagerApi";
import { publishCourseApi } from "../../PublishCourse/api/publishCourseApi";

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
    price: 0,
    tags: [],
    imageFile: null,
    imagePreview: null,
  });

  const [faqs, setFaqs] = useState([]);

  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!demoId || !assetId) return;

    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const assetData = await courseManagerApi.getAsset(demoId, assetId);

        const course = assetData.course || assetData.data?.course || assetData;
        setCourseId(course.id);

        setGeneralInfo({
          title: course.title || "",
          description: course.description || "",
          visibility: course.visibility || "PRIVATE",
          imagePath: course.imagePath || "",
          price: course.price || 0,
          tags: course.tags || [],
          imageFile: null,
          imagePreview: null,
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
      const tagNames = (generalInfo.tags || []).map((tag) =>
        typeof tag === "object" ? tag.name : tag,
      );

      const tagPromises = tagNames.map((name) =>
        publishCourseApi.createTag(name),
      );
      const createdTagsResponses = await Promise.all(tagPromises);

      const tagIds = createdTagsResponses.map((res) => res.data?.id || res.id);

      const payload = {
        title: generalInfo.title,
        description: generalInfo.description,
        imagePath: generalInfo.imagePath,
        visibility: generalInfo.visibility,
        price: Number(generalInfo.price) || 0,
        tagIds: tagIds,
      };

      let result;

      if (generalInfo.imageFile) {
        result = await courseManagerApi.uploadAndSaveCourseImage(
          courseId,
          generalInfo.imageFile,
          payload,
        );
      } else {
        result = await courseManagerApi.updateCourseGeneralInfo(
          courseId,
          payload,
        );
      }
      setGeneralInfo((prev) => ({
        ...prev,
        imagePath: result?.imagePath || prev.imagePath,
        imageFile: null,
        imagePreview: null,
      }));

      alert("Course updated successfully!");
    } catch (err) {
      alert(
        "Error updating course: " +
          (err.response?.data?.message || err.message),
      );
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
    faqs,
    setFaqs,
    sections,
    setSections,
  };
};
