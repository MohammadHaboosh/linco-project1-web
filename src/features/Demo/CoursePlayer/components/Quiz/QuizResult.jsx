import {
  IoArrowForwardOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import styles from "./Quiz.module.css";

const QuizResult = ({ scoreInfo, onRetry, onContinue }) => {
  const { percentage, isPassed, correctCount, total } = scoreInfo;

  return (
    <div className={styles.resultContainer}>
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
            : "Review the learning materials and try again to improve your score."}
        </p>

        {/* Horizontal Compact Scoreboard */}
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
              <span>Correct Answers</span>
              <strong>
                {correctCount} / {total}
              </strong>
            </div>
            <div className={styles.statRow}>
              <div className={styles.targetDot} />
              <span>Passing Score</span>
              <strong>80%</strong>
            </div>
          </div>
        </div>

        <div className={styles.resultActions}>
          {!isPassed && (
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              <IoRefreshOutline /> Retry Quiz
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
  );
};

export default QuizResult;
