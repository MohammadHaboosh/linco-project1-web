import { useState } from "react";
import {
  IoCloseOutline,
  IoGlobeOutline,
  IoTimeOutline,
  IoBookOutline,
  IoLayersOutline,
} from "react-icons/io5";
import styles from "./CourseDetailsModal.module.css";
import { useCourseCurriculum } from "../../hooks/useCourseCurriculum";
import CourseSectionItem from "../CourseSectionItem/CourseSectionItem";
import { useTranslation } from "react-i18next";
import { useCourseFaqs } from "../../hooks/useCourseFaqs";
import CourseFaqItem from "../CourseFaqItem/CourseFaqItem";

const CourseDetailsModal = ({
  course,
  onClose,
  onEnroll,
  isBuying,
  buyError,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    sections,
    lessonsState,
    expandedSections,
    toggleSection,
    isLoadingSections,
  } = useCourseCurriculum(course?.id, activeTab === "curriculum");
  const { faqs, isLoadingFaqs } = useCourseFaqs(
    course?.id,
    activeTab === "faqs",
  );

  const { t } = useTranslation();

  if (!course) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <img
              src={course.imagePath}
              alt={course.title}
              className={styles.headerThumb}
            />
            <div>
              <span className={styles.publisherBadge}>
                <IoGlobeOutline /> {course.demo?.name}
              </span>
              <h2>{course.title}</h2>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            {t("overview")}
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "curriculum" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("curriculum")}
          >
            {t("curriculum-0")} ({course.sectionsCount} {t("sections")})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "faqs" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("faqs")}
          >
            {t("faqs")}
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "overview" && (
            <div className={styles.overviewSection}>
              <h3>{t("about-this-course")}</h3>
              <p className={styles.description}>{course.description}</p>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <IoBookOutline size={20} />
                  <span>
                    {course.lessonCount} {t("lessons")}
                  </span>
                </div>
                <div className={styles.statBox}>
                  <IoTimeOutline size={20} />
                  <span>
                    {course.totalDuration} {t("minutes")}
                  </span>
                </div>
                <div className={styles.statBox}>
                  <IoLayersOutline size={20} />
                  <span>
                    {course.sectionsCount} {t("sections")}
                  </span>
                </div>
              </div>

              <h3>{t("tags")}</h3>
              <div className={styles.tagsFlex}>
                {course.tags?.map((tag) => (
                  <span key={tag.id} className={styles.tagBadge}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className={styles.curriculumSection}>
              <div className={styles.lockNotice}>
                <p>
                  {t(
                    "you-must-enroll-in-this-course-to-access-the-internal-lesson-contents-and-videos",
                  )}
                </p>
              </div>

              {isLoadingSections ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "20px",
                  }}
                >
                  {t("loading-sections")}
                </p>
              ) : sections.length > 0 ? (
                sections.map((section) => (
                  <CourseSectionItem
                    key={section.id}
                    section={section}
                    isExpanded={expandedSections[section.id]}
                    onToggle={toggleSection}
                    lessonsInfo={lessonsState[section.id]}
                  />
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "20px",
                  }}
                >
                  {t("no-curriculum-data-available")}
                </p>
              )}
            </div>
          )}

          {activeTab === "faqs" && (
            <div className={styles.faqsSection}>
              <h3 style={{ marginBottom: "16px", color: "#0a2a54" }}>
                {t("frequently-asked-questions")}
              </h3>

              {isLoadingFaqs ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "20px",
                  }}
                >
                  {t("loading-faqs")}
                </p>
              ) : faqs && faqs.length > 0 ? (
                faqs.map((faq) => <CourseFaqItem key={faq.id} faq={faq} />)
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "20px",
                  }}
                >
                  {t("no-faqs-available-for-this-course")}
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.priceTag}>
            {course.price === 0 ? (
              <span className={styles.freeText}>{t("free-course")}</span>
            ) : (
              <span className={styles.priceText}>${course.price}</span>
            )}
          </div>
          {buyError && (
            <div
              style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}
            >
              {buyError}
            </div>
          )}
          <button
            className={styles.enrollBtn}
            disabled={isBuying}
            onClick={() => onEnroll(course)}
          >
            {course.price === 0
              ? t("enroll-for-free")
              : `${t("buy-course")} ($${course.price})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
