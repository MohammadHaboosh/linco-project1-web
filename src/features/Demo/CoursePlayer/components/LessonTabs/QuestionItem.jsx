import { useState } from "react";
import styles from "./QASection.module.css";
import {
  IoChatbubblesOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";

const QuestionItem = ({ question, onAddReply, onEdit, onDelete, lessonId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(question.content);

  const user = question.demoMember?.user || {};
  const authorName =
    `${user.firstName || "Unknown"} ${user.lastName || ""}`.trim();
  const avatarUrl = user.imagePath;

  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onAddReply(question.id, replyText);
    setReplyText("");
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
              <IoCheckmarkOutline /> Save
            </button>
            <button
              className={styles.cancelEditBtn}
              onClick={() => {
                setIsEditing(false);
                setEditedContent(question.content);
              }}
            >
              <IoCloseOutline /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.questionText}>{question.content}</p>
      )}

      <div className={styles.cardActions}>
        <button
          className={styles.actionBtn}
          onClick={() => setShowReplies(!showReplies)}
        >
          <IoChatbubblesOutline />
          {question.answers?.length || 0}{" "}
          {question.answers?.length === 1 ? "Reply" : "Replies"}
        </button>
      </div>

      {showReplies && (
        <div className={styles.repliesSection}>
          {question.answers?.map((reply) => {
            const replyUser = reply.demoMember?.user || {};
            const replyAuthor =
              `${replyUser.firstName || "User"} ${replyUser.lastName || ""}`.trim();
            const replyDate = new Date(reply.createdAt).toLocaleDateString();

            return (
              <div key={reply.id} className={styles.replyItem}>
                {replyUser.imagePath ? (
                  <img
                    src={replyUser.imagePath}
                    alt={replyAuthor}
                    className={styles.replyAvatar}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className={styles.replyAvatar}>
                    {getInitials(replyAuthor)}
                  </div>
                )}

                <div className={styles.replyContent}>
                  <div className={styles.replyHeader}>
                    <span className={styles.replyName}>{replyAuthor}</span>
                    <span className={styles.date}>{replyDate}</span>
                  </div>
                  <p className={styles.replyText}>{reply.content}</p>
                </div>
              </div>
            );
          })}

          <div className={styles.replyInputWrapper}>
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
            />
            <button
              className={styles.sendReplyBtn}
              disabled={!replyText.trim()}
              onClick={handleReplySubmit}
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
