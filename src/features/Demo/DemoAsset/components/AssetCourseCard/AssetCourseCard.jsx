import { useState } from "react";
import {
  IoDownloadOutline,
  IoCheckmarkCircle,
  IoInformationCircleOutline,
} from "react-icons/io5";
import styles from "./AssetCourseCard.module.css";
import { useTranslation } from "react-i18next";

const AssetCourseCard = ({ course }) => {
  const { t } = useTranslation();
  const [isImported, setIsImported] = useState(false);

  const handleImport = () => {
    // TO DOOOOO :
    setIsImported(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.coverImage}
        />
        <div className={styles.readyBadge}>{t("ready-to-use")}</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.sourceInfo}>
          <IoInformationCircleOutline /> {course.source}
        </div>

        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.actionArea}>
          <button
            className={`${styles.importBtn} ${isImported ? styles.successBtn : ""}`}
            onClick={handleImport}
            disabled={isImported}
          >
            {isImported ? (
              <>
                <IoCheckmarkCircle className={styles.btnIcon} />{" "}
                {t("added-to-department")}
              </>
            ) : (
              <>
                <IoDownloadOutline className={styles.btnIcon} />{" "}
                {t("pull-to-department")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCourseCard;
