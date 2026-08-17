import { useState } from "react";
import {
  IoCloseOutline,
  IoGlobeOutline,
  IoTimeOutline,
  IoBookOutline,
  IoLayersOutline,
} from "react-icons/io5";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./CourseDetailsModal.module.css";
import { useCourseCurriculum } from "../../hooks/useCourseCurriculum";
import { useCourseFaqs } from "../../hooks/useCourseFaqs";
import CourseSectionItem from "../CourseSectionItem/CourseSectionItem";
import CourseFaqItem from "../CourseFaqItem/CourseFaqItem";
import VideoContent from "../../../CoursePlayer/components/CourseViewer/VideoContent";

const CourseDetailsModal = ({
  course,
  onClose,
  onEnroll,
  isBuying,
  buyError,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewLesson, setPreviewLesson] = useState(null);
  const { demoId } = useParams();
  const { t, i18n } = useTranslation();
  const {
    sections,
    lessonsState,
    expandedSections,
    toggleSection,
    isLoadingSections,
    sectionsError,
    retrySections,
  } = useCourseCurriculum(course?.id, activeTab === "curriculum");
  const {
    faqs,
    isLoadingFaqs,
    faqsError,
    retryFaqs,
  } = useCourseFaqs(course?.id, activeTab === "faqs");

  if (!course) return null;

  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numericPrice = Number(course.price) || 0;
  const isPaidCourse = numericPrice > 0;
  const lessonCount = Number(course.lessonCount) || 0;
  const duration = Number(course.totalDuration) || 0;
  const sectionCount = Number(course.sectionsCount) || 0;
  const numberFormatter = new Intl.NumberFormat(locale);
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
  const isOwnWorkspaceCourse =
    String(course.demo?.id ?? course.demoId) === String(demoId);
  const dialogTitleId = `course-details-title-${course.id}`;
  const firstSectionId = sections[0]?.id;

  const formatCount = (key, count) =>
    t(key, {
      count,
      formattedCount: numberFormatter.format(count),
    });

  const handleOverlayClick = () => {
    if (!isBuying) onClose();
  };

  const purchaseButtonLabel = isBuying
    ? numericPrice === 0
      ? t("enrolling-in-course")
      : t("preparing-course-purchase")
    : numericPrice === 0
      ? t("enroll-for-free")
      : t("buy-course-for-price", { price: formattedPrice });

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className={styles.modalContainer}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-busy={isBuying}
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            {course.imagePath && (
              <img
                src={course.imagePath}
                alt={t("course-thumbnail-alt", {
                  courseTitle: course.title,
                })}
                className={styles.headerThumb}
              />
            )}
            <div className={styles.headerText}>
              <span className={styles.publisherBadge}>
                <IoGlobeOutline aria-hidden="true" />
                {course.demo?.name || t("unknown-workspace")}
              </span>
              <h2 id={dialogTitleId}>{course.title}</h2>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isBuying}
            aria-label={t("close-course-details")}
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div
          className={styles.tabsRow}
          role="tablist"
          aria-label={t("course-details-sections")}
        >
          <button
            type="button"
            id={`course-overview-tab-${course.id}`}
            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("overview")}
            role="tab"
            aria-selected={activeTab === "overview"}
            aria-controls={`course-overview-panel-${course.id}`}
          >
            {t("overview")}
          </button>
          <button
            type="button"
            id={`course-curriculum-tab-${course.id}`}
            className={`${styles.tabBtn} ${activeTab === "curriculum" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("curriculum")}
            role="tab"
            aria-selected={activeTab === "curriculum"}
            aria-controls={`course-curriculum-panel-${course.id}`}
          >
            {t("curriculum-tab-with-count", {
              count: sectionCount,
              formattedCount: numberFormatter.format(sectionCount),
            })}
          </button>
          <button
            type="button"
            id={`course-faqs-tab-${course.id}`}
            className={`${styles.tabBtn} ${activeTab === "faqs" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("faqs")}
            role="tab"
            aria-selected={activeTab === "faqs"}
            aria-controls={`course-faqs-panel-${course.id}`}
          >
            {t("faqs")}
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "overview" && (
            <section
              id={`course-overview-panel-${course.id}`}
              className={styles.overviewSection}
              role="tabpanel"
              aria-labelledby={`course-overview-tab-${course.id}`}
            >
              <h3>{t("about-this-course")}</h3>
              <p className={styles.description}>{course.description}</p>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <IoBookOutline size={20} aria-hidden="true" />
                  <span>{formatCount("course-lesson-count", lessonCount)}</span>
                </div>
                <div className={styles.statBox}>
                  <IoTimeOutline size={20} aria-hidden="true" />
                  <span>
                    {formatCount("course-duration-minutes", duration)}
                  </span>
                </div>
                <div className={styles.statBox}>
                  <IoLayersOutline size={20} aria-hidden="true" />
                  <span>
                    {formatCount("course-section-count", sectionCount)}
                  </span>
                </div>
              </div>

              <h3>{t("tags")}</h3>
              {course.tags?.length > 0 ? (
                <div className={styles.tagsFlex}>
                  {course.tags.map((tag) => (
                    <span key={tag.id} className={styles.tagBadge}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={styles.inlineState}>{t("course-has-no-tags")}</p>
              )}
            </section>
          )}

          {activeTab === "curriculum" && (
            <section
              id={`course-curriculum-panel-${course.id}`}
              className={styles.curriculumSection}
              role="tabpanel"
              aria-labelledby={`course-curriculum-tab-${course.id}`}
            >
              <div className={styles.lockNotice}>
                <p>
                  {isPaidCourse
                    ? t("paid-course-preview-notice")
                    : t(
                        "you-must-enroll-in-this-course-to-access-the-internal-lesson-contents-and-videos",
                      )}
                </p>
              </div>

              {previewLesson && (
                <div className={styles.previewPanel}>
                  <div className={styles.previewHeader}>
                    <div>
                      <span>{t("course-preview")}</span>
                      <strong>{previewLesson.title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewLesson(null)}
                      aria-label={t("close-lesson-preview")}
                    >
                      <IoCloseOutline aria-hidden="true" />
                    </button>
                  </div>
                  <div className={styles.previewVideoWrapper}>
                    <VideoContent
                      key={previewLesson.id}
                      activeLesson={previewLesson}
                      showLessonNavigation={false}
                    />
                  </div>
                </div>
              )}

              {isLoadingSections ? (
                <p className={styles.inlineState} role="status">
                  {t("loading-sections")}
                </p>
              ) : sectionsError ? (
                <div className={styles.errorState} role="alert">
                  <span>{sectionsError}</span>
                  <button type="button" onClick={retrySections}>
                    {t("try-again")}
                  </button>
                </div>
              ) : sections.length > 0 ? (
                sections.map((section) => (
                  <CourseSectionItem
                    key={section.id}
                    section={section}
                    isExpanded={expandedSections[section.id]}
                    onToggle={toggleSection}
                    lessonsInfo={lessonsState[section.id]}
                    allowsPreview={
                      isPaidCourse &&
                      String(section.id) === String(firstSectionId)
                    }
                    activePreviewLessonId={previewLesson?.id}
                    onPreviewLesson={setPreviewLesson}
                  />
                ))
              ) : (
                <p className={styles.inlineState} role="status">
                  {t("no-curriculum-data-available")}
                </p>
              )}
            </section>
          )}

          {activeTab === "faqs" && (
            <section
              id={`course-faqs-panel-${course.id}`}
              className={styles.faqsSection}
              role="tabpanel"
              aria-labelledby={`course-faqs-tab-${course.id}`}
            >
              <h3>{t("frequently-asked-questions")}</h3>

              {isLoadingFaqs ? (
                <p className={styles.inlineState} role="status">
                  {t("loading-faqs")}
                </p>
              ) : faqsError ? (
                <div className={styles.errorState} role="alert">
                  <span>{faqsError}</span>
                  <button type="button" onClick={retryFaqs}>
                    {t("try-again")}
                  </button>
                </div>
              ) : faqs.length > 0 ? (
                faqs.map((faq) => <CourseFaqItem key={faq.id} faq={faq} />)
              ) : (
                <p className={styles.inlineState} role="status">
                  {t("no-faqs-available-for-this-course")}
                </p>
              )}
            </section>
          )}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.priceTag}>
            {numericPrice === 0 ? (
              <span className={styles.freeText}>{t("free-course")}</span>
            ) : (
              <span className={styles.priceText}>{formattedPrice}</span>
            )}
          </div>
          {buyError && (
            <div className={styles.buyError} role="alert">
              {buyError}
            </div>
          )}
          {!isOwnWorkspaceCourse && (
            <button
              type="button"
              className={styles.enrollBtn}
              disabled={isBuying}
              aria-busy={isBuying}
              onClick={() => onEnroll(course)}
            >
              {purchaseButtonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
