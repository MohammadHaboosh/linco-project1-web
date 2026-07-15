import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoFolderOpenOutline } from "react-icons/io5";
import CourseManagementCard from "../CourseManagementCard/CourseManagementCard";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";
import { useOwnerCourses } from "../../hooks/useOwnerCourses";

const OwnerCoursesContent = () => {
  const { t } = useTranslation("demo");
  const navigate = useNavigate();
  const { demoId } = useParams();
  const { courses, isLoading, error } = useOwnerCourses(demoId);

  const handleAddNewCourse = () => {
    /// TO DO
    navigate(`/demos/${demoId}/course-studio`);
  };

  const handleEditCourse = (courseId) => {
    /// TO DO
    navigate(`/demos/${demoId}/course-studio/${courseId}`);
  };

  const handlePublishToLibrary = (courseId) => {
    /// TO DO
    // setCourses((prev) =>
    //   prev.map((c) => (c.id === courseId ? { ...c, isPublished: true } : c)),
    // );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoFolderOpenOutline className={styles.headerIcon} />
            </div>
            <div>
              <h1 className={styles.title}>{t("demo-courses")}</h1>
              <p className={styles.description}>
                {t(
                  "manage-your-created-courses-edit-curriculum-and-publish-them-to-the-public-library",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.coursesGrid}>
          <CourseManagementCard isAddNew={true} onAddNew={handleAddNewCourse} />

          {isLoading && <p style={{ padding: "20px" }}>Loading courses...</p>}
          {error && <p style={{ padding: "20px", color: "red" }}>{error}</p>}

          {!isLoading &&
            !error &&
            courses.map((course) => (
              <CourseManagementCard
                key={course.id}
                isAddNew={false}
                course={course}
                onEdit={handleEditCourse}
                onPublish={handlePublishToLibrary}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerCoursesContent;
