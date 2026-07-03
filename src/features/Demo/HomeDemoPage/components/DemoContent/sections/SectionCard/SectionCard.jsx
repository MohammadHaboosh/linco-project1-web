import { useState } from "react";
import {
  IoDocumentTextOutline,
  IoLockClosedOutline,
  IoPeopleOutline,
  IoBookOutline,
  IoTrashOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { PATHS } from "../../../../../../../routes/paths";
import styles from "./SectionCard.module.css";
import { useTranslation } from "react-i18next";

const SectionCard = ({ section, isOwner, onDelete }) => {
  const { t } = useTranslation();
  const { demoId } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const confirmDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(section.id);
    setShowConfirmModal(false);
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(false);
  };

  return (
    <>
      <Link
        to={
          section.isLocked && !isOwner
            ? "#"
            : PATHS.DEMO_SECTION.replace(":demoId", demoId).replace(
                ":departmentId",
                section.id,
              )
        }
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <div
          className={`${styles.sectionCard} ${
            section.isLocked && !isOwner ? styles.cardLocked : styles.cardActive
          }`}
        >
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{section.title}</h3>

            <div className={styles.headerActions}>
              {section.isLocked && !isOwner && (
                <span className={styles.lockedText}>{t("locked")}</span>
              )}

              {isOwner && (
                <button
                  className={styles.deleteBtn}
                  onClick={handleDeleteClick}
                  title={t("delete-department")}
                >
                  <IoTrashOutline />
                </button>
              )}

              <div className={styles.iconBox}>
                {section.isLocked && !isOwner ? (
                  <IoLockClosedOutline />
                ) : (
                  <IoDocumentTextOutline />
                )}
              </div>
            </div>
          </div>

          <p className={styles.description}>{section.description}</p>

          {!isOwner && (
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
          )}

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

      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={cancelDelete}>
          <div
            className={styles.confirmModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIcon}>
              <IoWarningOutline />
            </div>
            <h3>{t("delete-department-confirm-title")}</h3>
            <p>{t("delete-department-confirm-desc")}</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={cancelDelete}>
                {t("cancel")}
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={confirmDelete}
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionCard;
