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
  const [actionError, setActionError] = useState(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  const handleAskSubmit = async () => {
    if (!newQuestionText.trim()) return;
    setActionError(null);
    const result = await addQuestion(newQuestionText.trim());
    if (result.success) {
      setNewQuestionText("");
      setIsAsking(false);
    } else {
      setActionError(t("course-player-question-post-failed"));
    }
  };

  const handleEdit = async (questionId, newContent) => {
    setActionError(null);
    const result = await editQuestion(questionId, newContent);
    if (!result.success) {
      setActionError(t("course-player-question-update-failed"));
      return false;
    }
    return true;
  };

  const handleDelete = async (questionId) => {
    if (window.confirm(t("course-player-delete-question-confirmation"))) {
      setActionError(null);
      setDeletingQuestionId(questionId);
      const result = await removeQuestion(questionId);
      setDeletingQuestionId(null);
      if (!result.success) {
        setActionError(t("course-player-question-delete-failed"));
      }
    }
  };

  if (!activeLesson) {
    return (
      <div className={styles.qaContainer}>
        <div className={styles.emptyStateContainer}>
          <p>{t("please-select-a-lesson-first")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.qaContainer}>
      <div className={styles.panelHeadingQA}>
        <div>
          <span className={styles.kicker}>{t("discussion-board")}</span>
          <h3>
            {t("course-player-q-and-a-for-lesson", {
              title: activeLesson.title,
            })}
          </h3>
        </div>

        {!isAsking && (
          <button
            type="button"
            className={styles.askBtn}
            onClick={() => {
              setActionError(null);
              setIsAsking(true);
            }}
          >
            <IoAddOutline size={20} /> {t("ask-a-question")}
          </button>
        )}
      </div>

      {isAsking ? (
        <div className={styles.askForm} aria-busy={isPosting}>
          <label className={styles.srOnly} htmlFor="course-question-input">
            {t("course-player-question-input-label")}
          </label>
          <textarea
            id="course-question-input"
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
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setIsAsking(false);
                setActionError(null);
              }}
              disabled={isPosting}
            >
              {t("cancel")}
            </button>
            <button
              type="button"
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
            <p className={styles.statusMessage} role="status">
              {t("course-player-loading-discussions")}
            </p>
          )}
          {error && (
            <p className={styles.inlineError} role="alert">
              {t("course-player-discussions-load-failed")}
            </p>
          )}

          {!isLoading && !error && questions.length === 0 && (
            <div className={styles.emptyStateContainer}>
              <p>{t("no-questions-yet-be-the-first-to-ask")}</p>
            </div>
          )}

          {!isLoading &&
            questions.map((q) => (
              <QuestionItem
                key={q.id}
                question={q}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingQuestionId === q.id}
              />
            ))}
        </div>
      )}

      {actionError && (
        <p className={styles.inlineError} role="alert">
          {actionError}
        </p>
      )}
    </div>
  );
};

export default QASection;
