import {
  IoAddOutline,
  IoReorderTwoOutline,
  IoVideocamOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";
import styles from "../CourseManager.module.css";

const CurriculumTab = () => {
  return (
    <div className={styles.tabCard}>
      <div className={styles.tabHeaderFlex}>
        <div>
          <h3 className={styles.tabTitle}>Curriculum Builder</h3>
          <p className={styles.tabSubtitle}>
            Drag and drop to reorder sections and lessons.
          </p>
        </div>
        <button className={styles.primaryOutlineBtn}>
          <IoAddOutline /> New Section
        </button>
      </div>

      <div className={styles.curriculumBoard}>
        <div className={styles.curriculumSection}>
          <div className={styles.sectionHeaderBar}>
            <div className={styles.sectionTitleBlock}>
              <IoReorderTwoOutline className={styles.dragHandle} />
              <h4>Section 1: Getting Started</h4>
            </div>
            <div className={styles.actionGroup}>
              <button className={styles.ghostBtn}>
                <IoPencilOutline />
              </button>
              <button className={styles.ghostDangerBtn}>
                <IoTrashOutline />
              </button>
            </div>
          </div>

          <div className={styles.lessonList}>
            <div className={styles.lessonRow}>
              <div className={styles.lessonInfo}>
                <IoReorderTwoOutline className={styles.dragHandle} />
                <div className={styles.lessonIcon}>
                  <IoVideocamOutline />
                </div>
                <span className={styles.lessonName}>
                  1. Introduction to the platform
                </span>
              </div>
              <span className={styles.durationBadge}>05:30</span>
            </div>
            <button className={styles.addLessonBtn}>
              <IoAddOutline /> Add Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumTab;
