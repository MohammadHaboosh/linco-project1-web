import {
  IoDocumentTextOutline,
  IoLockClosedOutline,
  IoPeopleOutline,
  IoBookOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { PATHS } from "../../../../../../../routes/paths"; // مسار استدعاء الـ Paths
import styles from "./SectionCard.module.css";

const SectionCard = ({ section }) => {
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
          <div style={{ display: "flex", alignItems: "center" }}>
            {section.isLocked && (
              <span className={styles.lockedText}>Locked</span>
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
            <span>Progress</span>
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
              <IoBookOutline /> {section.coursesCount} courses
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
