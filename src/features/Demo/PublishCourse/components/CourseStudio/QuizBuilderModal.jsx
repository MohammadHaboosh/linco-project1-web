import { useState, useEffect } from "react";
import {
  IoCloseOutline,
  IoWarningOutline,
  IoTimerOutline,
  IoListOutline,
} from "react-icons/io5";
import styles from "./CourseStudio.module.css";
import { useTranslation } from "react-i18next";

const QuizBuilderModal = ({ initialData, onClose, onSave }) => {
  const { t } = useTranslation();
  const [quizData, setQuizData] = useState({
    title: "",
    questionsCount: 10,
    timeLimit: 15,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // if (initialData) setQuizData(initialData);
  }, [initialData]);

  const handleSave = () => {
    if (!quizData.title.trim() || quizData.questionsCount < 1)
      return setError(t("please-provide-a-valid-title-and-questions-count"));
    onSave(quizData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>
            {initialData
              ? t("edit-final-assessment")
              : t("add-final-assessment")}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
        <div className={styles.modalBody}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          <div className={styles.inputGroup}>
            <label>{t("assessment-title")} *</label>
            <input
              type="text"
              placeholder={`e.g. ${t("section-1-final-exam")}`}
              value={quizData.title}
              onChange={(e) =>
                setQuizData({ ...quizData, title: e.target.value })
              }
            />
          </div>
          <div className={styles.filesGrid}>
            <div className={styles.inputGroup}>
              <label>{t("number-of-questions")} *</label>
              <div className={styles.iconInputWrapper}>
                <IoListOutline className={styles.inputIcon} />
                <input
                  type="number"
                  min="1"
                  value={quizData.questionsCount}
                  onChange={(e) =>
                    setQuizData({ ...quizData, questionsCount: e.target.value })
                  }
                  className={styles.iconInput}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("time-limit-minutes")}</label>
              <div className={styles.iconInputWrapper}>
                <IoTimerOutline className={styles.inputIcon} />
                <input
                  type="number"
                  min="0"
                  value={quizData.timeLimit}
                  onChange={(e) =>
                    setQuizData({ ...quizData, timeLimit: e.target.value })
                  }
                  className={styles.iconInput}
                />
              </div>
            </div>
          </div>
          <div className={styles.infoBanner}>
            <IoWarningOutline
              className={styles.infoIcon}
              style={{ color: "#d97706" }}
            />
            <p style={{ color: "#92400e" }}>
              <strong>{t("dynamic-assessment")}</strong>{" "}
              {t(
                "questions-choices-and-correct-answers-will-be-randomly-generated-from-the-question-bank-for-each-trainee-to-prevent-cheating",
              )}
            </p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("cancel")}
          </button>
          <button className={styles.saveModalBtn} onClick={handleSave}>
            {t("save-assessment")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilderModal;
