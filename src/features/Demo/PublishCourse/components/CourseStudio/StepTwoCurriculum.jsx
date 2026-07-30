import React from "react";
import CurriculumTab from "../../../OwnerCourses/components/ManageCourse/components/tabs/CurriculumTab/CurriculumTab";
import CurriculumFooter from "./CurriculumFooter";
import styles from "./StepTwoCurriculum.module.css";
import { useTranslation } from "react-i18next";

const StepTwoCurriculum = ({
  courseData,
  updateCourseData,
  onPublish,
  isPublishing,
  onBack,
}) => {
  const { t } = useTranslation();

  const handleSetSections = (action) => {
    if (typeof action === "function") {
      updateCourseData("sections", action(courseData.sections || []));
    } else {
      updateCourseData("sections", action);
    }
  };

  const canPublish =
    courseData.sections?.length > 0 &&
    courseData.sections.some(
      (sec) =>
        (sec.lessons && sec.lessons.length > 0) ||
        (sec.questions && sec.questions.length > 0) ||
        sec.quiz !== null,
    );

  return (
    <div className={styles.stepContent}>
      <CurriculumTab
        courseId={courseData.id}
        sections={courseData.sections || []}
        setSections={handleSetSections}
      />

      <CurriculumFooter
        onBack={onBack}
        onPublish={onPublish}
        canPublish={canPublish}
        isPublishing={isPublishing}
        styles={styles}
        t={t}
      />
    </div>
  );
};

export default StepTwoCurriculum;
