import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronDown,
  IoTrophyOutline,
  IoRibbonOutline,
  IoPlay,
  IoTimeOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { useCourseSections } from "../../hooks/useCourseSections";
import { useSectionLessons } from "../../hooks/useSectionLessons";
import { useTranslation } from "react-i18next";

const CurriculumSidebar = ({ activeLesson, onSelectLesson }) => {
  const { courseId } = useParams();
  const { sections, isLoading, error } = useCourseSections(courseId);
  const { t } = useTranslation();
  const SectionItem = ({ section, index, activeLesson, onSelectLesson }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const { lessons, isLoading, error } = useSectionLessons(
      section.id,
      isExpanded,
    );

    return (
      <section
        className={`${styles.chapterCard} ${isExpanded ? styles.expanded : ""}`}
      >
        <button
          className={styles.chapterHeader}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className={styles.chapterNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={styles.chapterInfo}>
            <strong>{section.title}</strong>
          </span>
          <IoChevronDown className={styles.chevron} />
        </button>

        {isExpanded && (
          <div className={styles.lessonList}>
            {isLoading ? (
              <div className={styles.statusContainer}>
                <div className={styles.loader}></div>
                <p>{t("loading-lessons")}</p>
              </div>
            ) : error ? (
              <div className={styles.statusContainer}>
                <IoAlertCircleOutline
                  style={{ fontSize: "1.5rem", color: "#ef4444" }}
                />
                <p className={styles.errorText}>{error}</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className={styles.statusContainer}>
                <p>{t("no-lessons-available")}</p>
              </div>
            ) : (
              lessons.map((lesson, lIndex) => {
                const isActive = activeLesson?.id === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    className={`${styles.lessonItem} ${isActive ? styles.selected : ""}`}
                    onClick={() => onSelectLesson(lesson, lessons)}
                  >
                    <span className={styles.lessonStatus}>
                      <IoPlay />
                    </span>
                    <span className={styles.lessonBody}>
                      <span className={styles.lessonTitle}>
                        {lIndex + 1}. {lesson.title}
                      </span>
                      <span className={styles.lessonMeta}>
                        <span>
                          <IoTimeOutline /> {lesson.duration || 0} min
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
  if (isLoading) {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.loader}></div>
        <p>Loading curriculum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.statusContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.curriculum}>
      <div className={styles.chapterList}>
        {sections.length === 0 ? (
          <div className={styles.statusContainer}>
            <p>No sections available yet.</p>
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

      <button className={styles.finalAssessment}>
        <span className={styles.finalIcon}>
          <IoTrophyOutline />
        </span>
        <span>
          <strong>Final Assessment</strong>
          <small>Unlock after completing all lessons</small>
        </span>
      </button>

      <div className={styles.certificate}>
        <span className={styles.certificateIcon}>
          <IoRibbonOutline />
        </span>
        <span>
          <strong>Certificate</strong>
          <small>Issued when you pass the final assessment</small>
        </span>
      </div>
    </div>
  );
};

export default CurriculumSidebar;
