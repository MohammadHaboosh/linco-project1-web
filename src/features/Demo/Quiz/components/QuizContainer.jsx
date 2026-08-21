import { useState } from "react";
import QuizTaker from "./QuizTaker";
import QuizResult from "./QuizResult";
import styles from "./Quiz.module.css";
import { useExamPlayer } from "../hooks/useExamPlayer";
import {
  IoPlayOutline,
  IoTimeOutline,
  IoListOutline,
  IoCheckmarkCircleOutline,
  IoTrophyOutline,
  IoArrowForwardOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";

const QuizContainer = ({ examId, onCompleteSection }) => {
  const { t, i18n } = useTranslation();
  const [quizState, setQuizState] = useState("welcome");
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const percentFormatter = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  const {
    examData,
    isLoading,
    isSubmitting,
    error,
    answers,
    toggleChoice,
    submitExam,
    examResult,
    previousAttempt,
  } = useExamPlayer(examId);

  const handleStart = () => {
    setQuizState("taking");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div
        className={styles.loadingScreen}
        dir={i18n.dir()}
        role="status"
        aria-live="polite"
      >
        <div className={styles.spinner} aria-hidden="true" />
        <p>{t("loading-your-assessment")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorScreen} dir={i18n.dir()} role="alert">
        <strong>{t("course-player-assessment-load-failed")}</strong>
        <p>{t("course-player-assessment-load-failed-description")}</p>
        <button type="button" onClick={handleRetry}>
          {t("try-again")}
        </button>
      </div>
    );
  }

  if (previousAttempt) {
    const percentage = Number(previousAttempt.score) || 0;
    const formattedScore = percentFormatter.format(percentage / 100);
    const ContinueIcon =
      i18n.dir() === "rtl" ? IoArrowBackOutline : IoArrowForwardOutline;

    return (
      <div className={styles.quizWrapper} dir={i18n.dir()}>
        <div className={styles.welcomeScreen}>
          <div className={styles.mascotEntrance}>
            <img
              src="/images/squid-happy.webp"
              alt={t("course-player-success-mascot-alt", "Success Mascot")}
              className={styles.mascotImgResult}
            />
          </div>

          <div className={styles.welcomeContent}>
            <div
              className={styles.quizBadge}
              style={{
                background: "var(--app-success-surface)",
                color: "#10b981",
                borderColor: "#10b981",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <IoTrophyOutline />
              {t("exam-already-completed")}
            </div>

            <h2 className={styles.successText}>{t("excellent-job")}</h2>
            <p>{t("you-have-already-passed-this-exam")}</p>

            <div
              className={styles.horizontalScoreBoard}
              style={{ maxWidth: "400px", margin: "24px auto" }}
            >
              <div
                className={`${styles.scoreRing} ${styles.ringSuccess}`}
                role="img"
                aria-label={t("course-player-assessment-score-value", {
                  score: formattedScore,
                })}
              >
                <svg viewBox="0 0 36 36" className={styles.circularChart}>
                  <path
                    className={styles.circleBg}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.circle}
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className={styles.scorePercentage}>
                  <strong>{formattedScore}</strong>
                  <span>{t("course-player-score")}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.startBtn}
              onClick={onCompleteSection}
              style={{ marginTop: "12px", minWidth: "220px" }}
            >
              {t("course-player-continue-course")}
              <ContinueIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!examData) return null;

  const questionCount =
    examData.numberOfQuestions || examData.questions?.length || 0;
  const durationMinutes = Number(examData.durationMinutes) || 0;
  const passingScore = Number(examData.passingScore) || 0;

  if (examResult) {
    return (
      <QuizResult
        scoreInfo={examResult.data || examResult}
        passingScore={passingScore}
        userAnswers={answers}
        onRetry={handleRetry}
        onContinue={onCompleteSection}
      />
    );
  }

  return (
    <div className={styles.quizWrapper} dir={i18n.dir()}>
      {quizState === "welcome" && (
        <div className={styles.welcomeScreen}>
          <div className={styles.mascotEntrance}>
            <img
              src="/icons/linco-logo.webp"
              alt={t("course-player-welcome-mascot-alt")}
              className={styles.mascotImg}
            />
          </div>

          <div className={styles.welcomeContent}>
            <div className={styles.quizBadge}>
              {t("intelligence-challenge")}
            </div>
            <h2>{examData.title}</h2>
            <p>
              {t(
                "test-your-understanding-of-this-sections-concepts-make-sure-to-select-all-correct-options-for-each-question",
              )}
            </p>

            <div className={styles.quizStatsOverview}>
              <div className={styles.statPill}>
                <IoListOutline aria-hidden="true" />
                <span>
                  {t("course-player-assessment-question-count", {
                    count: questionCount,
                    formattedCount: numberFormatter.format(questionCount),
                  })}
                </span>
              </div>
              <div className={styles.statPill}>
                <IoTimeOutline aria-hidden="true" />
                <span>
                  {t("course-player-assessment-duration", {
                    count: durationMinutes,
                    formattedCount: numberFormatter.format(durationMinutes),
                  })}
                </span>
              </div>
              <div className={styles.statPill}>
                <IoCheckmarkCircleOutline aria-hidden="true" />
                <span>
                  {t("course-player-assessment-passing-score", {
                    score: percentFormatter.format(passingScore / 100),
                  })}
                </span>
              </div>
            </div>

            <button
              type="button"
              className={styles.startBtn}
              onClick={handleStart}
            >
              <IoPlayOutline /> {t("start-exam-now")}
            </button>
          </div>
        </div>
      )}

      {quizState === "taking" && (
        <QuizTaker
          examData={examData}
          answers={answers}
          toggleChoice={toggleChoice}
          onSubmit={submitExam}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default QuizContainer;
