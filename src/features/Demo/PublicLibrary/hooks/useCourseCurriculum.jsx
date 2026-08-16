import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { sectionApi } from "../../OwnerCourses/api/sectionApi";
import { lessonApi } from "../../OwnerCourses/api/lessonApi";

export const useCourseCurriculum = (courseId, shouldFetch) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);
  const [lessonsState, setLessonsState] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [sectionsError, setSectionsError] = useState("");
  const [sectionsRequestVersion, setSectionsRequestVersion] = useState(0);

  useEffect(() => {
    if (courseId && shouldFetch) {
      const fetchSections = async () => {
        setIsLoadingSections(true);
        setSectionsError("");
        try {
          const data = await sectionApi.getSections(courseId);
          setSections(data.sort((a, b) => a.order - b.order));
        } catch (error) {
          console.error("Error fetching sections:", error);
          setSections([]);
          setSectionsError(t("course-curriculum-load-failed"));
        } finally {
          setIsLoadingSections(false);
        }
      };
      fetchSections();
    }
  }, [courseId, sectionsRequestVersion, shouldFetch, t]);

  const toggleSection = async (sectionId) => {
    const isCurrentlyExpanded = expandedSections[sectionId];

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !isCurrentlyExpanded,
    }));

    if (
      !isCurrentlyExpanded &&
      (!lessonsState[sectionId] || lessonsState[sectionId].error)
    ) {
      setLessonsState((prev) => ({
        ...prev,
          [sectionId]: { data: [], error: "", isLoading: true },
      }));

      try {
        const data = await lessonApi.getLessons(sectionId);
        setLessonsState((prev) => ({
          ...prev,
          [sectionId]: {
            data: data.sort((a, b) => a.order - b.order),
            error: "",
            isLoading: false,
          },
        }));
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLessonsState((prev) => ({
          ...prev,
          [sectionId]: {
            data: [],
            error: t("course-lessons-load-failed"),
            isLoading: false,
          },
        }));
      }
    }
  };

  return {
    sections,
    lessonsState,
    expandedSections,
    toggleSection,
    isLoadingSections,
    sectionsError,
    retrySections: () => setSectionsRequestVersion((version) => version + 1),
  };
};
