import {
  IoArrowForwardOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoBulbOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizResult = ({
  scoreInfo,
  passingScore,
  userAnswers,
  onRetry,
  onContinue,
}) => {
  const attemptData = scoreInfo.examAttempt || {};
  const percentage = attemptData.score ?? (scoreInfo.score || 0);
  const isPassed = percentage >= passingScore;
  const questions = scoreInfo.questions || [];

  return (
    <div className={styles.resultTwoColumnContainer}>
      <div className={styles.resultSummaryCol}>
        <div className={styles.resultContent}>
          <img
            src={isPassed ? "/images/squid-happy.png" : "/icons/sad.png"}
            alt={isPassed ? "Happy Mascot" : "Sad Mascot"}
            className={styles.mascotImgResult}
          />

          <h2 className={isPassed ? styles.successText : styles.failText}>
            {isPassed ? "Awesome Job! 🌟" : "Keep Practicing! 💪"}
          </h2>
          <p className={styles.resultSubtitle}>
            {isPassed
              ? "You've proven your skills in this section. Ready for the next challenge!"
              : "Review your answers on the right and try again to improve your score."}
          </p>

          <div className={styles.horizontalScoreBoard}>
            <div
              className={`${styles.scoreRing} ${isPassed ? styles.ringSuccess : styles.ringFail}`}
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
                <strong>{percentage}%</strong>
                <span>Score</span>
              </div>
            </div>

            <div className={styles.dividerVertical} />

            <div className={styles.statsDetails}>
              <div className={styles.statRow}>
                <IoCheckmarkCircleOutline className={styles.correctIcon} />
                <span>Result Status</span>
                <strong style={{ color: isPassed ? "#10b981" : "#ef4444" }}>
                  {isPassed ? "PASSED" : "FAILED"}
                </strong>
              </div>
              <div className={styles.statRow}>
                <div className={styles.targetDot} />
                <span>Passing Score Required</span>
                <strong>{passingScore}%</strong>
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
                <IoRefreshOutline /> Retry Exam
              </button>
            )}
            <button
              type="button"
              className={styles.continueBtn}
              onClick={onContinue}
            >
              Continue Course <IoArrowForwardOutline />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.resultReviewCol}>
        <div className={styles.reviewHeader}>
          <h3>Exam Review</h3>
          <p>Check your answers and learn from your mistakes.</p>
        </div>

        <div className={styles.reviewScrollArea}>
          {questions.map((q, index) => {
            const studentSelectedIds = userAnswers[q.id] || [];

            return (
              <div key={q.id} className={styles.reviewQuestionCard}>
                <h4 className={styles.reviewQuestionText}>
                  <span className={styles.questionNumber}>Q{index + 1}.</span>{" "}
                  {q.question}
                </h4>

                {q.note && (
                  <div className={styles.reviewNote}>
                    <IoBulbOutline /> {q.note}
                  </div>
                )}

                <div className={styles.reviewChoicesList}>
                  {q.choices?.map((choice) => {
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
                        />
                      );
                    } else if (!isCorrectAnswer && isSelectedByStudent) {
                      choiceClass = styles.reviewChoiceWrong;
                      IconComponent = (
                        <IoCloseCircleOutline className={styles.iconWrong} />
                      );
                    } else if (isCorrectAnswer && !isSelectedByStudent) {
                      choiceClass = styles.reviewChoiceMissed; // الإجابة الصحيحة التي نسي الطالب اختيارها
                      IconComponent = (
                        <IoCheckmarkCircleOutline
                          className={styles.iconMissed}
                        />
                      );
                    }

                    return (
                      <div
                        key={choice.id}
                        className={`${styles.reviewChoiceItem} ${choiceClass}`}
                      >
                        <div className={styles.reviewChoiceContent}>
                          <div className={styles.reviewCheckboxMock}>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
