import {
  IoCheckmark,
  IoTrashOutline,
  IoSwapHorizontalOutline,
  IoPlayOutline,
  IoLockClosed,
} from "react-icons/io5";
import styles from "./LearningPath.module.css";
import { useTranslation } from "react-i18next";

const PathStepCard = ({ course, index, role, onDelete, onReplace }) => {
  const { t } = useTranslation();
  const isManager = role === "owner" || role === "admin";
  const isCompleted = role === "member" && course.status === "completed";
  const isLocked = role === "member" && course.status === "locked";

  return (
    <div
      className={`${styles.stepWrapper} ${isCompleted ? styles.stepCompleted : ""} ${isLocked ? styles.stepLocked : ""}`}
    >
      <div className={styles.timelineNode}>
        {isCompleted ? <IoCheckmark /> : <span>{index + 1}</span>}
      </div>

      <div className={styles.stepCard}>
        <div className={styles.cardImageArea}>
          <img
            src={course.thumbnail}
            alt={course.title}
            className={styles.thumbnail}
          />
          {isLocked && (
            <div className={styles.lockedOverlay}>
              <IoLockClosed />
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <p className={styles.courseDesc}>{course.desc}</p>

          {!isManager && (
            <span
              className={`${styles.statusBadge} ${isCompleted ? styles.badgeGreen : styles.badgeBlue}`}
            >
              {isCompleted
                ? t("completed")
                : course.status === "in-progress"
                  ? t("in-progress")
                  : t("locked")}
            </span>
          )}
        </div>

        <div className={styles.cardActions}>
          {isManager ? (
            <>
              <button
                className={styles.actionBtn}
                onClick={onReplace}
                title={t("replace-course")}
              >
                <IoSwapHorizontalOutline /> {t("replace")}
              </button>
              <button
                className={styles.actionBtnDanger}
                onClick={onDelete}
                title={t("remove-from-path")}
              >
                <IoTrashOutline /> {t("remove")}
              </button>
            </>
          ) : (
            <button className={styles.startBtn} disabled={isLocked}>
              <IoPlayOutline /> {isCompleted ? t("review") : t("start-course")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathStepCard;
