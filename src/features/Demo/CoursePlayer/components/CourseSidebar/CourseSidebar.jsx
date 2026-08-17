import styles from "./CourseSidebar.module.css";
import {
  IoListOutline,
  IoSparklesOutline,
  IoChevronForwardOutline,
  IoChevronBackOutline,
} from "react-icons/io5";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import AIFloatingAssistant from "../../../AIFloatingAssistant/AIFloatingAssistant";
import { useTranslation } from "react-i18next";

const CourseSidebar = ({
  courseId,
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  activeLesson,
  onSelectLesson,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const CollapseIcon = isRtl
    ? IoChevronBackOutline
    : IoChevronForwardOutline;
  const ExpandIcon = isRtl
    ? IoChevronForwardOutline
    : IoChevronBackOutline;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <>
      <aside
        className={`${styles.sidebarWrapper} ${isOpen ? styles.open : styles.closed}`}
        aria-label={t("course-player-sidebar-label")}
        data-open={isOpen}
      >
        {/* Content Area (Left side of the sidebar) */}
        <div className={styles.sidebarContent} aria-hidden={!isOpen}>
          <div className={styles.contentHeader}>
            <div className={styles.headerTitles}>
              <span className={styles.headerEyebrow}>
                {activeTab === "curriculum"
                  ? t("course-player-learning-path")
                  : t("course-player-smart-study")}
              </span>
              <h2>
                {activeTab === "curriculum"
                  ? t("course-player-curriculum")
                  : t("course-player-ai-assistant")}
              </h2>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label={t("course-player-close-sidebar")}
            >
              <CollapseIcon />
            </button>
          </div>

          <div className={styles.scrollableArea}>
            {activeTab === "curriculum" ? (
              <CurriculumSidebar
                activeLesson={activeLesson}
                onSelectLesson={onSelectLesson}
              />
            ) : (
              <AIFloatingAssistant key={courseId} courseId={courseId} />
            )}
          </div>
        </div>

        {/* Navigation Rail (Right side of the sidebar) */}
        <div className={styles.verticalNav}>
          {!isOpen && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsOpen(true)}
              aria-label={t("course-player-open-sidebar")}
            >
              <ExpandIcon />
            </button>
          )}

          <button
            className={`${styles.navBtn} ${activeTab === "curriculum" && isOpen ? styles.activeNavBtn : ""}`}
            onClick={() => handleTabClick("curriculum")}
            title={t("course-player-course-content")}
            type="button"
            aria-pressed={activeTab === "curriculum"}
          >
            <div className={styles.navIconBox}>
              <IoListOutline />
            </div>
            {isOpen && (
              <span className={styles.navText}>
                {t("course-player-path-tab")}
              </span>
            )}
          </button>

          <button
            className={`${styles.navBtn} ${styles.aiBtn} ${activeTab === "ai" && isOpen ? styles.activeAiBtn : ""}`}
            onClick={() => handleTabClick("ai")}
            title={t("course-player-smart-assistant")}
            type="button"
            aria-pressed={activeTab === "ai"}
          >
            <div className={styles.navIconBox}>
              <IoSparklesOutline />
            </div>
            {isOpen && (
              <span className={styles.navText}>
                {t("course-player-smart-tab")}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default CourseSidebar;
