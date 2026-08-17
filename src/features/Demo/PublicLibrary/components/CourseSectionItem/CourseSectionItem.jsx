import {
  IoLayersOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoPlayOutline,
} from "react-icons/io5";
import styles from "./CourseSectionItem.module.css";
import { useTranslation } from "react-i18next";

const CourseSectionItem = ({
  section,
  isExpanded,
  onToggle,
  lessonsInfo,
  allowsPreview,
  activePreviewLessonId,
  onPreviewLesson,
}) => {
  const { t, i18n } = useTranslation();

  const { data: lessons, error, isLoading } = lessonsInfo || {};
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const formattedSectionOrder = new Intl.NumberFormat(locale).format(
    Number(section.order) || 0,
  );
  const lessonsId = `course-section-lessons-${section.id}`;

  return (
    <div className={styles.sectionItem}>
      <button
        type="button"
        className={styles.sectionHeader}
        onClick={() => onToggle(section.id)}
        aria-expanded={Boolean(isExpanded)}
        aria-controls={lessonsId}
      >
        <div className={styles.headerLeft}>
          <IoLayersOutline />
          <span>
            {t("course-section-title", {
              order: formattedSectionOrder,
              title: section.title,
            })}
          </span>
        </div>
        <div className={styles.iconWrapper}>
          {isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
      </button>

      {isExpanded && (
        <div id={lessonsId} className={styles.lessonsContainer}>
          {isLoading ? (
            <p className={styles.statusText} role="status">
              {t("loading-lessons")}
            </p>
          ) : error ? (
            <p className={styles.errorText} role="alert">
              {error}
            </p>
          ) : lessons?.length > 0 ? (
            <ul className={styles.lessonsList}>
              {lessons.map((lesson, lessonIndex) => {
                const isPreviewLesson = allowsPreview && lessonIndex < 2;
                const lessonTitle = t("course-lesson-title", {
                  order: new Intl.NumberFormat(locale).format(
                    Number(lesson.order) || 0,
                  ),
                  title: lesson.title,
                });
                const isActivePreview =
                  isPreviewLesson &&
                  String(activePreviewLessonId) === String(lesson.id);

                return (
                  <li key={lesson.id} className={styles.lessonItem}>
                    {isPreviewLesson ? (
                      <button
                        type="button"
                        className={`${styles.lessonButton} ${isActivePreview ? styles.activePreview : ""}`}
                        onClick={() => onPreviewLesson(lesson)}
                        aria-pressed={isActivePreview}
                        aria-label={t("preview-named-lesson", {
                          title: lesson.title,
                        })}
                      >
                        <span>{lessonTitle}</span>
                        <span className={styles.previewTag}>
                          <IoPlayOutline aria-hidden="true" />
                          {t("free-preview")}
                        </span>
                      </button>
                    ) : (
                      <div className={styles.lockedLesson}>
                        <span>{lessonTitle}</span>
                        <span className={styles.lockTag}>{t("locked")}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.statusText}>
              {t("no-lessons-in-this-section")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSectionItem;
