import React, { useState } from "react";
import styles from "./QASection.module.css";
import { IoChatbubblesOutline, IoTimeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const QuestionItem = ({ question, onAddReply }) => {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onAddReply(question.id, replyText);
    setReplyText("");
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className={styles.questionCard}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{getInitials(question.author)}</div>
        <div>
          <h4 className={styles.userName}>{question.author}</h4>
          <span className={styles.date}>
            <IoTimeOutline
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />
            {question.date}
          </span>
        </div>
      </div>

      <p className={styles.questionText}>{question.text}</p>

      <div className={styles.cardActions}>
        <button
          className={styles.actionBtn}
          onClick={() => setShowReplies(!showReplies)}
        >
          <IoChatbubblesOutline />
          {question.replies.length}{" "}
          {question.replies.length === 1 ? "Reply" : "Replies"}
        </button>
      </div>

      {showReplies && (
        <div className={styles.repliesSection}>
          {question.replies.map((reply) => (
            <div key={reply.id} className={styles.replyItem}>
              <div className={styles.replyAvatar}>
                {getInitials(reply.author)}
              </div>
              <div className={styles.replyContent}>
                <div className={styles.replyHeader}>
                  <span className={styles.replyName}>{reply.author}</span>
                  <span className={styles.date}>{reply.date}</span>
                </div>
                <p className={styles.replyText}>{reply.text}</p>
              </div>
            </div>
          ))}

          <div className={styles.replyInputWrapper}>
            <input
              type="text"
              placeholder={t("write-a-reply")}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
            />
            <button
              className={styles.sendReplyBtn}
              disabled={!replyText.trim()}
              onClick={handleReplySubmit}
            >
              {t("reply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
