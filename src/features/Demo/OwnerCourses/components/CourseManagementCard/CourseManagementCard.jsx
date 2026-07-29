import {
  IoAddOutline,
  IoCreateOutline,
  IoCloudUploadOutline,
  IoListOutline,
  IoVideocamOutline,
  IoHelpCircleOutline,
  IoCheckmarkCircleOutline,
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
  onPublish,
  onAddNew,
}) => {
  const { t } = useTranslation();

  if (isAddNew) {
    return (
      <div className={styles.addNewCard} onClick={onAddNew}>
        <div className={styles.addCircle}>
          <IoAddOutline className={styles.addIcon} />
        </div>
        <h3>{t("create-new-course")}</h3>
        <p>{t("build-a-new-curriculum-from-scratch")}</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.courseImage}
        />
        <div className={styles.imageOverlay}></div>
        {course.isPublished && (
          <div className={styles.publishedBadge}>
            <IoCheckmarkCircleOutline /> {t("published")}
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
            <IoListOutline className={styles.statIcon} />
            <span>
              {course.stats?.sections || 0} {t("sections")}
            </span>
          </div>
          <div className={styles.statItem}>
            <IoVideocamOutline className={styles.statIcon} />
            <span>
              {course.stats?.lessons || 0} {t("lessons")}
            </span>
          </div>
          <div className={styles.statItem}>
            <IoHelpCircleOutline className={styles.statIcon} />
            <span>
              {course.stats?.quizzes || 0} {t("quizzes")}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.editBtn} onClick={onEdit}>
          <IoCreateOutline /> {t("edit")}
        </button>
        <button
          className={`${styles.publishBtn} ${course.isPublished ? styles.publishedBtn : ""}`}
          onClick={onPublish}
          disabled={course.isPublished}
        >
          <IoCloudUploadOutline />{" "}
          {course.isPublished ? t("in-library") : t("publish")}
        </button>
      </div>
    </div>
  );
};

export default CourseManagementCard;
