import { useState } from "react";
import styles from "./QASection.module.css";
import {
  IoPencilOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useAppAlert } from "../../../../../components/common/AppAlerts/useAppAlert";

const ReplyItem = ({ reply, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();
  const { confirmAction } = useAppAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const replyUser = reply.demoMember?.user || {};
  const replyAuthor =
    `${replyUser.firstName || ""} ${replyUser.lastName || ""}`.trim() ||
    t("unknown-user");
  const avatarUrl = replyUser.imagePath;
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const createdAt = new Date(reply.createdAt);
  const replyDate = Number.isNaN(createdAt.getTime())
    ? t("course-player-date-unavailable")
    : new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(createdAt);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || isSaving) return;
    setIsSaving(true);
    setActionError(null);
    const result = await onEdit(reply.id, editedContent.trim());
    setIsSaving(false);
    if (result?.success) {
      setIsEditing(false);
    } else {
      setActionError(
        result?.error || t("course-player-reply-update-failed"),
      );
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    const shouldDelete = await confirmAction({
      message: t("course-player-delete-reply-confirmation"),
      confirmLabel: t("delete"),
      tone: "danger",
    });

    if (!shouldDelete) return;

    setIsDeleting(true);
    setActionError(null);
    const result = await onDelete(reply.id);
    setIsDeleting(false);
    if (!result?.success) {
      setActionError(
        result?.error || t("course-player-reply-delete-failed"),
      );
    }
  };

  return (
    <div className={styles.replyItem}>
      {avatarUrl && avatarUrl !== "default" ? (
        <img
          src={avatarUrl}
          alt={t("course-player-user-avatar", { name: replyAuthor })}
          className={styles.replyAvatar}
        />
      ) : (
        <div className={styles.replyAvatar}>{getInitials(replyAuthor)}</div>
      )}

      <div className={styles.replyContent}>
        <div className={styles.replyHeader}>
          <span className={styles.replyName}>{replyAuthor}</span>
          <span className={styles.date}>{replyDate}</span>

          {!isEditing && (
            <div className={styles.ownerActions}>
              <button
                type="button"
                className={styles.iconActionBtn}
                onClick={() => setIsEditing(true)}
                title={t("edit-reply")}
                aria-label={t("edit-reply")}
                disabled={isDeleting}
              >
                <IoPencilOutline size={16} />
              </button>
              <button
                type="button"
                className={styles.iconActionBtnDanger}
                onClick={handleDelete}
                title={t("delete-reply")}
                aria-label={t("delete-reply")}
                disabled={isDeleting}
              >
                <IoTrashOutline size={16} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className={styles.editBox}>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={`${styles.editTextarea} ${styles.replyEditTextarea}`}
              aria-label={t("course-player-edit-reply-input")}
              disabled={isSaving}
            />
            <div className={styles.editActions}>
              <button
                type="button"
                className={styles.saveEditBtn}
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                <IoCheckmarkOutline />
                {isSaving ? t("course-player-saving-reply") : t("save")}
              </button>
              <button
                type="button"
                className={styles.cancelEditBtn}
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(reply.content);
                }}
                disabled={isSaving}
              >
                <IoCloseOutline /> {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.replyText}>{reply.content}</p>
        )}

        {actionError && (
          <p className={styles.inlineError} role="alert">
            {actionError}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReplyItem;
