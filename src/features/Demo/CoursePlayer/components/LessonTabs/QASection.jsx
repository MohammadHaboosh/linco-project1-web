import { useState } from "react";
import styles from "./QASection.module.css";
import { IoAddOutline } from "react-icons/io5";
import QuestionItem from "./QuestionItem";
import { useTranslation } from "react-i18next";
import { useQA } from "../../hooks/useQA";
import { useParams } from "react-router-dom";

const QASection = ({ activeLesson }) => {
  const { t } = useTranslation();
  const { demoId } = useParams();

  const {
    questions,
    isLoading,
    error,
    isPosting,
    addQuestion,
    editQuestion,
    removeQuestion,
  } = useQA(demoId, activeLesson?.id);

  const [isAsking, setIsAsking] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");

  const handleAskSubmit = async () => {
    if (!newQuestionText.trim()) return;
    const result = await addQuestion(newQuestionText.trim());
    if (result.success) {
      setNewQuestionText("");
      setIsAsking(false);
    } else {
      alert("Failed to post question: " + result.error);
    }
  };

  const handleEdit = async (questionId, newContent) => {
    const result = await editQuestion(questionId, newContent);
    if (!result.success) {
      alert("Failed to update question: " + result.error);
      return false;
    }
    return true;
  };

  const handleDelete = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const result = await removeQuestion(questionId);
      if (!result.success) {
        alert("Failed to delete question: " + result.error);
      }
    }
  };

  if (!activeLesson) {
    return (
      <div className={styles.qaContainer}>
        <p>{t("please-select-a-lesson-first")}</p>
      </div>
    );
  }

  return (
    <div className={styles.qaContainer}>
      <div className={styles.qaHeader}>
        <div>
          <h3>Q&A for: {activeLesson.title}</h3>
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
            disabled={isPosting}
          />
          <div className={styles.formActions}>
            <button
              className={styles.cancelBtn}
              onClick={() => setIsAsking(false)}
              disabled={isPosting}
            >
              {t("cancel")}
            </button>
            <button
              className={styles.submitBtn}
              onClick={handleAskSubmit}
              disabled={isPosting}
            >
              {isPosting ? t("posting") : t("post-question")}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.questionsList}>
          {isLoading && (
            <p style={{ textAlign: "center", padding: "20px" }}>
              Loading discussions...
            </p>
          )}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}

          {!isLoading && !error && questions.length === 0 && (
            <p
              style={{ textAlign: "center", color: "#64748b", padding: "20px" }}
            >
              {t("no-questions-yet-be-the-first-to-ask")}
            </p>
          )}

          {!isLoading &&
            questions.map((q) => (
              <QuestionItem
                key={q.id}
                question={q}
                lessonId={activeLesson.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default QASection;
