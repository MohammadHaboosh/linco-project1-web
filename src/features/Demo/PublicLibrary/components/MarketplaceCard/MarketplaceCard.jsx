import {
  IoCartOutline,
  IoGlobeOutline,
  IoBusinessOutline,
  IoTimeOutline,
  IoBookOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import styles from "./MarketplaceCard.module.css";
import { useTranslation } from "react-i18next";
import { useDemo } from "../../../../../hooks/useDemo";

const MarketplaceCard = ({ course, onViewDetails }) => {
  const { t, i18n } = useTranslation();
  const { demoId } = useDemo();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numericPrice = Number(course.price) || 0;
  const lessonCount = Number(course.lessonCount) || 0;
  const duration = Number(course.totalDuration) || 0;
  const formattedLessonCount = new Intl.NumberFormat(locale).format(lessonCount);
  const formattedDuration = new Intl.NumberFormat(locale).format(duration);
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);

  const isOwnDemoCourse =
    String(course.demo?.id) === String(demoId) ||
    String(course.demoId) === String(demoId);

  const tagColorClasses = [
    styles.tagBlue,
    styles.tagGreen,
    styles.tagPurple,
    styles.tagOrange,
    styles.tagPink,
  ];

  const getTagColor = (index) =>
    tagColorClasses[index % tagColorClasses.length];

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardDetailsButton}
        onClick={onViewDetails}
        aria-label={t("view-course-details", { title: course.title })}
      />
      <div className={styles.imageWrapper}>
        <img
          src={course.imagePath}
          alt={t("course-thumbnail-alt", { courseTitle: course.title })}
          className={styles.coverImage}
        />
        <div className={styles.imageOverlay}></div>

        <div
          className={`${styles.priceBadge} ${numericPrice === 0 ? styles.freeBadge : styles.paidBadge}`}
        >
          {numericPrice === 0 ? t("free") : formattedPrice}
        </div>

        <div className={`${styles.privacyBadge} ${styles.public}`}>
          <IoGlobeOutline /> {t("public")}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <div className={styles.companyInfo}>
            <IoBusinessOutline className={styles.metaIcon} />
            <span className={styles.companyText}>
              {course.demo?.name || t("unknown-workspace")}
            </span>
          </div>
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.tagsContainer}>
          {course.tags?.map((tag, index) => (
            <span
              key={tag.id || index}
              className={`${styles.tag} ${getTagColor(index)}`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.footerRow}>
          <div className={styles.courseStats}>
            <span title={t("lessons")}>
              <IoBookOutline />
              {t("course-lesson-count", {
                count: lessonCount,
                formattedCount: formattedLessonCount,
              })}
            </span>
            <span title={t("course-duration")}>
              <IoTimeOutline />
              {t("course-duration-minutes", {
                count: duration,
                formattedCount: formattedDuration,
              })}
            </span>
          </div>

          <div className={styles.actionArea}>
            {!isOwnDemoCourse && (
              <button
                type="button"
                className={styles.buyBtn}
                onClick={() => {
                  onViewDetails();
                }}
                title={
                  numericPrice === 0
                    ? t("enroll-for-free")
                    : t("purchase-course")
                }
                aria-label={
                  numericPrice === 0
                    ? t("enroll-in-named-course-for-free", {
                        title: course.title,
                      })
                    : t("purchase-named-course", { title: course.title })
                }
              >
                {numericPrice === 0 ? (
                  <IoDownloadOutline />
                ) : (
                  <IoCartOutline />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default MarketplaceCard;
