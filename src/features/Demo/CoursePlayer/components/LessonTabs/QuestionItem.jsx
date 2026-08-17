import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./QASection.module.css";
import {
  IoChatbubblesOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";
import ReplyItem from "./ReplyItem";
import { useAnswers } from "../../hooks/useAnswers";
import { useTranslation } from "react-i18next";

const QuestionItem = ({ question, onEdit, onDelete, isDeleting }) => {
  const { t, i18n } = useTranslation();
  const { demoId } = useParams();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(question.content);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    answers,
    isLoading,
    error,
    isSubmitting,
    fetchAnswers,
    addAnswer,
    editAnswer,
    removeAnswer,
  } = useAnswers(demoId, question.id, question.answers || []);

  const user = question.demoMember?.user || {};
  const authorName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    t("unknown-user");
  const avatarUrl = user.imagePath;
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const createdAt = new Date(question.createdAt);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? t("course-player-date-unavailable")
    : new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(createdAt);
  const formattedReplyCount = new Intl.NumberFormat(locale).format(
    answers.length,
  );

  const handleToggleReplies = () => {
    if (!showReplies) fetchAnswers();
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;
    setActionError(null);
    const result = await addAnswer(replyText.trim());
    if (result.success) {
      setReplyText("");
    } else {
      setActionError(t("course-player-reply-post-failed"));
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || isSaving) return;
    setActionError(null);
    setIsSaving(true);
    const success = await onEdit(question.id, editedContent.trim());
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className={styles.questionCard}>
      <div className={styles.userInfo}>
        {avatarUrl && avatarUrl !== "default" ? (
          <img
            src={avatarUrl}
            alt={t("course-player-user-avatar", { name: authorName })}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatar}>{getInitials(authorName)}</div>
        )}

        <div>
          <h4 className={styles.userName}>{authorName}</h4>
          <span className={styles.date}>
            <IoTimeOutline
              className={styles.dateIcon}
              aria-hidden="true"
            />
            {formattedDate}
          </span>
        </div>

        {!isEditing && (
          <div className={styles.ownerActions}>
            <button
              type="button"
              className={styles.iconActionBtn}
              onClick={() => setIsEditing(true)}
              title={t("course-player-edit-question")}
              aria-label={t("course-player-edit-question")}
              disabled={isDeleting}
            >
              <IoPencilOutline size={18} />
            </button>
            <button
              type="button"
              className={styles.iconActionBtnDanger}
              onClick={() => onDelete(question.id)}
              title={
                isDeleting
                  ? t("course-player-deleting-question")
                  : t("course-player-delete-question")
              }
              aria-label={
                isDeleting
                  ? t("course-player-deleting-question")
                  : t("course-player-delete-question")
              }
              disabled={isDeleting}
            >
              <IoTrashOutline size={18} />
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
            aria-label={t("course-player-edit-question-input")}
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
              {isSaving ? t("course-player-saving-question") : t("save")}
            </button>
            <button
              type="button"
              className={styles.cancelEditBtn}
              onClick={() => {
                setIsEditing(false);
                setEditedContent(question.content);
              }}
              disabled={isSaving}
            >
              <IoCloseOutline /> {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.questionText}>{question.content}</p>
      )}

      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleToggleReplies}
          aria-expanded={showReplies}
        >
          <IoChatbubblesOutline size={18} />
          {t("course-player-reply-count", {
            count: answers.length,
            formattedCount: formattedReplyCount,
          })}
        </button>
      </div>

      {showReplies && (
        <div className={styles.repliesSection}>
          <div className={styles.repliesThread}>
            {isLoading ? (
              <p className={styles.replyStatus} role="status">
                {t("course-player-loading-replies")}
              </p>
            ) : error ? (
              <p className={styles.inlineError} role="alert">
                {t("course-player-replies-load-failed")}
              </p>
            ) : (
              <>
                {answers.length === 0 && (
                  <p className={styles.replyStatus}>
                    {t("course-player-no-replies")}
                  </p>
                )}
                {answers.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    onEdit={editAnswer}
                    onDelete={removeAnswer}
                  />
                ))}
              </>
            )}

            <div className={styles.replyInputWrapper}>
              <label
                className={styles.srOnly}
                htmlFor={`question-${question.id}-reply`}
              >
                {t("course-player-reply-input-label")}
              </label>
              <input
                id={`question-${question.id}-reply`}
                type="text"
                placeholder={t("write-a-reply")}
                value={replyText}
                disabled={isSubmitting}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
              />
              <button
                type="button"
                className={styles.sendReplyBtn}
                disabled={!replyText.trim() || isSubmitting}
                onClick={handleReplySubmit}
              >
                {isSubmitting ? t("course-player-posting-reply") : t("reply")}
              </button>
            </div>
            {actionError && (
              <p className={styles.inlineError} role="alert">
                {actionError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
