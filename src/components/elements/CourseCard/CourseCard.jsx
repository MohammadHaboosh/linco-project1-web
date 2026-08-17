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
import { useNavigate, useParams } from "react-router-dom";

const formatVideoDuration = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) return "00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const CourseCard = ({ course, isOwner, onDelete, isDeleting = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { demoId, departmentId } = useParams();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const percentFormatter = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  const {
    id,
    title: providedTitle,
    description: providedDescription,
    image: providedImage,
    lessonsCount: providedLessonsCount,
    duration: providedDuration,
    progress: providedProgress,
    views: providedViews,
    studentsCount: providedStudentsCount,
    status: providedStatus,
    lastUpdated: providedLastUpdated,
  } = course || {};

  const title = providedTitle || t("untitled-course");
  const description = providedDescription || t("no-description-provided");
  const image = providedImage || "/images/linco-logo.jpg";
  const lessonsCount = Number(providedLessonsCount) || 0;

  const durationInSeconds = Number(providedDuration) || 0;
  const formattedDuration = formatVideoDuration(durationInSeconds);

  const progress = Math.min(100, Math.max(0, Number(providedProgress) || 0));
  const views = Number(providedViews) || 0;
  const studentsCount = Number(providedStudentsCount) || 0;
  const status = providedStatus === "draft" ? "draft" : "published";
  const lastUpdated = providedLastUpdated || t("recently");
  const formattedProgress = percentFormatter.format(progress / 100);

  const openCourse = () => {
    navigate(
      `/demos/${demoId}/departments/${departmentId}/course-player/${id}`,
      { state: { courseData: course } },
    );
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={t("course-cover-alt", { title })}
          className={styles.coverImage}
        />

        {!isOwner ? (
          <div className={styles.playOverlay}>
            <IoPlayCircle className={styles.playIcon} aria-hidden="true" />
          </div>
        ) : (
          <span className={`${styles.statusBadge} ${styles[status]}`}>
            {status === "draft" ? t("draft") : t("published")}
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.header}>
          <h3 className={styles.title} title={title}>
            {title}
          </h3>

          {isOwner && onDelete && (
            <div className={styles.adminActions}>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                title={t(
                  isDeleting
                    ? "removing-named-course-from-department"
                    : "remove-named-course-from-department",
                  { title },
                )}
                aria-label={t(
                  isDeleting
                    ? "removing-named-course-from-department"
                    : "remove-named-course-from-department",
                  { title },
                )}
                disabled={isDeleting}
                aria-busy={isDeleting}
              >
                <IoTrashOutline aria-hidden="true" />
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
              <IoBookOutline aria-hidden="true" />
              {t("course-lesson-count", {
                count: lessonsCount,
                formattedCount: numberFormatter.format(lessonsCount),
              })}
            </span>
            <span className={styles.tag}>
              <IoTimeOutline aria-hidden="true" />
              <span style={{ fontWeight: "600", letterSpacing: "0.5px" }}>
                {formattedDuration}
              </span>
            </span>
          </div>

          {isOwner && (
            <button
              type="button"
              className={styles.watchBtnOwner}
              onClick={openCourse}
              title={t("watch-named-course", { title })}
              aria-label={t("watch-named-course", { title })}
            >
              <IoPlayOutline aria-hidden="true" /> {t("watch")}
            </button>
          )}
        </div>

        <div className={styles.spacer}></div>

        {isOwner ? (
          <div className={styles.ownerFooter}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <IoEyeOutline aria-hidden="true" />
                <span>
                  {t("course-view-count", {
                    count: views,
                    formattedCount: numberFormatter.format(views),
                  })}
                </span>
              </div>
              <div className={styles.statItem}>
                <IoPeopleOutline aria-hidden="true" />
                <span>
                  {t("course-student-count", {
                    count: studentsCount,
                    formattedCount: numberFormatter.format(studentsCount),
                  })}
                </span>
              </div>
            </div>
            <div className={styles.lastUpdated}>
              {t("course-last-updated", { date: lastUpdated })}
            </div>
          </div>
        ) : (
          <div className={styles.traineeFooter}>
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>{t("progress")}</span>
                <span className={styles.progressValue}>
                  {formattedProgress}
                </span>
              </div>
              <div
                className={styles.progressBar}
                role="progressbar"
                aria-label={t("course-progress-label", { title })}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={openCourse}
              aria-label={t(
                progress > 0 ? "continue-named-course" : "start-named-course",
                { title },
              )}
            >
              {progress > 0 ? t("continue-learning") : t("start-learning")}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default CourseCard;
