import { useState } from "react";

export const useCourseStudioState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletedSectionIds, setDeletedSectionIds] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  const [courseData, setCourseData] = useState({
    id: null,
    title: "",
    description: "",
    tags: [],
    imagePath: "",
    imageFile: null,
    imagePreview: null,
    visibility: "PUBLIC",
    price: 0,
    sections: [],
  });

  const updateCourseData = (fieldOrObject, value) => {
    setCourseData((prev) => {
      if (typeof fieldOrObject === "object" && fieldOrObject !== null) {
        return { ...prev, ...fieldOrObject };
      }
      return { ...prev, [fieldOrObject]: value };
    });
  };

  const isTempId = (id) => {
    if (!id) return true;
    const strId = String(id);
    return strId.startsWith("temp-") || strId.startsWith("temp_");
  };

  const handleRemoveSection = (section, sectionId) => {
    const targetId =
      sectionId || (typeof section === "object" ? section?.id : section);
    const isNew = typeof section === "object" ? section?.isNew : false;

    if (targetId && !isNew && !isTempId(targetId)) {
      setDeletedSectionIds((prev) => [...prev, targetId]);
    }

    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== targetId),
    }));
  };

  return {
    currentStep,
    setCurrentStep,
    isPublishing,
    setIsPublishing,
    deletedSectionIds,
    setDeletedSectionIds,
    uploadProgress,
    setUploadProgress,
    courseData,
    setCourseData,
    updateCourseData,
    handleRemoveSection,
    isTempId,
  };
};
