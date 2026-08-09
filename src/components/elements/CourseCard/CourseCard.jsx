import {
  IoPlayCircle,
  IoTrashOutline,
  IoEyeOutline,
  IoBookOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoPlayOutline,
} from "react-icons/io5";
import styles from "./CourseCard.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../../../hooks/useDemo";
import { PATHS } from "../../../routes/paths";

const CourseCard = ({ course, isOwner, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    id,
    title = "Untitled Course",
    description = "No description provided.",
    image = "/images/linco-logo.jpg",
    lessonsCount = 0,
    duration = "0h 0m",
    progress = 0,
    views = 0,
    studentsCount = 0,
    status = "published",
    lastUpdated = "Recently",
  } = course || {};

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.coverImage} />

        {!isOwner ? (
          <div className={styles.playOverlay}>
            <IoPlayCircle className={styles.playIcon} />
          </div>
        ) : (
          <div className={`${styles.statusBadge} ${styles[status]}`}>
            {status === "draft" ? t("draft") : t("published")}
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.header}>
          <h3 className={styles.title} title={title}>
            {title}
          </h3>

          {isOwner && (
            <div className={styles.adminActions}>
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                title={t("delete-course")}
              >
                <IoTrashOutline />
              </button>
            </div>
          )}
        </div>

        <p className={styles.description} title={description}>
          {description}
        </p>

        <div className={styles.metaContainer}>
          <div className={styles.metaTags}>
            <span className={styles.tag}>
              <IoBookOutline /> {lessonsCount} {t("lessons")}
            </span>
            <span className={styles.tag}>
              <IoTimeOutline /> {duration}
            </span>
          </div>

          {isOwner && (
            <button
              className={styles.watchBtnOwner}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`../${PATHS.COURSE_PLAYER}/${id}`);
              }}
              title={t("watch-course")}
            >
              <IoPlayOutline /> {t("watch")}
            </button>
          )}
        </div>

        <div className={styles.spacer}></div>

        {isOwner ? (
          <div className={styles.ownerFooter}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <IoEyeOutline />{" "}
                <span>
                  {views} {t("views")}
                </span>
              </div>
              <div className={styles.statItem}>
                <IoPeopleOutline />{" "}
                <span>
                  {studentsCount} {t("students")}
                </span>
              </div>
            </div>
            <div className={styles.lastUpdated}>
              {t("last-updated")}: {lastUpdated}
            </div>
          </div>
        ) : (
          <div className={styles.traineeFooter}>
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>
                  {t("progress", "Progress")}
                </span>
                <span className={styles.progressValue}>{progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <button
              className={styles.primaryCta}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`${PATHS.COURSE_PLAYER.replace(":courseId", id)}`);
              }}
            >
              {progress > 0 ? t("continue-learning") : t("start-learning")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
