import { useEffect, useState } from "react";
import {
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoArrowForwardOutline,
  IoArrowBackOutline,
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
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const PreviousIcon = isRtl
    ? IoArrowForwardOutline
    : IoArrowBackOutline;
  const NextIcon = isRtl ? IoArrowBackOutline : IoArrowForwardOutline;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    (Number(examData.durationMinutes) || 0) * 60,
  );
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const timeFormatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

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
    `${timeFormatter.format(Math.floor(sec / 60))}:${timeFormatter.format(
      sec % 60,
    )}`;

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
    <div className={styles.takerContainer} aria-busy={isSubmitting}>
      <div className={styles.compactHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.scoreBox}>
            {t("course-player-assessment-question-progress", {
              current: numberFormatter.format(currentQIndex + 1),
              total: numberFormatter.format(questions.length),
            })}
          </div>
          <div
            className={`${styles.timerBox} ${timeLeft < 60 ? styles.timerWarning : ""}`}
            role="timer"
            aria-label={t("course-player-assessment-time-remaining", {
              time: formatTime(timeLeft),
            })}
          >
            <IoTimeOutline /> {formatTime(timeLeft)}
          </div>
        </div>

        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-label={t("course-player-assessment-progress")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
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
              alt={t("course-player-thinking-mascot-alt")}
              className={styles.tinyMascot}
            />
            <div className={styles.questionTextWrapper}>
              <h3>{currentQuestion.question}</h3>
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
                    className={styles.choiceInput}
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
          <PreviousIcon /> {t("previous")}
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
            {t("next-question")} <NextIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTaker;
