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

const QuestionItem = ({ question, onEdit, onDelete, lessonId }) => {
  const { t } = useTranslation();
  const { demoId } = useParams();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(question.content);

  const {
    answers,
    isLoading,
    isSubmitting,
    fetchAnswers,
    addAnswer,
    editAnswer,
    removeAnswer,
  } = useAnswers(demoId, question.id, question.answers || []);

  const user = question.demoMember?.user || {};
  const authorName =
    `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim();
  const avatarUrl = user.imagePath;

  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
  );

  const handleToggleReplies = () => {
    if (!showReplies) fetchAnswers();
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;
    const result = await addAnswer(replyText.trim());
    if (result.success) {
      setReplyText("");
    } else {
      alert("Failed to post reply: " + result.error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    const success = await onEdit(question.id, editedContent.trim());
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
            alt={authorName}
            className={styles.avatar}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className={styles.avatar}>{getInitials(authorName)}</div>
        )}

        <div>
          <h4 className={styles.userName}>{authorName}</h4>
          <span className={styles.date}>
            <IoTimeOutline
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />
            {formattedDate}
          </span>
        </div>

        {!isEditing && (
          <div
            className={styles.ownerActions}
            style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
          >
            <button
              className={styles.iconActionBtn}
              onClick={() => setIsEditing(true)}
              title="Edit Question"
            >
              <IoPencilOutline size={16} />
            </button>
            <button
              className={styles.iconActionBtnDanger}
              onClick={() => onDelete(question.id)}
              title="Delete Question"
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
          />
          <div className={styles.editActions}>
            <button className={styles.saveEditBtn} onClick={handleSaveEdit}>
              <IoCheckmarkOutline /> {t("save")}
            </button>
            <button
              className={styles.cancelEditBtn}
              onClick={() => {
                setIsEditing(false);
                setEditedContent(question.content);
              }}
            >
              <IoCloseOutline /> {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.questionText}>{question.content}</p>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn} onClick={handleToggleReplies}>
          <IoChatbubblesOutline />
          {answers.length} {answers.length === 1 ? t("reply") : t("replies")}
        </button>
      </div>

      {showReplies && (
        <div className={styles.repliesSection}>
          {isLoading ? (
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              Loading replies...
            </p>
          ) : (
            answers.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                onEdit={editAnswer}
                onDelete={removeAnswer}
              />
            ))
          )}

          <div className={styles.replyInputWrapper}>
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              disabled={isSubmitting}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
            />
            <button
              className={styles.sendReplyBtn}
              disabled={!replyText.trim() || isSubmitting}
              onClick={handleReplySubmit}
            >
              {isSubmitting ? "..." : t("reply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
