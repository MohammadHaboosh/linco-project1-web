import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoChatbubblesOutline,
  IoSaveOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useCourseManager } from "../../../hooks/useCourseManager";
import { useCourseSaver } from "../../../hooks/useCourseSaver";
import GeneralInfoTab from "./tabs/GeneralInfoTab/GeneralInfoTab";
import CurriculumTab from "./tabs/CurriculumTab/CurriculumTab";
import FAQsTab from "./tabs/FAQsTab/FAQsTab";
import UploadProgressOverlay from "./UploadProgressOverlay/UploadProgressOverlay";
import styles from "./CourseManager.module.css";
import { useTranslation } from "react-i18next";

const CourseManagerLayout = ({ readOnly = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId, assetId } = useParams();

  const {
    isLoading,
    error,
    retryCourse,
    isSaving,
    setIsSaving,
    courseId,
    generalInfo,
    handleGeneralInfoChange,
    saveGeneralInfo,
    sections,
    setSections,
    deletedSectionIds,
    setDeletedSectionIds,
  } = useCourseManager(demoId, assetId);

  const [activeTab, setActiveTab] = useState("curriculum");
  const [deletedQuizIds, setDeletedQuizIds] = useState([]);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);

  const {
    saveCourseData,
    uploadProgress,
    saveFeedback,
    clearSaveFeedback,
  } = useCourseSaver({
    courseId,
    assetId,
    demoId,
    saveGeneralInfo,
    setIsSaving,
  });

  const executeSave = async () => {
    const success = await saveCourseData(sections, setSections, {
      deletedSectionIds,
      setDeletedSectionIds,
      deletedQuizIds,
      setDeletedQuizIds,
      deletedQuestionIds,
      setDeletedQuestionIds,
    });
    if (success) navigate(-1);
  };

  const isTempId = (id) => !id || String(id).startsWith("temp");

  const handleDeleteSection = (sectionId) => {
    if (sectionId && !isTempId(sectionId))
      setDeletedSectionIds((prev) => [...(prev || []), sectionId]);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const handleDeleteQuiz = (secId, quizId) => {
    if (quizId && !isTempId(quizId))
      setDeletedQuizIds((prev) => [...prev, { secId, quizId }]);
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, quiz: null } : s)),
    );
  };

  const handleDeleteQuestion = (secId, questionId) => {
    if (questionId && !isTempId(questionId))
      setDeletedQuestionIds((prev) => [...prev, { secId, questionId }]);
    setSections((prev) =>
      prev.map((s) =>
        s.id === secId
          ? {
              ...s,
              questions: (s.questions || []).filter((q) => q.id !== questionId),
            }
          : s,
      ),
    );
  };

  if (isLoading)
    return (
      <div
        className={styles.loadingScreen}
        role="status"
        aria-live="polite"
      >
        <div className={styles.spinner} aria-hidden="true"></div>
        <h1>
          {t(readOnly ? "loading-course-details" : "loading-course-manager")}
        </h1>
        <p>{t("loading-course-manager-description")}</p>
      </div>
    );

  if (error) {
    return (
      <div className={styles.loadingScreen} role="alert">
        <h1>
          {t(
            readOnly
              ? "course-details-load-failed"
              : "course-manager-load-failed",
          )}
        </h1>
        <p>{t("course-manager-load-error-message")}</p>
        <div className={styles.stateActions}>
          <button type="button" onClick={() => navigate(-1)}>
            {t("back-to-courses")}
          </button>
          <button type="button" onClick={retryCourse}>
            {t("try-again")}
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    {
      id: "general",
      icon: <IoInformationCircleOutline aria-hidden="true" />,
      label: t("general-info"),
    },
    {
      id: "curriculum",
      icon: <IoListOutline aria-hidden="true" />,
      label: t(readOnly ? "course-curriculum" : "curriculum"),
    },
    {
      id: "faqs",
      icon: <IoChatbubblesOutline aria-hidden="true" />,
      label: t("faqs"),
    },
  ];
  const navigationLabel = t(
    readOnly ? "course-details-sections" : "course-manager-navigation",
  );

  return (
    <div className={styles.pageContainer}>
      {!readOnly && (
        <UploadProgressOverlay progress={uploadProgress} styles={styles} />
      )}

      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label={t("back-to-courses")}
            title={t("back-to-courses")}
          >
            <IoArrowBackOutline aria-hidden="true" />
          </button>
          <div className={styles.courseHeaderInfo}>
            <span className={styles.badge}>
              {t(readOnly ? "viewing-mode" : "editing-mode")}
            </span>
            <h1>{generalInfo?.title || t("untitled-course")}</h1>
          </div>
        </div>
        <div className={styles.headerRight}>
          {!readOnly && activeTab !== "faqs" && (
            <button
              type="button"
              className={styles.saveBtn}
              onClick={executeSave}
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? (
                <span className={styles.btnSpinner} aria-hidden="true"></span>
              ) : (
                <IoSaveOutline aria-hidden="true" />
              )}
              <span>{isSaving ? t("saving") : t("save-changes")}</span>
            </button>
          )}
        </div>
      </header>

      {!readOnly && saveFeedback && (
        <div
          className={`${styles.feedbackBanner} ${
            saveFeedback.type === "error"
              ? styles.feedbackError
              : styles.feedbackSuccess
          }`}
          role={saveFeedback.type === "error" ? "alert" : "status"}
        >
          <span>{saveFeedback.message}</span>
          <button
            type="button"
            onClick={clearSaveFeedback}
            aria-label={t("dismiss-save-message")}
          >
            <IoCloseOutline aria-hidden="true" />
          </button>
        </div>
      )}

      <div className={styles.layoutGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>{navigationLabel}</span>
          </div>
          <nav
            className={styles.navMenu}
            aria-label={navigationLabel}
          >
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.activeNav : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  clearSaveFeedback();
                }}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <div className={styles.navItemContent}>
                  <span className={styles.navIcon}>{tab.icon}</span>
                  <span className={styles.navLabel}>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <IoChevronForwardOutline
                    className={styles.activeArrow}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.mainPanel}>
          <div className={styles.contentWrapper}>
            {activeTab === "general" && (
              <GeneralInfoTab
                data={generalInfo}
                onChange={handleGeneralInfoChange}
                readOnly={readOnly}
              />
            )}
            {activeTab === "curriculum" && (
              <CurriculumTab
                courseId={courseId}
                sections={sections}
                setSections={setSections}
                onDeleteSection={handleDeleteSection}
                onDeleteQuiz={handleDeleteQuiz}
                onDeleteQuestion={handleDeleteQuestion}
                readOnly={readOnly}
              />
            )}
            {activeTab === "faqs" && (
              <FAQsTab courseId={courseId} readOnly={readOnly} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default CourseManagerLayout;
