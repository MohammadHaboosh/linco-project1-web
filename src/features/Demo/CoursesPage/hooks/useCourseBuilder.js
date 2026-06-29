import { useState } from "react";
// import { courseApi } from "../api/courseApi";

export const useCourseBuilder = (initialData = null) => {
  const [isLoading, setIsLoading] = useState(false);

  // حالة تفاصيل الكورس (القسم الأيسر)
  const [courseDetails, setCourseDetails] = useState(
    initialData?.details || {
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      estimatedDuration: "",
    },
  );

  // حالة الأقسام والدروس (القسم الأيمن)
  const [sections, setSections] = useState(
    initialData?.sections || [
      { id: Date.now, title: "Introduction", isExpanded: true, lessons: [] },
    ],
  );

  // دوال التحكم بالأقسام
  const addSection = () =>
    setSections([
      ...sections,
      { id: Date.now(), title: "New Section", isExpanded: true, lessons: [] },
    ]);
  const deleteSection = (sIndex) =>
    setSections(sections.filter((_, idx) => idx !== sIndex));
  const toggleSection = (sIndex) => {
    const newSec = [...sections];
    newSec[sIndex].isExpanded = !newSec[sIndex].isExpanded;
    setSections(newSec);
  };
  const updateSectionTitle = (sIndex, title) => {
    const newSec = [...sections];
    newSec[sIndex].title = title;
    setSections(newSec);
  };

  // دوال التحكم بالدروس
  const deleteLesson = (sIndex, lIndex) => {
    const newSec = [...sections];
    newSec[sIndex].lessons.splice(lIndex, 1);
    setSections(newSec);
  };

  const saveLesson = (sIndex, lIndex, lessonData) => {
    const newSec = [...sections];
    if (lIndex !== null) newSec[sIndex].lessons[lIndex] = lessonData;
    else newSec[sIndex].lessons.push({ ...lessonData, id: Date.now() });
    setSections(newSec);
  };

  const handleSaveCourse = async () => {
    setIsLoading(true);
    const payload = { details: courseDetails, curriculum: sections };
    try {
      // await courseApi.createCourse(payload);
      alert("Course saved successfully!");
    } catch (error) {
      console.error("Failed to save course", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    courseDetails,
    setCourseDetails,
    sections,
    isLoading,
    addSection,
    deleteSection,
    toggleSection,
    updateSectionTitle,
    deleteLesson,
    saveLesson,
    handleSaveCourse,
  };
};
