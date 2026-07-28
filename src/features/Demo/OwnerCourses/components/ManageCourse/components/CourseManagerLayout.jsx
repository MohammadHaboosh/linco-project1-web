import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoListOutline,
  IoChatbubblesOutline,
  IoSaveOutline,
} from "react-icons/io5";
import { useCourseManager } from "../../../hooks/useCourseManager";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import CurriculumTab from "./tabs/CurriculumTab";
import FAQsTab from "./tabs/FAQsTab";
import styles from "./CourseManager.module.css";
import { useTranslation } from "react-i18next";

const CourseManagerLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { demoId, assetId } = useParams();

  const {
    isLoading,
    isSaving,
    generalInfo,
    setGeneralInfo,
    saveGeneralInfo,
    faqs,
    setFaqs,
    sections,
    setSections,
  } = useCourseManager(demoId, assetId);

  const [activeTab, setActiveTab] = useState("curriculum");

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading Workspace...</p>
      </div>
    );
  }

  const TABS = [
    {
      id: "general",
      icon: <IoInformationCircleOutline />,
      label: t("general-info", "General Info"),
    },
    {
      id: "curriculum",
      icon: <IoListOutline />,
      label: t("curriculum", "Curriculum Builder"),
    },
    {
      id: "faqs",
      icon: <IoChatbubblesOutline />,
      label: t("faqs", "Course FAQs"),
    },
  ];

  return (
    <div className={styles.managerContainer}>
      {/* الشريط العلوي - ثابت في أعلى الشاشة */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <IoArrowBackOutline />
          </button>
          <div className={styles.courseHeaderInfo}>
            <span className={styles.badge}>
              {t("editing-mode", "Editing Mode")}
            </span>
            <h2>{generalInfo?.title || "Untitled Course"}</h2>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            className={styles.saveBtn}
            onClick={saveGeneralInfo}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className={styles.btnSpinner}></div>
            ) : (
              <IoSaveOutline />
            )}
            {isSaving
              ? t("saving", "Saving...")
              : t("save-changes", "Save Changes")}
          </button>
        </div>
      </header>

      {/* مساحة العمل: شبكة تسمح بالسكرول الطبيعي للصفحة ككل */}
      <div className={styles.workspaceGrid}>
        {/* القائمة الجانبية: تلحق بك أثناء السكرول */}
        <aside className={styles.stickySidebar}>
          <nav className={styles.navMenu}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.activeNav : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {activeTab === tab.id && (
                  <div className={styles.activeIndicator}></div>
                )}
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* المحتوى الرئيسي: يمتد للأسفل بحرية تامة */}
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {activeTab === "general" && (
              <GeneralInfoTab
                data={generalInfo}
                onChange={(f, v) => setGeneralInfo({ ...generalInfo, [f]: v })}
              />
            )}
            {activeTab === "curriculum" && (
              <CurriculumTab sections={sections} setSections={setSections} />
            )}
            {activeTab === "faqs" && <FAQsTab faqs={faqs} setFaqs={setFaqs} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseManagerLayout;
