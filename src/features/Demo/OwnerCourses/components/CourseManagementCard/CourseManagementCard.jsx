import {
  IoAddOutline,
  IoCreateOutline,
  IoCloudUploadOutline,
  IoListOutline,
  IoVideocamOutline,
  IoHelpCircleOutline,
  IoCheckmarkCircleOutline,
  IoSettingsOutline,
  IoEyeOutline,
} from "react-icons/io5";
import styles from "./CourseManagementCard.module.css";
import { useTranslation } from "react-i18next";

const PASTEL_COLORS = [
  { bg: "#eff6ff", color: "#1a56db" },
  { bg: "#ecfdf5", color: "#059669" },
  { bg: "#fef2f2", color: "#dc2626" },
  { bg: "#fffbeb", color: "#d97706" },
  { bg: "#faf5ff", color: "#4f46e5" },
  { bg: "#fdf4ff", color: "#9333ea" },
  { bg: "#f0fdf4", color: "#16a34a" },
];

const getTagStyle = (tagName) => {
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PASTEL_COLORS[Math.abs(hash) % PASTEL_COLORS.length];
};

const CourseManagementCard = ({
  isAddNew,
  course,
  onEdit,
  onView,
  onPublish,
  onAddNew,
  onEditSettings,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const formatCount = (count) => new Intl.NumberFormat(locale).format(count);
  const canManageCourse = course?.accessMethod === "CREATED";

  if (isAddNew) {
    return (
      <button type="button" className={styles.addNewCard} onClick={onAddNew}>
        <div className={styles.addCircle}>
          <IoAddOutline className={styles.addIcon} />
        </div>
        <h3>{t("create-new-course")}</h3>
        <p>{t("build-a-new-curriculum-from-scratch")}</p>
      </button>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={course.imagePath}
          alt={t("course-thumbnail-alt", { courseTitle: course.title })}
          className={styles.courseImage}
        />
        <div className={styles.imageOverlay}></div>
        {course.isPublished && (
          <div className={styles.publishedBadge}>
            <IoCheckmarkCircleOutline aria-hidden="true" /> {t("published")}
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.tagsRow}>
          {course.tags?.map((tag) => {
            const tagId = tag.id || tag;
            const tagName = tag.name || tag;
            const tagStyle = getTagStyle
              ? getTagStyle(tagName)
              : { bg: "#f0f2f5", color: "#333" };

            return (
              <span
                key={tagId}
                className={styles.tag}
                style={{ backgroundColor: tagStyle.bg, color: tagStyle.color }}
              >
                {tagName}
              </span>
            );
          })}
        </div>

        <h3 className={styles.title} title={course.title}>
          {course.title}
        </h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <IoListOutline className={styles.statIcon} aria-hidden="true" />
            <span>
              {t("course-section-count", {
                count: course.sectionsCount || 0,
                formattedCount: formatCount(course.sectionsCount || 0),
              })}
            </span>
          </div>
          <div className={styles.statItem}>
            <IoVideocamOutline
              className={styles.statIcon}
              aria-hidden="true"
            />
            <span>
              {t("course-lesson-count", {
                count: course.lessonCount || 0,
                formattedCount: formatCount(course.lessonCount || 0),
              })}
            </span>
          </div>
          <div className={styles.statItem}>
            <IoHelpCircleOutline
              className={styles.statIcon}
              aria-hidden="true"
            />
            <span>
              {t("course-quiz-count", {
                count: course.quizzes || course.stats?.quizzes || 0,
                formattedCount: formatCount(
                  course.quizzes || course.stats?.quizzes || 0,
                ),
              })}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {canManageCourse && !course.isPublished ? (
          <>
            <button type="button" className={styles.editBtn} onClick={onEdit}>
              <IoCreateOutline aria-hidden="true" /> {t("edit")}
            </button>
            <button
              type="button"
              className={styles.publishBtn}
              onClick={onPublish}
            >
              <IoCloudUploadOutline aria-hidden="true" /> {t("publish")}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.viewBtn}
              onClick={onView}
              aria-label={t("view-course-details", { title: course.title })}
            >
              <IoEyeOutline aria-hidden="true" /> {t("view-course")}
            </button>
            {canManageCourse && (
              <button
                type="button"
                className={styles.settingsBtn}
                onClick={() => onEditSettings(course)}
              >
                <IoSettingsOutline aria-hidden="true" /> {t("settings")}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseManagementCard;
