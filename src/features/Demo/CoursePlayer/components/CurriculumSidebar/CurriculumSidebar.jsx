import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CurriculumSidebar.module.css";
import {
  IoAlertCircleOutline,
  IoChevronDown,
  IoPlay,
  IoRibbonOutline,
  IoTimeOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { useCourseSections } from "../../hooks/useCourseSections";
import { useSectionLessons } from "../../hooks/useSectionLessons";
import { useTranslation } from "react-i18next";

const SectionItem = ({ section, index, activeLesson, onSelectLesson }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { lessons, isLoading, error } = useSectionLessons(
    section.id,
    isExpanded,
  );
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const sectionNumberFormatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const lessonListId = `course-section-${section.id}-lessons`;

  return (
    <section
      className={`${styles.chapterCard} ${isExpanded ? styles.expanded : ""}`}
    >
      <button
        type="button"
        className={styles.chapterHeader}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        aria-controls={lessonListId}
      >
        <span className={styles.chapterNumber} aria-hidden="true">
          {sectionNumberFormatter.format(index + 1)}
        </span>
        <span className={styles.chapterInfo}>
          <strong>{section.title}</strong>
        </span>
        <IoChevronDown className={styles.chevron} aria-hidden="true" />
      </button>

      {isExpanded && (
        <div className={styles.lessonList} id={lessonListId}>
          {isLoading ? (
            <div
              className={styles.statusContainer}
              role="status"
              aria-live="polite"
            >
              <div className={styles.loader} aria-hidden="true" />
              <p>{t("loading-lessons")}</p>
            </div>
          ) : error ? (
            <div className={styles.statusContainer} role="alert">
              <IoAlertCircleOutline
                className={styles.statusErrorIcon}
                aria-hidden="true"
              />
              <p className={styles.errorText}>
                {t("course-player-section-content-load-failed")}
              </p>
            </div>
          ) : lessons.length === 0 ? (
            <div className={styles.statusContainer} role="status">
              <p>{t("no-lessons-available")}</p>
            </div>
          ) : (
            lessons.map((lesson, lessonIndex) => {
              const isActive = activeLesson?.id === lesson.id;
              const duration = Number(
                lesson.isQuiz ? lesson.durationMinutes : lesson.duration,
              );
              const durationCount = Number.isFinite(duration) ? duration : 0;
              const durationKey = lesson.isQuiz
                ? "quiz-duration-minutes"
                : "lesson-duration-minutes";

              return (
                <button
                  type="button"
                  key={lesson.id}
                  className={`${styles.lessonItem} ${isActive ? styles.selected : ""}`}
                  onClick={() => onSelectLesson(lesson, lessons)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.lessonStatus} aria-hidden="true">
                    {lesson.isQuiz ? <IoTrophyOutline /> : <IoPlay />}
                  </span>
                  <span className={styles.lessonBody}>
                    <span className={styles.lessonTitle}>
                      {lesson.isQuiz
                        ? lesson.title
                        : t("lesson-list-item-title", {
                            number: numberFormatter.format(lessonIndex + 1),
                            title: lesson.title,
                          })}
                    </span>
                    <span className={styles.lessonMeta}>
                      <span>
                        <IoTimeOutline aria-hidden="true" />
                        {t(durationKey, {
                          count: durationCount,
                          formattedCount: numberFormatter.format(durationCount),
                        })}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

const CurriculumSidebar = ({ activeLesson, onSelectLesson }) => {
  const { courseId } = useParams();
  const { sections, isLoading, error } = useCourseSections(courseId);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className={styles.statusContainer} role="status" aria-live="polite">
        <div className={styles.loader} aria-hidden="true" />
        <p>{t("course-player-loading-curriculum")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statusContainer} role="alert">
        <IoAlertCircleOutline
          className={styles.statusErrorIcon}
          aria-hidden="true"
        />
        <p className={styles.errorText}>
          {t("course-player-curriculum-load-failed")}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.curriculum}>
      <div className={styles.chapterList}>
        {sections.length === 0 ? (
          <div className={styles.statusContainer} role="status">
            <p>{t("no-sections-available-yet")}</p>
          </div>
        ) : (
          sections.map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              index={index}
              activeLesson={activeLesson}
              onSelectLesson={onSelectLesson}
            />
          ))
        )}
      </div>

      <div className={styles.certificate}>
        <span className={styles.certificateIcon} aria-hidden="true">
          <IoRibbonOutline />
        </span>
        <span className={styles.certificateText}>
          <strong>{t("course-player-certificate")}</strong>
          <small>{t("course-player-certificate-description")}</small>
        </span>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
