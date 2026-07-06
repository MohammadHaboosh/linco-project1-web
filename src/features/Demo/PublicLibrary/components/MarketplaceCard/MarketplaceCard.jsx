import {
  IoSettingsOutline,
  IoCartOutline,
  IoLockClosed,
  IoGlobeOutline,
  IoBusinessOutline,
  IoStar,
  IoPeopleOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import styles from "./MarketplaceCard.module.css";
import { useTranslation } from "react-i18next";

const MarketplaceCard = ({ course }) => {
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
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.coverImage}
        />
        <div className={styles.imageOverlay}></div>

        <div
          className={`${styles.priceBadge} ${course.price === 0 ? styles.freeBadge : styles.paidBadge}`}
        >
          {course.price === 0 ? t("free") : `$${course.price}`}
        </div>

        {course.isMyDemo && (
          <div
            className={`${styles.privacyBadge} ${course.isPrivate ? styles.private : styles.public}`}
          >
            {course.isPrivate ? (
              <>
                <IoLockClosed /> {t("private")}
              </>
            ) : (
              <>
                <IoGlobeOutline /> {t("public")}
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.metaRow}>
          <div className={styles.companyInfo}>
            <IoBusinessOutline className={styles.metaIcon} />
            <span className={styles.companyText}>{course.company}</span>
            {course.isMyDemo && (
              <span className={styles.myDemoTag}>({t("you")})</span>
            )}
          </div>
          <div className={styles.ratingInfo}>
            <IoStar className={styles.starIcon} />
            <span>{course.rating}</span>
          </div>
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.tagsContainer}>
          {course.tags?.map((tag, index) => (
            <span key={index} className={`${styles.tag} ${getTagColor(index)}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.footerRow}>
          <div className={styles.studentsInfo}>
            <IoPeopleOutline className={styles.metaIcon} />
            <span>
              {course.students.toLocaleString()} {t("users")}
            </span>
          </div>

          <div className={styles.actionArea}>
            {course.isMyDemo ? (
              <button className={styles.manageBtn} title={t("manage-asset")}>
                <IoSettingsOutline />
              </button>
            ) : (
              <button
                className={styles.buyBtn}
                title={
                  course.price === 0 ? t("get-for-free") : t("purchase-course")
                }
              >
                {course.price === 0 ? <IoDownloadOutline /> : <IoCartOutline />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;
