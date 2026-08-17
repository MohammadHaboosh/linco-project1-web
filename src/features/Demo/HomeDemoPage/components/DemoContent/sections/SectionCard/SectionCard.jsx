import { useState } from "react";
import {
  IoLayersOutline,
  IoLockClosedOutline,
  IoPeopleOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoOpenOutline,
} from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PATHS } from "../../../../../../../routes/paths";
import styles from "./SectionCard.module.css";

const SectionCard = ({ section, isOwner, onDelete, isDeleting }) => {
  const { t, i18n } = useTranslation();
  const { demoId } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);

  const isLocked = section.isLocked && !isOwner;

  const handleDeleteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirmModal(true);
  };

  const confirmDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await onDelete(section.id);
    setShowConfirmModal(false);
  };

  const cancelDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDeleting) setShowConfirmModal(false);
  };

  return (
    <>
      <Link
        to={
          isLocked
            ? "#"
            : PATHS.DEMO_SECTION.replace(":demoId", demoId).replace(
                ":departmentId",
                section.id,
              )
        }
        aria-disabled={isLocked}
        tabIndex={isLocked ? -1 : undefined}
        onClick={(event) => {
          if (isLocked) event.preventDefault();
        }}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <article
          className={`${styles.sectionCard} ${
            isLocked ? styles.cardLocked : styles.cardActive
          }`}
        >
          <div className={styles.watermarkBg} aria-hidden="true">
            <IoLayersOutline />
          </div>

          <div className={styles.cardHeader}>
            <div className={styles.iconBox} aria-hidden="true">
              {isLocked ? <IoLockClosedOutline /> : <IoLayersOutline />}
            </div>

            <div className={styles.headerActions}>
              {isLocked && (
                <span className={styles.lockedText}>{t("locked")}</span>
              )}

              {/* 💡 زر الحذف أصبح ثابتاً للأونر */}
              {isOwner && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={handleDeleteClick}
                  title={t("delete-department")}
                  aria-label={t("delete-department-named", {
                    department: section.title,
                  })}
                  disabled={isDeleting}
                >
                  <IoTrashOutline aria-hidden="true" />
                </button>
              )}

              <div className={styles.openIconBox} aria-hidden="true">
                <IoOpenOutline />
              </div>
            </div>
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{section.title}</h3>
            <p className={styles.description}>{section.description}</p>
          </div>

          <div className={styles.cardFooter}>
            <span className={styles.memberPill}>
              <IoPeopleOutline aria-hidden="true" />
              {numberFormatter.format(section.membersCount || 0)}{" "}
              {t("members", "Members")}
            </span>
          </div>
        </article>
      </Link>

      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={cancelDelete}>
          <div
            className={styles.confirmModal}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-department-title-${section.id}`}
            aria-describedby={`delete-department-desc-${section.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalIcon} aria-hidden="true">
              <IoWarningOutline />
            </div>
            <h3 id={`delete-department-title-${section.id}`}>
              {t("delete-department-confirm-title")}
            </h3>
            <p id={`delete-department-desc-${section.id}`}>
              {t("delete-department-confirm-desc", {
                department: section.title,
              })}
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className={styles.confirmDeleteBtn}
                onClick={confirmDelete}
                disabled={isDeleting}
                aria-busy={isDeleting}
              >
                {isDeleting ? t("deleting-department") : t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionCard;
