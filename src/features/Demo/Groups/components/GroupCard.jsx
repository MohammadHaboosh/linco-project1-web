import { useState } from "react";
import {
  IoPeopleOutline,
  IoGlobeOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoTrashOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import styles from "./Groups.module.css";
import { useTranslation } from "react-i18next";

const GroupCard = ({ group, isManager, onDelete, isDeleting }) => {
  const { t } = useTranslation();
  const { demoId } = useParams();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isPrivate = group.privacy === "PRIVATE";
  const groupName = group.name || group.title || "";
  const memberCount = group.membersCount || 0;

  const handleDeleteClick = (event) => {
    event.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmDelete = async (event) => {
    event.preventDefault();
    await onDelete();
    setShowConfirmModal(false);
  };

  const cancelDelete = (event) => {
    event.preventDefault();
    if (!isDeleting) setShowConfirmModal(false);
  };

  return (
    <>
      <div className={styles.groupCardWrapper}>
        <div className={styles.groupCard}>
          <div className={styles.cardHeader}>
            <div className={styles.groupTitleWrapper}>
              <div className={styles.groupIcon}>
                {groupName.substring(0, 2).toUpperCase()}
              </div>
              <h3 className={styles.groupName}>{groupName}</h3>
            </div>

            <div className={styles.headerActions}>
              {isManager && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  title={t("delete-group", "Delete Group")}
                >
                  <IoTrashOutline />
                </button>
              )}
              <span
                className={`${styles.privacyBadge} ${isPrivate ? styles.privateBadge : styles.publicBadge}`}
              >
                {isPrivate ? <IoLockClosedOutline /> : <IoGlobeOutline />}
                <span className={styles.privacyText}>
                  {isPrivate ? t("private", "Private") : t("public", "Public")}
                </span>
              </span>
            </div>
          </div>

          <div className={styles.cardBody}>
            <p className={styles.groupDesc}>
              {group.description ||
                t(
                  "no-group-description",
                  "No description was provided for this group.",
                )}
            </p>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.membersCount}>
              <IoPeopleOutline />
              <span>{t("workspace-members", { count: memberCount })}</span>
            </div>
            <Link
              to={`/demos/${demoId}/groups/${group.id}`}
              className={styles.joinBtn}
            >
              {t("enter-group", "Enter")} <IoArrowForwardOutline />
            </Link>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={cancelDelete}>
          <div
            className={styles.confirmModal}
            role="alertdialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalIcon} aria-hidden="true">
              <IoWarningOutline />
            </div>
            <h3>{t("delete-group-confirm-title", "Delete Group?")}</h3>
            <p>
              {t(
                "delete-group-confirm-desc",
                "Are you sure you want to delete this group? This action cannot be undone.",
              )}
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
              >
                {isDeleting
                  ? t("deleting", "Deleting...")
                  : t("delete", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupCard;
