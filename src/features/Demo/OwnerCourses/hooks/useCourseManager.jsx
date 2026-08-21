import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { courseManagerApi } from "../api/courseManagerApi";
import { sectionApi } from "../api/sectionApi";
import { lessonApi } from "../api/lessonApi";
import { attachmentApi } from "../api/attachmentApi";

const formatAttachment = (attachment) => ({
  id: attachment.id,
  title: attachment.name || "",
  fileName: attachment.name || "",
  path: attachment.path,
  isExisting: true,
  isNew: false,
});

const loadLessonAttachments = async (lesson) => {
  try {
    const attachments = await attachmentApi.getAttachments(lesson.id);

    return {
      ...lesson,
      attachments: (attachments || []).map(formatAttachment),
      isAttachmentsFetched: true,
    };
  } catch (error) {
    console.error(`Failed to fetch attachments for lesson ${lesson.id}:`, error);

    return {
      ...lesson,
      attachments: lesson.attachments || [],
      isAttachmentsFetched: false,
    };
  }
};

export const useCourseManager = (demoId, assetId) => {
  const { t } = useTranslation();
  const hasRouteIdentifiers = Boolean(demoId && assetId);
  const [isLoading, setIsLoading] = useState(hasRouteIdentifiers);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(!hasRouteIdentifiers);
  const [courseId, setCourseId] = useState(null);
  const [accessMethod, setAccessMethod] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

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
  useEffect(() => {
    if (!demoId || !assetId) return;

    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setAccessMethod(null);
        const assetData = await courseManagerApi.getAsset(demoId, assetId);

        const course = assetData.course || assetData.data?.course || assetData;
        if (!course?.id) {
          throw new Error("The course payload did not include an identifier");
        }
        setAccessMethod(
          assetData.accessMethod || assetData.data?.accessMethod || null,
        );
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
              let lessonsLoadError = false;

              if (!lessonsList || lessonsList.length === 0) {
                try {
                  lessonsList = await lessonApi.getLessons(sec.id);
                } catch (err) {
                  console.error(
                    `Failed to fetch lessons for section ${sec.id}:`,
                    err,
                  );
                  lessonsList = [];
                  lessonsLoadError = true;
                }
              }

              lessonsList = await Promise.all(
                (lessonsList || []).map(loadLessonAttachments),
              );

              return {
                id: sec.id,
                title: sec.title,
                order: sec.order,
                lessons: lessonsList,
                questions: sec.questions || [],
                quiz: sec.quiz || null,
                isNew: false,
                isQuizFetched: false,
                isQuestionsFetched: false,
                isLessonsLoading: false,
                lessonsLoadError,
              };
            }),
          );

          setSections(formattedSections);
        }
      } catch (err) {
        console.error("Failed to load course details:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [demoId, assetId, requestVersion]);

  const saveGeneralInfo = useCallback(async () => {
    if (!courseId) {
      const missingCourseError = new Error(
        t("course-studio-missing-course-error"),
      );
      missingCourseError.name = "CourseValidationError";
      throw missingCourseError;
    }

    const hasTitle = generalInfo.title?.trim();
    const hasDescription = generalInfo.description?.trim();
    const hasTags = generalInfo.tags && generalInfo.tags.length > 0;
    const hasValidPrice =
      generalInfo.price !== "" &&
      generalInfo.price !== null &&
      Number(generalInfo.price) >= 0;
    const hasImage =
      generalInfo.imageFile ||
      (generalInfo.imagePath &&
        generalInfo.imagePath !== "default" &&
        generalInfo.imagePath !== "qwertyuiop");

    if (
      !hasTitle ||
      !hasDescription ||
      !hasTags ||
      !hasValidPrice ||
      !hasImage
    ) {
      const validationError = new Error(
        t("course-studio-required-fields-error"),
      );
      validationError.name = "CourseValidationError";
      throw validationError;
    }

    let tagIds = [];
    if (generalInfo.tags && generalInfo.tags.length > 0) {
      tagIds = generalInfo.tags.map((tag) => tag.id).filter(Boolean);
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
  }, [courseId, generalInfo, t]);

  return {
    isLoading,
    isSaving,
    setIsSaving,
    error,
    courseId,
    accessMethod,
    generalInfo,
    setGeneralInfo,
    handleGeneralInfoChange,
    saveGeneralInfo,
    sections,
    setSections,
    deletedSectionIds,
    setDeletedSectionIds,
    retryCourse: () => setRequestVersion((version) => version + 1),
  };
};
