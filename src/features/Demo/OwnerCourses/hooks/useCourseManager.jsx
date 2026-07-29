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
          tags: course.tags || [],
          imageFile: null,
          imagePreview: null,
        });

        setFaqs([
          {
            id: 1,
            question: "Is this course for beginners?",
            answer: "Yes, it starts from scratch.",
          },
        ]);
        setSections([
          {
            id: "sec-1",
            title: "Introduction",
            lessons: [{ id: "l-1", title: "Welcome Video", duration: "05:00" }],
            questions: [
              {
                id: "q-1",
                text: "What is React?",
                options: ["Library", "Framework", "Language", "DB"],
                correctIndex: 0,
              },
            ],
            quiz: {
              id: "qz-1",
              title: "Intro Quiz",
              duration: 15,
              questionsCount: 5,
            },
          },
        ]);
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
        publishCourseApi.createTag({ name }),
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

      if (generalInfo.imageFile) {
        await courseManagerApi.uploadAndSaveCourseImage(
          courseId,
          generalInfo.imageFile,
          payload,
        );
      } else {
        await courseManagerApi.updateCourseGeneralInfo(courseId, payload);
      }

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
