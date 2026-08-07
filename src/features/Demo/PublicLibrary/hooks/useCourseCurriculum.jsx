import { useState, useEffect } from "react";
import { sectionApi } from "../../OwnerCourses/api/sectionApi";
import { lessonApi } from "../../OwnerCourses/api/lessonApi";

export const useCourseCurriculum = (courseId, shouldFetch) => {
  const [sections, setSections] = useState([]);
  const [lessonsState, setLessonsState] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [isLoadingSections, setIsLoadingSections] = useState(false);

  useEffect(() => {
    if (courseId && shouldFetch) {
      const fetchSections = async () => {
        setIsLoadingSections(true);
        try {
          const data = await sectionApi.getSections(courseId);
          setSections(data.sort((a, b) => a.order - b.order));
        } catch (error) {
          console.error("Error fetching sections:", error);
        } finally {
          setIsLoadingSections(false);
        }
      };
      fetchSections();
    }
  }, [courseId, shouldFetch]);

  const toggleSection = async (sectionId) => {
    const isCurrentlyExpanded = expandedSections[sectionId];

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !isCurrentlyExpanded,
    }));

    if (!isCurrentlyExpanded && !lessonsState[sectionId]) {
      setLessonsState((prev) => ({
        ...prev,
        [sectionId]: { data: [], isLoading: true },
      }));

      try {
        const data = await lessonApi.getLessons(sectionId);
        setLessonsState((prev) => ({
          ...prev,
          [sectionId]: {
            data: data.sort((a, b) => a.order - b.order),
            isLoading: false,
          },
        }));
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLessonsState((prev) => ({
          ...prev,
          [sectionId]: { data: [], isLoading: false },
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
  };
};
