import {
  IoDocumentTextOutline,
  IoLockClosedOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { PATHS } from "../../../../../../../routes/paths";
import styles from "./SectionCard.module.css";
import { useTranslation } from "react-i18next";

const SectionCard = ({ section, isOwner, onDelete }) => {
  const { t } = useTranslation();
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(section.id);
  };

  return (
    <Link
      to={section.isLocked ? "#" : PATHS.DEPARTMENT_DETAILS}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <div
        className={`${styles.sectionCard} ${section.isLocked ? styles.cardLocked : styles.cardActive}`}
      >
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{section.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {section.isLocked && (
              <span className={styles.lockedText}>{t("locked")}</span>
            )}

            {isOwner && (
              <button className={styles.deleteBtn} onClick={handleDeleteClick}>
                <IoTrashOutline />
              </button>
            )}

            <div className={styles.iconBox}>
              {section.isLocked ? (
                <IoLockClosedOutline />
              ) : (
                <IoDocumentTextOutline />
              )}
            </div>
          </div>
        </div>

        <p className={styles.description}>{section.description}</p>

        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span>{t("progress")}</span>
            <span>{section.progress}%</span>
          </div>
          <div className={styles.progressBg}>
            <div
              className={styles.progressFill}
              style={{ width: `${section.progress}%` }}
            ></div>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.tags}>
            {section.tags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.stats}>
            <span className={styles.statItem}>
              <IoBookOutline /> {section.coursesCount} {t("courses")}
            </span>
            <span className={styles.statItem}>
              <IoPeopleOutline /> {section.membersCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SectionCard;
