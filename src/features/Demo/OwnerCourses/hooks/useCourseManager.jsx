import { useState, useEffect, useCallback } from "react";
import { courseManagerApi } from "../api/courseManagerApi";
import { publishCourseApi } from "../../PublishCourse/api/publishCourseApi";
import { sectionApi } from "../api/sectionApi";
import { lessonApi } from "../api/lessonApi";
import { quizApi } from "../api/quizApi";

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
  const [deletedSectionIds, setDeletedSectionIds] = useState([]);
  const handleGeneralInfoChange = useCallback((keyOrObject, value) => {
    setGeneralInfo((prev) => {
      if (typeof keyOrObject === "object" && keyOrObject !== null) {
        return { ...prev, ...keyOrObject };
      }
      return { ...prev, [keyOrObject]: value };
    });
  }, []);
  const isTempId = (id) => {
    if (!id) return true;
    const strId = String(id);
    return strId.startsWith("temp-") || strId.startsWith("temp_");
  };
  useEffect(() => {
    if (!demoId || !assetId) return;

    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);
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

        if (course.id) {
          const sectionsData = await sectionApi.getSections(course.id);
          const formattedSections = await Promise.all(
            (sectionsData || []).map(async (sec) => {
              let lessonsList = sec.lessons || [];

              if (!lessonsList || lessonsList.length === 0) {
                try {
                  lessonsList = await lessonApi.getLessons(sec.id);
                } catch (err) {
                  console.error(
                    `Failed to fetch lessons for section ${sec.id}:`,
                    err,
                  );
                  lessonsList = [];
                }
              }

              return {
                id: sec.id,
                title: sec.title,
                order: sec.order,
                lessons: lessonsList,
                questions: sec.questions || [],
                quiz: sec.quiz || null,
                isNew: false,
              };
            }),
          );

          setSections(formattedSections);
        }
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

    let tagIds = [];
    if (generalInfo.tags && generalInfo.tags.length > 0) {
      const tagIdResults = await Promise.all(
        generalInfo.tags.map(async (tag) => {
          if (typeof tag === "object" && tag !== null && tag.id) {
            return tag.id;
          }

          const tagName =
            typeof tag === "string"
              ? tag
              : tag?.name || tag?.label || tag?.value || "";

          if (!tagName || !tagName.trim()) return null;

          const res = await publishCourseApi.createTag(tagName.trim());
          return res.data?.id || res.id;
        }),
      );

      tagIds = tagIdResults.filter(Boolean);
    }

    const basePayload = {
      title: generalInfo.title,
      description: generalInfo.description,
      imagePath: generalInfo.imagePath,
      visibility: generalInfo.visibility,
      price: Number(generalInfo.price) || 0,
      tagIds: tagIds,
    };

    let generalResult;
    if (generalInfo.imageFile) {
      generalResult = await courseManagerApi.uploadAndSaveCourseImage(
        courseId,
        generalInfo.imageFile,
        basePayload,
      );
    } else {
      generalResult = await courseManagerApi.updateCourseGeneralInfo(
        courseId,
        basePayload,
      );
    }

    setGeneralInfo((prev) => ({
      ...prev,
      imagePath: generalResult?.imagePath || prev.imagePath,
      imageFile: null,
      imagePreview: null,
    }));

    return generalResult;
  }, [courseId, generalInfo]);

  const handleDeleteQuiz = async (sectionId, quizId) => {
    if (String(quizId).startsWith("temp_") || isTempId?.(sectionId)) {
      setSections((prev) =>
        prev.map((sec) =>
          sec.id === sectionId ? { ...sec, quiz: null } : sec,
        ),
      );
      return;
    }

    try {
      await quizApi.deleteQuiz(sectionId, quizId);

      setSections((prev) =>
        prev.map((sec) =>
          sec.id === sectionId ? { ...sec, quiz: null } : sec,
        ),
      );
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      throw err;
    }
  };

  return {
    isLoading,
    isSaving,
    setIsSaving,
    error,
    courseId,
    generalInfo,
    setGeneralInfo,
    handleGeneralInfoChange,
    handleDeleteQuiz,
    saveGeneralInfo,
    faqs,
    setFaqs,
    sections,
    setSections,
    deletedSectionIds,
    setDeletedSectionIds,
  };
};
