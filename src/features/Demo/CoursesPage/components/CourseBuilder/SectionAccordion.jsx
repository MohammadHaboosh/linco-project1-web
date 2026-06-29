import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoReorderTwoOutline,
  IoVideocamOutline,
  IoTimeOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./CourseBuilder.module.css";
import { useTranslation } from "react-i18next";

const SectionAccordion = ({
  section,
  sIndex,
  onToggle,
  onUpdateTitle,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.accordionCard}>
      <div className={styles.accordionHeader}>
        <div className={styles.accordionTitleArea}>
          <button className={styles.collapseBtn} onClick={onToggle}>
            {section.isExpanded ? (
              <IoChevronUpOutline />
            ) : (
              <IoChevronDownOutline />
            )}
          </button>
          <span className={styles.sectionPrefix}>
            {t("section")} {sIndex + 1}:
          </span>
          <input
            type="text"
            className={styles.sectionTitleInput}
            value={section.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
          />
        </div>
        <button className={styles.iconBtnDanger} onClick={onDelete}>
          <IoTrashOutline />
        </button>
      </div>

      {section.isExpanded && (
        <div className={styles.accordionBody}>
          {section.lessons.map((lesson, lIndex) => (
            <div key={lesson.id} className={styles.lessonItem}>
              <div className={styles.lessonInfo}>
                <IoReorderTwoOutline className={styles.dragHandle} />
                <span className={styles.lessonNumber}>
                  {t("lesson")} {lIndex + 1}:
                </span>
                <IoVideocamOutline className={styles.lessonTypeIcon} />
                <span className={styles.lessonTitle}>{lesson.title}</span>
              </div>
              <div className={styles.lessonMeta}>
                <span className={styles.lessonDuration}>
                  <IoTimeOutline /> {lesson.duration || "0:00"}
                </span>
                <button
                  className={styles.iconBtn}
                  onClick={() => onEditLesson(lIndex, lesson)}
                >
                  <IoPencilOutline />
                </button>
                <button
                  className={styles.iconBtnDanger}
                  onClick={() => onDeleteLesson(lIndex)}
                >
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
          <button className={styles.addLessonBtn} onClick={onAddLesson}>
            <IoAddCircleOutline /> {t("add-lesson")}
          </button>
        </div>
      )}
    </div>
  );
};
export default SectionAccordion;
