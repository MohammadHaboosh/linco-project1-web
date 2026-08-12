import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoChatbubblesOutline,
  IoSaveOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { useCourseManager } from "../../../hooks/useCourseManager";
import { useCourseSaver } from "../../../hooks/useCourseSaver";
import GeneralInfoTab from "./tabs/GeneralInfoTab/GeneralInfoTab";
import CurriculumTab from "./tabs/CurriculumTab/CurriculumTab";
import FAQsTab from "./tabs/FAQsTab/FAQsTab";
import UploadProgressOverlay from "./UploadProgressOverlay/UploadProgressOverlay";
import styles from "./CourseManager.module.css";
import { useTranslation } from "react-i18next";

const CourseManagerLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId, assetId } = useParams();

  const {
    isLoading,
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

  const { saveCourseData, uploadProgress } = useCourseSaver({
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
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>{t("loading-workspace")}</p>
      </div>
    );

  const TABS = [
    {
      id: "general",
      icon: <IoInformationCircleOutline />,
      label: t("general-info"),
    },
    { id: "curriculum", icon: <IoListOutline />, label: t("curriculum") },
    { id: "faqs", icon: <IoChatbubblesOutline />, label: t("faqs") },
  ];

  return (
    <div className={styles.pageContainer}>
      <UploadProgressOverlay progress={uploadProgress} styles={styles} />

      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <IoArrowBackOutline />
          </button>
          <div className={styles.courseHeaderInfo}>
            <span className={styles.badge}>{t("editing-mode")}</span>
            <h2>{generalInfo?.title || "Untitled Course"}</h2>
          </div>
        </div>
        <div className={styles.headerRight}>
          {activeTab !== "faqs" && (
            <button
              className={styles.saveBtn}
              onClick={executeSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className={styles.btnSpinner}></div>
              ) : (
                <IoSaveOutline />
              )}
              <span>{isSaving ? t("saving") : t("save-changes")}</span>
            </button>
          )}
        </div>
      </header>

      <div className={styles.layoutGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>NAVIGATION</span>
          </div>
          <nav className={styles.navMenu}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.activeNav : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className={styles.navItemContent}>
                  <span className={styles.navIcon}>{tab.icon}</span>
                  <span className={styles.navLabel}>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <IoChevronForwardOutline className={styles.activeArrow} />
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
              />
            )}
            {activeTab === "faqs" && <FAQsTab courseId={courseId} />}
          </div>
        </main>
      </div>
    </div>
  );
};
export default CourseManagerLayout;
