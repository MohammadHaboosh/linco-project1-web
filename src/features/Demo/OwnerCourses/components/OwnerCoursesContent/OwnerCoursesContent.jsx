import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoAlertCircleOutline,
  IoFolderOpenOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import CourseManagementCard from "../CourseManagementCard/CourseManagementCard";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";
import { useOwnerCourses } from "../../hooks/useOwnerCourses";
import { usePublishCourse } from "../../hooks/usePublishCourse";
import PublishConfirmationModal from "./PublishConfirmationModal";
import ErrorModal from "./ErrorModal";
import CourseSettingsModal from "./CourseSettingsModal";
import { courseManagerApi } from "../../api/courseManagerApi";

const OwnerCoursesContent = () => {
  const { t, i18n } = useTranslation();
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
  const [statusMessage, setStatusMessage] = useState("");

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
      setStatusMessage(t("course-published-successfully"));
    } else {
      setSelectedCourseForPublish(null);
      setErrorMessage(result.error);
    }
  };

  const handleSaveSettings = async (courseId, newSettings) => {
    setIsSavingSettings(true);
    try {
      await courseManagerApi.updateCourseGeneralInfo(courseId, newSettings);

      setSelectedCourseForSettings(null);
      if (refetch) refetch();
      setStatusMessage(t("course-settings-saved-successfully"));
    } catch (error) {
      console.error("Error saving settings:", error);
      setErrorMessage(t("course-settings-save-failed"));
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className={styles.pageContainer} dir={i18n.dir()}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoFolderOpenOutline
                className={styles.headerIcon}
                aria-hidden="true"
              />
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

        {statusMessage && (
          <div className={styles.successMessage} role="status" aria-live="polite">
            {statusMessage}
            <button
              type="button"
              onClick={() => setStatusMessage("")}
              aria-label={t("dismiss-message")}
            >
              {t("close")}
            </button>
          </div>
        )}

        <div className={styles.coursesGrid} aria-busy={isLoading}>
          <CourseManagementCard isAddNew={true} onAddNew={handleAddNewCourse} />

          {isLoading && (
            <div className={styles.stateCard} role="status" aria-live="polite">
              <span className={styles.pageSpinner} aria-hidden="true" />
              <h2>{t("loading-courses")}</h2>
              <p>{t("loading-courses-description")}</p>
            </div>
          )}
          {!isLoading && error && (
            <div className={`${styles.stateCard} ${styles.errorState}`} role="alert">
              <IoAlertCircleOutline aria-hidden="true" />
              <h2>{t("courses-load-failed")}</h2>
              <p>{error}</p>
              <button type="button" onClick={refetch}>
                <IoRefreshOutline aria-hidden="true" /> {t("try-again")}
              </button>
            </div>
          )}

          {!isLoading && !error && courses.length === 0 && (
            <div className={styles.stateCard} role="status">
              <IoFolderOpenOutline aria-hidden="true" />
              <h2>{t("no-workspace-courses")}</h2>
              <p>{t("no-workspace-courses-description")}</p>
            </div>
          )}

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
        key={selectedCourseForSettings?.id || "closed-course-settings"}
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
