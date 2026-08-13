import { useState } from "react";
import QuizTaker from "./QuizTaker";
import QuizResult from "./QuizResult";
import styles from "./Quiz.module.css";
import { useExamPlayer } from "../../hooks/useExamPlayer";
import {
  IoPlayOutline,
  IoTimeOutline,
  IoListOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";

const QuizContainer = ({ examId, onCompleteSection }) => {
  const { t } = useTranslation();
  const [quizState, setQuizState] = useState("welcome");

  const {
    examData,
    isLoading,
    isSubmitting,
    error,
    answers,
    toggleChoice,
    submitExam,
    examResult,
  } = useExamPlayer(examId);

  const handleStart = () => {
    setQuizState("taking");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>{t("loading-your-assessment")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorScreen}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!examData) return null;

  if (examResult) {
    return (
      <QuizResult
        scoreInfo={examResult.data || examResult}
        passingScore={examData.passingScore}
        onRetry={handleRetry}
        onContinue={onCompleteSection}
      />
    );
  }

  return (
    <div className={styles.quizWrapper} dir="ltr">
      {quizState === "welcome" && (
        <div className={styles.welcomeScreen}>
          <div className={styles.mascotEntrance}>
            <img
              src="/icons/linco-logo.png"
              alt="Mascot Greeting"
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
                <IoListOutline />{" "}
                <strong>
                  {examData.numberOfQuestions || examData.questions?.length}
                </strong>{" "}
                {t("questions")}
              </div>
              <div className={styles.statPill}>
                <IoTimeOutline /> <strong>{examData.durationMinutes}</strong>{" "}
                {t("seconds")}
              </div>
              <div className={styles.statPill}>
                <IoCheckmarkCircleOutline />{" "}
                <strong>{examData.passingScore}%</strong> {t("passing-score")}
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
