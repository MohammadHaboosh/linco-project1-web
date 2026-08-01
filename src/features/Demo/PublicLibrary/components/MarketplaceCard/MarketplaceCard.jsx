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

const MarketplaceCard = ({ course, onViewDetails }) => {
  const { t } = useTranslation();

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
    <div className={styles.card} onClick={onViewDetails}>
      <div className={styles.imageWrapper}>
        <img
          src={course.imagePath}
          alt={course.title}
          className={styles.coverImage}
        />
        <div className={styles.imageOverlay}></div>

        <div
          className={`${styles.priceBadge} ${course.price === 0 ? styles.freeBadge : styles.paidBadge}`}
        >
          {course.price === 0 ? t("free") : `$${course.price}`}
        </div>

        <div className={`${styles.privacyBadge} ${styles.public}`}>
          <IoGlobeOutline /> {t("public")}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <div className={styles.companyInfo}>
            <IoBusinessOutline className={styles.metaIcon} />
            <span className={styles.companyText}>{course.demo?.name}</span>
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
            <span title="Lessons">
              <IoBookOutline /> {course.lessonCount} lessons
            </span>
            <span title="Duration">
              <IoTimeOutline /> {course.totalDuration}m
            </span>
          </div>

          <div className={styles.actionArea}>
            <button
              className={styles.buyBtn}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              title={course.price === 0 ? "Enroll Free" : "Purchase Course"}
            >
              {course.price === 0 ? <IoDownloadOutline /> : <IoCartOutline />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;
