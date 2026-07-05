import {
  IoSettingsOutline,
  IoCartOutline,
  IoLockClosed,
  IoGlobeOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import styles from "./MarketplaceCard.module.css";
import { useTranslation } from "react-i18next";

const MarketplaceCard = ({ course }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.coverImage}
        />

        <div
          className={`${styles.priceBadge} ${course.price === 0 ? styles.freeBadge : styles.paidBadge}`}
        >
          {course.price === 0 ? t("free") : `${course.price}`}
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
        <div className={styles.companyInfo}>
          <IoBusinessOutline /> {course.company}
          {course.isMyDemo && (
            <span className={styles.myDemoTag}>({t("your-company")})</span>
          )}
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.actionArea}>
          {course.isMyDemo ? (
            <button className={styles.manageBtn}>
              <IoSettingsOutline /> {t("manage-course")}
            </button>
          ) : (
            <button className={styles.buyBtn}>
              <IoCartOutline />{" "}
              {course.price === 0 ? t("get-for-free") : t("purchase-course")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;
