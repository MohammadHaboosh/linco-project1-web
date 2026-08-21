import {
  IoPlayCircle,
  IoTrashOutline,
  IoBookOutline,
  IoTimeOutline,
  IoPlayOutline,
} from "react-icons/io5";
import styles from "./CourseCard.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useId, useRef, useState } from "react";

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

const CourseCard = ({
  course,
  isOwner,
  onDelete,
  deleteId,
  isDeleting = false,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { demoId, departmentId } = useParams();
  const descriptionId = useId();
  const descriptionRef = useRef(null);
  const [expandedDescription, setExpandedDescription] = useState(null);
  const [hasDescriptionOverflow, setHasDescriptionOverflow] = useState(false);
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);

  const {
    id,
    title: providedTitle,
    description: providedDescription,
    image: providedImage,
    lessonsCount: providedLessonsCount,
    totalDuration: providedTotalDuration,
    views: providedViews,
    studentsCount: providedStudentsCount,
    status: providedStatus,
    lastUpdated: providedLastUpdated,
  } = course || {};

  const title = providedTitle || t("untitled-course");
  const description = providedDescription || t("no-description-provided");
  const image = providedImage || "/images/linco-logo.jpg";
  const lessonsCount = Number(providedLessonsCount) || 0;

  const rawDuration = providedTotalDuration || 0;
  const durationInSeconds = Number(rawDuration) || 0;
  const formattedDuration = formatVideoDuration(durationInSeconds);

  const views = Number(providedViews) || 0;
  const studentsCount = Number(providedStudentsCount) || 0;
  const status = providedStatus === "draft" ? "draft" : "published";
  const lastUpdated = providedLastUpdated || t("recently");
  const isDescriptionExpanded = expandedDescription === description;

  useEffect(() => {
    const descriptionElement = descriptionRef.current;
    if (!descriptionElement || isDescriptionExpanded) return undefined;

    const checkOverflow = () => {
      setHasDescriptionOverflow(
        descriptionElement.scrollHeight > descriptionElement.clientHeight + 1,
      );
    };

    const animationFrameId = requestAnimationFrame(checkOverflow);

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(descriptionElement);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [description, isDescriptionExpanded]);

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
                  onDelete(deleteId ?? id);
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

        <div className={styles.descriptionContainer}>
          <p
            id={descriptionId}
            ref={descriptionRef}
            className={`${styles.description} ${
              isDescriptionExpanded ? styles.descriptionExpanded : ""
            }`}
            title={isDescriptionExpanded ? undefined : description}
          >
            {description}
          </p>
          {hasDescriptionOverflow && (
            <button
              type="button"
              className={styles.descriptionToggle}
              aria-expanded={isDescriptionExpanded}
              aria-controls={descriptionId}
              onClick={() => {
                setExpandedDescription((currentDescription) =>
                  currentDescription === description ? null : description,
                );
              }}
            >
              {t(isDescriptionExpanded ? "show-less" : "show-more")}
            </button>
          )}
        </div>

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
              <span
                style={{
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  margin: "0 4px",
                }}
              >
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
            <div className={styles.lastUpdated}>
              {t("course-last-updated", { date: lastUpdated })}
            </div>
          </div>
        ) : (
          <div className={styles.traineeFooter}>
            <button
              type="button"
              className={styles.primaryCta}
              onClick={openCourse}
              aria-label={t("start-named-course", { title })}
            >
              {t("start-learning")}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default CourseCard;
