import { useEffect, useState } from "react";
import {
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoArrowBackOutline,
  IoBulbOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";
import { useTranslation } from "react-i18next";

const QuizTaker = ({
  examData,
  answers,
  toggleChoice,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(examData.durationMinutes * 60);

  const questions = examData.questions || [];
  const currentQuestion = questions[currentQIndex];
  const progress = ((currentQIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isSubmitting) onSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, onSubmit]);

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)
      .toString()
      .padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((v) => v + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((v) => v - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className={styles.takerContainer}>
      <div className={styles.compactHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.scoreBox}>
            Q {currentQIndex + 1} / {questions.length}
          </div>
          <div
            className={`${styles.timerBox} ${timeLeft < 60 ? styles.timerWarning : ""}`}
          >
            <IoTimeOutline /> {formatTime(timeLeft)}
          </div>
        </div>

        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.questionArea}>
        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <img
              src="/icons/linco-logo.png"
              alt="Thinking"
              className={styles.tinyMascot}
            />
            <div className={styles.questionTextWrapper}>
              <h3>{currentQuestion.question}</h3>
              {currentQuestion.note && (
                <p className={styles.questionNote}>
                  <IoBulbOutline /> {currentQuestion.note}
                </p>
              )}
            </div>
          </div>

          <div className={styles.optionsGrid}>
            {currentQuestion.choices?.map((choice) => {
              const isSelected = answers[currentQuestion.id]?.includes(
                choice.id,
              );

              return (
                <label
                  key={choice.id}
                  className={`${styles.optionCard} ${isSelected ? styles.selectedOption : ""}`}
                >
                  <div className={styles.checkbox}>
                    {isSelected && <div className={styles.checkboxFill} />}
                  </div>
                  <input
                    type="checkbox"
                    hidden
                    checked={isSelected || false}
                    onChange={() => toggleChoice(currentQuestion.id, choice.id)}
                  />
                  <span className={styles.optionText}>{choice.choice}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.compactFooter}>
        <button
          type="button"
          className={styles.actionBtnSecondary}
          onClick={handlePrev}
          disabled={currentQIndex === 0 || isSubmitting}
        >
          <IoArrowBackOutline /> {t("previous")}
        </button>

        {currentQIndex === questions.length - 1 ? (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.submitFinalBtn}`}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submit-exam")}{" "}
            <IoCheckmarkCircleOutline />
          </button>
        ) : (
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.nextBtn}`}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {t("next-question")} <IoArrowForwardOutline />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;
