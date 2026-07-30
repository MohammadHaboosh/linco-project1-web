import { useState, useEffect, useCallback } from "react";
import { courseManagerApi } from "../api/courseManagerApi";
import { publishCourseApi } from "../../PublishCourse/api/publishCourseApi";
import { sectionApi } from "../api/sectionApi";

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
          const formattedSections = (sectionsData || []).map((sec) => ({
            id: sec.id,
            title: sec.title,
            order: sec.order,
            lessons: sec.lessons || [],
            questions: sec.questions || [],
            quiz: sec.quiz || null,
            isNew: false,
          }));
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
    setIsSaving(true);
    console.log("START SAVING EVERYTHING");

    try {
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

      console.log("Course Saved Successfully! Returned Data:", generalResult);

      setGeneralInfo((prev) => ({
        ...prev,
        imagePath: generalResult?.imagePath || prev.imagePath,
        imageFile: null,
        imagePreview: null,
      }));

      const newSections = sections.filter((sec) => sec.isNew);

      if (newSections.length > 0) {
        console.log("Saving new sections to backend...", newSections);

        const createdSectionsResults = await Promise.all(
          newSections.map((sec) =>
            sectionApi.createSection(courseId, {
              title: sec.title,
              order: sec.order,
            }),
          ),
        );

        setSections((prevSections) => {
          let resultIdx = 0;
          return prevSections.map((sec) => {
            if (sec.isNew) {
              const resData =
                createdSectionsResults[resultIdx]?.data ||
                createdSectionsResults[resultIdx];
              resultIdx++;
              return {
                ...sec,
                id: resData?.id || sec.id,
                isNew: false,
              };
            }
            return sec;
          });
        });
      }

      alert("All changes updated successfully!");
    } catch (err) {
      console.error("Error Saving Course:", err);
      alert(
        "Error updating course: " + (err.message || "Something went wrong"),
      );
    } finally {
      setIsSaving(false);
      console.log("END SAVING PROCESS");
    }
  }, [courseId, generalInfo, sections]);

  return {
    isLoading,
    isSaving,
    error,
    courseId,
    generalInfo,
    setGeneralInfo,
    handleGeneralInfoChange,
    saveGeneralInfo,
    faqs,
    setFaqs,
    sections,
    setSections,
  };
};
