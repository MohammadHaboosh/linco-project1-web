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
    handleGeneralInfoChange,
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
    <div className={styles.pageContainer}>
      {/* الترويسة العلوية */}
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

      <div className={styles.layoutGrid}>
        {/* القائمة الجانبية */}
        <aside className={styles.sidebar}>
          <nav className={styles.navMenu}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.activeNav : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* منطقة المحتوى المتغير */}
        <main className={styles.mainPanel}>
          <div className={styles.contentWrapper}>
            {activeTab === "general" && (
              <GeneralInfoTab
                data={generalInfo}
                onChange={handleGeneralInfoChange}
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
