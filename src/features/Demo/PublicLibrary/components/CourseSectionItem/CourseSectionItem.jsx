import {
  IoLayersOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
} from "react-icons/io5";
import styles from "./CourseSectionItem.module.css";
import { useTranslation } from "react-i18next";

const CourseSectionItem = ({ section, isExpanded, onToggle, lessonsInfo }) => {
  const { t } = useTranslation();

  const { data: lessons, isLoading } = lessonsInfo || {};

  return (
    <div className={styles.sectionItem}>
      <div
        className={styles.sectionHeader}
        onClick={() => onToggle(section.id)}
      >
        <div className={styles.headerLeft}>
          <IoLayersOutline />
          <span>
            {t("section")} {section.order}: {section.title}
          </span>
        </div>
        <div className={styles.iconWrapper}>
          {isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </div>
      </div>

      {isExpanded && (
        <div className={styles.lessonsContainer}>
          {isLoading ? (
            <p className={styles.statusText}>{t("loading-lessons")}</p>
          ) : lessons?.length > 0 ? (
            <ul className={styles.lessonsList}>
              {lessons.map((lesson) => (
                <li key={lesson.id} className={styles.lessonItem}>
                  <span>
                    {lesson.order}. {lesson.title}
                  </span>
                  <span className={styles.lockTag}>{t("locked")}</span>
                </li>
              ))}
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
