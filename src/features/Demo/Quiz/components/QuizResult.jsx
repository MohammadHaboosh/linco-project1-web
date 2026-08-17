import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoBulbOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./Quiz.module.css";

const QuizResult = ({
  scoreInfo,
  passingScore,
  userAnswers,
  onRetry,
  onContinue,
}) => {
  const { t, i18n } = useTranslation();
  const ContinueIcon =
    i18n.dir() === "rtl" ? IoArrowBackOutline : IoArrowForwardOutline;
  const attemptData = scoreInfo.examAttempt || {};
  const percentage = Number(attemptData.score ?? scoreInfo.score) || 0;
  const isPassed = percentage >= passingScore;
  const questions = scoreInfo.questions || [];
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const percentFormatter = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const formattedScore = percentFormatter.format(percentage / 100);
  const formattedPassingScore = percentFormatter.format(passingScore / 100);

  return (
    <div className={styles.resultTwoColumnContainer} dir={i18n.dir()}>
      <div className={styles.resultSummaryCol}>
        <div className={styles.resultContent}>
          <img
            src={isPassed ? "/images/squid-happy.png" : "/icons/sad.png"}
            alt={
              isPassed
                ? t("course-player-success-mascot-alt")
                : t("course-player-encouragement-mascot-alt")
            }
            className={styles.mascotImgResult}
          />

          <h2 className={isPassed ? styles.successText : styles.failText}>
            {isPassed
              ? t("course-player-assessment-passed-title")
              : t("course-player-assessment-failed-title")}
          </h2>
          <p className={styles.resultSubtitle}>
            {isPassed
              ? t("course-player-assessment-passed-description")
              : t("course-player-assessment-failed-description")}
          </p>

          <div className={styles.horizontalScoreBoard}>
            <div
              className={`${styles.scoreRing} ${isPassed ? styles.ringSuccess : styles.ringFail}`}
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

            <div className={styles.dividerVertical} aria-hidden="true" />

            <div className={styles.statsDetails}>
              <div className={styles.statRow}>
                <IoCheckmarkCircleOutline
                  className={styles.correctIcon}
                  aria-hidden="true"
                />
                <span>{t("course-player-result-status")}</span>
                <strong
                  className={
                    isPassed ? styles.statusPassed : styles.statusFailed
                  }
                >
                  {isPassed
                    ? t("course-player-passed-status")
                    : t("course-player-failed-status")}
                </strong>
              </div>
              <div className={styles.statRow}>
                <div className={styles.targetDot} aria-hidden="true" />
                <span>{t("course-player-passing-score-required")}</span>
                <strong>{formattedPassingScore}</strong>
              </div>
            </div>
          </div>

          <div className={styles.resultActions}>
            {!isPassed && (
              <button
                type="button"
                className={styles.retryBtn}
                onClick={onRetry}
              >
                <IoRefreshOutline aria-hidden="true" />
                {t("course-player-retry-exam")}
              </button>
            )}
            <button
              type="button"
              className={styles.continueBtn}
              onClick={onContinue}
            >
              {t("course-player-continue-course")}
              <ContinueIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.resultReviewCol}>
        <div className={styles.reviewHeader}>
          <h3>{t("course-player-exam-review")}</h3>
          <p>{t("course-player-exam-review-description")}</p>
        </div>

        <div className={styles.reviewScrollArea}>
          {questions.length === 0 && (
            <p className={styles.reviewEmpty} role="status">
              {t("course-player-no-review-questions")}
            </p>
          )}
          {questions.map((question, index) => {
            const studentSelectedIds = userAnswers[question.id] || [];

            return (
              <section key={question.id} className={styles.reviewQuestionCard}>
                <h4 className={styles.reviewQuestionText}>
                  <span className={styles.questionNumber}>
                    {t("course-player-assessment-question-number", {
                      number: numberFormatter.format(index + 1),
                    })}
                  </span>{" "}
                  {question.question}
                </h4>

                {question.note && (
                  <div className={styles.reviewNote}>
                    <IoBulbOutline aria-hidden="true" /> {question.note}
                  </div>
                )}

                <div className={styles.reviewChoicesList}>
                  {question.choices?.map((choice) => {
                    const isSelectedByStudent = studentSelectedIds.includes(
                      choice.id,
                    );
                    const isCorrectAnswer = choice.isCorrect;

                    let choiceClass = styles.reviewChoiceNormal;
                    let IconComponent = null;

                    if (isCorrectAnswer && isSelectedByStudent) {
                      choiceClass = styles.reviewChoiceCorrect;
                      IconComponent = (
                        <IoCheckmarkCircleOutline
                          className={styles.iconCorrect}
                          aria-hidden="true"
                        />
                      );
                    } else if (!isCorrectAnswer && isSelectedByStudent) {
                      choiceClass = styles.reviewChoiceWrong;
                      IconComponent = (
                        <IoCloseCircleOutline
                          className={styles.iconWrong}
                          aria-hidden="true"
                        />
                      );
                    } else if (isCorrectAnswer && !isSelectedByStudent) {
                      choiceClass = styles.reviewChoiceMissed;
                      IconComponent = (
                        <IoCheckmarkCircleOutline
                          className={styles.iconMissed}
                          aria-hidden="true"
                        />
                      );
                    }

                    return (
                      <div
                        key={choice.id}
                        className={`${styles.reviewChoiceItem} ${choiceClass}`}
                      >
                        <div className={styles.reviewChoiceContent}>
                          <div
                            className={styles.reviewCheckboxMock}
                            aria-hidden="true"
                          >
                            {isSelectedByStudent && (
                              <div className={styles.reviewCheckboxFill} />
                            )}
                          </div>
                          <span>{choice.choice}</span>
                        </div>
                        {IconComponent && (
                          <div className={styles.reviewChoiceResultIcon}>
                            {IconComponent}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
