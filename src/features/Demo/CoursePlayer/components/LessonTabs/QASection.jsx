import React, { useState } from "react";
import styles from "./QASection.module.css";
import { IoAddOutline } from "react-icons/io5";
import QuestionItem from "./QuestionItem";
import { useTranslation } from "react-i18next";

const MOCK_QUESTIONS = [
  {
    id: 1,
    author: "Ahmad Ali",
    text: "Can you explain the main difference between useMemo and useCallback? I'm a bit confused.",
    date: "2 hours ago",
    replies: [
      {
        id: 101,
        author: "Instructor",
        text: "Sure! useMemo returns a memoized value, while useCallback returns a memoized function.",
        date: "1 hour ago",
      },
    ],
  },
  {
    id: 2,
    author: "Sarah M.",
    text: "At minute 4:30 in the video, where did you import the Axios library from?",
    date: "1 day ago",
    replies: [],
  },
];

const QASection = ({ activeLesson }) => {
  const { t } = useTranslation();

  const [questions, setQuestions] = useState(MOCK_QUESTIONS);

  const [isAsking, setIsAsking] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");

  const handleAskSubmit = () => {
    if (!newQuestionText.trim()) return;

    const newQuestion = {
      id: Date.now(),
      author: "Current User",
      text: newQuestionText,
      date: "Just now",
      replies: [],
    };

    setQuestions([newQuestion, ...questions]);
    setNewQuestionText("");
    setIsAsking(false);
  };

  const handleAddReply = (questionId, replyText) => {
    const newReply = {
      id: Date.now(),
      author: "Current User",
      text: replyText,
      date: "Just now",
    };

    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, replies: [...q.replies, newReply] };
        }
        return q;
      }),
    );
  };

  return (
    <div className={styles.qaContainer}>
      <div className={styles.qaHeader}>
        <div>
          <h3>Q&A for: {activeLesson?.title || "This Lesson"}</h3>
          <p>{t("ask-the-instructor-or-discuss-with-other-students")}</p>
        </div>
        {!isAsking && (
          <button className={styles.askBtn} onClick={() => setIsAsking(true)}>
            <IoAddOutline size={18} /> {t("ask-a-question")}
          </button>
        )}
      </div>

      {isAsking ? (
        <div className={styles.askForm}>
          <textarea
            placeholder={t(
              "write-your-question-here-be-specific-to-get-better-answers",
            )}
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            autoFocus
          />
          <div className={styles.formActions}>
            <button
              className={styles.cancelBtn}
              onClick={() => setIsAsking(false)}
            >
              {t("cancel")}
            </button>
            <button className={styles.submitBtn} onClick={handleAskSubmit}>
              {t("post-question")}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.questionsList}>
          {questions.length === 0 ? (
            <p
              style={{ textAlign: "center", color: "#64748b", padding: "20px" }}
            >
              {t("no-questions-yet-be-the-first-to-ask")}
            </p>
          ) : (
            questions.map((q) => (
              <QuestionItem
                key={q.id}
                question={q}
                onAddReply={handleAddReply}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QASection;
