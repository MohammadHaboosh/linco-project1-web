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

  const [faqs, setFaqs] = useState([]);

  const [sections, setSections] = useState([]);

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
          tagIds: course.tags?.map((t) => t.name) || [],
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
      await courseManagerApi.updateCourseGeneralInfo(courseId, generalInfo);
      alert("Course saved successfully!");
    } catch (err) {
      alert("Error saving course: " + err.message);
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
