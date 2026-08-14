import { useState } from "react";
import styles from "./QASection.module.css";
import {
  IoPencilOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";

const ReplyItem = ({ reply, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);

  const replyUser = reply.demoMember?.user || {};
  const replyAuthor =
    `${replyUser.firstName || "User"} ${replyUser.lastName || ""}`.trim();
  const avatarUrl = replyUser.imagePath;

  const replyDate = new Date(reply.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    const success = await onEdit(reply.id, editedContent.trim());
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      onDelete(reply.id);
    }
  };

  return (
    <div className={styles.replyItem}>
      {avatarUrl && avatarUrl !== "default" ? (
        <img
          src={avatarUrl}
          alt={replyAuthor}
          className={styles.replyAvatar}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className={styles.replyAvatar}>{getInitials(replyAuthor)}</div>
      )}

      <div className={styles.replyContent}>
        <div className={styles.replyHeader}>
          <span className={styles.replyName}>{replyAuthor}</span>
          <span className={styles.date}>{replyDate}</span>

          {!isEditing && (
            <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
              <button
                className={styles.iconActionBtn}
                onClick={() => setIsEditing(true)}
                title={t("edit-reply")}
              >
                <IoPencilOutline size={16} />
              </button>
              <button
                className={styles.iconActionBtnDanger}
                onClick={handleDelete}
                title={t("delete-reply")}
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
              className={styles.editTextarea}
              style={{ minHeight: "60px", padding: "12px" }}
            />
            <div className={styles.editActions}>
              <button className={styles.saveEditBtn} onClick={handleSaveEdit}>
                <IoCheckmarkOutline /> {t("save")}
              </button>
              <button
                className={styles.cancelEditBtn}
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(reply.content);
                }}
              >
                <IoCloseOutline /> {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.replyText}>{reply.content}</p>
        )}
      </div>
    </div>
  );
};

export default ReplyItem;
