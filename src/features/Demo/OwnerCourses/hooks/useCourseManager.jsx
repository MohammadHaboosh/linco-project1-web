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
    console.log("START SAVING COURSE GENERAL INFO");

    try {
      const tagNames = (generalInfo.tags || []).map((tag) =>
        typeof tag === "object" ? tag.name : tag,
      );
      console.log("Processing Tag Names:", tagNames);

      const tagPromises = tagNames.map((name) =>
        publishCourseApi.createTag(name),
      );
      const createdTagsResponses = await Promise.all(tagPromises);

      const tagIds = createdTagsResponses.map((res) => res.data?.id || res.id);
      console.log("Extracted Tag IDs:", tagIds);

      const basePayload = {
        title: generalInfo.title,
        description: generalInfo.description,
        imagePath: generalInfo.imagePath,
        visibility: generalInfo.visibility,
        price: Number(generalInfo.price) || 0,
        tagIds: tagIds,
      };

      let result;

      if (generalInfo.imageFile) {
        console.log(
          "New Image Detected -> Calling uploadAndSaveCourseImage...",
        );
        result = await courseManagerApi.uploadAndSaveCourseImage(
          courseId,
          generalInfo.imageFile,
          basePayload,
        );
      } else {
        console.log("No new image -> Updating text details only...");
        result = await courseManagerApi.updateCourseGeneralInfo(
          courseId,
          basePayload,
        );
      }

      console.log("Course Saved Successfully! Returned Data:", result);

      setGeneralInfo((prev) => ({
        ...prev,
        imagePath: result?.imagePath || prev.imagePath,
        imageFile: null,
        imagePreview: null,
      }));

      alert("Course updated successfully!");
    } catch (err) {
      console.error("Error Saving Course:", err);
      alert(
        "Error updating course: " + (err.message || "Something went wrong"),
      );
    } finally {
      setIsSaving(false);
      console.log("END SAVING PROCESS");
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
