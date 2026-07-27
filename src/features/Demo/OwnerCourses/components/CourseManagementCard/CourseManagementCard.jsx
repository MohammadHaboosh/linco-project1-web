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
          {course.tags?.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag.name}
            </span>
          ))}
        </div>

        <h3 className={styles.title} title={course.title}>
          {course.title}
        </h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <IoListOutline className={styles.statIcon} />
            <span>
              {course.stats.sections} {t("sections")}
            </span>
          </div>
          <div className={styles.statItem}>
            <IoVideocamOutline className={styles.statIcon} />
            <span>
              {course.stats.lessons} {t("lessons")}
            </span>
          </div>
          <div className={styles.statItem}>
            <IoHelpCircleOutline className={styles.statIcon} />
            <span>
              {course.stats.quizzes} {t("quizzes")}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(course.assetId)}
        >
          <IoCreateOutline /> {t("edit")}
        </button>
        <button
          className={`${styles.publishBtn} ${course.isPublished ? styles.publishedBtn : ""}`}
          onClick={() => !course.isPublished && onPublish(course.id)}
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
