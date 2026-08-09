import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./CurriculumSidebar.module.css";
import {
  IoChevronDown,
  IoTrophyOutline,
  IoRibbonOutline,
} from "react-icons/io5";
import { useCourseSections } from "../../hooks/useCourseSections"; // استدعاء الـ Hook الجديد
import { useTranslation } from "react-i18next";

const CurriculumSidebar = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const { sections, isLoading, error } = useCourseSections(courseId);

  const [expanded, setExpanded] = useState([]);

  const toggleChapter = (id) => {
    setExpanded((curr) =>
      curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id],
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
            <p>{t("no-sections-available-yet")}</p>
          </div>
        ) : (
          sections.map((section, index) => {
            const isExpanded = expanded.includes(section.id);

            return (
              <section
                key={section.id}
                className={`${styles.chapterCard} ${isExpanded ? styles.expanded : ""}`}
              >
                <button
                  className={styles.chapterHeader}
                  onClick={() => toggleChapter(section.id)}
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
                    <div className={styles.lessonsPlaceholder}>
                      Loading lessons...{" "}
                    </div>
                  </div>
                )}
              </section>
            );
          })
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
