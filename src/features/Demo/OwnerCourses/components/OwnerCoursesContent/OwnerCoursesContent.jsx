import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoFolderOpenOutline } from "react-icons/io5";
import CourseManagementCard from "../CourseManagementCard/CourseManagementCard";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";
import { useOwnerCourses } from "../../hooks/useOwnerCourses";
import { usePublishCourse } from "../../hooks/usePublishCourse";
import PublishConfirmationModal from "./PublishConfirmationModal";
import ErrorModal from "./ErrorModal";
import CourseSettingsModal from "./CourseSettingsModal";

const OwnerCoursesContent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId } = useParams();
  const { courses, isLoading, error, refetch } = useOwnerCourses(demoId);
  const { publishCourse, isPublishing } = usePublishCourse();

  const [selectedCourseForPublish, setSelectedCourseForPublish] =
    useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCourseForSettings, setSelectedCourseForSettings] =
    useState(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleOpenSettingsModal = (course) => {
    setSelectedCourseForSettings(course);
  };

  const handleAddNewCourse = () => {
    navigate(`/demos/${demoId}/course-studio`);
  };

  const handleEditCourse = (assetId) => {
    navigate(`/demos/${demoId}/manage-course/${assetId}`);
  };

  const handleOpenPublishModal = (course) => {
    setSelectedCourseForPublish(course);
  };

  const handleConfirmPublish = async () => {
    if (!selectedCourseForPublish) return;

    const result = await publishCourse(selectedCourseForPublish.id);

    if (result.success) {
      setSelectedCourseForPublish(null);
      if (refetch) refetch();
      alert(t("course-published-successfully"));
    } else {
      setSelectedCourseForPublish(null);
      setErrorMessage(t("an-error-occurred-please-try-again-later"));
    }
  };

  const handleSaveSettings = async (courseId, newSettings) => {
    setIsSavingSettings(true);
    try {
      // await courseManagerApi.updateCourseGeneralInfo(courseId, newSettings);

      setSelectedCourseForSettings(null);
      if (refetch) refetch();
    } catch (error) {
      setErrorMessage("Failed to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
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
                onEdit={() => handleEditCourse(course.assetId || course.id)}
                onPublish={() => handleOpenPublishModal(course)}
                onEditSettings={() => handleOpenSettingsModal(course)}
              />
            ))}
        </div>
      </div>

      <PublishConfirmationModal
        course={selectedCourseForPublish}
        isPublishing={isPublishing}
        onClose={() => setSelectedCourseForPublish(null)}
        onConfirm={handleConfirmPublish}
      />

      <CourseSettingsModal
        course={selectedCourseForSettings}
        isOpen={!!selectedCourseForSettings}
        onClose={() => setSelectedCourseForSettings(null)}
        onSave={handleSaveSettings}
        isSaving={isSavingSettings}
      />

      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};

export default OwnerCoursesContent;
